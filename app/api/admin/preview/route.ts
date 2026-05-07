import { NextRequest } from "next/server";
import { markdownToHtml } from "@/lib/markdown";

export async function POST(req: NextRequest) {
  try {
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
