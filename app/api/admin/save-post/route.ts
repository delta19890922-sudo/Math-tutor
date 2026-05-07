import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slug, content } = await req.json();
    if (!slug || !content) {
      return Response.json({ error: "slug 和 content 不能为空" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "content/posts", `${slug}.md`);
    fs.writeFileSync(filePath, content, "utf-8");

    return Response.json({ ok: true, slug });
  } catch (e) {
    return Response.json({ error: `保存失败: ${e}` }, { status: 500 });
  }
}
