---
title: "Latent Variable Models"
description: "Latent Variable Models — notes by Théo Morales"
date: 2023-09-15 12:00:00
categories: [deep-learning, variational-inference]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
Talk about what we want to do (approximate very large or complex distributions, ie high dimensional data like natural images). We want to be able to sample likely data points, not just infer the likeliness of a data point. Markov Chain Monte Carlo methods and the like allow us to integrate the distribution of the data and approximate it, but it is super computationally expensive and does not scale well to high dimensional problems.
Now, since we have these things called "universal function approximators" (jk it's neural networks lolz), we can exploit them to do it more efficiently.

## Latent variables

Okay so what's a latent? Something not observed, something that explains the event but that we can't observe. Give analogy + graphical model diagram.

## Approximating distributions with latent variables

The idea is to define a deterministic model f(z;theta), which produces samples very similar to the data, but random ones since we sample z from P(Z). 

> Before we can say that our model is representative of our dataset, we need to make sure that for every datapoint X in the dataset, there is one (or many) settings of the latent variables which causes the model to generate something very similar to X.

So basically we want to encourage continuity in the latent space. (TODO: Verify this intuition. Is it really what's going on here??)


So what is the approximative distribution here? Are we trying to approximate P(X) with P(Z) or with theta? Well I think you just answered it: theta parameterizes a deterministic function, so by definition it's not a probability distribution. The latent distribution P(Z) is the one that will learn the information lower bound to transmit to the decoder f(z;theta). By increasing the entropy of P(Z), we can reduce its information content but keep it to the minimum using the [KL divergence](../kullback-leibler-divergence/) (minimizing the information loss).


We aim to maximize the probability of each X in the training set under the entire generative process, via *maximal likelihood*, according to



$$
P(X) = \int P(X|z; \theta) P(Z) dz
$$



we replaced $$f(z;\theta)$$ with a distribution which allows us to make the dependence of X on z explicit. 

The typical problem is that solving for this equation requires integrating over aaaall the values of the latent space, which is intractable. To make it tractable, we replace the encoder by a new one $$Q(z\vertX)$$ which generates a latent given the input.
{% endraw %}
