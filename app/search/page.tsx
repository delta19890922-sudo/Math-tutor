"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import TagBadge from "@/components/TagBadge";

interface PostData {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  category: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [results, setResults] = useState<PostData[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (!q.trim()) {
        setResults([]);
        return;
      }
      const lowerQ = q.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQ) ||
          post.description.toLowerCase().includes(lowerQ) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerQ)) ||
          post.category.toLowerCase().includes(lowerQ)
      );
      setResults(filtered);
    },
    [posts]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        搜索
      </h1>
      <div className="mt-6">
        <input
          type="text"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
        />
      </div>

      {query.trim() && (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
          {results.length === 0
            ? "没有找到相关文章"
            : `找到 ${results.length} 篇文章`}
        </p>
      )}

      <div className="mt-8 space-y-8">
        {results.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">
                {post.title}
              </h2>
              {post.description && (
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  {post.description}
                </p>
              )}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-500">
                {new Date(post.date).toLocaleDateString("zh-CN")}
              </span>
              {post.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </article>
        ))}
      </div>

      {!query.trim() && (
        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
          输入关键词开始搜索
        </p>
      )}
    </div>
  );
}
