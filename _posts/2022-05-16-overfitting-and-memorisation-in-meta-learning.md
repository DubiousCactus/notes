---
title: "Task overfitting and the memorisation problem"
description: "Task overfitting and the memorisation problem — notes by Théo Morales"
date: 2022-05-16 12:00:00
categories: [meta-learning]
tags: [meta-learning]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
## Task overfitting and the memorisation problem

For meta-learning to work, the sampled tasks must be mutually exclusive such that no single model can solve all tasks. In some cases where the task is identifiable (*i.e.* the classification labels are not shuffled), the meta-learning algorithm may simply discard the context set and memorise the predictions to minimise the error. In other cases, such as predicting the pose of an object from an image, if the task can be solved from the target inputs alone then the algorithm may minimise the loss while discarding the context set by memorising a function that solves all of the tasks. This results in a zero-shot model that makes average decisions for all tasks without adaptation, and thus poor performance on novel tasks.

![Complete memorisation of the tasks](memorisation.png)

### Information theory to the rescue

The idea proposed by et al is to reduce the information flow between x* and y*, such that the algorithm is forced to use the information in D.

![regularisation](regularisation.png)


#### Widening the task distribution

![overfitting_forms](overfitting-forms.png)
{% endraw %}
