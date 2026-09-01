---
title: "Automatic Differentiation"
description: "Automatic Differentiation — notes by Théo Morales"
date: 2022-10-09 12:00:00
categories: [deep-learning, automatic-differentiation]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
## Backpropagation in practice

The theory of backpropagation, as discussed in [Backpropagation basics](../backpropagation-basics/), is rather simple: compute the forward pass, calculate the loss, and apply the sum rule and the chain rule for each parameter.
This sounds easy to implement for a fixed-size neural network, but  
how would we go about implementing a flexible and automatic backpropagation algorithm for an arbitrary amount of layers and units?

> 
>Check this out:  [autodiff slides](https://mblondel.org/teaching/autodiff-2020.pdf)

### Symbolic differentiation?

Requires closed-form expressions, is very costly (because of the product rule, expressions can grow exponentially).

### Automatic differentiation
Rather than *analytically* compute an *expression* for the derivative, as in the symbolic differentiation, we can compute the partial derivatives *numerically* by exploiting known primitives and the intermediary variables used during computation of the forward pass. The chain rule becomes very useful here.

#### Forward mode
"Forward auto-diff involves augmenting each intermediate variable during evaluation of a function with its derivative". Not suitable for large models, any DL models, because is only effective when inputs << outputs.
How are the derivatives of each variable computed on the go?? I need to dig into this...

#### Reverse mode
{% endraw %}
