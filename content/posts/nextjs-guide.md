---
title: "Next.js App Router 入门指南"
date: "2026-05-03"
description: "快速了解 Next.js App Router 的核心概念和用法。"
tags: ["Next.js", "React", "前端"]
category: "技术"
---

## App Router 是什么

Next.js 13 引入了 App Router，基于 React Server Components 的全新路由系统。

### 核心概念

- **Server Components** - 默认所有组件在服务端渲染
- **文件系统路由** - 文件夹结构即路由
- **Layout** - 共享布局，导航时保持状态
- **Loading & Error** - 内置加载和错误处理

### 示例

```typescript
// app/posts/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

## 数据获取

App Router 推荐在 Server Components 中直接使用 `async/await` 获取数据：

```typescript
async function getPosts(): Promise<Post[]> {
  const posts = await fs.readdir("content/posts");
  // ...处理逻辑
  return posts;
}
```

无需 `getServerSideProps` 或 `getStaticProps`，代码更简洁。

## 总结

App Router 让 Next.js 开发体验大幅提升，Server Components + 文件系统路由的组合非常优雅。
