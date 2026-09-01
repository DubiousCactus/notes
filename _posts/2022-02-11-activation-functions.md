---
title: "Activation functions"
description: "Activation functions — notes by Théo Morales"
date: 2022-02-11 12:00:00
categories: [deep-learning]
tags: [deep-learning]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
Monotonic functions, functions which are either entirely non-increasing or non-decreasing on a given interval, are highly desirable as activation functions. This is because backpropagation tries to adjust the inputs of each activation, such that the final activation, the output neurons, minimise the loss. However, non-monotonic functions (such as the absolute value function, or a sinusoidal), can yield more than one input value for a given output. Because there are several choices that lead to the same result, there are several local minima: this creates saddle points in the optimisation landscape.

```plotly
data:
  - x: [-1,0,1]
    y: [1,0,1]
```

## Sigmoid



$$
\sigma(x)=\frac{1}{1+\exp(-x)}
$$


### What makes ReLU so popular?

The ReLU -- **Rectifying** Linear Unit -- function acts as a switch inside a neural network, a simple detector if you will. It simply lets information flow above a certain threshold, and allows each neuron in a neural network to "detect" and capture specific signals, parameterised by the learnt weights.
It plays the role as a diode -- a **rectifier** -- in electronics: it lets current flow beyond a certain threshold. This threshold is typically encoded in the bias of the neuron, but the complete affine transformation is what filters the signal.

The linearity of ReLUs is also very useful to combat vanishing and exploding gradients, as discussed in [Batch Normalisation](../batch-normalisation/).


## Softmax for logistic regression


## The Softmax function

Softmax is defined as:



$$
\sigma(\vec{z})_i = \frac{e^{z_i}}{\sum_{j=1}^{K}e^{z_j}}
$$



where $$z_i$$ are the elements of the input vector, and $$e$$ is the Euler number of the exponential function. The denominator is the normalization term which ensures that all the output values of the function will sum up to $$1$$, thus constituting a valid probability distribution. Softmax normalizes the weights, but it makes large values larger via the exponential function, as the following figure[^3] illustrates:

![The Softmax function in the scaled dot-product attention.](softmax.png)

[^3]: [Attention Approximates Sparse Distributed Memory](https://www.youtube.com/watch?v=THIIk7LR9_8)


The softmax function is a multinomial generalisation of the sigmoid (A.K.A. the logistic function or the Fermi-Dirac distribution)

Sigmoid, the logistic function, is a special case of softmax for two variables where one of them is always zero:



$$
z_1 = \frac{e^{x_1}}{e^{x_1}+e^{x_2}}=\frac{e^{x_1}}{e^{x_1}+1}=\frac{1}{1+e^{x_1}}
$$



where $$x_2=0$$. The exponential is very convenient here, and in statistics in general, because it allows to smoothly convert any real number into a positive number, while its derivative is itself.

Softmax becomes very convenient when we want to convert arbitrary scores, or input activations, into a series of numbers that sum up to one, such that they can be interpreted as a probability distribution over a choice of $$n$$ outcomes.
{% endraw %}
