import { redirect } from "next/navigation";
import { getGitHubOAuthUrl } from "@/lib/auth";
import crypto from "node:crypto";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  const url = getGitHubOAuthUrl(state);
  redirect(url);
}
