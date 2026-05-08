import { NextRequest, NextResponse } from "next/server";
import { createSession, getBaseUrl } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return Response.json({ error: "no code" }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return Response.json({ error: "GitHub OAuth not configured" }, { status: 500 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return Response.json({ error: "failed to get access token" }, { status: 400 });
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const userData = await userRes.json();
  const login = userData.login;
  if (!login) {
    return Response.json({ error: "failed to get user" }, { status: 400 });
  }

  const allowed = (process.env.ALLOWED_GITHUB_USERS || "").split(",").map((s) => s.trim());
  if (!allowed.includes(login)) {
    return new Response(`<html><body><h1>403 无权限</h1><p>${login} 不在允许列表中。</p></body></html>`, {
      status: 403, headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  await createSession(login);
  const baseUrl = getBaseUrl();
  return NextResponse.redirect(new URL("/admin", baseUrl));
}
