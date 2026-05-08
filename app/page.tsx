import { getPosts, getAllTags, getAllCategories } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function Home() {
  const posts = await getPosts();
  const tags = await getAllTags();
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="shrink-0 lg:w-64">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-center gap-4 lg:flex-col lg:text-center">
                <div className="h-14 w-14 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900/40">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">A</span>
                </div>
                <div className="lg:mt-1">
                  <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">阿饱</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">记录思考与学习</p>
                </div>
              </div>
              <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-700">
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  数学老师，业余写代码。这里主要放高中数学讲义和一些技术笔记。
                </p>
              </div>
              <div className="mt-4 flex gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-700">
                <div className="text-center">
                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{posts.length}</div>
                  <div className="text-xs text-zinc-400">文章</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{tags.size}</div>
                  <div className="text-xs text-zinc-400">标签</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{categories.size}</div>
                  <div className="text-xs text-zinc-400">分类</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">导航</h3>
              <div className="mt-3 space-y-1">
                <Link href="/tags" className="block text-sm text-zinc-600 hover:text-emerald-600 transition-colors dark:text-zinc-400 dark:hover:text-emerald-400">
                  🏷️ 标签 ({tags.size})
                </Link>
                <Link href="/categories" className="block text-sm text-zinc-600 hover:text-emerald-600 transition-colors dark:text-zinc-400 dark:hover:text-emerald-400">
                  📂 分类 ({categories.size})
                </Link>
                <Link href="/search" className="block text-sm text-zinc-600 hover:text-emerald-600 transition-colors dark:text-zinc-400 dark:hover:text-emerald-400">
                  🔍 搜索
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">热门标签</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Array.from(tags.entries()).slice(0, 8).map(([tag, count]) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}
                    className="text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400">
                    {tag} ({count})
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="space-y-10">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
