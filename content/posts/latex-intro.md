---
title: "LaTeX 介绍"
date: "2026-05-08"
description: "LaTeX 是一个基于 TeX 的排版系统，广泛用于学术论文、书籍和技术文档的编写。"
tags: ["LaTeX", "排版"]
category: "技术"
slug: "latex-intro"
---

## 什么是 LaTeX？

LaTeX（读音 lay-tek 或 lah-tek）是一个高质量的排版系统，由 Leslie Lamport 在 20 世纪 80 年代基于 Donald Knuth 的 TeX 系统开发。它特别适合处理包含数学公式的文档。

## 为什么使用 LaTeX？

- **数学公式** — 排版精美的数学公式是 LaTeX 最强大的功能之一
- **自动编号** — 章节、公式、图表、参考文献自动编号
- **跨引用** — 轻松实现文内交叉引用
- **参考文献** — 通过 BibTeX 管理引用，支持各种格式
- **文档结构** — 清晰的内容与样式分离

## 数学公式示例

行内公式：$E = mc^2$

独立公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

## 基本语法

```latex
\documentclass{article}
\usepackage{amsmath}

\begin{document}
\section{引言}
这是一个 LaTeX 文档示例。
\end{document}
```

LaTeX 是学术写作的事实标准，尤其在数学、物理和计算机科学领域。
