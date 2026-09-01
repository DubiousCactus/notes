---
title: "Batch Normalisation"
description: "Batch Normalisation — notes by Théo Morales"
date: 2022-02-11 12:00:00
categories: [deep-learning]
tags: [deep-learning]
math: true
media_subpath: /assets/img/blog
pin: false
published: true
---

{% raw %}
## What makes deep neural networks training slow?

[why does batch norm work?](https://www.youtube.com/watch?v=nUUqwaxLnWs)

![Deep Neural Network.](https://i.stack.imgur.com/epElm.png)

**Let's have a look at the hidden layer 4:** its activations depend on earlier layers' activations, which are parameterised by their weights and biases. As the earlier weights are changing during training, the distribution of inputs at layer 4 is shifting: this phenomenon is referred to as *covariate shift*.

> What is covariate shift? It is the change in the distribution of the inputs. If the objective function changes, the covariate shift is even more acute.


## Exploding gradients

In a network of ReLU activations for instance, if the weights of all layers are larger than one, the activations of the output layer will explode. This in turns causes the gradients at the earlier layers to explode!

The issue is simply the result of too high gains in the network.

By introducing batch normalisation, or group normalisation, or layer normalisation, the activations of the network are normalised and the outputs don't  grow exponentially.

## How does Batch Normalisation fix the issue?


Batch Norm essentially reduces the amount by which the distribution of the inputs of a hidden layer shifts around, by normalising those inputs to have a mean of $$\beta$$ and a variance of $$\gamma$$.
As the earlier layers' parameters are being updated, the Batch Norm layer will ensure that the mean and variance of the corresponding hidden layer remain the same.
This solution effectively reduces the fluctuation in the weights for deeper layers, which was the root of gradient instability between mini-batches.

However, it removes deterministic behavior.

So how do we fix it? Compute quantities during training, use them for inference.

## The regularisation effect of Batch Norm

In addition to the benefits in learning, Batch Norm acts as regularisation by scaling the values in each mini-batch by a factor of their mean and variance. Since those are specific to each mini-batch, they fluctuate and act as additive noise to each hidden layer's activations.
This side effect is minimal and decreases as the mini-batch size increases; it shouldn't be used primarily as a regulariser.
{% endraw %}
