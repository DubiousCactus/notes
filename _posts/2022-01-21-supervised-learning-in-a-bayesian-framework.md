---
title: "Supervised Learning in a Bayesian Framework"
description: "Supervised Learning in a Bayesian Framework — notes by Théo Morales"
date: 2022-01-21 12:00:00
categories: [deep-learning]
tags: [deep-learning]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
The supervised learning problem can be seen in a Bayesian perspective as maximising the log-likelihood of the model parameters given the observed data:


$$
\arg \max_{\phi} \log p(\phi | \mathcal{D})
$$



This can be redefined as maximising the data given the model parameters and maximising the marginal probability of the parameters:



$$
\arg \max_{\phi} \log p(\mathcal{D} | \phi) + \log p(\phi)
= \arg \max_{\phi} \sum_i \log p(y_i | x_i, \phi) + \log p(\phi)
$$


where the second term, the log of the marginal probability of the parameters, can be seen as a regulariser and understood as putting a Gaussian prior with a fixed variance on the weights.

### What is wrong with this?

If the data set is very small, even with the presence of a regulariser, the model may overfit due to its overparametrisation.
{% endraw %}
