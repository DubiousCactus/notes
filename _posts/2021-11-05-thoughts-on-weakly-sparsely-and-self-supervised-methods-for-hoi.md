---
title: "Thoughts on weakly, sparsely and self supervised methods for HOI"
description: "Thoughts on weakly, sparsely and self supervised methods for HOI — notes by Théo Morales"
date: 2021-11-05 12:00:00
categories: [hand-object-interaction]
tags: [hand-object-interaction]
math: true
media_subpath: /assets/img/blog
pin: false
published: false
---

{% raw %}
# Weakly-, sparsely- and self-supervised methods for Hand-Object Interaction

****
![ ](https://i.imgur.com/Z5MwVyu.png "Mind map")
****
**A few thoughts:**
- *Using 3D intermediate representations makes more sense and sounds fun!*
- *I'm interested in latent representation learning for generalization or few-shot learning.*
- *The absence of physical constraints might result in infeasible grasps.*
- *Weakly- < Sparsely- < Self- | Supervised Learning. What about few-shot?*
- *If compression is intelligence, few-shot learning and latent space representation should be the way to go.*

****
**There is a clear lack of datasets of real images with hand and object pose annotations.**

Limitations of current datasets:

- Simple 3D objects
- No realistic interactions
- Synthetic images
- Corrupted by sensor failures
- Limited in sized

A few innovative datasets addressing these issues:

- EPIC Kitchens
- HO-3D (from HOnnotate)
- GRAB

****

**A few potential guiding problems where success can be defined:**

- Generalizing well with synthetic data for object-aware HPE
	- **Measuring the contribution**: Significantly improving the SOTA results on real images compared to other models trained on synthetic data. Or significantly reducing the margin between synthetic test results and real test results.
- Generalizing well with little data (few-shot learning or sparsely-supervised learning?) for object-aware HPE
	- **Measuring the contribution**: achieving SOTA results on par with, or better than, models trained on full datasets and better than the current SOTA in few-shot learning.
- Preventing drift and overcoming the initialization problem for video processing (through temporal constraints?) [*not so fun*]
	- **Measuring the contribution**: 
- Learning a good representation for model-free hand and object pose
	- **Measuring the contribution**: 
- Automating the search for data augmentation in self-supervised methods for HPE under object occlusions or HOPE (hand & object pose estimation)
	- **Measuring the contribution**: 
- Bringing explainable AI to HOI through disentangled representation learning (Contrastive Learning)
	- **Measuring the contribution**: 


**A few potential gaps in the literature:**

- Little to no work for HOI with these methods (a lot more is found on HPE alone).
- Very little work using physics-based models or physics simulations (a lot more on HPE).
- Object occlusion problems are hard and therefore joint hand & object pose estimation is much less active than HPE alone.
- Regarding HOI, there is:
	- A lack of data-driven methods
	- A lack of datasets because they are very hard to make compared to hand-pose estimation alone
- I see many works stating that temporal constraints are flawed because they induce drift and they depend on good initialization
	- Isn't that a gap? Shouldn't there be more work on improving temporal constraints or video processing?
	- Many recent works choose to go for single image inference but it doesn't make much sense for HOI since video is more valuable
- Photometric supervision is susceptible to fail in cases of fast motions or illumination changes
	- Is there any work on event-based cameras for HPE? Does it even make sense?


**Very interesting problems/solutions found in recent papers:**

- *Li et. al., 06/2020*: **Hand Pose Estimation for Hand-Object Interaction Cases using Augmented Autoencoders**. I love it because it is similar to what I published on drone racing. The method is applied to HPE under object occlusion, so no object pose estimation (which is left to solve). They used 3D point cloud data and augmented them for adding object occlusion. There is apparently just this work regarding the use of 3D point clouds for HOI.
- *Hasson et. al.*: **Leveraging Photometric Consistency Over Time for Sparsely Supervised Hand-Object Reconstruction**. Super cool and interesting because sparse supervision could be the best way to train an end-to-end model: accurate annotations make the model learn the objective function accurately, and sparse annotations help it generalize well and help aleviate manual labour.
- *Wan et. al.*: **Dual Grid Net: hand mesh vertex regression from single depth maps**. This method works really well under sparse supervision, and can work (less well) on multi-camera setups under self-supervision. It only tackles the problem of 3D hand surface reconstruction and HPE though. It is a generative data-driven approach.
- *Garcia-Hernando et. al.*: **Physics-Based Dexterous Manipulations with Estimated Hand Poses and Residual Reinforcement Learning**. I really love this work because it is physics-based and close to self-supervision (maybe more weak supervision?). It sounds fun, and it is unique in its application: AR/VR and real-world for improved HPE under object interaction. There are not many works using physics simulation for HOI.
- *Grill et. al.:* **Bootstrap Your Own Latent**: Very cool idea (apparently not new though) and impressive how they get almost same results as fully-supervised methods on ImageNet! However they use an insane amount of computaion power and that's quite ridiculous... So that's definitely a limitation there. "*Designing such augmentations may require significant effort and expertise. Therefore, automating the search for these augmentations would be an important next step to generalize BYOL to other modalities*."
{% endraw %}
