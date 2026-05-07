---
title: "解三角形（四）：实际应用问题"
date: "2026-05-08"
description: "测量距离、高度、角度——解三角形在现实生活中的经典应用。"
tags: ["数学", "解三角形", "应用"]
category: "高一必修一"
slug: "trig-4-applications"
---

## 常见实际场景

解三角形在实际中广泛应用于：

- **测量距离**：不可直接测量的两点间距
- **测量高度**：建筑物、山的高度
- **航海导航**：船只定位与航向
- **物理力学**：力的合成与分解

## 关键术语

- **仰角**：从水平线向上看目标的角度
- **俯角**：从水平线向下看目标的角度
- **方位角**：从正北方向顺时针旋转的角度

## 典型例题

### 例 1：测量河宽

要测量一条河的宽度，在河的一侧选取两点 $A, B$，测得 $AB = 50\text{m}$。在对岸选一点 $C$，测得 $\angle CAB = 60^\circ$，$\angle CBA = 45^\circ$。求河宽。

**解：**

在 $\triangle ABC$ 中，$AB = 50$，$A = 60^\circ$，$B = 45^\circ$。

$C = 180^\circ - 60^\circ - 45^\circ = 75^\circ$

由正弦定理：

$$
\frac{AB}{\sin C} = \frac{AC}{\sin B}
$$

$$
\frac{50}{\sin 75^\circ} = \frac{AC}{\sin 45^\circ}
$$

$$
AC = \frac{50 \times \frac{\sqrt2}{2}}{\frac{\sqrt6 + \sqrt2}{4}} = \frac{50\sqrt2}{2} \times \frac{4}{\sqrt6 + \sqrt2}
$$

$$
= \frac{100\sqrt2}{\sqrt6 + \sqrt2} = \frac{100\sqrt2(\sqrt6 - \sqrt2)}{4} = 50(\sqrt3 - 1) \approx 36.6\text{m}
$$

河宽即为 $C$ 到 $AB$ 的垂线距离：

$$
h = AC \times \sin 60^\circ = 36.6 \times \frac{\sqrt3}{2} \approx 31.7\text{m}
$$

### 例 2：测量楼高

在距离楼底 $30\text{m}$ 处，测得楼顶仰角为 $30^\circ$，向前走 $10\text{m}$ 后，测得仰角为 $45^\circ$。求楼高。

**解：**

设楼高为 $h$，第一次观测点距离楼底 $d$，则 $\tan 30^\circ = \frac{h}{d}$。

第二次观测点距离楼底 $d-10$，$\tan 45^\circ = \frac{h}{d-10}$。

由 $\tan 45^\circ = 1$ 得 $h = d - 10$。

代入 $\tan 30^\circ = \frac{1}{\sqrt3}$：

$$
\frac{h}{h + 10} = \frac{1}{\sqrt3}
$$

$$
\sqrt3 h = h + 10
$$

$$
h(\sqrt3 - 1) = 10
$$

$$
h = \frac{10}{\sqrt3 - 1} = 5(\sqrt3 + 1) \approx 13.66\text{m}
$$

### 例 3：航海问题

一艘船从港口 $O$ 出发，向东航行 $30$ 海里到达 $A$ 点，然后向北偏东 $60^\circ$ 航行 $40$ 海里到达 $B$ 点。求 $B$ 点相对于港口 $O$ 的距离和方位。

**解：**

$\angle OAB = 180^\circ - 60^\circ = 120^\circ$

在 $\triangle OAB$ 中，$OA = 30$，$AB = 40$，$\angle OAB = 120^\circ$，用余弦定理：

$$
OB^2 = 30^2 + 40^2 - 2 \times 30 \times 40 \times \cos 120^\circ
$$

$$
= 900 + 1600 - 2400 \times (-\frac12) = 900 + 1600 + 1200 = 3700
$$

$$
OB = 10\sqrt{37} \approx 60.8\text{海里}
$$

再用正弦定理求 $\angle AOB$：

$$
\frac{\sin \angle AOB}{40} = \frac{\sin 120^\circ}{60.8}
$$

$$
\sin \angle AOB \approx \frac{40 \times 0.866}{60.8} \approx 0.570
$$

$\angle AOB \approx 34.7^\circ$，即北偏东 $55.3^\circ$。

## 练习题

1. 从山顶测得山脚两点的俯角分别为 $30^\circ$ 和 $45^\circ$，两点相距 $200\text{m}$，求山高。
2. 一艘船测得灯塔在北偏东 $30^\circ$ 方向，航行 $20$ 海里后测得灯塔在北偏西 $60^\circ$ 方向，求船与灯塔的最近距离。
