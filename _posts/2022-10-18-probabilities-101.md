---
title: "Probabilities 101"
description: "Probabilities 101 — notes by Théo Morales"
date: 2022-10-18 12:00:00
categories: [mathematical-foundations, probabilities-statistics]
math: true
pin: false
---

{% raw %}
## Probability Mass Function (PMF)
The PMF is suited for *discrete random variables* $$X$$. It assigns every realization of $$X$$ a **probability** in the interval $$[0,1]$$. The name *mass* refers to how much it influences the corresponding outcome of $$X$$:


$$
p_X(x)=P(X=x).
$$


In addition to each probability mass being in the interval $$[0,1]$$, the PMF must “integrate” to 1:


$$
\sum_x p_X(x) = 1.
$$



## Probability Density Function (PDF)

The PDF is suited for *continuous random variables* $$X$$. It is a **density function**, as opposed to a **mass function**, because it represents **where** the mass is, not **what** the mass is. 
In fact, the probability of all random variables at any point $$x$$ is **always** $$0$$! The reason is simple: there is an infinite amount of real-valued numbers in any interval, and the sum of all their probabilities must add up to 1.

> 
> *Even for fixed intervals*, a random variable has an infinite amount of possible values, whose probabilities must sum up to 1.

To compute the probability of a certain realization of $$X$$, we integrate the PDF over an interval :


$$
\begin{align}
p(X=x) &= \int_{-\infty}^\infty xp(x)dx, \\
p(a < X <b) &= \int_a^b xp(x)dx.
\end{align}
$$


In order for the PDF to be valid, it must integrate to 1:


$$
\int_{-\infty}^\infty xp(x)dx = 1.
$$
{% endraw %}
