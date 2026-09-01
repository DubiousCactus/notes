---
title: "The information bottleneck"
description: "The information bottleneck — notes by Théo Morales"
date: 2023-09-15 12:00:00
categories: [mathematical-foundations, information-theory]
tags: [mathematical-foundations, information-theory]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
## Introduction

The primary goals of information theory is to quantify how much information is in data.
Claude Shannon, the father of Information Theory, introduced the concept based on a measure called [entropy](../shannons-entropy/).

## The standard information bottleneck

In *information theory*, we want to find the information in a signal $$x \in X$$ that is relevant to the information of interest in a signal $$y \in Y$$. In other words, we want to extract the information in $$x$$ such that we can predict $$y$$.
The *information bottleneck* is a way to extract **a short code** out of $$X$$ that preserves the maximal information about $$Y$$. We "squeeze" the information that $$X$$ provides about $$Y$$ into a limited set of codewords $$\tilde X$$ through this bottleneck.

## Rate distortion theory

> 
>Rate distortion theory determines the level of inevitable expected distortion $$D$$ given the desired information rate $$R$$ in terms of the *rate distortion function* $$R(D)$$.

The main problem in this theory is that we need to specify *rate distortion function* so that we can extract the relevant features. The function *is not part of the theory*, thus we don't have a way to determine which features to extract without prior knowledge about the signal and engineering.
{% endraw %}
