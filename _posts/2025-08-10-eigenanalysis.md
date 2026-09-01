---
title: "Eigenanalysis"
description: "Eigenanalysis — notes by Théo Morales"
date: 2025-08-10 12:00:00
categories: [mathematical-foundations, linear-algebra]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
Eigenvector = v such that $$A\mathbf{v} = \lambda \mathbf{v}$$, ie the direction of v remains the same but its magnitude changes and $$\lambda$$ is the eigenvalue.
- Eigenvectors of a sym. matrix will be orthogonal
- PCA uses the eigenvectors with the largest eigenvalues
- Eigenvalues are roots of the characteristic polynomial where $$\det (A - \lambda I) = 0$$ 
	- The polynomial is in $$\lambda$$ and of degree N, the size of an NxN matrix.
	- You can use SVD to solve arbitrary polynomials by constructing the matrix A, ie:
		$$$\det(\[0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \\ -a & -b & -c & -d\] - \lambda I)$$$

- Eigendecomposition into an orthogonal mat of eigenvectors and diag mat of eigenvalues: $$A = Q\Lambda Q^{-1}$$ 
	- Extended to non-square matrices with SVD: $$A = U \Sigma V^*$$ 



----------
- Eigenvectors of a covmat of vertex positions give you the axes of an OBB!
	- Largest eigenvalue: direction that vertices are most linear
	- Second eigenvalue: spans best-fit plane
	- Third eigenvalue: normal to best-fit plane
OBB are way more complex than AABB to check for intersection/collision. But sometimes faster at runtime because you get a much better fit and so less boxes to check!
{% endraw %}
