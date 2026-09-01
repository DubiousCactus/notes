---
title: "Curated list of datasets"
description: "Curated list of datasets — notes by Théo Morales"
date: 2023-05-23 12:00:00
categories: [hand-object-interaction]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
## Requirements

In [my research on joint hand-object pose estimation](../accelerated-learning-in-the-context-of-hand-object-interaction/), and because my focus is on object-specific adaptation, I find myself in the need of different datasets than the typical use. There are various hand-object interaction datasets out there, but only a few meet my requirements:
1. Provide the ground-truth for the 2D or 3D hand joint poses (21 joints)
2. Provide the ground-truth for the 6D object pose
3. Contain several object categories/shapes; the more the better
4. Provide RGB images

For my current experiments with object-specific adaptation with [meta-learning](../a-gentle-introduction-to-meta-learning/#an-in-depth-view-of-the-maml-algorithm), I need datasets that contain as many different objects as possible, in order to exploit the advantage of meta-learning methods for few-shot learning, since the goal is to demonstrate the potential increase in the ability of a model to generalize to unseen objects.

## Curated list of datasets

| Dataset                                                                                                                | # subjects | # frames | # objects        | Nature          | Year |
| ---------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | ---------------- | --------------- | ---- |
| [SynthHands](https://occludedhands.com/)                                                                                | 2          | 63,350   | 7                | Synthetic       | 2017 |
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
| [Partially Occluded Hands](https://occludedhands.com/)                                     | N/A        | 11,840   | 148       | Real      | 2018 | No object annotations.                                     |
| [FreiHAND](https://lmb.informatik.uni-freiburg.de/projects/freihand/)                     | N/A        | 130,3960 | N/A       | Real      | 2019 | No object annotations.                                     |
| [ContactDB](https://contactdb.cc.gatech.edu/)                                             | 50         | 375K     | 50        | Real      | 2019 | No joint annotations.                                      |


---

![List of RGB datasets, Huang et al.](huang-et-al-rgb-datasets.png) [^1]

[^1]:  [Survey on depth and RGB image-based 3D hand shape and pose estimation (Huang et al. 2021)](https://doi.org/10.1016/j.vrih.2021.05.002)
{% endraw %}
