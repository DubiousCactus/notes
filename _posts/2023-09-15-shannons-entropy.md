---
title: "Shannon's Entropy"
description: "Shannon's Entropy — notes by Théo Morales"
date: 2023-09-15 12:00:00
categories: [mathematical-foundations, information-theory]
math: true
pin: false
---

{% raw %}
## The right way to measure information content

Claude Shannon claimed that the right way to define *the information content of an outcome* $$x=a_i$$ for an ensemble $$X$$ is


$$
\begin{aligned}
h(x=a_i) &= \log_2 \frac{1}{P(x=a_i)}\\
	&= -\log_2 P(x=a_i).
\end{aligned}
$$



An ensemble is defined as $$X = \{x, A_x, P_x\}$$ where:
- $$x$$ is a random variable
- $$A_x = \{a_1, a_2, a_3, \ldots, a_i\}$$ is the set of possible outcomes
- $$P_x = \{p_1, p_2, p_3, \ldots, p_i\}$$ is the set of probabilities
such that $$p(x=a_i) = p_i$$ and $$\sum_i p_i=1, p_i \ge 0$$.

> The information content is additive
> If we consider a joint distribution of two indepedent variables $$P(X,Y)$$, the information content is **additive**.

For an esenmble $$XY$$ such that an event is a pair of independent random variables $$x, y$$ with probability $$P(x,y) = P(x)P(y)$$, the entropy of one outcome is defined as:


$$
\begin{aligned}
h(x=a,y=b) &= \log_2 \frac{1}{P(x=a,y=b)}\\
		&= \log_2 \frac{1}{P(x=a)} + \log_2 \frac{1}{P(y=b)}
\end{aligned}
$$


This means that the information content of  the joint outcome of two independent events is the sum of the information content of each independent event. For example, the toss of a coin and the wheather outside are independent: the information content of both outcomes is the sum of each.

## The information content of an ensemble is its Entropy

In *Information Theory*, the notion of *entropy* is used all over the place. This quantity defines **the average information content** (or element of surprise) in the transmission of information. It is defined for a probability distribution as


$$
H(X) = \sum_{x_i} P(X=x_i) \log_2 \frac{1}{P(X=x_i)}
$$



where $$P(X=x_i)$$ is the probability of event $$x_i$$ to occur, given the PDF/PMF $$p(X)$$ (see [Probabilities 101](/posts/probabilities-101/) for the PDF and PMF).

A distribution with relatively spread out probability mass (information) has an exponentially higher entropy than one with all its mass concentrated around a single point.


### How is it the information content?

If a system $$S$$ has $$N$$ possible states, then its state $$s$$ can be represented in $$\log_2 N$$ bits.  In fact, if all its states are uniformely distributed, we can compute the system's entropy using $$\log_2$$ as:


$$
\begin{aligned}
	H(S) &= - \sum_{i=1}^{N} p(s_i)\log_2 p(s_i) \\
	&= - \sum_{i=1}^{N} \frac{1}{N}\log_2 \frac{1}{N} \\
	& = -\frac{1}{N}\log_2(\prod_{i=1}^N\frac{1}{N})\\
	& = -\frac{1}{N}\log_2(N^{-N})\\
	& = -\frac{1}{N} (-N) \log_2 N\\
	& = \log_2 N\\
\end{aligned}
$$


Therefore, we can use $$\log_2$$ to measure the entropy of a distribution of $$N$$ possible states. Then, we can interpret the result as the minimum number of bits needed to encode a state sampled from that distribution. Using $$\log_2$$ is well suited to computer science and information encoding, but it generalizes to any base. Hence, **Shannon's entropy is a measure of information content**.

When considering binary files, $$h(x)$$ is **the compressed file length to which we should aspire**[^1].

[^1]: Davic McKay, [Course on Information Theory, Pattern Recognition, and Neural Networks](http://videolectures.net/mackay_course_02/)

### Why the logarithm?

The information content is the same thing as the measure of uncertainty associated with an outcome. Due to its properties, such that the logarithm of a product is the sum of the logarithms, the logarithm is a perfect fit for a measure of uncertainty. Primarily, it is common that adding parameters to a system makes its number of possible states grow exponentially. Inversely, the number of parameters tend to vary linearly with the logarithm of the number of possible states. This gives a more intuitive measure which works really well with the properties of the logarithm and the information content being additive.

![entropy plot](/assets/img/blog/entropy-plot.svg)
In effect, more certainty - or probability - over an event exponentially increases its logarithm (for all $$0 \le p_i \le 1$$),  hence we can imagine two general cases:
1. A distribution with a spike for one event and *very low* probabilities for others will have a *very low* entropy: this is due to the negative summation. There is **almost no surprise** to the outcome!
2. A more uniform distribution with more or less equal probabilities will have a *very high* entropy: there is **a high surprise** as to the outcome!


The entropy is an essential measure for Information Theory, the field of Computer Science that studies how information can be compressed and [extracted](/posts/the-information-bottleneck/). In Deep Learning, it is the foundation of [The Variational Autoencoder](/posts/the-variational-autoencoder/) and is at the core of the [Kullback-Leibler Divergence](/posts/kullback-leibler-divergence/).
{% endraw %}
