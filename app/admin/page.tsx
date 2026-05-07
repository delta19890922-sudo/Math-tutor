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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            管理后台
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">写文章、管理内容、一键部署</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">A</span>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        <TabButton icon="✏️" label="写文章" active={tab === "write"} onClick={() => setTab("write")} />
        <TabButton icon="📄" label="现有文章" active={tab === "browse"} onClick={() => setTab("browse")} />
        <TabButton icon="🗑️" label="垃圾箱" active={tab === "trash"} onClick={() => setTab("trash")} />
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

function TabButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? "bg-white text-zinc-800 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
      }`}
    >
      <span className="text-xs">{icon}</span>
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
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30"
        placeholder={placeholder} />
      {focused && filtered.length > 0 && (
        <div className="absolute z-10 top-full mt-1 w-full rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {filtered.map((s, i) => (
            <button key={s} type="button"
              onMouseDown={() => { onChange(s); setFocused(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
                i === selectedIdx ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
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
  const [geoUrl, setGeoUrl] = useState("");
  const [showGeo, setShowGeo] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
        setTitle(data.title || ""); setSlug(data.slug || "");
        setDate(data.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
        setDescription(data.description || ""); setTags((data.tags || []).join(", "));
        setCategory(data.category || ""); setContent(data.rawContent || "");
        setLoaded(true); localStorage.removeItem(DRAFT_KEY); onEditDone();
      });
    } else {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) { try { const d = JSON.parse(saved); setTitle(d.title || ""); setSlug(d.slug || ""); setDate(d.date || new Date().toISOString().slice(0, 10)); setDescription(d.description || ""); setTags(d.tags || ""); setCategory(d.category || ""); setContent(d.content || ""); } catch {} }
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
        const res = await fetch("/api/admin/preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
        const data = await res.json();
        setPreview(data.html || "");
      } catch { setPreview("<p>预览失败</p>"); }
    }, 300);
    return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
  }, [content]);

  const pollDeploy = () => {
    setDeployState("部署中...");
    const check = async () => {
      try {
        const res = await fetch("/api/admin/deploy-status");
        const data = await res.json();
        if (data.state === "READY") { setDeployState("部署完成"); setLog((prev) => prev + "\n[部署] 已上线！\n"); }
        else if (data.state === "ERROR") { setDeployState("部署失败"); setLog((prev) => prev + "\n[部署] 构建失败。\n"); }
        else { setTimeout(check, 5000); }
      } catch { setTimeout(check, 5000); }
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
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/save-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, content: fullContent }) });
      const data = await res.json();
      setMessage(data.ok ? "已保存到本地" : data.error);
      if (data.ok) localStorage.removeItem(DRAFT_KEY);
    } catch { setMessage("保存失败"); }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!slug) return;
    setPublishing(true); setMessage(""); setLog(""); setDeployState(null);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, title }) });
      const data = await res.json();
      setMessage(data.ok ? "已推送" : data.error); setLog(data.log || "");
      if (data.ok) { localStorage.removeItem(DRAFT_KEY); pollDeploy(); }
    } catch { setMessage("发布失败"); }
    setPublishing(false);
  };

  const insertGeoGebra = () => {
    const url = geoUrl.trim(); if (!url) return;
    let src = url;
    const m = url.match(/geogebra\.org\/m\/(\w+)/); const g = url.match(/geogebra\.org\/(\w+)\/(\w+)/);
    if (m) { src = `https://www.geogebra.org/material/iframe/id/${m[1]}`; }
    else if (g && g[1] !== "material") { src = `https://www.geogebra.org/${g[1]}/${g[2]}?embed`; }
    setContent((prev) => prev + `\n\n<iframe src="${src}" width="100%" height="500" style="border:1px solid #e4e4e4;border-radius:4px;" allowfullscreen></iframe>\n\n`);
    setShowGeo(false); setGeoUrl("");
  };

  const wordCount = (() => {
    const cn = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const en = content.replace(/[\u4e00-\u9fff]/g, " ").split(/\s+/).filter(Boolean).length;
    return { total: cn + en, min: Math.max(1, Math.round(cn / 300 + en / 200)) };
  })();

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">标题</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30"
              placeholder="文章标题" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">标签</label>
            <AutocompleteInput value={tags} onChange={setTags}
              placeholder="数学, 随笔" suggestions={metadata.tags.map((t) => t + ", ").flatMap((s) => [s, s])} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">分类</label>
            <AutocompleteInput value={category} onChange={setCategory}
              placeholder="技术" suggestions={metadata.categories} />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
            描述 {slug && <span className="ml-2 font-mono text-zinc-300 lowercase">/ {slug}</span>}
          </label>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30"
            placeholder="简短描述" />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="grid grid-cols-2 gap-4" style={{ minHeight: 500 }}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">正文 (Markdown)</label>
              <button type="button" onClick={() => setShowGeo(true)}
                className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                + GeoGebra
              </button>
            </div>
            <textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono resize-none transition-colors placeholder:text-zinc-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30"
              placeholder="## 标题&#10;&#10;正文内容..." />
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
              <span>{wordCount.total} 字 · 约 {wordCount.min} 分钟</span>
              {message && (
                <span className={`${message.includes("成功") || message.includes("推送") ? "text-emerald-500" : "text-red-400"}`}>
                  {message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">预览</label>
            <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-4 overflow-auto dark:border-zinc-700 dark:bg-zinc-800/80">
              {preview ? (
                <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: preview }} />
              ) : (
                <p className="text-sm text-zinc-300 dark:text-zinc-500">输入内容后自动预览...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving || !slug}
            className="rounded-lg border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200">
            {saving ? "保存中..." : "💾 保存到本地"}
          </button>
          <button onClick={handlePublish} disabled={publishing || !slug}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-40 dark:bg-emerald-600 dark:hover:bg-emerald-500">
            {publishing ? "发布中..." : "🚀 Git Push + 部署"}
          </button>
          {deployState && (
            <span className={`text-sm ${
              deployState.includes("完成") ? "text-emerald-500" :
              deployState.includes("失败") ? "text-red-400" : "text-amber-500"
            }`}>
              {deployState}
            </span>
          )}
        </div>
      </div>

      {log && (
        <pre className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed overflow-auto dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          {log}
        </pre>
      )}

      {showGeo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowGeo(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-1 text-zinc-800 dark:text-zinc-100">插入 GeoGebra</h3>
            <p className="text-xs text-zinc-400 mb-4">粘贴 GeoGebra 链接，支持 geometry / m / material 格式</p>
            <input value={geoUrl} onChange={(e) => setGeoUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-700 dark:text-zinc-100 dark:focus:border-emerald-500"
              placeholder="https://www.geogebra.org/geometry/xxx 或 /m/xxx" autoFocus />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowGeo(false)}
                className="px-4 py-2 text-sm rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700">
                取消
              </button>
              <button onClick={insertGeoGebra}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                插入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
    setSelected(slug); setHtml("");
    try {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      const previewRes = await fetch("/api/admin/preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: data.rawContent }) });
      setHtml((await previewRes.json()).html || "");
    } catch { setHtml("<p>加载失败</p>"); }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`确定将「${title}」移到垃圾箱？`)) return;
    setDeleting(slug);
    try {
      const res = await fetch("/api/admin/delete-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
      const data = await res.json();
      if (data.ok) { if (selected === slug) { setSelected(null); setHtml(""); } loadPosts(); }
      else { alert(`删除失败: ${data.error}`); }
    } catch { alert("删除失败"); }
    setDeleting(null);
  };

  return (
    <div className="grid grid-cols-[340px_1fr] gap-5" style={{ minHeight: 500 }}>
      <div className="rounded-xl border border-zinc-200 bg-white overflow-auto dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="sticky top-0 border-b border-zinc-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800/80">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            {loading ? "加载中..." : `${posts.length} 篇文章`}
          </span>
        </div>
        {loading ? (
          <p className="p-4 text-sm text-zinc-400">加载中...</p>
        ) : posts.length === 0 ? (
          <p className="p-4 text-sm text-zinc-400">暂无文章</p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
            {posts.map((post) => (
              <div key={post.slug}
                className={`group flex items-center gap-1 px-4 py-3 cursor-pointer transition-colors ${
                  selected === post.slug ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                }`}
                onClick={() => handleSelect(post.slug)}>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${selected === post.slug ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {post.title}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{post.date} · {post.category}</div>
                </div>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(post.slug)}
                    className="text-xs px-2 py-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-700">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(post.slug, post.title)} disabled={deleting === post.slug}
                    className="text-xs px-2 py-1 rounded text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50">
                    {deleting === post.slug ? "..." : "删除"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 overflow-auto dark:border-zinc-700 dark:bg-zinc-800/50">
        {selected ? (
          html ? (
            <div className="prose prose-zinc max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="text-sm text-zinc-400">加载中...</p>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-zinc-300 dark:text-zinc-500">从左侧选择一篇文章预览</p>
          </div>
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
    setRestoring(slug); setMsg("");
    try {
      const res = await fetch("/api/admin/restore-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
      const data = await res.json();
      if (data.ok) { setMsg(`已恢复「${title}」`); loadTrash(); } else { alert(`恢复失败: ${data.error}`); }
    } catch { alert("恢复失败"); }
    setRestoring(null);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-400">垃圾箱中的文章可以恢复</p>
        {msg && <span className="text-sm text-emerald-500">{msg}</span>}
      </div>
      {loading ? (
        <p className="text-sm text-zinc-400">加载中...</p>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-zinc-300 dark:text-zinc-500">垃圾箱是空的</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
          {items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-700 truncate dark:text-zinc-300">{item.title}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{item.date} · {item.category}</div>
              </div>
              <button onClick={() => handleRestore(item.slug, item.title)} disabled={restoring === item.slug}
                className="text-xs px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700">
                {restoring === item.slug ? "..." : "恢复"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
