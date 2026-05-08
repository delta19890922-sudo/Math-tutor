import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { execFile } from "child_process";
import { promisify } from "util";
import { isSafeSlug, requireAdmin } from "@/lib/auth";

const execFileAsync = promisify(execFile);

async function run(command: string, args: string[]): Promise<string> {
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, HOME: process.env.HOME },
  });
  return stdout + stderr;
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { slug, title } = await req.json();
    if (!isSafeSlug(slug) || typeof title !== "string" || !title.trim()) {
      return Response.json({ error: "slug 或 title 无效" }, { status: 400 });
    }

    const token = process.env.VERCEL_TOKEN;
    let log = "";

    log += await run("git", ["add", `content/posts/${slug}.md`]);
    log += await run("git", ["commit", "-m", `new post: ${title}`]);
    log += await run("git", ["push"]);

    if (token) {
      spawn("npx", ["vercel", "deploy", "--prod", "--yes", "--token", token], {
        cwd: process.cwd(),
        detached: true,
        stdio: "ignore",
        env: { ...process.env, HOME: process.env.HOME },
      }).unref();
      log += "\n[部署] 已在后台启动，约 1 分钟后上线。\n";
    } else {
      log += "\n[提示] 未配置 VERCEL_TOKEN，跳过自动部署。\n";
    }

    return Response.json({ ok: true, log });
  } catch (e: unknown) {
    const error = e as { message?: string; stdout?: string };
    return Response.json(
      { error: `发布失败: ${error?.message || e}`, log: error?.stdout || "" },
      { status: 500 }
    );
  }
}
