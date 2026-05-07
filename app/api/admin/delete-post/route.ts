import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return Response.json({ error: "slug 不能为空" }, { status: 400 });
    }

    const postsDir = path.join(process.cwd(), "content/posts");
    const trashDir = path.join(process.cwd(), "content/trash");
    const srcPath = path.join(postsDir, `${slug}.md`);

    if (!fs.existsSync(srcPath)) {
      return Response.json({ error: "文件不存在" }, { status: 404 });
    }

    if (!fs.existsSync(trashDir)) {
      fs.mkdirSync(trashDir, { recursive: true });
    }

    let destName = `${slug}.md`;
    const destPath = path.join(trashDir, destName);
    if (fs.existsSync(destPath)) {
      const ts = Date.now();
      destName = `${slug}-${ts}.md`;
    }

    fs.renameSync(srcPath, path.join(trashDir, destName));

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: `删除失败: ${e}` }, { status: 500 });
  }
}
