---
title: "Backpropagation basics"
description: "Backpropagation basics — notes by Théo Morales"
date: 2022-10-18 12:00:00
categories: [deep-learning, automatic-differentiation]
tags: [deep-learning, automatic-differentiation]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
## Overview

The engine of Deep Learning is backpropagation, the algorithm that allows to perform gradient descent. In itself, backpropagation is simply the application of the chain rule, from the output layer all the way down to the input layer of a neural network.

Let us take the example of a three-layer neural network with an input layer of $$n$$ units, one hidden layer of $$l$$ units, and an output layer of 2 units:

*missing embed: Automatic Differentiation_2022-02-14 10.44.24.excalidraw*

where each unit, or neuron, can be schematised as:
*missing embed: Automatic Differentiation_2022-02-14 11.00.46.excalidraw*
where $$x_i$$ is an input neuron from the previous layer, $$a(i)$$ is the affine transformation of input activations, and $$z(i)$$ is the activation of this neuron as the result of a non-linearity function applied to the affine transformation.


### The forward pass
This example neural network can simply be expressed as $$f_\theta(x)$$ where $$\theta$$ describes the parameters: the weights and biases. In order to optimise $$\theta$$ to fit the objective function, a cost function, or loss function, is minimised. It is typically expressed as $$\mathcal{L}_\theta$$, and can only be computed by doing a full forward-pass of the network, given an input vector $$x$$, since each neuron directly depends on the activations of all its preceding neurons. The forward pass is formally expressed as:


$$
f_\theta(x)=\sum_{i=1}^{l} \sigma_i(W_iz_{i-1}+b_i)
$$


where $$l$$ is the number of layers, $$W_i$$ is the weights matrix of layer $$i$$, $$z_{i-1}$$ the activations vector of the previous layer (with $$z_0$$ being the input vector), $$b_i$$ the bias of layer $$i$$, and $$\sigma_i$$ the activation function of layer $$i$$. In the case of an output layer of more than one units, the result of $$f_\theta(x)$$ is a vector. The loss vector can then be computed as:



$$
\mathcal{L}_theta(x) = C(f_\theta(x), y)
$$


where $$C$$ is the cost criterion. In practice, it is common to use the Mean Squared Error (MSE) for regression problems or toy classification problems, but the choice of loss criterion depends on the problem (see [Activation functions](../activation-functions/)). When using the MSE, the loss can be reformulated as:


$$
\mathcal{L}_\theta(X) = \frac{1}{N} \sum_{i}^{N} (f_{\theta}(x_i) - y_i)^2
$$


where the loss of a batch of $$N$$ samples $$X$$ is computed as the mean of the squared difference between the forward pass of each sample $$x_i$$ and the label (or ground truth) $$y_i$$.

### The backward pass
Now that the loss for a given input, or batch of inputs, is computed, the parameters of the network can be adjusted so as to minimise it. This is referred to as *optimisation* of the objective function, which is the underlying function that we aim to approximate through $$f_\theta$$, and is done by *minimisation* of the loss function. In neural networks, an efficient way to do this is by *Gradient Descent* or *Steepest Descent*, where we adjust each weight in the opposite direction of the gradient of the loss.

*But how to obtain the gradient of the loss with respect to each weight?*

This is achieved by *backpropagating* through all the layers of the network, from the computed loss back to the input layer. Backpropagation is simply the application of the sum rule and the chain rule of differentiation to compute the partial derivative of the loss with respect to each weight. A generic expression of computing the partial derivative of the loss with respect to any variable, using backpropagation, can be formulated as:


$$
v_i = \frac{\partial \mathcal{L}}{\partial v_i} = \sum_{j}^{K} v_j \frac{\partial v_j}{\partial v_i}
$$


with $$K$$ children, or following connected units, of unit $$v_i$$.


For instance, the partial derivative of the loss $$\mathcal{L}$$ w.r.t. the weight $$w_1$$ can be formulated as:


$$
\frac{\partial \mathcal{L}}{\partial w_1} = \frac{\partial h_1}{\partial w_1} \frac{\partial o_1}{\partial h_1} \frac{\partial \mathcal{L}}{\partial o_1}+ \frac{\partial h_1}{\partial w_1} \frac{\partial o_2}{\partial h_1} \frac{\partial \mathcal{L}}{\partial o_2}
$$


Let's break this down into easy-to-digest chunks:



$$
\frac{\partial \mathcal{L}}{\partial o_1} = 
$$



... Finish this section with this practical example!


In the end, what we obtain after a full backward pass is [The Jacobian matrix](../the-jacobian-matrix/), where each column is a gradient vector (since the output of $$\mathcal{L}$$ is a vector for vector-valued functions) as such:



$$
\nabla \mathcal{L} = [\frac{\partial \mathcal{L}}{\partial w_1}, \frac{\partial \mathcal{L}}{\partial w_2}, \cdots, \frac{\partial \mathcal{L}}{\partial w_n}]
$$


The Jacobian is simply the matrix of first-order partial derivatives.
{% endraw %}
