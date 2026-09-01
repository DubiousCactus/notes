---
title: "Gaussian Processes from A to Z"
description: "Gaussian Processes from A to Z — notes by Théo Morales"
date: 2022-10-24 12:00:00
categories: [gaussian-neural-processes]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
> Code
>Have a look at my mini self-contained Gaussian Process optimization library on [GitHub](https://github.com/DubiousCactus/minigauss)! It is readable, pythonic, and comes with clear examples!

> Purpose
> This blog post focuses on introducing the Gaussian Process from A to Z while covering aspects of it that most online resources leave in the shade, such as: the difference between training data and observations, fitting a random process as opposed to a function, and what is going on with numerical instability. This article is a unification of all the aspects of GPs that were found from browsing wikipedia, reading papers, looking at code and web articles.

## Motivation
Say you are building an autonomous submarine which you want to send on a mission in the coastal area. Your budget is limited, and since you're a competent engineer, you would rather implement an efficient solution than buy expensive components and be lazy. Your goal is to accomplish the mission with a limited onboard power source, and you are faced with the difficulty that waves are pushing the submarine backwards at random intervals. The robot is effectively wasting energy on the propellers, which cannot outrun the waves, and you realize that it is best to turn down the power on the propellers during each outburst. You experiment with an IMU and write rapid acceleration detection routines to identify when waves start and end. However, this requires polling sensors frequently and costs computing power. When you realize that the detection delay and power are not worth the effort, you turn to prediction instead. But how can the random nature of waves be predicted?

One can see the phenomenon of waves in the ocean as a stochastic process due to its random nature. It is convenient because we can now model this process with a Gaussian Process (GP). That gives us two advantages: we can predict the magnitude of a wave at time *t* and get a measure of uncertainty with it. The only things we need to get accurate predictions are *observations*, corresponding to IMU measurements, for instance. How many, you ask? That is up to you: more observations equals more accuracy. Thanks to the power of the Bayesian framework, a Gaussian Process allows us to incorporate evidence into prior knowledge to better model a stochastic process.

The idea is to place a prior over the space of functions $$y(x)$$ without parameterizing them. In fact, the simplest type of function prior is a Gaussian Process. A Gaussian Process can model a Stochastic Process as a multivariate Gaussian distribution. By conditioning a GP on some observations of one realization $$y(x)$$ of the process, we can sample functions $$\mathbf{f}$$ from the posterior process:

![Gaussian Process](gaussian-process.svg)
One main advantage of the GP is that **it is a non-parametric model**: it does not have any parameters representing anything physical about the data. A GP only has *hyperparameters* which parameterize the priors of its Gaussian distribution. But why the Gaussian distribution? We'll dive into that in the next section.

## The Gaussian distribution

In statistics, the Gaussian distribution is everywhere. It turns out that many things in the real world can be modelled by it[^1], and the Central Limit Theorem[^2] shows how omnipresent it is.

Let us begin with the simplest case: the *univariate* Gaussian distribution


$$
x \sim \mathcal{N}(\mu, \sigma^2)
$$


parameterized by a mean $$\mu$$ and a standard deviation $$\sigma$$. 
To model stochastic processes, we'll need to go one step further and look at *multivariate* distributions. As we'll see in more detail, a Gaussian Process is an *infinite-dimensional multivariate* Gaussian distribution, but let us start with the *finite-dimensional* one. That is especially helpful because many stochastic processes have more than o morene random variable. We define this distribution as



$$
X =   \mathcal{N}(\mathbf{\mu}, \mathbf{\Sigma})
$$



with a mean *vector* $$\mu$$ and a covariance *matrix* $$\Sigma$$. The mean transitioned from scalar to vector where each component represents the mean of the corresponding random variable. Likewise, the variance is now a **covariance** matrix representing the relationship between all the random variables, and between themselves (the variance) in the diagonal.
But what does this covariance matrix tell us about the distribution?

[^1]: [9 Real Life Examples Of Normal Distribution](https://studiousguy.com/real-life-examples-normal-distribution/)
[^2]: [Central Limit Theorem](https://en.wikipedia.org/wiki/Central_limit_theorem)
	
### The covariance matrix

In the univariate Gaussian distribution, the variance scalar, or more intuitively its square root, the standard deviation, quantifies the spread of the data around its mean.
In the case of the multivariate Gaussian, we now not only have to quantify the variance of each variable but also their movement with respect to each other. It is encoded in an $$N\times N$$ matrix $$\Sigma$$ for $$N$$ random variables and their mean $$\mu_i$$, where the diagonal represents the variance of each variable (the covariance with themselves):



$$
\Sigma = Cov(X_i, X_i) =\mathop{{}\mathbb{E}}[(X_i-\mu_i)(X_j-\mu_j)^T]
$$



Thus, this matrix describes the relationship between the variables or how they move together. When looking at a pair of random variables $$(X_1,X_2)$$, their correlation is positive if $$X_1$$ increases with $$X_2$$. It is negative if $$X_2$$ decreases as $$X_1$$ increases, and it is neutral or $$0$$ if the movement of $$X_1$$ does not influence that of $$X_2$$ (and vice versa).

![3 correlations](3-correlations.svg)
The covariance matrix has three main properties:
- It is a square matrix with $$N$$ rows and columns for $$N$$ random variables.
- It is symmetric by definition: the function $$Cov(X_i, X_j)$$ populates each cell of the matrix, where $$Cov(X_i, X_j)=Cov(X_j, X_i)$$. Its transpose is thus equal to itself, and its diagonal entries are the variance of each random variable.
- It is positive semi-definite, meaning that for every real-valued vector $$\mathbf{x}$$, $$\mathbf{x}^T \Sigma \mathbf{x} \geq 0$$, $$\mathbf{x} \neq 0$$.[^8]

To wholly represent these three properties, we may define the covariance matrix as:



$$
\Sigma = 
\underbrace{
\begin{bmatrix}
	Var(X_1, X_1) & \cdots & Cov(X_1, X_n)\\
	\vdots & \ddots & \vdots \\
	Cov(X_n, X_1) & \cdots & Var(X_n, X_n)
\end{bmatrix}}_{\displaystyle N}
\left.\vphantom{\begin{bmatrix}
	Var(X_1, X_1) & \cdots & Cov(X_1, X_n)\\
	\vdots & \ddots & \vdots \\
	Cov(X_n, X_1) & \cdots & Var(X_n, X_n)
\end{bmatrix}}\right\}N
$$


[^8]: [Understanding Positive Definite Matrices](https://gregorygundersen.com/blog/2022/02/27/positive-definite/#quadratic-programming)

The following figure depicts a $$2$$-dimensional Gaussian distribution from which one can sample a random vector $$X$$ composed of two random variables $$X_1$$ and $$X_2$$.

![Multivariate Gausssian](multivariate-gausssian.svg)

### Stochastic processes as multivariate Gaussians
We know that a stochastic process amounts to a *collection of random variables defined on the same probability space*. That is what multivariate distributions are; how convenient! 
Due to its omnipresence in the real world, we have reasons to choose the Gaussian distribution as a default model for a broad family of stochastic processes. But what's more, is that it is **convenient**.

The Gaussian distribution has one main property that interests us here: it remains closed under *marginalization* and *conditioning*. For these terms to make sense, we must consider the *joint probability distribution* of several random variables, written as $$p(x,y)$$  for random variables $$x$$ and $$y$$. Let's now have a look at *marginalization* and *conditioning*.

#### Marginalization
Marginalizing a joint probability distribution translates to *putting one variable in the margin*. We use it to calculate the probability of the other random variables independently of the one left in the margin.
For instance, the marginal probability of $$x$$, when the possible values of $$y$$ are not considered, is written as $$p_X(x)$$. It is the sum of the joint probabilities weighted by the probabilities of $$y$$:
$$p_X(x_i) = \Sigma_j p(x_i, y_j)$$. 

For the Gaussian distribution, marginalizing out one random variable corresponds to simply dropping it out of the equation. For example, let's consider the joint Gaussian distribution of random vectors $$X=[X_1, X_2, X_3]$$ defined as:


$$
X \sim \mathcal{N}(
\begin{bmatrix}
	\mathbf{\mu_1}\\ \mathbf{\mu_2} \\\mathbf{\mu_3}
\end{bmatrix},
\begin{bmatrix}
\Sigma_{11} & \Sigma_{12} & \Sigma_{13} \\
\Sigma_{21} & \Sigma_{22} & \Sigma_{23} \\
\Sigma_{31} & \Sigma_{32} & \Sigma_{33}
\end{bmatrix}).
$$


If we then marginalize out $$X_2$$ such that we're interested in the joint distribution of $$X^\prime=[X_1,X_3]$$, we obtain:


$$
X^\prime \sim \mathcal{N}(
\begin{bmatrix}
	\mathbf{\mu_1}\\ \mathbf{\mu_3}
\end{bmatrix},
\begin{bmatrix}
	\Sigma_{11} &  \Sigma_{13} \\
	\Sigma_{31} &  \Sigma_{33}
\end{bmatrix}).
$$



The fact that we obtain another Gaussian distribution is what we mean by *closed under marginalization*, but how is it interesting for stochastic processes? We are interested in *conditioning* our joint distribution on a set of observations. For this, we first need to calculate the marginal of the conditioning variables.

#### Conditioning
A conditional probability is the probability of one random vector (or variable) *given* another's state. From the previous example, we define the conditional probability of $$X^\prime=[X_2, X_3]$$ given $$X_1$$ as 


$$
p_{X^\prime|X_1}=
\frac{p(X_1=\mathbf{x_1},
X_2=\mathbf{x_2},
X_3=\mathbf{x_y})}{p_{X_1}(\mathbf{x_1})}
$$



where $$p_{X_1}(\mathbf{x_1})$$ is the marginal probability of $$X_1=\mathbf{x_1}$$. Again, *the conditional distribution of a Gaussian case is yet another Gaussian probability distribution*.
Let us start with a general example where we have a joint Gaussian distribution defined as


$$
\begin{bmatrix}
\mathbf{f} \\ \mathbf{f_*}
\end{bmatrix} \sim \mathcal{N}(
	\begin{bmatrix}
		\mathbf{\mu} \\ \mathbf{\mu_*}
	\end{bmatrix},
	\begin{bmatrix}
		\Sigma & \Sigma_* \\
		\Sigma_*^T & \Sigma_{**}
	\end{bmatrix}
)
$$



with vectors of random variables $$\mathbf{f}, \mathbf{f_*}$$ and $$\mathbf{\mu}, \mathbf{\mu_*}$$ their corresponding mean vectors, $$\Sigma$$ the square matrix of covariances for $$\mathbf{f}$$, $$\Sigma_* = Cov(\mathbf{f}, \mathbf{f_*})$$, $$\Sigma_*^T = Cov(\mathbf{f_*}, \mathbf{f})$$ and $$\Sigma_{**}$$ the square matrix of covariances for $$\mathbf{f_*}$$.
Then, the definition of $$\mathbf{f_*}$$ conditional on $$\mathbf{f}=\mathbf{a}$$ is $$(\mathbf{f_*} \vert \mathbf{f}=\mathbf{a}) \sim \mathcal{N}(\mathbf{\bar{\mu}}, \bar{\Sigma})$$ with


$$
\begin{align}
\mathbf{\bar{\mu}} &= \mathbf{\mu_*} + \Sigma_*^T \Sigma^{-1}(\mathbf{a}-\mu)\\
\bar{\Sigma} &= \Sigma_{**}-\Sigma_*^T \Sigma^{-1}\Sigma_*
\end{align}.
$$


We can interpret the matrix $$\Sigma_*^T$$ as the covariances between each variable and the conditional: it is a composite matrix. 
As the general definition may be difficult to assimilate, we may now apply it to our example to understand it more intuitively. Recall that we have a joint Gaussian for $$X=[X_1, X_2, X_3]$$ defined as:


$$
X \sim \mathcal{N}(
\begin{bmatrix}
	\mathbf{\mu_1} \\
	\mathbf{\mu_2}\\
	\mathbf{\mu_3}
\end{bmatrix},
\begin{bmatrix}
	\Sigma_{11} & \Sigma_{12} & \Sigma_{13} \\
	\Sigma_{21} & \Sigma_{22} & \Sigma_{23} \\
	\Sigma_{31} & \Sigma_{32} & \Sigma_{33}
\end{bmatrix}).
$$


The conditional distribution for $$(X^\prime\vertX_1=\mathbf{a})$$ is thus defined as


$$
X^\prime \sim \mathcal{N}(
\begin{bmatrix}
	\mathbf{\mu_2} \\ \mathbf{\mu_3}
\end{bmatrix} +
\begin{bmatrix}
	\Sigma_{21} \\ \Sigma_{31}
\end{bmatrix}
\Sigma_{11}^{-1}(\mathbf{\mu_1}-\mathbf{a}),
\begin{bmatrix}
	\Sigma_{22} & \Sigma_{23} \\
	\Sigma_{32} & \Sigma_{33}
\end{bmatrix} -
\begin{bmatrix}
	\Sigma_{21} \\ \Sigma_{31}
\end{bmatrix}
	\Sigma_{11}^{-1}
\begin{bmatrix}
	\Sigma_{12} & \Sigma_{13}
\end{bmatrix}
).
$$


See? Another Gaussian!

---
These guarantees make everything easy to optimize. We will see in the next section that optimizing Gaussian Processes is straightforward and relies on these notions and properties.

## The Gaussian Process
> Distributions over functions as multivariate distributions
>If the relationship between *distribution over functions* and *multivariate distributions* is unclear to you, take a minute to read my article "What is a stochastic process?".

We are now able to model a stochastic process with a multivariate distribution. We also know how to construct and manipulate *finite-dimensional* multivariate Gaussian distributions, which is convenient and helpful for many real-world processes. But we're still missing something to build a Gaussian Process: *infinite dimensions*. 

> 
> A Gaussian Process is a collection of random variables, any finite number of which have (consistent) joint Gaussian distributions.[^3]

A Gaussian Process is nothing else than an infinite-dimensional multivariate Gaussian distribution representing a stochastic process. Due to its probabilistic nature, it acts as a prior over the space of functions. It is infinite-dimensional since *functions* now define the mean vector $$\mathbf{\mu}$$ along with the covariance matrix $$\Sigma$$, such that



$$
\mathbf{f} \sim \mathcal{N}(m(x), k(x,x^\prime))
$$


where $$\mathbf{f}$$ is the function sampled from the GP, $$m(x)$$ is the *mean function*, and $$k(x,x^\prime)$$ is the *covariance function* (or *kernel*). The former represents the mean function sample, while the latter expresses the distance between two inputs in function space. With continuous functions as the parameters of the Gaussian distribution, we can cover the entire function space!

> 
>While we theoretically define a distribution over functions, we are limited to finite-dimensional sampling in practice. Therefore, we sample $$\mathbf{f}$$ as a **random vector** from a multivariate Gaussian. The mean and covariance **functions** generate the corresponding **vector** and **matrix** parameters.

Since *the Gaussian Process is essentially a prior over functions*, the mean and covariance functions that parameterize it act as prior knowledge over the process. While the mean function is enough for accurately modelling the underlying function, it is much harder to guess or approximate than the covariance function. Indeed, the latter must obey the properties of the covariance matrix (*symmetry* and *positive semi-definiteness*). Thus, in practice, we use kernel functions that are known to have these properties, such as:
- Squared exponential: $$k(x, x^\prime)=\sigma^2 \exp(-\frac{\lVert x - x^\prime \rVert^2}{2 l^2})$$[^8]
- Periodic: $$k(x, x^\prime)=\sigma^2 \exp(- \frac{2}{l^2} \sin^2(\frac{x-x^{\prime}}{2}))$$[^8]
- Matérn: $$k(x, x^\prime) = \sigma^2 \exp(\frac{2^{l-\nu}}{\Gamma(\nu)})(\sqrt{2 \nu} \frac{x-x^\prime}{\rho})^{\nu}K_{\nu}(\sqrt{2 \nu} \frac{x-x^{\prime}}{\rho})$$[^8]

All kernel functions are parameterized by a process variance $$\sigma^2$$ and a lengthscale $$l$$ which determines how close $$x$$ and $$x^\prime$$ must be to influence each other, as seen in the following figure. There is still a lot to cover about covariance functions. For that, I will redirect you to [this excellent blog post](https://peterroelants.github.io/posts/gaussian-process-kernels/) by [Peter Roelants](https://twitter.com/PeterRoelants).

![exp_kernels](exp-kernels.svg)

We now know how to define a GP and specify priors to obtain an accurate distribution over functions. But this seems pointless if we need to know the overall shape of the function that we want to learn!
**The idea is actually to specify vague priors with parameters**, which amounts to *adding hyperparameters to the Gaussian Process.* **By over-parameterizing the prior functions, we can wrap a large family of processes** such that optimizing the GP leads to finding hyperparameters that fit the random process accurately. We'll look at this in the following section.


[^3]: [Rasmussen et al., 2004: Gaussian Processes in Machine Learning](https://www.researchgate.net/publication/41781206_Gaussian_Processes_in_Machine_Learning)
[^8]: [Covariance functions](https://en.wikipedia.org/wiki/Gaussian_process#Covariance_functions)

### Optimizing a Gaussian Process

So far, we've seen how to define a Gaussian Process and how the mean and covariance functions act as priors. By over-parameterizing those, we can optimize the GP to find the right parameters of these functions that suit the training data. It effectively relieves the task of engineering the right prior for an (unknown) process from the expert. For instance, the function $$y(x)=\frac{1}{4} x^2 - 3 x + \frac{3}{4}$$ can be fitted with a GP with mean function $$m(x) = a x^3 + b x^2 + c x + d$$ and a squared exponential kernel. We can fit this mean function to a $$3^{\text{rd}}$$-degree polynomial or a lower one like $$y(x)$$!

> 
We can use a GP to model any real-valued function, not only stochastic processes! The Bayesian framework is helpful if we have a vague idea of what the function looks like (i.e. a polynomial) but we aren't able to parameterize it (i.e. a $$2^{\text{nd}}$$-degree polynomial).

Gaussian processes are optimized by *maximizing their log marginal likelihood*, defined as[^3]


$$
L = \log p(\mathbf{y}|\mathbf{x}, \theta) =
-\frac{1}{2} \begin{vmatrix}\Sigma\end{vmatrix}
- \frac{1}{2} (\mathbf{y} - \mathbf{\mu})^T \Sigma^{-1}(\mathbf{y}-\mathbf{\mu})
- \frac{n}{2} \log(2\pi)
$$


with the covariance matrix $$\Sigma$$, the training targets $$\mathbf{y}$$, the training data mean vector $$\mu$$ and $$n$$ training points. This loss function is composed of three terms:
1. The quadratic term $$- \frac{1}{2} (\mathbf{y} - \mathbf{\mu})^T \Sigma^{-1}(\mathbf{y}-\mathbf{\mu})$$ is the data-fit measure which encourages learning hyperparameters that fit the training data.
2. The term $$-\frac{1}{2} \begin{vmatrix}\Sigma\end{vmatrix}$$ is a complexity penalty: the determinant of the covariance matrix is equal to the product of its eigenvalues, the volume spanned by $$\Sigma$$. By reducing it, we encourage the sampled points to be closer to each other, thus reducing complexity.
3. The log normalization term $$- \frac{n}{2} \log(2\pi)$$ is data-independent.

Using the log of the marginal likelihood, we can conveniently compute its partial derivatives! We can maximize it via gradient-based methods and fine-tune the priors in the light of training data. *It is a form of Maximum Likelihood Estimation* that is non-convex and does not allow for solving analytically.[^6][^7] The gradients of $$L$$ w.r.t. the *mean* and *covariance* functions can be derived as follows


$$
\begin{align}
	\frac{\partial L}{\partial m} &= (\mathbf{y} -\mathbf{\mu})^T \Sigma^{-1} \\
	\frac{\partial L}{\partial k} &= \frac{1}{2} \text{trace}(\Sigma^{-1} \frac{\partial \Sigma}{\partial \theta_k}) + \frac{1}{2}(\mathbf{y}-\mathbf{\mu})^T \frac{\partial \Sigma}{\partial \theta_k} \Sigma^{-1}\frac{\partial \Sigma}{\partial \theta_k}(\mathbf{y}-\mathbf{\mu}).
\end{align}
$$


> 
>The log marginal likelihood is the probability of the data given the hyperparameters: a *conditional distribution* where **we assume a Gaussian distribution for the data**. By marginalizing over the hyperparameters of the GP in weight-space view, we obtain the marginal likelihood.[^3]

**The prior specification can therefore be automated** through model selection from a set of priors, or using composable functions, **without ever having to use expert knowledge**. A research paper demonstrated how a genetic algorithm could effectively construct kernel functions from primitives and match hand-tuned kernels, whereas another used a [meta-learning](../a-gentle-introduction-to-meta-learning/) approach to learn the priors.[^4][^5]

[^4]: [Kronberger et al., 2013: Evolution of Covariance Functions for Gaussian Process Regression using Genetic Programming](https://arxiv.org/abs/1305.3794)
[^5]: [Harrison et al., 2018: Meta-Learning Priors for Efficient Online Bayesian Regression](https://arxiv.org/abs/1807.08912)
[^6]: [Maximum Likelihood Estimation](https://en.wikipedia.org/wiki/Maximum_likelihood_estimation)
[^7]: [Medium article on MLE](https://towardsdatascience.com/probability-concepts-explained-maximum-likelihood-estimation-c7b4342fdbb1)

#### Regarding the training data
As we want to optimize the prior of the GP to fit our target process, we need training data. It must come from the random process to model, as past measurements, for instance. Since the goal is to fine-tune the prior, the training data should come from the same process. In other words, GPs are not suited for multi-task learning.

It is important to have variety in the training data to efficiently optimize a GP, and avoid getting stuck in local minima. The general strategy is to collect as many samples as possible and shuffle them at each training iteration. If we're trying to fit a GP from data originating from a *known GP* (as an exercise), we would sample many function realizations from the known process and sample a random subset of observations (or measurements).

### From prior to posterior
At this point, we have learnt three things:
1. How to mathematically define a *prior over functions*, a.k.a. Gaussian Process, in terms of a multivariate Gaussian distribution parameterized by functions. 
2. How to formulate expert knowledge of the process through parametric functions.
3. How to remove expert knowledge and automatically fit parametric priors to the training data using gradient-based optimization.

One question remains: *what do we do with this prior over functions*?

Having a prior distribution of functions has no practical use: it only informs us about the plausible shapes of the underlying function. 
Let's take our example of the movement of the ocean caused by waves: knowing plausible realizations is not useful on its own. What we need is the state of the waves *right now*. 
However, given a few observations of the function (i.e. the ocean movement), we can *condition the prior GP* to refine the distribution. If you recall from the section on conditioning, this results in another Gaussian distribution: the *posterior GP*. It is a distribution over **functions that fit the observations**.

> What's the difference between training data and observations?
>During training, we fit the *prior GP* on data points that originate from the same stochastic process, **but not necessarily the same realization**. This helps Maximum Likelihood Estimation to learn hyperparameters that model all realizations from the original process. On the other hand, **observations of one process realization** are used to condition the *prior GP* and obtain the *posterior GP* that models **the statistics of that specific function sample**.
>However, when fitting a GP to a single function $$y(x)$$, the training points are often the observations themselves.

As a reminder, a joint multivariate Gaussian distribution that is defined as 
$$\begin{bmatrix}
	\mathbf{f} \\
	\mathbf{f_*}
\end{bmatrix}
\sim \mathcal{N}(
\begin{bmatrix}
	\mathbf{\mu} \\
	\mathbf{\mu_*}
\end{bmatrix}, 
\begin{bmatrix}
	\Sigma & \Sigma_* \\
	\Sigma_*^T & \Sigma_{**}
\end{bmatrix})$$
will have the following conditional Gaussian distribution
$$$\mathbf{f_*}\vert\mathbf{f} \sim \mathcal{N}(\mu_* + \Sigma_*^T \Sigma^{-1}(\mathbf{f-\mu}), \Sigma_{**} - \Sigma_*^T \Sigma^{-1} \Sigma_*),$$$
where $$\mathbf{f}$$ is the vector of observations, $$\mathbf{f_*}$$ the vector of target points, $$\mathbf{u}$$ is the vector of observation means, $$\mathbf{u_*}$$ the vector of target means, $$\Sigma$$ the matrix of observation covariances, $$\Sigma_*$$ the matrix of observation-target covariances, and $$\Sigma_{**}$$ the matrix of target covariances.
Note that we only have the indexes of the targets (i.e. time steps $$t_i$$), of which we can compute the covariance matrix and mean vector thanks to our fitted mean and kernel functions. However, the observations $$\mathbf{f}$$ consist of *measured outcomes*  of the process (i.e. pairs $$t_i, y_i$$).

An important point to raise is that the posterior covariance is the covariance of the targets **minus** a positive term which is a function of the observations. Thus, the posterior covariance will always be smaller than the prior covariance: the observations effectively *reduce the uncertainty*.

![observations](observations.svg)

Notice that computing the posterior distribution involves inverting the covariance matrix, which often leads to numerical instabilities with floating point numbers.

#### Numerical stability and the real world
*“It seems that no matter how I code the posterior covariance matrix computation, I get numerical instabilities that make the matrix either non-symmetric or non positive-semidefinite.”*

We have seen earlier that all proper kernel functions are guaranteed to yield a *true* covariance matrix that is *positive-semidefinite* and *symmetric*. So how is it possible that the posterior covariance matrix does not have both properties?

##### How the problem arises and why you should not bother

If we define the posterior covariance matrix as a function, we can easily spot the source of numerical instabilities on the right-hand side involving a matrix inverse:


$$
k_D(x,x^\prime)= k(x,x^\prime)-\Sigma(X,x)^T \Sigma^{-1} \Sigma(X, x^\prime).
$$


Okay, that explains the possible non-positive-definiteness of the posterior covariance matrix $$\bar{\Sigma}$$. We can fix it by adding a small quantity to its diagonal. Note that [more elaborate methods](https://quant.stackexchange.com/questions/2074/what-is-the-best-way-to-fix-a-covariance-matrix-that-is-not-positive-semi-defi) are unnecessary since the covariances are not noisy or wrong; the floating point operations are the only source of error.
Now, **why would the posterior matrix not be symmetric**? Let us have a look at a nested-loop-based implementation:
```python
"""
X_tgts: vector of target inputs.
X_obs: vector of observation inputs.
K: covariance matrix of observations, precomputed.
K_inv: inverse of K, precomputed.
""" 
K_test = np.zeros((X_tgts.shape[0], X_tgts.shape[0]))
for i in X_tgts.shape[0]:
	for j in X_tgts.shape[0]:
		# Deterministic and symmetric:
		K_test[i, j] = kernel(X_tgts[i], X_tgts[j])
		K_test[i, j] -= (
			kernel(X_obs, X_tgts[i]).T 
			@ K_inv 
			@ kernel(X_obs, X_tgts[j])
		)
```

While line $$11$$ is symmetric and deterministic, lines $$12-16$$ are less straightforward. `K_inv`, while being a source of numerical error, does not appears to impact symmetry since it is precomputed. However, the problem becomes clear if we rewrite lines $$12-16$$ as


$$
\begin{align}
\bar{\Sigma}[i,j] &= a^T \Sigma^{-1} b\\
\bar{\Sigma}[j,i] &= b^T \Sigma^{-1} a\\
\end{align}
$$


Since $$\Sigma$$ is square, symmetric and positive-semidefinite, it is invertible. Thus, **its inverse $$\Sigma^{-1}$$ is square and symmetric** as well. A property of any symmetric matrix $$A$$ is that $$x^TAy = y^TAx$$ (see my [Proof of matrix-vector multiplication commutativeness for a symmetric matrix](../proof-of-matrix-vector-multiplication-commutativeness-for-a-symmetric-matrix/)).
Thus, $$a^T \Sigma^{-1}b$$ **should equal** $$b^T \Sigma^{-1}a$$, but because the inversion of $$\Sigma$$ is not entirely accurate, *$$\Sigma^{-1}$$ is not truly symmetric: the relationship does not hold.* We end up with a matrix `K_test` which is not symmetric either.

Ultimately, it is worth knowing that these issues have non-significant impacts on the samples drawn from the posterior distribution parameterized by such a covariance matrix. In fact, with `np.random.multivariate_normal(mu, K_test)`, NumPy will throw warnings that can be disabled. It may still be worth fixing positive semi-definiteness to avoid unwanted behaviour.

### Dealing with noise
So far, we have been dealing with with noise-free observations to fit and condition our GP.  Unlike most parametric models, the Gaussian Process can model noise-free data *exactly*. In the real world, however, measurements are often noisy or inaccurate. **One of the strengths of the Gaussian Process is its ability to deal with noise.** In fact, under the assumption of i.i.d. Gaussian noise, the GP can *model its variance*.
This is equivalent to modelling the observations as the sum of a "clean" Gaussian Process $$f(x) \sim \mathcal{GP}(m(x), k(x, x^\prime))$$ and a Normal distribution for the noise. We can redefine the prior GP as


$$
y(x) \sim \mathcal{GP}(m(x),k(x,x^\prime)+\sigma_n^2\delta_{ii^\prime})
$$


with noise standard deviation $$\sigma_n$$ and Kronecker's delta $$\delta_{ii^\prime}$$ which equals $$1$$ when $$i=i^\prime$$ and $$0$$ otherwise. In simpler terms, we can rewrite the prior covariance matrix as $$\Sigma = \Sigma + \sigma_n^2 I$$. In effect, this adds the hyperparameter $$\sigma_n$$ to the GP. It is learned from the training data without changes to the optimization procedure.
> 
>We only add the noise variance to the covariance matrix of the **observations**. When sampling from the posterior, we do not add noise to the covariance of the targets or the posterior covariance matrix.

We now have all the tools we need to fit a GP from training data, be it of a single function, or several realizations of a stochastic process, with or without noise. Nevertheless, this is not *the* golden solution for all regression problems. As we'll discuss in the next section, GPs have drawbacks that may render them impractical in some classes of problems.

## Limitations and solutions
Gaussian Processes remain an appealing method to tackle regression problems with their provided measure of uncertainty, mathematical guarantees, differentiable loss and their ability to model the noise in the data. However, *they do not come free of any drawbacks and are impractical for some problems*.

The primary disadvantage against other machine learning methods is the need to specify a kernel (and mean) function. It requires knowledge of the process or signal to model, which may not be available or impossible to assess. Some methods in the literature address this issue, as mentioned above, but it still imposes boundaries over the priors that can be encoded.[^4][^5]

Another drawback of this method is its computational complexity. It scales cubically in terms of dataset size or dimensionality, which goes against modern problems. Indeed, we are facing high-dimensional and data-hungry pattern recognition problems (i.e. face recognition, autonomous driving, sentiment analysis, language modelling, etc.), and we need methods that scale. Although some works have attempted to address these issues, paradigms that shift towards deep learning seem to take the upper hand.[^9] Furthermore, GPs cannot model a broad range of stochastic processes like natural images.[^9]

All in all, deep learning is taking over pattern recognition and is surpassing more engineered methods for high-dimensional problems. However, there has been a surge of interest in [The Neural Process Family](../the-neural-process-family/), which mary the best of both worlds from Gaussian Processes and Deep Learning. Understanding this mathematically sound method is a valued asset to whoever wishes to dive into this fresh wave of regression methods.

[^9]: [Garnelo et al., 2018: Conditional Neural Processes](https://arxiv.org/abs/1807.01613)


---
> More resources
> - [Excellent tutorial by Peter Roelants](https://peterroelants.github.io/posts/gaussian-process-tutorial/)
> - [Amazing visual introduction to GPs by Juan Orduz](https://juanitorduz.github.io/gaussian_process_reg/)
> - [Masterclass interactive article on GPs by Görtler et al. on Distill](https://distill.pub/2019/visual-exploration-gaussian-processes/)
{% endraw %}
