---
title: "解三角形（三）：面积公式与综合"
date: "2026-05-08"
description: "三角形面积公式的多重形式，以及正余弦定理的综合运用。"
tags: ["数学", "解三角形", "面积"]
category: "高一必修一"
slug: "trig-3-area-formula"
---

![area](https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800)

## 三角形面积公式

### 1. 底×高÷2（基础）

$$
S = \frac12 \times \text{底} \times \text{高}
$$

### 2. 两边及其夹角

$$
S = \frac12 ab\sin C = \frac12 bc\sin A = \frac12 ac\sin B
$$

这个公式将面积与正弦定理联系起来了。

### 3. 海伦公式（已知三边）

设 $p = \frac{a+b+c}{2}$（半周长）：

$$
S = \sqrt{p(p-a)(p-b)(p-c)}
$$

### 4. 外接圆半径形式

$$
S = \frac{abc}{4R}
$$

其中 $R$ 为外接圆半径。

## 典型例题

### 例 1：两边夹角求面积

在 $\triangle ABC$ 中，$a = 8$，$b = 6$，$C = 30^\circ$，求面积。

**解：**

$$
S = \frac12 ab\sin C = \frac12 \times 8 \times 6 \times \frac12 = 12
$$

### 例 2：综合应用

在 $\triangle ABC$ 中，$A = 60^\circ$，$b = 10$，$S = 20\sqrt3$，求 $c$ 和 $a$。

**解：**

由面积公式：

$$
S = \frac12 bc\sin A
$$

$$
20\sqrt3 = \frac12 \times 10 \times c \times \frac{\sqrt3}{2}
$$

$$
20\sqrt3 = \frac{5\sqrt3}{2}c \quad\Rightarrow\quad c = 8
$$

再由余弦定理求 $a$：

$$
a^2 = b^2 + c^2 - 2bc\cos A = 100 + 64 - 2 \times 10 \times 8 \times \frac12 = 84
$$

$$
a = 2\sqrt{21}
$$

### 例 3：海伦公式

三角形三边为 $7, 8, 9$，求面积。

**解：**

半周长 $p = \frac{7+8+9}{2} = 12$

$$
S = \sqrt{12 \times 5 \times 4 \times 3} = \sqrt{720} = 12\sqrt5
$$

## 方法选择

| 已知条件 | 面积公式 |
|---------|---------|
| 两边夹角 | $S = \frac12 ab\sin C$ |
| 三边 | $S = \sqrt{p(p-a)(p-b)(p-c)}$ |
| 底和高 | $S = \frac12 \times \text{底} \times \text{高}$ |

## 练习题

1. $\triangle ABC$ 中，$a = 5$，$c = 7$，$B = 45^\circ$，求面积。
2. 三角形三边长为 $10, 12, 14$，求面积和外接圆半径。
