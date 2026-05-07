import { NextRequest } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { slug, title } = await req.json();
    let log = "";

    const run = async (cmd: string) => {
      const { stdout, stderr } = await execAsync(cmd, { cwd: process.cwd(), env: { ...process.env, HOME: process.env.HOME } });
      log += stdout + (stderr || "");
    };

    await run(`git add content/posts/${slug}.md`);
    await run(`git commit -m "new post: ${title}"`);
    await run(`git push`);

    const token = process.env.VERCEL_TOKEN;
    if (token) {
      await run(`npx vercel deploy --prod --yes --token ${token}`);
    } else {
      log += "\n[提示] 未配置 VERCEL_TOKEN，跳过自动部署。请手动运行 vercel deploy。\n";
    }

    return Response.json({ ok: true, log });
  } catch (e: any) {
    return Response.json({ error: `发布失败: ${e?.message || e}`, log: e?.stdout || "" }, { status: 500 });
  }
}
