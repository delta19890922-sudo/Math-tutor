import { NextResponse } from "next/server";
import { getGitHubOAuthUrl, setOAuthState } from "@/lib/auth";
import crypto from "node:crypto";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  await setOAuthState(state);
  const url = getGitHubOAuthUrl(state);
  return NextResponse.redirect(url);
}
