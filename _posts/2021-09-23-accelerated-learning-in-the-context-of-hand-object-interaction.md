---
title: "Accelerated Learning in the Context of Hand-Object Interaction"
description: "Accelerated Learning in the Context of Hand-Object Interaction — notes by Théo Morales"
date: 2021-09-23 12:00:00
categories: [hand-object-interaction]
math: true
pin: false
---

{% raw %}
## Introduction

The goal is to learn a general representation of classes for prediction, with very little supervised information. 
Classical deep-learning models need a very large amount of data to prevent overfitting, but need no priors on the data. The idea of few-shot learning is to do the same but without needing a large amount of data, and so with the help of (learned) priors.

Typically, few-shot learners can be categorized as either data augmentation, or task-based meta-learning. The principle of data augmentation is to artificially increase the amount of training samples by extrapolating from the given samples, by learning a data generator for example. For task-based meta-learning, the goal is to use the accumulated knowledge of previous tasks in order to quickly adapt to a new task[^1], by aiming for sensitivity in the learned parameters for example[^2].

[^1]: [Task definition in Meta-Learning](/posts/the-neural-process-family/#task-definition-in-meta-learning)
[^2]: [A Gentle Introduction to Meta-Learning](/posts/a-gentle-introduction-to-meta-learning/)

## Motivation

Humans can efficiently learn new tasks by exploiting past knowledge and learned patterns on other tasks. Experience is not only used on a per-task basis for better performance, it is merged and aggregated into a more generalized form that allows us to quickly learn new skills when we have experience on similar skills.
More work must be done on uniforming experience and online-learning. For Hand-Object Interaction (HOI), when new point of views are learned, the knowledge of past point of views must be retained, and the new experience must be incorporated. A model should become better at everything when learning new things, without forgetting previous knowledge.

The main problem of defining my research might be to define the tasks or new domains for few-shot learning in HOI, such as:

- New view points
- New subjects
- New objects in manipulation (a model could fine-tune on the given object after learning with  only a few samples for instance, and retain past knowledge as to become better and better)


### Meta-learning

>The goal of meta-learning is to train a model on a variety of learning tasks, such that it can solve new learning tasks using only a small number of training samples. The key-idea of meta-learning is to train the model’s initial parameters such that the model has maximal performance on a new task after the parameters have been updated through one or more gradient steps computed with a small amount of data from that new task.[^3]

[^3]: [Model-Agnostic Meta-Learning (Finn et al.)](https://arxiv.org/abs/1703.03400)

Meta-learning is **one approach** to achieving few-shot learning. Meta-learners are trained by sampling small training sets and test sets from a large universe of labeled examples, feeding the sampled training set to the learner to get a classifier, and then computing the loss of the classifier on the sampled test set. These methods directly frame low-shot learning as an optimization problem.

### Zero-Shot Learning
*Being able to correctly make predictions without seeing any example for each class.*

### One-Shot Learning
*Being able to correctly make predictions given only a single example for each class.*
The goal is usually to learn a similarity ranking between inputs. 
The difficulty of one-shot learning also lies in the fact that such models must know when a sample **does not** belong to the previously learned classes. As such, the prior is updated on novel observations with the information of previously learned classes. In practice, such methods learn class distributions from image features, usually from input pairs.

%%#### A few example approaches

- **Siamese Neural Networks**
%%

### Few-Shot Learning

>The two most common approaches to few-shot learning have been, broadly speaking, based on metric learning and meta learning: Learn a good way to learn a new task, or combinations thereof. However, recent work has shown that much simpler approaches based on transfer learning achieve competitive performance.[^4]

[^4]: [Closing the Generalization Gap in One-Shot Object Detection (Michaelis et al.)](https://arxiv.org/abs/2011.04267)

The supervised meta-learning paradigm can be categorized as such:

- **Metric learning:** those methods learn a similarity space in which learning is efficient for few-shot examples.
- **Memory networks:** those methods memorize experience on past tasks and leverage that knowledge for generalizing to unseen tasks.
- **Gradient descent:** those methods use gradient descent to learn a meta-learner that adapts a base-learner without changing its architecture usually. The validation loss of the base-learner is used to optimize the meta-learner. Those  methods search for parameters that are conducive to fast gradient-based adaptation to new tasks.

For low-shot learning, literature have generally shown three classes of methods:

1. Building generative models that can share priors across categories. Those must often be hand-designed for the domain and so they tend to hardly capture the entirety of the distribution for unconstrained domains.
2. Building feature representations that are invariant to intra-class variation, for example by sharing features between seen and novel classes or by using carefully designed loss functions.
3. More generally, meta-learning. It consists in training a parameterized mapping from training sets to classifiers, often by learning a latent space from examples and using gradient descent to fine-tune the representation.

Ha et al. and Krueger et al. also tried to use one neural net to produce part of the parameters of another for fast adaptation.

MAML (Finn et al. 2017) ([A Gentle Introduction to Meta-Learning](/posts/a-gentle-introduction-to-meta-learning/)) and REPTILE (Nichol & Schulman 2018) use an optimization-based meta-learning approach.
As very well explained by Rusu et al., performing adaptation in latent space to generate a simple linear layer can lead to superior generalization and better scalability to large expressive models such as residual networks.

There are also probabilistic meta-learning approaches that show the advantages of learning Gaussian  posteriors over model parameters.

Recently, Neural Processes (Garnelo et al. 2018) and LEO (Rusu et al.) learn a mapping to and from a latent space that can be used for few-shot function estimation. I think the latter is great and it performs great.

<mark>Quite often, if not always, the base network needs to be trained on a large data set for a good amount of classes. Do humans work like that? Couldn't we build a model that does that more efficiently, by learning to segment object instances from annotations or in an self-supervised way using synthetic images? For instance by just moving the camera around to obtain slightly different views of the same objects, and using optical flow and warping as in Hassan et al. Because what is the point of few-shot learning if you still need a huge data set to get a good base network?</mark>

### Transfer learning

What and how to transfer are key issues to be addressed in transfer learning, as different methods are applied to different source-target domains and bridge different transfer knowledge.
The process of fine-tuning is simply to take a pre-trained network on base task (just its backbone), and to modify its head (or simply re-train it) as to adapt the model for another task.
**The benefit of pre-training decreases as the source task diverges from the target task.**

## Hand-Object Interaction

**Motivation**: lack of annotated real world data, because it's hard to annotate.
Multiple tasks for a few-shot model: egocentric view, in-the-wild videos, third-person view, top-view, bottom-view, front-view, physical hand + virtual object, etc.

- How can the use of 3D point clouds be of value for few-shot learning methods?
- How can few-shot learning methods be of value for object interaction in AR/VR?
- How can meta-learning improve the performance and generalizability of SOTA HPE methods?
- Can meta-learning improve online learning for hand-object interaction in AR/VR?
	- For example, as the model gets new views of the physical hand and of the virtual object, can it improve its performance for - broadly speaking - HOI with online learning using a meta-learning initialization approach? As in Chelsea Finn et. al., there could be one regression network which would be initialized with meta-learning for every new user or virtual object, and it would improve continuously with online learning. Reinforcement Learning could be incorporated as in Garcia-Hernando et. al. The goal is rapid adaptation of the same network but for different object manipulation tasks maybe. This is also referred to as few-shot learning.
	
- Few-shot learning could be used for domain adaptation. For instance, a HPE model is trained on synthetic data, and through few-shot learning it is then able to perform very well on real data. This has the great advantage of not necessitating expensive real-world datasets. This is the future my man.
- Few-shot or meta-learning for self-supervised learning in hand-object pose estimation?


**Object-specific adaptive network for hand & object pose estimation using a meta-learning approach**

*Even for the best methods, it remains challenging to generalize to unseen objects or novel object categories for joint hand and object pose estimation. In such cases, retraining the network on the unseen object category with a few labeled shots would greatly increase its performance.*

The question is now: should I focus on AR/VR since I obviously have the ground-truth for the virtual object (mesh), or should I focus on real images where in that case I must work with self-supervised methods only? What about both? Are both propositions solid enough for a PhD?

- Are there papers doing object-specific pose estimation (with hands)?	
	- Few-Shot Viewpoint Estimation (Tseng et al.)
- Has it been discovered that performance gains can be obtained by adapting the model or its parameters to the new task (specific object)?
	- Few-Shot Adaptive Gaze Estimation (Park et al.)
	- MetaPix: Few-Shot Video Retargeting (Lee et al.)
- Should the research question be about **few-shot learning** or **meta-learning**? One will give me more freedom than the other, but while the latter ensures that I improve the SOTA in **meta-learning**, the former indicates that I improve the SOTA in **hand-object interaction**. It is a tough choice.

*Strongly related papers:*

- Few-Shot Adaptive Gaze Estimation (Park et al.)
- Low-Shot Learning from Imaginary Data (Wang et al.)
- Meta-Learning with Latent Embedding Optimization (Rusu et al.)
- Few-Shot Viewpoint Estimation (Tseng et al.)


### Datasets


## Curated list of datasets

## Requirements

In [my research on joint hand-object pose estimation](/posts/accelerated-learning-in-the-context-of-hand-object-interaction/), and because my focus is on object-specific adaptation, I find myself in the need of different datasets than the typical use. There are various hand-object interaction datasets out there, but only a few meet my requirements:
1. Provide the ground-truth for the 2D or 3D hand joint poses (21 joints)
2. Provide the ground-truth for the 6D object pose
3. Contain several object categories/shapes; the more the better
4. Provide RGB images

For my current experiments with object-specific adaptation with [meta-learning](/posts/a-gentle-introduction-to-meta-learning/#an-in-depth-view-of-the-maml-algorithm), I need datasets that contain as many different objects as possible, in order to exploit the advantage of meta-learning methods for few-shot learning, since the goal is to demonstrate the potential increase in the ability of a model to generalize to unseen objects.

## Curated list of datasets

| Dataset                                                                                                                | # subjects | # frames | # objects        | Nature          | Year |
| ---------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | ---------------- | --------------- | ---- |
| [SynthHands](http://occludedhands.com/)                                                                                | 2          | 63,350   | 7                | Synthetic       | 2017 |
| [FPHAD](https://github.com/guiggh/hand_pose_action)                                                                    | 6          | 100,000  | 4                | Real            | 2018 |
| [FHAB](https://guiggh.github.io/publications/first-person-hands/)                                                      | 6          | 105,459  | 26 (4 annotated) | Real            | 2018 |
| [ObMan](https://hassony2.github.io/obman)                                                                              | N/A        | 150,000  | 8                | Synthetic       | 2019 |
| [ContactPose](https://research.fb.com/publications/contactpose-a-dataset-of-grasps-with-object-contact-and-hand-pose/) | 50         | 2.9M     | 25               | Hybrid          | 2020 |
| [GRAB](https://grab.is.tue.mpg.de/)                                                                                    | 10         | 1.6M     | 51               | Mocap           | 2020 |
| [HO3D](https://www.tugraz.at/institute/icg/research/team-lepetit/research-projects/hand-object-3d-pose-annotation/)    | 10         | 77,558   | 10               | Real            | 2021 |
| [H2O](https://taeinkwon.com/projects/h2o/)                                                                             | 4          | 571,645  | 8                | Real            | 2021 |
| [DexYCB](https://dex-ycb.github.io/)                                                                                   | 10         | 582,000  | 20               | Real            | 2021 |
| [OakInk](https://oakink.net/)                                                                                          | 12         | 230,000  | 100              | Real            | 2022 |
| [HOI4D](https://hoi4d.github.io/)                                                                                      | 9          | 2.4M     | 800              | Real egocentric | 2022 |
| [ARCTIC](https://arctic.is.tue.mpg.de/)                                                                                | 10         | 2.1M     | 11               | Real            | 2023 |

### Related datasets not meeting the requirements
| Dataset                                                                                   | # subjects | # frames | # objects | Nature    | Year | Reason                                                     |
| ----------------------------------------------------------------------------------------- | ---------- | -------- | --------- | --------- | ---- | ---------------------------------------------------------- |
| [Dexter+Object](https://handtracker.mpi-inf.mpg.de/projects/RealtimeHO/dexter+object.htm) | 4          | 3,014    | N/A       | Real      | 2016 | Only finger tip annotations.                               |
| [HUST Dataset](https://www.handcorpus.org/?p=1596)                                        | 30         | N/A      | N/A       | Real      | 2016 | Cyberglove used, no object annotations, only joint angles. |
| [TUB Dataset](https://www.handcorpus.org/?p=1830)                                         | 17         | N/A      | 25        | Real      | 2016 | Cyberglove used, no object annotations, only joint angles. |
| [EgoDexter](https://handtracker.mpi-inf.mpg.de/projects/OccludedHands/EgoDexter.htm)      | 4          | 1,485    | N/A       | Real      | 2017 | Only finger tip annotations.                               |
| [Rendered Hand Pose (RHD)](https://lmb.informatik.uni-freiburg.de/projects/hand3d/)       | 20         | 44,700   | N/A       | Synthetic | 2017 | No object annotations.                                     |
| [UNIPI Dataset](https://www.handcorpus.org/?p=1855)                                       | 6          | N/A      | 21        | Real      | 2018 | No object annotations, only joint angles.                  |
| [Partially Occluded Hands](http://occludedhands.com/)                                     | N/A        | 11,840   | 148       | Real      | 2018 | No object annotations.                                     |
| [FreiHAND](https://lmb.informatik.uni-freiburg.de/projects/freihand/)                     | N/A        | 130,3960 | N/A       | Real      | 2019 | No object annotations.                                     |
| [ContactDB](https://contactdb.cc.gatech.edu/)                                             | 50         | 375K     | 50        | Real      | 2019 | No joint annotations.                                      |


---

![List of RGB datasets, Huang et al.](/assets/img/blog/huang-et-al-rgb-datasets.png) [^1]

[^1]:  [Survey on depth and RGB image-based 3D hand shape and pose estimation (Huang et al. 2021)](https://doi.org/10.1016/j.vrih.2021.05.002)
{% endraw %}
