---
title: "解三角形（五）：综合难题与思想方法"
date: "2026-05-08"
description: "正余弦定理、面积公式、几何辅助线的综合运用——提升解题能力。"
tags: ["数学", "解三角形", "综合", "难题"]
category: "高一必修一"
slug: "trig-5-challenges"
---

![math-challenge](https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800)

## 核心思想回顾

解三角形的本质：**在三角形中，已知三个元素（至少一条边），求其余元素。**

- 正弦定理：边与对角的正弦成比例
- 余弦定理：边的平方关系
- 面积公式：边与夹角的正弦

## 典型难题

### 例 1：多三角形综合

如图，$\triangle ABC$ 中，$AB = AC = 10$，$BC = 12$。点 $D$ 在 $BC$ 上，且 $\angle BAD = 30^\circ$。求 $AD$ 的长度。

**解：**

在 $\triangle ABC$ 中，$AB = AC = 10$，$BC = 12$。

由余弦定理先求 $\angle B$：

$$
\cos B = \frac{AB^2 + BC^2 - AC^2}{2 \cdot AB \cdot BC} = \frac{100 + 144 - 100}{2 \times 10 \times 12} = \frac{144}{240} = \frac35
$$

所以 $\sin B = \sqrt{1 - \frac{9}{25}} = \frac45$。

在 $\triangle ABD$ 中，$\angle BAD = 30^\circ$，$\angle ABD = \angle B$。

$\angle ADB = 180^\circ - 30^\circ - \angle B$

由正弦定理：

$$
\frac{AD}{\sin B} = \frac{AB}{\sin \angle ADB}
$$

先求 $\sin \angle ADB$：

$$
\angle ADB = 180^\circ - 30^\circ - \arccos\frac35
$$

这个表达式较复杂，我们可以用另一种思路：

在 $\triangle ABD$ 中直接用正弦定理：

$$
\frac{AD}{\sin B} = \frac{AB}{\sin(150^\circ - B)}
$$

$$
\sin(150^\circ - B) = \sin150^\circ\cos B - \cos150^\circ\sin B = \frac12 \times \frac35 + \frac{\sqrt3}{2} \times \frac45
$$

整理得：

$$
AD = \frac{AB \times \sin B}{\sin(150^\circ - B)} = \frac{10 \times \frac45}{\frac{3}{10} + \frac{4\sqrt3}{10}} = \frac{8}{\frac{3 + 4\sqrt3}{10}} = \frac{80}{3 + 4\sqrt3}
$$

有理化得：

$$
AD = \frac{80(4\sqrt3 - 3)}{39}
$$

### 例 2：取值范围问题

在 $\triangle ABC$ 中，$\angle A = 60^\circ$，$BC = 2$，求 $AB + AC$ 的取值范围。

**解：**

由正弦定理：

$$
\frac{BC}{\sin A} = \frac{AB}{\sin C} = \frac{AC}{\sin B} = \frac{2}{\frac{\sqrt3}{2}} = \frac{4}{\sqrt3}
$$

所以：

$$
AB + AC = \frac{4}{\sqrt3}(\sin C + \sin B)
$$

因为 $B + C = 120^\circ$，设 $B = 60^\circ + x$，$C = 60^\circ - x$，$|x| < 60^\circ$。

$$
\sin C + \sin B = \sin(60^\circ - x) + \sin(60^\circ + x) = 2\sin 60^\circ \cos x = \sqrt3 \cos x
$$

所以：

$$
AB + AC = \frac{4}{\sqrt3} \times \sqrt3 \cos x = 4\cos x
$$

$x \in (-60^\circ, 60^\circ)$，$\cos x \in (\frac12, 1]$。

因此 $AB + AC \in (2, 4]$。

### 例 3：证明题

在 $\triangle ABC$ 中，求证：

$$
\frac{a-b}{a+b} = \frac{\sin A - \sin B}{\sin A + \sin B}
$$

**证明：**

由正弦定理 $\frac{a}{\sin A} = \frac{b}{\sin B} = 2R$，得 $a = 2R\sin A$，$b = 2R\sin B$。

代入左边：

$$
\frac{a-b}{a+b} = \frac{2R\sin A - 2R\sin B}{2R\sin A + 2R\sin B} = \frac{\sin A - \sin B}{\sin A + \sin B}
$$

得证。这个结论被称为**正切定理**的推论。

## 解题策略总结

| 条件特征 | 首选思路 |
|---------|---------|
| 涉及外接圆 | 正弦定理 + $2R$ |
| 三边或两边夹角 | 余弦定理 |
| 涉及面积 | $S = \frac12 ab\sin C$ 或海伦公式 |
| 求取值范围 | 用正弦定理转化为三角函数 |
| 多三角形 | 找公共边或公共角，分别用定理 |
| 证明边角关系 | 正弦定理统一为角或边 |

## 练习题

1. $\triangle ABC$ 中，$\angle A = 120^\circ$，$a = 7$，$b + c = 8$，求 $b, c$。
2. $\triangle ABC$ 中，$\max(a, b, c) < \frac{a+b+c}{2}$，求证：$\triangle ABC$ 是锐角三角形。
3. $\triangle ABC$ 中，$a\cos A = b\cos B$，判断三角形形状。
