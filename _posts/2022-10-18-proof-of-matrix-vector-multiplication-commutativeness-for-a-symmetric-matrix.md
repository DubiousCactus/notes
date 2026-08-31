---
title: "Proof of matrix-vector multiplication commutativeness for a symmetric matrix"
description: "Proof of matrix-vector multiplication commutativeness for a symmetric matrix — notes by Théo Morales"
date: 2022-10-18 12:00:00
categories: [mathematical-foundations, linear-algebra]
math: true
pin: false
---

{% raw %}
For vectors $$\mathbf{a}, \mathbf{b} \in \mathbf{R}^n$$  and matrix $$K \in \mathbf{R}^{n \times n}$$, we may write


$$
\begin{align}
\mathbf{a}^T K \mathbf{b} &= a^T 
\begin{bmatrix}
	K_{11}b_1 + K_{12}b_2+\cdots+K_{1n}b_n,
	 \hspace{10px} \cdots,
	%%%%K_{21}b_1 + K_{22}b2 + \cdots+K_{2n}b_n,
	 \hspace{10px}
	 K_{n1}b_1 + K_{n2}b_2 + \cdots+K_{nn}b_n
\end{bmatrix}\\
&= K_{11}(a_1b_1)+ K_{12}(a_1b_2)+\cdots+K_{1n}(a_1b_n)+\cdots\\&+K_{n1}(a_nb_1)+K_{n2}(a_nb_2)+K_{nn}(a_nb_n),
\end{align}
$$


and similarly


$$
\begin{align}
\mathbf{b}^T K \mathbf{a} &= b^T 
\begin{bmatrix}
	K_{11}a_1 + K_{12}a_2+\cdots+K_{1n}a_n,
	 \hspace{10px} \cdots,
	%%%%K_{21}b_1 + K_{22}b2 + \cdots+K_{2n}b_n,
	 \hspace{10px}
	 K_{n1}a_1 + K_{n2}a_2 + \cdots+K_{nn}a_n
\end{bmatrix}\\
&= K_{11}(b_1a_1)+K_{12}(b_1a_2)+\cdots+K_{1n}(b_na_1)+\cdots\\&+K_{n1}(b_na_1)+K_{n2}(b_na_2)+K_{nn}(b_na_n).
\end{align}
$$


We can see a pattern emerging here, where all factors of the diagonal of $$K$$ are equal, such as $$K_{11}(a_1b_1)=K_{11}(b_1a_1)$$. The differences are in the non-diagonal elements, such as the factor of $$K_{12}$$ being $$(a_1b_2)$$ for $$\mathbf{a}^TK\mathbf{b}$$ but $$(a_2b_1)$$ for $$\mathbf{b}^TK\mathbf{a}$$. Intuitively, if $$K_{12}=K_{21}$$, the equality holds.
It can be verified by developing the above linear systems that $$\mathbf{a}^TK\mathbf{b} = \mathbf{b}^TK\mathbf{a}$$ **if and only if** $$K_{ij} = K_{ji}$$, or in other words if $$K^T=K$$.
{% endraw %}
