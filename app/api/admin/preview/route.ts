import { NextRequest } from "next/server";
import { markdownToHtml } from "@/lib/markdown";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { content } = await req.json();
    if (!content) {
      return Response.json({ html: "" });
    }
    const html = await markdownToHtml(content);
    return Response.json({ html });
  } catch {
    return Response.json({ html: "<p>预览失败</p>" });
  }
}
