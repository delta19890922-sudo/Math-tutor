import { getAllCategories } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "分类",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        分类
      </h1>
      <div className="mt-8 space-y-4">
        {[...categories.entries()].map(([category, count]) => (
          <Link
            key={category}
            href={`/categories/${encodeURIComponent(category)}`}
            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {category}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">
              {count} 篇
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
