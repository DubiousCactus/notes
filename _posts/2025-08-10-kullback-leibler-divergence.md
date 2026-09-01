---
title: "Kullback-Leibler Divergence"
description: "Kullback-Leibler Divergence — notes by Théo Morales"
date: 2025-08-10 12:00:00
categories: [mathematical-foundations, information-theory]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
## Information Theory & Entropy

> 
>Rewrite this because I quoted a lot from Count Bayesie!


Information Theory is a branch of Computer Science aimed to study how information can be quantified in data.
Claude Shannon, the father of Information Theory, introduced the concept based on a measure called [entropy](../shannons-entropy/). This measure allows us to calculate the minimum amount of information required to transmit a message, hence enabling us to compress data.
However, it is just a measure and we still need to find the encoding scheme that leads to this compression. Entropy tells us the theoretical lower bound on the number of bits needed to encode the message, thus we can measure the information content of our data.

When working with complex and high dimensional problems, we often replace observed data or a complex and intractable distribution with a simpler approximative one. 
Being able to quantify **the information content** in the true data distribution, we want to quantify how much information is lost when we substitute our observed distribution for a parameterized approximation. The Kullback-Leibler (KL) divergence can be seen as the average additional bits per datum required to compress a true data distribution into a compressed one. (TODO: Isn't it the opposite???) [The information bottleneck](../the-information-bottleneck/) allows us to extract the information from the 

## Measuring information loss

"The Kullback-Leibler Divergence is just a modification of the formula for entropy. Rather than just having our probability distribution $$p$$, we add in our approximating distribution $$q$$. Then, we look at the difference in the log values for each:"


$$
D_{KL}(p||q) = \sum_{i=1}^{N} p(x_i) \cdot(\log p(x_i) - \log q(x_i))
$$


"Essentially, the KL divergence shows the expectation of the log difference between the probability of data in the original distribution with the approximating distribution."" If we think in $$\log_2$$ we can interpret this as *how many bits of information we expect to lose*.


$$
D_{KL}(p||q) = \mathbb{E} [\log p(x) - \log q(x)]

$$



### Divergence, not distance!

"The most common definition of the KL divergence for discrete distributions is


$$
D_{KL}(p||q) = \sum_{i=1}^{N}\underbrace{p(x_i)}_{\displaystyle A}\cdot \underbrace{\log \frac{p(x_i)}{q(x_i)}}_{\displaystyle B},
$$


since $$\log a - \log b = \log \frac{a}{b}$$."

**Let's break it down.**
There are two main terms in the common definition of the KL divergence: $$\displaystyle A$$ and $$\displaystyle B$$.

- The first is the probability of $$x_i$$ according to the base distribution. It acts as a weight for the divergence measure: events that are more likely to occur have a stronger effect on the divergence of the distribution.
- The second defines the divergence between the two distributions as the logarithm of a fraction of probabilities.  By looking at this fraction, we can observe three behaviours of this log term: 
	1. If $$q(x_i) > p(x_i)$$ the fraction is between $$0$$ and $$1$$ and the logarithm decreases exponentially with respect to the difference between $$q(x_i)$$ and $$p(x_i)$$. A larger difference implies an exponentially lower **negative divergence**.
	2. If $$q(x_i) < p(x_i)$$ the fraction is higher than $$1$$ and the logarithm increases exponentially with respect to the difference between $$q(x_i)$$ and $$p(x_i)$$. A larger difference implies an exponentially higher **positive divergence.**
	3. If $$q(x_i) = p(x_i)$$ the logarithm is $$0$$ and there is **no divergence** whatsoever.

A direct observation from this breakdown is that **the divergence is not a distance metric,** since it comprises a direction and is therefore *asymmetric*. That makes sense, since we are measuring the loss of information in an approximation of the original distribution: if the metric was symmetric, there would be no way of knowing if the approximating distribution is *adding* information or *removing* it!

> 
>Revisit the following. The diagram is very stupid because the entropy of an ensemble corresponds to the average information content in that ensemble!!


It means that **a positive divergence means a loss of information** while a **negative divergence means an information gain**, which is not something you would expect of an approximating distribution.

![entropy vs information](entropy-vs-information.svg)
#### The order matters

> 
>How does the order of the KLD terms influence the divergence? What do we need to optimize an approximate distribution; what order should we use?
{% endraw %}
