---
title: "From Diametrically Opposed Ideas to Artificial Intelligence"
description: "From Diametrically Opposed Ideas to Artificial Intelligence — notes by Théo Morales"
date: 2022-10-18 12:00:00
categories: [conversations]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
> Purpose
> In this post, I simplify concepts and mostly treat Artificial Intelligence as Deep Learning. While AI may be an annoying term that does not mean much, it is what the public hears about. This oversimplification is useful to explain such advanced concepts to the masses.

## Diametrically opposed ideas and where to find them
*“I won't participate in this debate. Our ideas are diametrically opposed!”*

*— “But what does it even mean to be diametrically opposed?”*


![Diameter](diameter.svg)

Let us start with the definition of diameter. One way to define it is: the segment of which the two ends are adjacent to a circle's perimeter, and whose length is maximal. It can be seen as the maximum distance between two points on a circle. This applies to spheres in three dimensions. Thus, *diametrically opposed* means opposed by the maximum *distance* in a straight line, and by analogy to the circle: on opposite sides.


*“How can ideas be separated by distance? It's not like you can draw a measuring tape between two ideas!”*

While this is true for the real — tangible — world, it does not necessarily mean that distance cannot be measured between ideas, words, concepts or any modality of information for that matter. It is possible to represent any piece of information, whatever its nature, as a point in space: this is called *embedding*.
In fact, not only is it possible, but it is a common thing to do in the field of Data Analytics and Artificial Intelligence.
Just like we can plot 8 points in 3D space to form a cube, we can plot words or pictures too! 


![Shared vector space](shared-vector-space.svg)
#### Too abstract? Let's flatten things out and think in 2D.
A point in space is typically represented by its coordinates, $$x$$ and $$y$$ for 2D planes, which correspond to the point's position on each axis: the $$X-$$axis and the $$Y-$$axis. This space is referred to as *Euclidean*[^2], where we can apply *Euclidean geometry*, the one you learn in primary school. However, those two axes do not *have to* represent absolute, meaningless, position on two lines. 
They can also represent other concepts, such as the price of a house and its square-footage. When stripped with the meaning of absolute position in a space, such points live in what we call a *“vector space”*. In fact, they are not called points any more, but *vectors*. In this space, vectors can be added, multiplied or subtracted together. They have additional properties that are absent from *“Euclidean space”*. 
A vector is simply an abstract entity, which can still be seen as a point in space. It represents the various attributes of our datum[^1] in the form of a list. The magic here is that we can still treat vectors as points (and points as vectors, ha!), and use Euclidean geometry to, for instance, compute their distance!

[^1]: A *datum* is a unit of data. One datum can be one house and can be formed into a vector with attributes *price* and *square-footage*.
[^2]: Euclidean space is the fundamental space of classical geometry, governed by a set of rules such as parallelism.

### Any modality of data can be embedded in space

*“But how can words be embedded in space? Letters are not numbers!”*

While this would be the subject of another post, we embed information in a *vector space* with *artificial neural networks* nowadays. For instance, images are represented as numbers corresponding to the colour amounts (*i.e.,* red, blue, and green) for each pixel coordinate, whereas words are simply matched with a unique number in the form of a dictionary.
As such, two words identified by two different numbers can be embedded in a *vector space* by a neural network such that their distance is proportional to the similarity of both words' meaning. The way that this embedding works is *learnt* by *training* the neural network, such that words that mean similar things are close to each other in this space, while words that have opposite meanings are far apart. Clever, right?

### AI reasons by similarity

*“Ooh I see! So Artificial Intelligence works by association of ideas?”*[^3]

![dogs vs cats](dogs-vs-cats.svg)

In a way, yes! The idea of artificial neural networks, in this field that we call *Deep Learning*, is to represent concepts in a space, such that new concepts can be assimilated with previously seen ones. To classify pictures of cats and dogs, for instance, a neural network learns to embed pictures of cats such that they are close together in space, while pictures of dogs are clustered together in another region of the space. Given a previously unseen image of a dog, the neural network embeds it according to its learning, and simply compares the distance[^4] with both clusters: it decides that it must be a dog because the distance to the dogs cluster is smaller than the one to the cats cluster. This is an oversimplification of how neural networks work, although that is precisely how Prototypical Networks learn new concepts with very little examples [^5]! See my post on meta-learning for a closer look at this family of methods: [A Gentle Introduction to Meta-Learning](../a-gentle-introduction-to-meta-learning/).

[^3]: https://en.wikipedia.org/wiki/Association_of_ideas
[^4]: We actually use the *cosine similarity* as a distance measure between two vectors, derived from the dot-product of two vectors (see [The Scaled Dot-Product Attention function](../attention-is-all-you-need/#the-scaled-dot-product-attention-function)). 
[^5]: Snell, Jake et al. “Prototypical Networks for Few-shot Learning.” _NIPS_ (2017).


### AI is not just about reasoning by similarity

*“So that's what Artificial Intelligence is, after all?”*

Well, yes and no. The association of ideas paradigm is a good simplification of Artificial Intelligence to explain it. But in truth, it is all about pattern recognition! Recognizing patterns allows making predictions about the future (weather forecasting, stock market movements, car crash prevention, etc.), or to classify images and other types of data (fraud prevention, spam detection, etc.). 

Deep Learning and neural networks are an efficient and effective way to recognize patterns on a large scale (image and videos for instance), but they require humongous quantities of data to learn. 
With neural networks, generalization $$-$$ the ability to recognize patterns outside their training examples $$-$$ remains a challenge to solve. These models are trained by showing them many examples of the archetypes of what we wish them to understand (*i.e.,* cats and dogs). When deployed in the real world, we need them to recognize these archetypes on examples that were not in their training data: this is what learning is all about!
The family of methods introduced in [A Gentle Introduction to Meta-Learning](../a-gentle-introduction-to-meta-learning/) directly addresses this issue.

There are many other methods that fall under the umbrella of Artificial Intelligence, or what should really be called *Machine Learning*. For many real-world challenges, simpler methods are better suited than neural networks. But if your only tool is a hammer, then every problem looks like a nail.
{% endraw %}
