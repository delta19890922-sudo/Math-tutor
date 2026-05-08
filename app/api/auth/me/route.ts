import { verifySession, clearSession } from "@/lib/auth";

export async function GET() {
  const user = await verifySession();
  if (!user) {
    return Response.json({ authed: false });
  }
  return Response.json({ authed: true, user });
}

export async function POST() {
  await clearSession();
  return Response.json({ ok: true });
}
