"use client";

import { useState, useEffect, useRef } from "react";

type Tab = "write" | "browse";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  category: string;
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("write");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        管理后台
      </h1>

      <div className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setTab("write")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
            tab === "write"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          写文章
        </button>
        <button
          onClick={() => setTab("browse")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
            tab === "browse"
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          现有文章
        </button>
      </div>

      {tab === "write" ? <WriteTab /> : <BrowseTab />}
    </div>
  );
}

function WriteTab() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [log, setLog] = useState("");

  const previewTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!title) return;
    const clean = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);
    setSlug(clean || `post-${Date.now()}`);
  }, [title]);

  useEffect(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    if (!content) { setPreview(""); return; }
    previewTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const data = await res.json();
        setPreview(data.html || "");
      } catch {
        setPreview("<p>预览失败</p>");
      }
    }, 300);
    return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
  }, [content]);

  const buildFrontmatter = () => {
    const tagList = tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => `"${t}"`)
      .join(", ");
    return [
      "---",
      `title: "${title}"`,
      `date: "${date}"`,
      `description: "${description}"`,
      `tags: [${tagList}]`,
      `category: "${category}"`,
      `slug: "${slug}"`,
      "---",
      "",
    ].join("\n");
  };

  const fullContent = buildFrontmatter() + "\n" + content;

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content: fullContent }),
      });
      const data = await res.json();
      setMessage(data.ok ? "已保存到本地" : data.error);
    } catch {
      setMessage("保存失败");
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setMessage("");
    setLog("");
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title }),
      });
      const data = await res.json();
      setMessage(data.ok ? "发布成功!" : data.error);
      setLog(data.log || "");
    } catch {
      setMessage("发布失败");
    }
    setPublishing(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">标题</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="文章标题" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">日期</label>
          <input value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">标签 (逗号分隔)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="数学, 随笔" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">分类</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="技术" />
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
          描述 {slug && <span className="text-zinc-400 ml-2">slug: {slug}</span>}
        </label>
        <input value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          placeholder="简短描述" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4" style={{ minHeight: 500 }}>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
            正文 (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono resize-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="## 标题&#10;&#10;正文内容..."
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
            预览
          </label>
          <div className="flex-1 rounded-lg border border-zinc-300 p-4 overflow-auto dark:border-zinc-700">
            {preview ? (
              <div
                className="prose prose-sm prose-zinc max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            ) : (
              <p className="text-sm text-zinc-400">输入内容后自动预览...</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleSave} disabled={saving || !slug}
          className="rounded-lg bg-zinc-200 px-6 py-2 text-sm font-medium hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-100">
          {saving ? "保存中..." : "保存到本地"}
        </button>
        <button onClick={handlePublish} disabled={publishing || !slug}
          className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          {publishing ? "发布中..." : "Git Push + 部署"}
        </button>
        {message && (
          <span className={`text-sm ${message.includes("成功") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </span>
        )}
      </div>

      {log && (
        <pre className="mt-4 rounded-lg bg-zinc-100 p-4 text-xs overflow-auto dark:bg-zinc-800 dark:text-zinc-300">
          {log}
        </pre>
      )}
    </>
  );
}

function BrowseTab() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = async (slug: string) => {
    setSelected(slug);
    setHtml("");
    try {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      const previewRes = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.rawContent }),
      });
      const previewData = await previewRes.json();
      setHtml(previewData.html || "");
    } catch {
      setHtml("<p>加载失败</p>");
    }
  };

  return (
    <div className="grid grid-cols-[280px_1fr] gap-6" style={{ minHeight: 500 }}>
      <div className="border border-zinc-200 rounded-lg overflow-auto dark:border-zinc-700">
        {loading ? (
          <p className="p-4 text-sm text-zinc-400">加载中...</p>
        ) : posts.length === 0 ? (
          <p className="p-4 text-sm text-zinc-400">暂无文章</p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {posts.map((post) => (
              <li key={post.slug}>
                <button
                  onClick={() => handleSelect(post.slug)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    selected === post.slug
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{post.date}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 p-6 overflow-auto dark:border-zinc-700">
        {selected ? (
          html ? (
            <div
              className="prose prose-zinc max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p className="text-sm text-zinc-400">加载中...</p>
          )
        ) : (
          <p className="text-sm text-zinc-400">从左侧选择一篇文章预览</p>
        )}
      </div>
    </div>
  );
}
