---
title: "SOTA methods in hand pose regression for HOI"
description: "SOTA methods in hand pose regression for HOI — notes by Théo Morales"
date: 2023-05-31 12:00:00
categories: [hand-object-interaction]
math: true
pin: false
---

{% raw %}
I will try to keep this post up to date with the state of the art in hand pose regression for hand-object interaction and joint hand-pose prediction. This post is mostly for my personal research in the field, but it may come in handy to others.

## Metrics

For all joint-based metrics, we use the 16 biological hand joints + 5 finger tip *"joints"* for a total of 21 joints:

![Hand keypoints](https://i.imgur.com/ktC5eDX.png)

- **MPJPE:** Mean Per-Joint Pose Error in millimeters where the pose error is the L2 norm between the ground-truth and predicted hand joint.
- **MPCPE:** Mean Per-Corner Pose Error in millimeters where the pose error is the L2 norm between the ground-truth and predicted object bounding box corner vertices.
- **3D PCK:** Percentage of Correct Keypoints where a keypoint (hand joint) is counted as correct if it falls within a certain threshold.
- **PCK AuC:** Area Under Curve for PCK values in a specific range (i.e. 0 to 50mm).


## Benchmarks

This section is a non-exhaustive list of commonly used benchmarks for hand pose regression in object interaction, or joint hand-object pose regression. For a more up-to-date list of available datasets and benchmarks, have a look at my other post: [Curated list of datasets](/posts/curated-list-of-datasets/).

- **HO-3D**: 3rd person images of subjects manipulating objects with one hand. Objects come from the YCB dataset.
	- **CHALLENGE**: Version of the benchmark adapted for the challenge introduced in blabla et al 20bla. The ground truth wrist position of the test images is provided (I assumed this means the joint error is root-aligned). There are several evaluation benchmarks (test splits) proposed, such as:
		- *INTERPOLATION*: viewpoint, articulation, shape and objects are **included** in the training set.
		- *EXTRAPOLATION:* viewpoint, articulation, shape and objects are **not included** in the training set.
  - **DexYCB**: multi-view videos of a subject grasping an object amongst others on a table and holding it for a couple of seconds before putting it back on the table.
	  - It has several splits:
		- **S0 (default):** The train split contains all 10 subjects, all 8 camera views, and all 20 grasped objects. Only the sequences are not shared with the val/test split.
		- **S1 (unseen subjects):** The dataset is split by subjects (train/val/test: 7/1/2).
		- **S2 (unseen views):** The dataset is split by camera views (train/val/test: 6/1/1).
		- **S3 (unseen grasping):** The dataset is split by grasped objects (train/val/test: 15/2/3). Objects being grasped in the test split are never being grasped in the train/val split,  
		but may appear static on the table. This way the training set still contain examples of each object.
  - **Arctic** (very recent CVPR 23 submission): allocentric + egocentric videos of people manipulating articulated + non-articulated objects with two hands with MOCAP annotations and contact maps.
  - **OakInk** (very recent CVPR 23 submission): large-scale knowledge repository for understanding hand-object interaction. The first knowledge base, Oak, is comprised of 1,800 objects with affordance annotations. The second, Ink, is comprised of recorded interactions on 100 real objects and transfered to their virtual counterparts. The resulting dataset, OakInk, is 50,000 distinct affordance-aware and intent-oriented hand-object interactions.
  - **ContactPose:**  3D scans of objects statically grasped by people with contact maps recorded via a thermal camera.

## I - Same-dataset evaluation

###  A- RGB-based 3D single-hand pose regression

Values in parentheses correspond to the PCK AuC for range [0, 50mm]:

| Method                              | Benchmark | Split         | Requires object mesh | MPJPE (mm) (absolute) | MPJPE (mm) (root-relative) | MPJPE (mm) (Procrustes aligned) | MPCPE (mm) (absolute) |     |     |     |     |
| ----------------------------------- | --------- | ------------- | -------------------- | --------------------- | -------------------------- | ------------------------------- | --------------------- | --- | --- | --- | --- |
| Spurr [^1] +ResNet50                | HO-3Dv1   | 55/6          | No                   | N/A                   | 18.05                      | 10.66                           | N/A                   |     |     |     |     |
| Spurr [^1] +HRNet32                 | HO-3Dv1   | 55/6          | No                   | N/A                   | **17.46**                  | **10.44**                       | N/A                   |     |     |     |     |
| CPF [^7]                            | HO-3Dv1   | N/A           | Yes                  | **23.99**             | N/A                        | N/A                             | 19.15                 |     |     |     |     |
| Hasson [^8]                         | HO-3Dv1   | N/A           | Yes                  | 24.80                 | N/A                        | N/A                             | **18.10**             |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| THOR-Net [^9]                       | HO-3Dv2   | N/A           | No                   | 26.3                  | N/A                        | 11.3                            | N/A                   |     |     |     |     |
| ArtiBoost [^10]                     | HO-3Dv2   | N/A           | No                   | N/A                   | 2.53                       | N/A                             | N/A                   |     |     |     |     |
| Wang [^11]                          | HO-3Dv2   | N/A           | No                   | N/A                   | 2.38                       | N/A                             | N/A                   |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| THOR-Net [^9]                       | HO-3Dv3   | N/A           | No                   | 25.6                  | N/A                        | 11.2                            | N/A                   |     |     |     |     |
| ArtiBoost [^10] (reported by [^9])  | HO-3Dv3   | N/A           | No                   | **22.6**              | N/A                        | 10.8                             | 10.8                  |     |     |     |     |
| ArtiBoost [^10] (reported by [^12]) | HO-3Dv3   | N/A           | No                   | N/A                   | N/A                        | 11.4                            | N/A                   |     |     |     |     |
| ArtiBoost [^10]                     | HO-3Dv3   | N/A           | No                   | N/A                   | **2.5**                    | N/A                             | **5.88**              |     |     |     |     |
| Lin [^12]                           | HO-3Dv3   | N/A           | No                   | N/A                   | N/A                        | **8.9**                         | N/A                   |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| Hasson [^8]                         | FHAB      | N/A           | Yes                  | 18.0                  | 11.33                      |                                 | 22.3                  |     |     |     |     |
| ArtiBoost [^10]                     | FHAB      | N/A           | No                   | N/A                   | 8.6                        | N/A                             | 19.45                 |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| Spurr [^1] +ResNet50                | DexYCB    | S0            | No                   | 53.92 (0.307)         | 17.71 (0.683)              | 7.120 (0.858)                   | N/A                   |     |     |     |     |
| Spurr [^1] +HRNet32                 | DexYCB    | S0            | No                   | 52.26 (0.328)         | 17.34 (0.698)              | 6.832 (0.864)                   | N/A                   |     |     |     |     |
| ArtiBoost [^10]                     | DexYCB    | S0            | No                   | N/A                   | 12.8                       | N/A                             | N/A                   |     |     |     |     |
| Wang [^11]                          | DexYCB    | S0            | No                   | N/A                   | **1.27**                   | N/A                             | **3.26**              |     |     |     |     |
| Lin [^12]                           | DexYCB    | S0            | No                   | **12.56**             | N/A                        | **5.47**                        | N/A                   |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| Spurr [^1] +ResNet50                | DexYCB    | S1            | No                   | 70.23 (0.240)         | 22.71 (0.601)              | 8.430 (0.832)                   | N/A                   |     |     |     |     |
| Spurr [^1] +HRNet32                 | DexYCB    | S1            | No                   | **70.10 (0.248)**     | **22.26 (0.615)**          | **7.980 (0.841)**               | N/A                   |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| Spurr [^1] +ResNet50                | DexYCB    | S2            | No                   | 83.46 (0.208)         | **23.15 (0.566)**          | **8.110 (0.838)**               | N/A                   |     |     |     |     |
| Spurr [^1] +HRNet32                 | DexYCB    | S2            | No                   | **80.63 (0.217)**     | 25.49 (0.530)              | 8.210 (0.836)                   | N/A                   |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| Spurr [^1] +ResNet50                | DexYCB    | S3            | No                   | 58.69 (0.281)         | 19.41 (0.665)              | 7.560 (0.849)                   | N/A                   |     |     |     |     |
| Spurr [^1] +HRNet32                 | DexYCB    | S3            | No                   | **55.39 (0.311)**     | **18.44 (0.686)**          | **7.060 (0.859)**               | N/A                   |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| Hasson [^3] left hand               | H2O       | subject-based | No                   | 39.56                 | N/A                        | N/A                             | 66.1                  |     |     |     |     |
| H+O [^4] left hand                  | H2O       | subject-based |                      | 41.42                 | N/A                        | N/A                             | 48.1                  |     |     |     |     |
| H2O [^5] left hand*                 | H2O       | subject-based |                      | 41.45                 | N/A                        | N/A                             | 47.9                  |     |     |     |     |
| THOR-Net [^9] left hand*            | H2O       | subject-based | No                   | 36.8                  | N/A                        | N/A                             | 73.9                  |     |     |     |     |
| Cho [^11] left hand*                | H2O       | subject-based |                      | **24.4**              | N/A                        | N/A                             | **45.2**              |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 | N/A                   |     |     |     |     |
| Hasson [^3] right hand              | H2O       | subject-based | No                   | 41.97                 | N/A                        | N/A                             | 66.1                  |     |     |     |     |
| H+O [^4] right hand                 | H2O       | subject-based |                      | 38.86                 | N/A                        | N/A                             | 48.1                  |     |     |     |     |
| H2O [^5] right hand*                | H2O       | subject-based |                      | 37.21                 | N/A                        | N/A                             | 47.9                  |     |     |     |     |
| THOR-Net [^9] right hand*           | H2O       | N/A           | No                   | 36.5                  | N/A                        | N/A                             | 73.9                  |     |     |     |     |
| Cho [^11] right hand*               | H2O       | subject-based |                      | **25.8**              | N/A                        | N/A                             | **45.2**              |     |     |     |     |
|                                     |           |               |                      |                       |                            |                                 |                       |     |     |     |     |
| Hasson [^8]                         | OakInk    | N/A           |                      | N/A                   | 27.26                      | N/A                             | 56.09                 |     |     |     |     |
| H+O [^4]                            | OakInk    | N/A           |                      | N/A                   | **23.52**                  | N/A                             | **52.16**             |     |     |     |     |

\*Trained on both hands.

###  B - Depth-based 3D hand pose regression

Values in parentheses correspond to the PCK AuC for range [0, 50mm]:

| Method   | Benchmark | Split | MPJPE (mm) (absolute) | MPJPE (mm) (root-relative) | MPJPE (mm) (Procrustes aligned) |
| -------- | --------- | ----- | --------------------- | -------------------------- | ------------------------------- |
| A2J [^2] | DexYCB    | S0    | 27.53 (0.612)         | 23.93 (0.588)              | 12.07 (0.760)                   |
| A2J [^2] | DexYCB    | S1    | 29.09 (0.584)         | 25.57 (0.562)              | 12.95 (0.743)                   |
| A2J [^2] | DexYCB    | S2    | 23.44 (0.576)         | 27.65 (0.540)              | 13.42 (0.733)                   |
| A2J [^2] | DexYCB    | S3    | 30.99 (0.608)         | 24.92 (0.581)              | 12.15 (0.759)                   |

### C - Point-cloud-based 3D hand pose regression


| Method               | Benchmark | Intersection Depth (cm) ↓ | Intersection Volume (cm3) ↓ | MPJPE (mm) ↓ | Perceptual score (%) ↑ | Contact ratio (%) ↑ |     |
| -------------------- | --------- | ------------------------- | --------------------------- | ------------ | ---------------------- | ------------------- | --- |
| Ground truth         | HO-3D     | 2.94                      | 6.08                        | N/A          | 3.18                   | 91.60               |     |
| Jiang [^18]          | HO-3D     | **1.05**                  | **4.58**                    | N/A          | **3.5**                | **99.61**           |     |
| Grasping Field [^19] | HO-3D     | 1.46                      | 14.90                       | N/A          | 3.29                   | 90.10               |     |
| Chen [^17]           | HO-3D     | 1.08                      | N/A                         | **2.06**     | N/A                    | N/A                 |     |

[^18]: Jiang et al 2021: Hand-Object Contact Consistency Reasoning for Human Grasps Generation.
[^19]: Karunratanakul et al 2020: Grasping Field: Learning Implicit Representations for Human Grasps.

### D - Sequence-based 3D hand pose regression



| Method         | Benchmark                           | Split | MPJPE (mm) (absolute) | MPJPE (mm) (root-relative) | MPJPE (mm) (Procrustes aligned) |
| -------------- | ----------------------------------- | ----- | --------------------- | -------------------------- | ------------------------------- |
| ArcticNet-SF   | Arctic reconstruction (allocentric) | N/A   | N/A                   | **21.5**                       | N/A                             |
| ArcticNet-LSTM | Arctic reconstruction (allocentric) | N/A   | N/A                   | **21.5**                   | N/A                             |
|                |                                     |       |                       |                            |                                 |
| ArcticNet-SF   | Arctic reconstruction (egocentric)  | N/A   | N/A                   | **19.2**                   | N/A                             |
| ArcticNet-LSTM | Arctic reconstruction (egocentric)  | N/A   | N/A                   | 20.0                       | N/A                             |

### E - Grasp refinement methods

In this section, we look at a line of work which refines hand-object interactions from off-the-shelf methods. There are manily two bodies of work here: *static* methods and *sequence-based* methods.

**This is where I should position my paper. This field isn't as active and there is a lot more room for novelty here. Especially in articulated-object manipulation or bimanual object manipulation with contact changes.**

#### Static methods

For each metric: \<original\>/\<corrected\>.

| Method                        | Benchmark              | Intersection Volume (cm3) ↓ | MPJPE (mm) ↓    | Perceptual score (%) ↑ | Vertex-to-vertex error (mm) |
| ----------------------------- | ---------------------- | --------------------------- | --------------- | ---------------------- | --------------------------- |
| GT/ContactOpt [^12]           | ContactPose (original) | 2.45/**1.35**               | - / 8.06        | 30.6/**69.4**          | N/A                         |
| GT/ContactOpt [^12]           | Perturbed ContactPose* | **8.46**/12.83              | 79.89/**25.05** | -/-                    | N/A                         |
| Grasping Process              | ContactPose (original) | N/A                         | - / 41.0        | N/A                    | N/A                            |
|                               |                        |                             |                 |                        |                             |
| Hasson[^8]/ContactOpt [12]    | HO-3D                  | 15.3/**6.0**                | 57.7/**48.1**   | *reference*/85.2       | N/A                         |
| CoarseNet[^13]/RefineNet[^13] | GRAB[^13]              | N/A                         | N/A             | N/A                    | 18.4/**4.4**                |

\* hand pose and shape parameters as well as translattion and rotation perturbed with additive Gaussian noise.

#### Sequence-based methods


This section is only about the *very relevent* paper from Zhou et al 2022: **TOCH: Spatio-Temporal Object-to-Hand Correspondence for Motion Refinement**. They are proposing a novel LST-based denoising spatio-temporal autoencoder that performs grasp refinement through the learning of hand-object interaction fields in an invariant object-centric coordinate system.

They propose to train their method on two types of noise:
- T: translation-dominant perturbation which applies additive noise to the hand translation.
- R: pose-dominant perturbation which applies additive noise to the hand pose.

They then evaluate the improvement from noisy ground-truth to denoised predictions, as if the model was seeing inaccurate predictions from an off-the-shelf SOTA method on the GRAB dataset:
![](https://i.imgur.com/CPUvU2a.png)

They then evaluate their method on state-of-the-art models which use image or depth sequences to see how well it generalizes to real tracking errors:
![](https://i.imgur.com/q2lZCy3.png)




[^1]: Spurr et al 2020: Weakly Supervised 3D Hand Pose Estimation via Biomechanical Constraints.
[^2]: Xiong et al 2019: A2J: Anchor-to-joint regression network for 3D articulated pose estimation from a single depth image.
[^3]: Hasson et al 2019: Learning joint reconstruction of hands and manipulated objects.
[^4]: Tekin et al 2019: H+O: Unified egocentric recognition of 3d hand-object poses and interactions.
[^5]: Kwon et al 2021: H2O: Two Hands Manipulating Objects for First Person Interaction Recognition.
[^8]: Hasson et al 2020: Leveraging Photometric Consistency over Time for Sparsely Supervised Hand-Object Reconstruction.
[^7]: Yang et al 2021: CPF: Learning a Contact Potential Field to Model the Hand-Object Interaction.
[^9]: Aboukhadra et al 2022: THOR-Net: End-to-end Graformer-based Realistic Two Hands and Object Reconstruction with Self-supervision.
[^10]: Li et al 2021: ArtiBoost: Boosting Articulated 3D Hand-Object Pose Estimation via Online Exploration and Synthesis.
[^11]: Cho et al 2023: Transformer-based Unified Recognition of Two Hands Manipulating Objects.
[^12]: Grady et al 2021: ContactOpt: Optimizing Contact to Improve Grasps.
[^13]: Taheri et al 2020: GRAB: A Dataset of Whole-Body Human Grasping of Objects.


## II - Cross-dataset evaluation

###  A- RGB-based 3D single-hand pose regression

| Method                                 | Trained on     | Benchmark | Split                  | MPJPE (mm) (absolute) | MPJPE (mm) (root-relative) | MPJPE (mm) (Procrustes aligned) | 3DPCK |
| -------------------------------------- | -------------- | --------- | ---------------------- | --------------------- | -------------------------- | ------------------------------- | ----- |
| Spurr [^1] +ResNet50                   | HO-3D          | DexYCB    |                        | N/A                   | 48.30                      | 24.23                           |       |
| Spurr [^1] +HRNet32                    | HO-3D          | DexYCB    |                        | N/A                   | **46.38**                  | **23.94**                       |       |
| Chen [^17]                             | SimGrasp [^17] | DexYCB    | N/A                    | 26.9                  | N/A                        |                                 |       |
|                                        |                |           |                        |                       |                            |                                 |       |
| Spurr [^1] +ResNet50                   | DexYCB         | HO-3D     |                        | N/A                   | **31.76**                  | **15.23**                       |       |
| Spurr [^1] +HRNet32                    | DexYCB         | HO-3D     |                        | N/A                   | 33.11                      | 15.51                           |       |
|                                        |                |           |                        |                       |                            |                                 |       |
| Spurr [^1] - no constraints            | RHD [^6]       | HO-3D     | EXTRAP                 | N/A                   | 19.57                      | N/A                             | N/A   |
| Spurr [^1] - biomechanical constratins | RHD [^6]       | HO-3D     | EXTRAP                 | N/A                   | **18.42**                  | N/A                             | N/A   |
|                                        |                |           |                        |                       |                            |                                 |       |
| Spurr [^1] - no constraints            | RHD [^6]       | HO-3D     | INTERP                 | N/A                   | 25.16                      | N/A                             | N/A   |
| Spurr [^1] - biomechanical constratins | RHD [^6]       | HO-3D     | INTERP                 | N/A                   | **10.31**                  | N/A                             | N/A   |
|                                        |                |           |                        |                       |                            |                                 |       |
| Chen [^17]                             | SimGrasp [^17] | HO3D      | Custom (from training) | 20.6                  | N/A                        |                                 |       |

[^6]: Zimmermann et al 2017: earning to estimate 3d hand pose from single rgb images.


## Discussion & reflection

I have okay-ish results but they are very far from SOTA (~40mm or 35 if root-aligned); maybe 3 times worse than SOTA, on *static point cloud based prediction*. Considering that my method is given ground-truth observations, this error **should be much much lower**. It seems that many things are wrong with my model, and mostly that it ignores most of the Y part of the observations and learns to solve the task with only X.

**Where is my research positioned?**

My work is relevent in the **Grasp refinement** body of work.

**What are the novelties of my method?**

- Uncertainty estimation for individual finger joints. This gives an opportunity for more efficient meta-learning?
- Having a conditional distribution of grasps for the given object, allowing to synthesise many plausible grasps given some observation of the hand-object interaction.
- Applying the Neural Process framework to this problem; recasting this problem as a stochastic process.
- Applying contrastive learning based on shape similarity for this problem (I have not seen that done yet, and contrastive learning is getting more popular).

**What has the literature review brought to me?**

- SO(3)-equivariance requires a lot of complexity in the model and makes the problem much harder. Invariant methods (i.e. TOCH, GrabNet) are much simpler and work very very well for the *right problem of modelling contacts fields or grasping fields*. I feel that I should probably follow these approaches and try to model a grasping field using a Neural Process.
- The SOTA is very hard to beat for static grasp inference from RGB/RGBD. On the other hand, there isn't much work done and *a recent rise in datasets*  for sequence-based grasp inference, grasp retargetting and soft-body/articulated object manipulation. Maybe TTA has more room for improvement in there? There isn't much work on bimanual inference as well!
- For articulated objects, we could probably define a grasping field which is a function of the object geometry at time T (since said geometry is changing). In this case, I think an NP would suit because we can define a prior distribution of grasps for the articulated geometry.
- If I want my method to be lightweight, I should either avoid using point clouds, or use an efficient pointcloud learning method (Basis Point Sets, PointNet++, etc.). BPS is a particularly interesting point cloud representation that allows to learn features with simple MLPs very very cheaply! It reminds me of SDFs but in a descrete form. I could try to maintain rotation equivariance with BPS + Vector Neurons for SO(3) equivariance, while doing it much much cheaper!
- There are several works in point-cloud-based 3D hand pose estimation [^14][^15][^16][^17]  that show that the large variations in hand global orientation can bring significant complexity and ambiguities, and that canonicalizing the input point cloud in its orientation bring consistent performance improvements. [^17] have tried canonicalizing both the hand and the object, but using an object-centric approach like TOCH (and mine) seems more effective at modelling interactions.
- There are *very few* works on UV-based contact maps, and the one I found is only a binary mask! I can **definitely improve that with the capsule-based idea of ContactOpt**. UV maps have the advantage of scaling efficiently as opposed to point-cloud based methods that trade accuracy for memory and speed.
- U-Net style encoder-decoder networks are used a lot for this kind of image-based problem, with a ResNet50 base and skip connections. Why is that?
- Something that is done a lot in the literature is a first coarse prediction to initialize a refined prediction with some amount of TTO. Can we simplify this paradigm with the Neural Process?


[^14]: Ge et al 2018: Hand pointnet: 3d hand pose estimation using point sets.
[^15]: Ge et al 2018: Point-to-point regression pointnet for 3d hand pose estimation.
[^16]: Cheng et al 2021: Handfoldingnet: A 3d hand pose estimation network using multiscale-feature guided folding of a 2d hand skeleton.
[^17]:  Chen et al 2022: Tracking and Reconstructing Hand Object Interactions from Point Cloud Sequences in the Wild.

**Should I reposition my experiment?**

I think I made the problem too complex by requiering equivariance and trying to model everything (contacts, hand shape, object shape, orientations, etc.) implicitely without enough training objectives.

*Wouldn't it make more sense to try and model hand and object contact maps (or object-to-hand contact field as in TOCH) based on noisy observations?*
--> 100% YES. This is a much easier problem and can be done with invariance (more efficient point cloud processing!).
--> We can then add temporal modelling to this method maybe kind of like Nvidia did it with their video diffusion model.
--> There is much less competition in this body of work and it seems like a slightly easier problem to work with. I think no one has yet done bimanual contact modelling?
--> We have ContactOpt and TOCH to benchmark against (if not changing the problem).


Overall, beating the SOTA seems like an impossible task due to the huge amount of competition. But my original idea still stands untested: **improving the representations for meta-learning hand-object pose prediction through Procrustes Analysis-based contrastive learning**. Can I just build a baseline that performs well and improve it with this method? Is that a good enough contribution?


My original idea was to learn prior grasps from data in the form of a stochastic process, such that it can be used as a source of supervision for test-time adaptation. *However,* the literature says that *optimizing the pose of a hand to achieve expected contact with an object can improve hand poses inferred via image-based methods*. So it seems that a contact map is much better suited as a source of supervision, right? In this case, my method should provide contact maps with a measure of uncertainty such that we can use this as a variable-trust supervision for TTA of image-based pose prediction methods. If I do this, all I should need is an invariant pointcloud processing method (PointNet). 
It seems that the most suited way to predict contact maps is to use PointNet/PointNet++, but in my case if I use an NP I think it would make more sense to predict a UV contact map (there's Yu et al 2022  that optimizes 3D hand shape from a single RGB image using a dense representation of contact regions in the form of a UV map, and of course they also propose TTA to fine-tune the grasp). I think it would make a lot of sense since NPs work great on images. Now if I replace observations with weaker labels (i.e. hand-object point clouds), it isn't quite the same so it may not work well... However there's no reason for it not to work, since the training objective naturally induces low variance / high likelihood around Xs that are similar to the observations.

The experiments done by ContactOpt show that aligning the hand pose to the ground truth contact map (which is perfectly captured) in the ContactPose dataset greatly improve the contact fidelity and lots of other metrics (quality of poses). Based on this, we can assume that having very accurate contact inference would allow for great TTA of inaccurate off-the-shelf methods. Can I improve this with NPs? I think that:
- Learning prior distributions of contact maps for objects is a good idea and has been showed to work with CVAEs (Yu et al 2021).
- Infering contact mpas from multiple observations has been tried and works (ContactPose experiments).
- Probabilistic models for contact map inference haven't been tried as far as I know, although they would provide a measure of uncertainty            


**Final thought?**
Predicting hand joints from noisy hand joints observations isn't that useful for TTO, you might as well feed in *all* observations and use the process' output as cleaned predictions.
*However,* predicting a contact map (UV, point cloud, doesn't matter what it is) from few observations **is useful for TTO** because you now have a stronger source of supervision which ties all predictions together. Making such method temporal would be amazing, because then you could have a temporal contact map hehe. Maybe that should be my following *grand contribution*? A **novel temporal contact representation**. Make it articulated and we hit bank.
{% endraw %}
