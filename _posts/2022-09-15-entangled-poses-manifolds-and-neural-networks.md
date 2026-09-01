---
title: "Entangled poses, Manifolds, and Neural Networks"
description: "Entangled poses, Manifolds, and Neural Networks — notes by Théo Morales"
date: 2022-09-15 12:00:00
categories: [deep-learning, manifolds-neural-networks]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
## The curse of dimensionality

As dimensionality rises, exponentially more parameters are needed to fit data points using traditional methods that are reasonable for low-dimensional data. It raises important issues for pattern recognition applications, but it does not prevent us from finding effective techniques applicable to high-dimensional spaces.[^1]

As the input space increases in dimensionality, and therefore the variables describing each data point increase, the number of partitions that can subdivide it grows exponentially! Therefore, this naive approach of partitioning the input space to classify new samples according to the majority of training point in the corresponding partition requires an exponentially large quantity of training data to fill all partitions in the space.

In broader terms, difficulty arises in high dimensional spaces, which leads to intuitions in low dimensions not always transferring to high dimensions.

However, there are two reasons why we can effectively develop techniques to solve problems in high-dimensional spaces:
> - Real data will often be confined to a region of space having lower effective dimensionality, and in particular the directions over which important variations in the target variables occur may be so confined.[^1]
> - Real data will typically exhibit some smoothness properties (at least locally), so for the most part small changes in the input variables will produce small changes in the target variables, and so we can exploit local interpolation-like techniques to allow us to make predictions of the target variables for new values of the input variables.[^1]



[^1]: Bishop: Pattern Recognition and Machine Learning

### The problem of hand-object pose estimation
Hand-Object Pose can be thought of as 3D data points that are under conditioned rigid constraints (conditioned on the object shape), themselves under rigid constraints (hand skeleton, rigid body geometry). Hand pose can also be thought of as high-dimensional data, if we flatten the $$21 \times 3$$ 3D joints matrix into a vector $$\overrightarrow{x} \in \mathbb{R}^{63}$$  living in high-dimensional space, which has lower effective dimensionality because of those said constraints: each joint only has very few effective degrees of freedom. 

High-dimensional hand-object pose samples of manipulations of the **same object** live in a low-dimensional manifold embedded within the high-dimensional space, because the rigid object's geometry reduces the degrees of freedom of the hand and object poses. Due to the complex relationships between the hand-object pose and the pixel intensities, this manifold will be highly nonlinear.

*The goal* is ultimately to reduce the degrees of freedom of variability within the manifold. Deep Neural Networks learn to do that from the data, by embedding each point into lower-dimensional manifolds, sometimes after projecting them into higher-dimensional spaces so that the original Euclidean space becomes an embedded manifold which can be unlinked. I am trying to make this all fit into my research on 
[Accelerated Learning in the Context of Hand-Object Interaction](../accelerated-learning-in-the-context-of-hand-object-interaction/).

## The manifold hypothesis

**The manifold hypothesis is that natural data form lower-dimensional manifolds in its embedding space.**

"A manifold is a topological space that locally resembles Euclidean  space near each point." This means that within an $$n$$-dimensional Euclidean space, where fundamental properties such as the *parallel postulate* are provable, one can define a sub-space as non-Euclidean geometry. "More precisely, an $$n$$-dimensional manifold, or $$n$$-manifold for short, is a topological space with the property that each point has a neighborhood that is homeomorphic to an open subset of $$n$$-dimensional Euclidean space. It allows complicated structures to be described in terms of well-understood topological properties of simpler spaces. One-dimensional manifolds include lines and circles, but not figure eights. Two-dimensional manifolds are also called surfaces."[^2] One can imagine folding an Euclidean space such that it adopts a certain topology and becomes more compact, sort of intricate.

[^2]: https://en.wikipedia.org/wiki/Manifold

> Many problems in machine learning involve regressing outputs that do not lie on a Euclidean space – such as a discrete probability distribution, or the pose of an object. An approach to tackle these problems through gradient-based learning consists in including in the deep learning architecture a differentiable function mapping arbitrary inputs of a Euclidean space onto this manifold.[^5]

[^5]: [Deep regression on manifolds: a 3D rotation case study (Brégier)](https://arxiv.org/abs/2103.16317v1)

### Object manifolds

Let's consider the case of visual object representation, where we have several classes of objects, all of which containing variations of themselves in terms of appearance, orientation, context, etc. We want to define an object manifold as a subspace of the feature space, where all instances of the same class belong. As defined by Chung[^4], an object manifold can be regarded as the convex hull of the point cloud representing such variations. This is a relatively simplistic view that differs from the pure mathematical definition of a manifold[^2].

![A geometric view of object manifolds.](obj-manifold.png)[^4]

A point in the manifold (one instance of an object class) can be represented as

$$$\bf{x}^\mu = \bf{x}_0^\mu + \Sigma_{i=1}^D s_i \bf{u}_i^\mu$$$
where $$\bf{x}_0^\mu \in \mathcal{R}^N$$ is the center of the object manifold in feature space of dimensionality $$N$$, $$\bf{u}_i^\mu \in \mathcal{R}^N$$ are the basis vectors of the subspace spanned by the manifold in $$D$$ dimensions, and $$\vec{S}$$ is the shape of the manifold defined as a function $$f(\vec{S}) \le 0, \vec{S} \in \mathcal{R}^D$$. This function on the shape parameter is what interests us: it can be learned to parameterize the manifold shape.


[^4]: [Sue-Yeon Chung - Emergence of Separable Manifolds in Deep Neural Networks](https://www.youtube.com/watch?v=Svf0QOQ0Cpw)

### Visual object recognition in the brain

![neural_rep](neural-rep.png)[^3]

[^3]: [How Does the Brain Solve Visual Object Recognition? (DiCarlo et al.)](https://neurophysics.ucsd.edu/courses/physics_171/rust.pdf)
{% endraw %}
