import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return Response.json({ error: "slug 不能为空" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "content/posts", `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return Response.json({ error: "文件不存在" }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: `删除失败: ${e}` }, { status: 500 });
  }
}
