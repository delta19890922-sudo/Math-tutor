import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const OAUTH_STATE_COOKIE = "oauth_state";

function getSecret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production");
  }
  return "fallback-dev-only-secret-change-me";
}

function getAllowedUsers(): string[] {
  return (process.env.ALLOWED_GITHUB_USERS || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL;
  return `http://localhost:3000`;
}

export function getGitHubOAuthUrl(state: string): string {
  const clientId = process.env.GITHUB_CLIENT_ID || "";
  const redirectUri = `${getBaseUrl()}/api/auth/callback`;
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=read:user`;
}

export async function setOAuthState(state: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
}

export async function verifyOAuthState(state: string | null): Promise<boolean> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);
  return Boolean(state && stored && state === stored);
}

export async function createSession(user: string): Promise<void> {
  const cookieStore = await cookies();
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${user}|${exp}`;
  const crypto = await import("node:crypto");
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  const token = `${Buffer.from(payload).toString("base64url")}.${sig}`;
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60,
  });
}

export async function verifySession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const crypto = await import("node:crypto");
  const expected = crypto.createHmac("sha256", getSecret()).update(Buffer.from(payloadB64, "base64url").toString()).digest("hex");
  if (sig !== expected) return null;
  const payload = Buffer.from(payloadB64, "base64url").toString();
  const [user, expStr] = payload.split("|");
  if (!user || !expStr || Date.now() > parseInt(expStr)) return null;
  if (!getAllowedUsers().includes(user)) return null;
  return user;
}

export async function requireAdmin(): Promise<Response | null> {
  const user = await verifySession();
  if (!user) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }
  return null;
}

export function isSafeSlug(slug: unknown): slug is string {
  return typeof slug === "string" && /^[\p{L}\p{N}_-]{1,120}$/u.test(slug);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { getAllowedUsers, getBaseUrl };
