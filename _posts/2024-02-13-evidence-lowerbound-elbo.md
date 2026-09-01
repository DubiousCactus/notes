---
title: "Evidence Lowerbound (ELBO)"
description: "Evidence Lowerbound (ELBO) — notes by Théo Morales"
date: 2024-02-13 12:00:00
categories: [deep-learning, variational-inference]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
**Question:**
Does it matter in which direction you use the KL divergence to train a VAE? If so, what is the reason for using DKL(q||p) instead of DKL(p||q), since p is the true distribution. What I mean by that is, since you need to be able to  compute p(z_i) in both cases, how is the second one impossible (the true posterior is not known) and not the first one?

**Response from chatbot:**


In Variational Autoencoders (VAEs), the KL divergence is used to measure the difference between the approximate posterior distribution `q(z|x)` and the prior distribution `p(z)`, where `z` is the latent variable and `x` is the input data. The KL divergence is typically written as `DKL(q(z|x)||p(z))`, which is called "forward KL" divergence. However, using `DKL(p(z)||q(z|x))` (backward KL) is also possible in theory.

The reason `DKL(q(z|x)||p(z))` is more commonly used in VAEs is due to the practical considerations and the structure of the optimization problem. In a VAE, we want to maximize the Evidence Lower BOund (ELBO) of the log-likelihood of the data:

```math
\log p(x) \geq \mathbb{E}_{q(z|x)}[\log p(x|z)] - D_{KL}(q(z|x)||p(z))
```

The first term, the expected reconstruction log-likelihood, encourages the decoder to reconstruct the input data well. The second term, the KL divergence, encourages the approximate posterior `q(z|x)` to be close to the prior `p(z)`, which is usually a simple distribution like a standard normal.

If we were to use `DKL(p(z)||q(z|x))`, the optimization would be challenging for several reasons:

1. **Intractability:** The term `p(z)` appears in the numerator, which means we need to compute the density of the prior at each sampled point `z`. For continuous `z`, this is generally impossible since the true posterior `p(z)` is not known, and we cannot integrate over the entire latent space.

2. **Learning dynamics:** With forward KL, the optimization starts by making `q(z|x)` close to `p(z)`, which simplifies the reconstruction task early in training. In contrast, with backward KL, the optimization would initially push `q(z|x)` away from `p(z)`, which might lead to a more challenging learning process and suboptimal solutions.

3. **Reparameterization trick:** The reparameterization trick, which is crucial for gradient-based optimization in VAEs, is easily applied to samples from `q(z|x)`. It is more difficult to apply the trick when sampling from `p(z)` because we don't have an explicit form for `q(z|x)`.

In summary, while both forward and backward KL divergences are theoretically valid, using `DKL(q(z|x)||p(z))` is more practical and leads to better learning dynamics in VAEs. The true posterior `p(z)` isn't known, which makes computing `p(z)` for any given `z` impossible, whereas we can parameterize and sample from the approximate posterior `q(z|x)`.


**Other chatbot (in relation to codebook learning and compression ((entropy))):**
In the case of $$D_{KL}(q\vert\vertp)$$, the KL divergence measures the expected number of extra bits required to represent a sample from $$q$$ when using a code based on $$p$$ instead of using a code based on $$q$$. This is what we want to minimize, because it means that $$q$$ is becoming a better and better approximation of $$p$$.

On the other hand, $$D_{KL}(p\vert\vertq)$$ measures the expected number of extra bits required to represent a sample from $$p$$ when using a code based on $$q$$ instead of using a code based on $$p$$. This is not what we want to minimize, because it would mean that our approximation $$q$$ is becoming worse and worse.
{% endraw %}
