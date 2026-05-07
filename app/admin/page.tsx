"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Tab = "write" | "browse" | "trash";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  category: string;
}

const DRAFT_KEY = "admin-draft";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("write");
  const [editSlug, setEditSlug] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        管理后台
      </h1>

      <div className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-700">
        <TabButton label="写文章" active={tab === "write"} onClick={() => setTab("write")} />
        <TabButton label="现有文章" active={tab === "browse"} onClick={() => setTab("browse")} />
        <TabButton label="垃圾箱" active={tab === "trash"} onClick={() => setTab("trash")} />
      </div>

      {tab === "write" && <WriteTab editSlug={editSlug} onEditDone={() => setEditSlug(null)} />}
      {tab === "browse" && (
        <BrowseTab
          onEdit={(slug) => {
            setEditSlug(slug);
            setTab("write");
          }}
        />
      )}
      {tab === "trash" && <TrashTab />}
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        active
          ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
          : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}

function AutocompleteInput({
  value, onChange, placeholder, suggestions,
}: {
  value: string; onChange: (v: string) => void; placeholder: string;
  suggestions: string[];
}) {
  const [focused, setFocused] = useState(false);
  const filtered = suggestions.filter((s) => s !== value && s.includes(value));
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input value={value} onChange={(e) => { onChange(e.target.value); setSelectedIdx(-1); }}
        onFocus={() => setFocused(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
          if (e.key === "Enter" && selectedIdx >= 0) { onChange(filtered[selectedIdx]); setFocused(false); }
        }}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
        placeholder={placeholder} />
      {focused && filtered.length > 0 && (
        <div className="absolute z-10 top-full mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:bg-zinc-800 dark:border-zinc-700">
          {filtered.map((s, i) => (
            <button key={s} type="button"
              onMouseDown={() => { onChange(s); setFocused(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                i === selectedIdx ? "bg-zinc-100 dark:bg-zinc-700" : ""
              }`}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function WriteTab({ editSlug, onEditDone }: { editSlug: string | null; onEditDone: () => void }) {
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
  const [deployState, setDeployState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [metadata, setMetadata] = useState<{ tags: string[]; categories: string[] }>({ tags: [], categories: [] });

  const previewTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetch("/api/admin/metadata").then((r) => r.json()).then(setMetadata).catch(() => {});
  }, []);

  useEffect(() => {
    if (editSlug) {
      fetch(`/api/posts/${editSlug}`).then((r) => r.json()).then((data) => {
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setDate(data.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
        setDescription(data.description || "");
        setTags((data.tags || []).join(", "));
        setCategory(data.category || "");
        setContent(data.rawContent || "");
        setLoaded(true);
        localStorage.removeItem(DRAFT_KEY);
        onEditDone();
      });
    } else {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const d = JSON.parse(saved);
          setTitle(d.title || "");
          setSlug(d.slug || "");
          setDate(d.date || new Date().toISOString().slice(0, 10));
          setDescription(d.description || "");
          setTags(d.tags || "");
          setCategory(d.category || "");
          setContent(d.content || "");
        } catch {}
      }
      setLoaded(true);
    }
  }, [editSlug]);

  const autoSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, slug, date, description, tags, category, content }));
    }, 800);
  }, [title, slug, date, description, tags, category, content]);

  useEffect(() => { if (loaded) autoSave(); return () => { if (saveTimer.current) clearTimeout(saveTimer.current); }; }, [autoSave, loaded]);

  useEffect(() => {
    if (!title) return;
    const clean = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
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

  const pollDeploy = () => {
    setDeployState("部署中");
    const check = async () => {
      try {
        const res = await fetch("/api/admin/deploy-status");
        const data = await res.json();
        if (data.state === "READY") {
          setDeployState("部署完成 ✓");
          setLog((prev) => prev + "\n[部署] 已上线！\n");
        } else if (data.state === "ERROR") {
          setDeployState("部署失败 ✗");
          setLog((prev) => prev + "\n[部署] 构建失败，请检查日志。\n");
        } else {
          setTimeout(check, 5000);
        }
      } catch {
        setTimeout(check, 5000);
      }
    };
    setTimeout(check, 5000);
  };

  const buildFrontmatter = () => {
    const tagList = tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean).map((t) => `"${t}"`).join(", ");
    return ["---", `title: "${title}"`, `date: "${date}"`, `description: "${description}"`,
      `tags: [${tagList}]`, `category: "${category}"`, `slug: "${slug}"`, "---", ""].join("\n");
  };

  const fullContent = buildFrontmatter() + "\n" + content;

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/save-post", { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, content: fullContent }) });
      const data = await res.json();
      setMessage(data.ok ? "已保存到本地" : data.error);
      if (data.ok) localStorage.removeItem(DRAFT_KEY);
    } catch { setMessage("保存失败"); }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!slug) return;
    setPublishing(true);
    setMessage("");
    setLog("");
    setDeployState(null);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, title }) });
      const data = await res.json();
      setMessage(data.ok ? "已推送" : data.error);
      setLog(data.log || "");
      if (data.ok) { localStorage.removeItem(DRAFT_KEY); pollDeploy(); }
    } catch { setMessage("发布失败"); }
    setPublishing(false);
  };

  const wordCount = (() => {
    const cn = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const en = content.replace(/[\u4e00-\u9fff]/g, " ").split(/\s+/).filter(Boolean).length;
    const total = cn + en;
    const min = Math.max(1, Math.round(cn / 300 + en / 200));
    return { total, min };
  })();

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
          <AutocompleteInput value={tags} onChange={setTags}
            placeholder="数学, 随笔" suggestions={metadata.tags.map((t) => t + ", ").flatMap((s) => [s, s])} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">分类</label>
          <AutocompleteInput value={category} onChange={setCategory}
            placeholder="技术" suggestions={metadata.categories} />
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
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono resize-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="## 标题&#10;&#10;正文内容..." />
          <div className="mt-1 text-xs text-zinc-400 text-right">
            {wordCount.total} 字 · 约 {wordCount.min} 分钟
          </div>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">预览</label>
          <div className="flex-1 rounded-lg border border-zinc-300 p-4 overflow-auto dark:border-zinc-700">
            {preview ? (
              <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: preview }} />
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
        {deployState && (
          <span className={`text-sm ${
            deployState.includes("✓") ? "text-green-600" :
            deployState.includes("✗") ? "text-red-600" : "text-amber-600"
          }`}>
            {deployState}
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

function BrowseTab({ onEdit }: { onEdit: (slug: string) => void }) {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadPosts = () => {
    setLoading(true);
    fetch("/api/posts").then((r) => r.json()).then((data) => { setPosts(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadPosts(); }, []);

  const handleSelect = async (slug: string) => {
    setSelected(slug);
    setHtml("");
    try {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      const previewRes = await fetch("/api/admin/preview", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: data.rawContent }),
      });
      const previewData = await previewRes.json();
      setHtml(previewData.html || "");
    } catch { setHtml("<p>加载失败</p>"); }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`确定将「${title}」移到垃圾箱？`)) return;
    setDeleting(slug);
    try {
      const res = await fetch("/api/admin/delete-post", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.ok) {
        if (selected === slug) { setSelected(null); setHtml(""); }
        loadPosts();
      } else { alert(`删除失败: ${data.error}`); }
    } catch { alert("删除失败"); }
    setDeleting(null);
  };

  return (
    <div className="grid grid-cols-[340px_1fr] gap-6" style={{ minHeight: 500 }}>
      <div className="border border-zinc-200 rounded-lg overflow-auto dark:border-zinc-700">
        {loading ? (
          <p className="p-4 text-sm text-zinc-400">加载中...</p>
        ) : posts.length === 0 ? (
          <p className="p-4 text-sm text-zinc-400">暂无文章</p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {posts.map((post) => (
              <li key={post.slug} className="group flex items-center gap-1 px-4 py-3">
                <button onClick={() => handleSelect(post.slug)}
                  className={`flex-1 text-left text-sm transition-colors ${
                    selected === post.slug
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}>
                  <div className="font-medium truncate">{post.title}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{post.date}</div>
                </button>
                <button onClick={() => onEdit(post.slug)}
                  className="shrink-0 text-xs px-2 py-1 rounded text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 transition-opacity">
                  编辑
                </button>
                <button onClick={() => handleDelete(post.slug, post.title)} disabled={deleting === post.slug}
                  className="shrink-0 text-xs text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity disabled:opacity-50">
                  {deleting === post.slug ? "..." : "删除"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 p-6 overflow-auto dark:border-zinc-700">
        {selected ? (
          html ? (
            <div className="prose prose-zinc max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
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

function TrashTab() {
  const [items, setItems] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const loadTrash = () => {
    setLoading(true);
    fetch("/api/admin/trash").then((r) => r.json()).then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadTrash(); }, []);

  const handleRestore = async (slug: string, title: string) => {
    setRestoring(slug);
    setMsg("");
    try {
      const res = await fetch("/api/admin/restore-post", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.ok) { setMsg(`已恢复「${title}」`); loadTrash(); } else { alert(`恢复失败: ${data.error}`); }
    } catch { alert("恢复失败"); }
    setRestoring(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">垃圾箱中的文章可以恢复，永久删除请手动删除文件。</p>
        {msg && <span className="text-sm text-green-600">{msg}</span>}
      </div>
      {loading ? (
        <p className="text-sm text-zinc-400">加载中...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-400">垃圾箱是空的</p>
      ) : (
        <div className="border border-zinc-200 rounded-lg divide-y divide-zinc-200 dark:border-zinc-700 dark:divide-zinc-700">
          {items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{item.date} · {item.category}</div>
              </div>
              <button onClick={() => handleRestore(item.slug, item.title)} disabled={restoring === item.slug}
                className="text-xs px-3 py-1.5 rounded-md bg-zinc-200 text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600">
                {restoring === item.slug ? "..." : "恢复"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
