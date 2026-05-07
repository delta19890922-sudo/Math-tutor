---
title: "解三角形（一）：正弦定理入门"
date: "2026-05-08"
description: "从直角三角形出发，理解正弦定理，学会用两边一对角解三角形。"
tags: ["数学", "解三角形", "正弦定理"]
category: "高一必修一"
slug: "trig-1-sine-law"
---

![trigonometry](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800)

## 回顾：直角三角形中的正弦

在直角三角形中，正弦的定义是：

$$
\sin A = \frac{\text{对边}}{\text{斜边}}
$$

但对于任意三角形，这个关系还能用吗？

## 正弦定理

对于任意三角形 $ABC$，设三边分别为 $a, b, c$，对角分别为 $A, B, C$，外接圆半径为 $R$，有：

$$
\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R
$$

### 证明思路

作三角形 $ABC$ 的外接圆，取 $BC = a$，连接圆心 $O$ 与 $B, C$，则 $\angle BOC = 2A$。由圆周角定理，在 $\triangle BOC$ 中有 $a = 2R\sin A$。

<iframe src="https://www.geogebra.org/geometry/wjucxens?embed" width="100%" height="500" allowfullscreen style="border: 1px solid #e4e4e4;border-radius: 4px;"></iframe>

## 典型例题

### 例 1：已知两角一边

在 $\triangle ABC$ 中，$A = 30^\circ$，$B = 45^\circ$，$a = 10$，求 $b$。

**解：**

由正弦定理：

$$
\frac{a}{\sin A} = \frac{b}{\sin B}
$$

代入得：

$$
\frac{10}{\sin 30^\circ} = \frac{b}{\sin 45^\circ}
$$

$$
\frac{10}{\frac12} = \frac{b}{\frac{\sqrt2}{2}}
$$

$$
20 = \frac{b}{\frac{\sqrt2}{2}} \quad\Rightarrow\quad b = 20 \times \frac{\sqrt2}{2} = 10\sqrt2
$$

### 例 2：已知两边一对角

在 $\triangle ABC$ 中，$a = 8$，$b = 6$，$A = 60^\circ$，求 $B$。

**解：**

$$
\frac{a}{\sin A} = \frac{b}{\sin B} \quad\Rightarrow\quad \frac{8}{\sin 60^\circ} = \frac{6}{\sin B}
$$

$$
\sin B = \frac{6 \times \frac{\sqrt3}{2}}{8} = \frac{3\sqrt3}{8}
$$

查表得 $B \approx 40.5^\circ$ 或 $139.5^\circ$，但 $A+B < 180^\circ$，所以 $B \approx 40.5^\circ$。

## 易错点

- **多解情况**：已知两边一对角时，正弦值可能对应两个角（锐角和钝角），需要检验是否合理
- **单位统一**：角度和边长计算时保持单位一致

## 练习题

1. $\triangle ABC$ 中，$A = 45^\circ$，$C = 60^\circ$，$b = 12$，求 $a$。
2. $\triangle ABC$ 中，$a = 7$，$b = 5$，$A = 50^\circ$，判断 $B$ 有几组解。
