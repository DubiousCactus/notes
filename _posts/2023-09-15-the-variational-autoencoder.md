---
title: "The Variational Autoencoder"
description: "The Variational Autoencoder — notes by Théo Morales"
date: 2023-09-15 12:00:00
categories: [deep-learning, variational-inference]
math: true
pin: false
---

{% raw %}
> 
>I should write this article as a high level description of VAEs, by building on top of my smaller notes (entropy, information bottleneck, KL divergence, latent variable models and ELBO). I should focus the article on how all these components are connected, and how VAEs have become the basis of many variational models.

## Information theory, entropy and KL-Divergence
  
[The information bottleneck](/posts/the-information-bottleneck/)
[Shannon's Entropy](/posts/shannons-entropy/)

### Reconstruction loss
Why? To encode meaningful features and not just random vectors of course.

### Distribution parameters for the latent vector
Why do we use the KLD to enforce a prior close to zero-mean Gaussian with unit variance? Well because we want to enforce all the encodings to be close together, otherwise they may drift apart in the manifold and we wouldn't be able to interpolate in latent space! It would create something quite discontinuous with huge gaps between groups of latent variables that would represent nothing!
That's because the features all vary in some way (some my be similar to each other). So the representations (latents z) would vary accordingly: differences between samples that can't be exaplined as noise would push the means apart to allow sampling distinct subclasses.
"[So, the **semantic features** come from trying to best represent N most semantically salient _variables in the training data_ (as extracted by the preceding encoder layers).](https://stats.stackexchange.com/questions/346387/why-does-enforcing-a-prior-distribution-create-semantic-latent-variables-in-vari?rq=1)".
[Kullback-Leibler Divergence](/posts/kullback-leibler-divergence/)

## Latent Variable Models
[Latent Variable Models](/posts/latent-variable-models/)

## ELBO loss
[Evidence Lowerbound (ELBO)](/posts/evidence-lowerbound-elbo/)]


## VAEs in practice

- [Why don't we use a full covariance matrix?](https://stats.stackexchange.com/questions/388620/variational-autoencoder-and-covariance-matrix)
	- Mostly because it's much quicker to draw samples from a diagonal covmat, meaining it's much much faster to optimize VAEs that way.
	- Using a diagonal covmat explicitly states that we want to model a latent representation as independent Gaussians, such that it's easier to optimize. However, while these models are in the *mean-field variational family*, there exists a family of models called *structured variational inference* which adds dependencies between the variables.
	- It is not necessary to be limited to independent Gaussians, but it's computationally much more feasible: with $$d$$ elements in each of $$\mu$$ and $$\sigma$$, the total number of latent parameters is $$2d$$. An alternative method which would output a covariance matrix would now need $$\frac{d(d+1)}{2}$$ elements just for $$\Sigma$$ since it is symmetric.
	- $$\Sigma$$ must be positive definite in addition to symmetric, so we must guarantee that during encoding! Depending on the strategy used to generate a valid $$\Sigma$$, it may or may not be possible to do backpropagation.
	- All those challenging constraints, in addition to the fact that independent latent variables work well for even high-dimensional problems, make the approach of a multivariate Gaussian unatractive.
{% endraw %}
