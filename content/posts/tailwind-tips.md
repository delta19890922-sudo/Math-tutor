---
title: "Tailwind CSS 实用技巧"
date: "2026-05-05"
description: "分享几个 Tailwind CSS 的实用技巧，让开发更高效。"
tags: ["CSS", "Tailwind", "前端"]
category: "技术"
---

## 实用技巧

### 1. 任意值语法

Tailwind 支持方括号语法来设置任意值：

```html
<div class="w-[327px] bg-[#bada55] text-[22px]">
  自定义尺寸和颜色
</div>
```

### 2. group 和 peer

- `group` - 父元素状态影响子元素
- `peer` - 兄弟元素状态影响相邻元素

```html
<div class="group">
  <h3 class="group-hover:text-blue-500">标题</h3>
  <p class="group-hover:underline">描述</p>
</div>
```

### 3. 响应式设计

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 响应式网格 -->
</div>
```

### 4. 暗色模式

```html
<div class="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
  自动适配暗色模式
</div>
```

## 总结

Tailwind CSS 的灵活性很高，搭配 VS Code 插件开发效率极佳。
