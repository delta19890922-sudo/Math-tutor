---
title: "Markdown 语言介绍"
date: "2026-05-08"
description: "Markdown 是一种轻量级标记语言，用简单的纯文本格式实现快速排版。"
tags: ["Markdown", "写作"]
category: "技术"
slug: "markdown-intro"
---

## 什么是 Markdown？

Markdown 由 John Gruber 于 2004 年创建，是一种轻量级标记语言。它让你用纯文本格式编写文档，同时能方便地转换为 HTML。

## 基本语法

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 强调

```markdown
*斜体* 或 _斜体_
**粗体** 或 __粗体__
~~删除线~~
```

### 列表

```markdown
- 无序列表项
- 另一个列表项

1. 有序列表项
2. 另一个有序项
```

### 链接与图片

```markdown
[文本](http://example.com)
![替代文本](image.jpg)
```

### 代码

```markdown
行内 `code`

```python
def hello():
    print("Hello!")
```
```

## 扩展语法

本博客支持 GFM（GitHub Flavored Markdown）扩展：

| 功能 | 语法 |
|------|------|
| 表格 | `\| 列1 \| 列2 \|` |
| 任务列表 | `- [x] 完成` |
| 删除线 | `~~文本~~` |
| 数学公式 | `$E=mc^2$` |

Markdown 是书写文档、博客、README 的首选语言，简单而强大。
