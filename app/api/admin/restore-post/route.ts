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
    let srcPath = path.join(trashDir, `${slug}.md`);

    if (!fs.existsSync(srcPath)) {
      const files = fs.readdirSync(trashDir).filter((f) => f.startsWith(slug) && f.endsWith(".md"));
      if (files.length === 0) {
        return Response.json({ error: "文件不存在" }, { status: 404 });
      }
      srcPath = path.join(trashDir, files[0]);
    }

    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const basename = path.basename(srcPath);
    const destPath = path.join(postsDir, basename);
    fs.renameSync(srcPath, destPath);

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: `恢复失败: ${e}` }, { status: 500 });
  }
}
