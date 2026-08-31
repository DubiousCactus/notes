---
title: "Backpropagation basics"
description: "Backpropagation basics — notes by Théo Morales"
date: 2022-10-18 12:00:00
categories: [deep-learning, automatic-differentiation]
math: true
pin: false
---

{% raw %}
## Overview

The engine of Deep Learning is backpropagation, the algorithm that allows to perform gradient descent. In itself, backpropagation is simply the application of the chain rule, from the output layer all the way down to the input layer of a neural network.

Let us take the example of a three-layer neural network with an input layer of $$n$$ units, one hidden layer of $$l$$ units, and an output layer of 2 units:

*missing embed: Automatic Differentiation_2022-02-14 10.44.24.excalidraw*

where each unit, or neuron, can be schematised as:

## Automatic Differentiation_2022-02-14 11.00.46.excalidraw

<mark>⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠</mark>


# Text Elements

# Embedded files
689439ec65972263629f63d0e65d9e62d8348dcf: $$$\cdots$$$
1d87591b66dca409e57a99c9a113095819b5211e: $$$\cdots$$$
b94facba93708faa76226e2a02584353cc010183: $$$\cdots$$$
75384eddcb0c03284af05c3208e82164cef3af40: $$$a(i)=\sum_{i=1}^{3} w_i * x_i + b$$$
68af036763af74f1029abf84e324ac1eee42c419: $$$=Wx+b$$$
5933ad21143a3737bc5936d2300e10f1a0349e24: $$$z(i)=ReLU(a(i))$$$
455471e4d50b9a20d80b7be0595d7e8e96be5bef: $$$a(i)$$$
e042e58d1c8579ad1d34e745b0fcedace135b36a: $$$z(i)$$$
7a1ecc956469b9c889c648d01fb2f2ec38bf8769: $$$w_1$$$
ba866b3c6f2252ae3115d3beacb913fabab226b8: $$$w_2$$$
728679b54fb542c62130433334d9f04174a02cd2: $$$w_3$$$
c262d0f387d2de3ef86bb4f12664c964bd3a8b0f: $$$b$$$

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://excalidraw.com",
	"elements": [
		{
			"type": "image",
			"version": 31,
			"versionNonce": 1376535774,
			"isDeleted": false,
			"id": "C7SCR3Xh",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -122.5297619047619,
			"y": -192.20858134920644,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 8,
			"height": 13,
			"seed": 4555,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544183,
			"link": null,
			"status": "pending",
			"fileId": "c262d0f387d2de3ef86bb4f12664c964bd3a8b0f",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 57,
			"versionNonce": 1466793986,
			"isDeleted": false,
			"id": "r17h8QDI",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -247.21428571428578,
			"y": -88.17583198051943,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 21,
			"height": 11,
			"seed": 83815,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544183,
			"link": null,
			"status": "pending",
			"fileId": "728679b54fb542c62130433334d9f04174a02cd2",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 21,
			"versionNonce": 1076623646,
			"isDeleted": false,
			"id": "0JXKPFL8",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -245.7857142857144,
			"y": -158.17583198051952,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 21,
			"height": 11,
			"seed": 65133,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "ba866b3c6f2252ae3115d3beacb913fabab226b8",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 59,
			"versionNonce": 595734466,
			"isDeleted": false,
			"id": "b9Vkbq10",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -243.64285714285717,
			"y": -206.03297483766235,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 21,
			"height": 11,
			"seed": 55653,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "7a1ecc956469b9c889c648d01fb2f2ec38bf8769",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 21,
			"versionNonce": 1892361566,
			"isDeleted": false,
			"id": "IIZQGDRR",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 440.21428571428567,
			"y": -162.3901176948052,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 29,
			"height": 18,
			"seed": 97691,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "e042e58d1c8579ad1d34e745b0fcedace135b36a",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 22,
			"versionNonce": 820701058,
			"isDeleted": false,
			"id": "76hStDzu",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 151.85714285714278,
			"y": -160.9615462662338,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 30,
			"height": 18,
			"seed": 27199,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "455471e4d50b9a20d80b7be0595d7e8e96be5bef",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 76,
			"versionNonce": 1429916062,
			"isDeleted": false,
			"id": "NkJkSDKw",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 238.6428571428571,
			"y": -147.39011769480524,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 145,
			"height": 18,
			"seed": 4768,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "5933ad21143a3737bc5936d2300e10f1a0349e24",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 26,
			"versionNonce": 1206298434,
			"isDeleted": false,
			"id": "v4tMlznl",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -42,
			"y": -107.1953125,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 78,
			"height": 14,
			"seed": 28635,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "68af036763af74f1029abf84e324ac1eee42c419",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 49,
			"versionNonce": 212592094,
			"isDeleted": false,
			"id": "Y62eKjUT",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -78.5,
			"y": -184.1953125,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 165,
			"height": 54,
			"seed": 95816,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "75384eddcb0c03284af05c3208e82164cef3af40",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 137,
			"versionNonce": 1356099330,
			"isDeleted": false,
			"id": "pY4XDM9Y",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 1.5707963267948957,
			"x": -307.5,
			"y": -179.1953125,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 52.5,
			"height": 5,
			"seed": 7009,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [
				{
					"id": "1R1-KKE6YUx6yz2DUKoxg",
					"type": "arrow"
				}
			],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "689439ec65972263629f63d0e65d9e62d8348dcf",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "image",
			"version": 180,
			"versionNonce": 674200094,
			"isDeleted": false,
			"id": "sMNzvz1qpv1F4PHFcL7j7",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 1.5707963267948957,
			"x": -307.25,
			"y": -118.6953125,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 52.5,
			"height": 5,
			"seed": 1655920514,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [
				{
					"id": "FEzihBZknybcgwEYnPPTB",
					"type": "arrow"
				},
				{
					"id": "pVCgW_i1cTRVspxQ3C119",
					"type": "arrow"
				}
			],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "1d87591b66dca409e57a99c9a113095819b5211e",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "arrow",
			"version": 331,
			"versionNonce": 60068354,
			"isDeleted": false,
			"id": "1R1-KKE6YUx6yz2DUKoxg",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -269.1546817222552,
			"y": -196.63430556162226,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 156.1671347193672,
			"height": 52.80614289397306,
			"seed": 1980409886,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1644836739115,
			"link": null,
			"startBinding": {
				"elementId": "pY4XDM9Y",
				"gap": 9.595318277744832,
				"focus": -0.8863002310670522
			},
			"endBinding": {
				"elementId": "JvGj6v-t4Q2sIvPbUKmkZ",
				"gap": 6.987547002887982,
				"focus": -0.3275236299478846
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": null,
			"points": [
				[
					0,
					0
				],
				[
					156.1671347193672,
					52.80614289397306
				]
			]
		},
		{
			"type": "arrow",
			"version": 403,
			"versionNonce": 485949890,
			"isDeleted": false,
			"id": "FEzihBZknybcgwEYnPPTB",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -274.4446054340041,
			"y": -143.89302671557155,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 163.009060844004,
			"height": 5.12980119430776,
			"seed": 610585282,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1644836739115,
			"link": null,
			"startBinding": {
				"elementId": "sMNzvz1qpv1F4PHFcL7j7",
				"gap": 4.306054056311601,
				"focus": -1.0598164732552526
			},
			"endBinding": {
				"elementId": "JvGj6v-t4Q2sIvPbUKmkZ",
				"gap": 5.435544590000064,
				"focus": -0.024188078958169736
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": null,
			"points": [
				[
					0,
					0
				],
				[
					163.009060844004,
					5.12980119430776
				]
			]
		},
		{
			"type": "arrow",
			"version": 307,
			"versionNonce": 133527938,
			"isDeleted": false,
			"id": "pVCgW_i1cTRVspxQ3C119",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -274.94572930171734,
			"y": -89.13336391925498,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 162.78593435256698,
			"height": 42.54355982276121,
			"seed": 68662558,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1644836739116,
			"link": null,
			"startBinding": {
				"elementId": "sMNzvz1qpv1F4PHFcL7j7",
				"gap": 3.6458333333333335,
				"focus": 1.0645745283069754
			},
			"endBinding": {
				"elementId": "JvGj6v-t4Q2sIvPbUKmkZ",
				"gap": 6.159794949150341,
				"focus": 0.27976262487375064
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": null,
			"points": [
				[
					0,
					0
				],
				[
					162.78593435256698,
					-42.54355982276121
				]
			]
		},
		{
			"type": "image",
			"version": 259,
			"versionNonce": 1345535682,
			"isDeleted": false,
			"id": "Nf61yt0iHFNVFyjbs6dGL",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 1.5707963267948957,
			"x": 504.607142857143,
			"y": -139.40959821428572,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 52.5,
			"height": 5,
			"seed": 1353009950,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [
				{
					"id": "1R1-KKE6YUx6yz2DUKoxg",
					"type": "arrow"
				},
				{
					"id": "wuILYY_XlFAQl74ER7Hu6",
					"type": "arrow"
				},
				{
					"id": "-Lr2ecGBmxdTW8IcqLVyb",
					"type": "arrow"
				}
			],
			"updated": 1644838544184,
			"link": null,
			"status": "pending",
			"fileId": "b94facba93708faa76226e2a02584353cc010183",
			"scale": [
				1,
				1
			]
		},
		{
			"type": "rectangle",
			"version": 144,
			"versionNonce": 1263102722,
			"isDeleted": false,
			"id": "JvGj6v-t4Q2sIvPbUKmkZ",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -106,
			"y": -199.1953125,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 222,
			"height": 125,
			"seed": 1288466882,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [
				{
					"id": "1R1-KKE6YUx6yz2DUKoxg",
					"type": "arrow"
				},
				{
					"id": "FEzihBZknybcgwEYnPPTB",
					"type": "arrow"
				},
				{
					"id": "pVCgW_i1cTRVspxQ3C119",
					"type": "arrow"
				},
				{
					"id": "wuILYY_XlFAQl74ER7Hu6",
					"type": "arrow"
				},
				{
					"id": "TR-0rxn9BoaUp_9QWf0na",
					"type": "arrow"
				}
			],
			"updated": 1644836835672,
			"link": null
		},
		{
			"type": "ellipse",
			"version": 171,
			"versionNonce": 1031656322,
			"isDeleted": false,
			"id": "V7f5QSsj7QBmFzkZ3xEr-",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 222.1428571428571,
			"y": -229.48102678571436,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 174.42857142857144,
			"height": 174.42857142857144,
			"seed": 961127070,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [
				{
					"id": "TR-0rxn9BoaUp_9QWf0na",
					"type": "arrow"
				},
				{
					"id": "-Lr2ecGBmxdTW8IcqLVyb",
					"type": "arrow"
				}
			],
			"updated": 1644836853472,
			"link": null
		},
		{
			"type": "arrow",
			"version": 46,
			"versionNonce": 2023243294,
			"isDeleted": false,
			"id": "TR-0rxn9BoaUp_9QWf0na",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 116.85714285714278,
			"y": -135.53297483766238,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 104.28571428571433,
			"height": 0,
			"seed": 1230963806,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1644836835672,
			"link": null,
			"startBinding": {
				"elementId": "JvGj6v-t4Q2sIvPbUKmkZ",
				"focus": 0.018597402597401926,
				"gap": 1
			},
			"endBinding": {
				"elementId": "V7f5QSsj7QBmFzkZ3xEr-",
				"focus": -0.07720944084580478,
				"gap": 1.2566349985261525
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": null,
			"points": [
				[
					0,
					0
				],
				[
					104.28571428571433,
					0
				]
			]
		},
		{
			"type": "arrow",
			"version": 52,
			"versionNonce": 407560350,
			"isDeleted": false,
			"id": "-Lr2ecGBmxdTW8IcqLVyb",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 398.2857142857142,
			"y": -136.9615462662338,
			"strokeColor": "#000000",
			"backgroundColor": "transparent",
			"width": 120.91326085224341,
			"height": 0.6860272167024277,
			"seed": 794695554,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1644836857639,
			"link": null,
			"startBinding": {
				"elementId": "V7f5QSsj7QBmFzkZ3xEr-",
				"focus": 0.05504330226138635,
				"gap": 1.8723906646632713
			},
			"endBinding": {
				"elementId": "Nf61yt0iHFNVFyjbs6dGL",
				"focus": -0.026660804018251272,
				"gap": 9.158167719185371
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": null,
			"points": [
				[
					0,
					0
				],
				[
					120.91326085224341,
					0.6860272167024277
				]
			]
		}
	],
	"appState": {
		"theme": "dark",
		"viewBackgroundColor": "#ffffff",
		"currentItemStrokeColor": "#000000",
		"currentItemBackgroundColor": "transparent",
		"currentItemFillStyle": "hachure",
		"currentItemStrokeWidth": 1,
		"currentItemStrokeStyle": "solid",
		"currentItemRoughness": 1,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 1,
		"currentItemFontSize": 20,
		"currentItemTextAlign": "left",
		"currentItemStrokeSharpness": "sharp",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": null,
		"currentItemLinearStrokeSharpness": "round",
		"gridSize": null
	},
	"files": {}
}
```
%%

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


where $$C$$ is the cost criterion. In practice, it is common to use the Mean Squared Error (MSE) for regression problems or toy classification problems, but the choice of loss criterion depends on the problem (see [Activation functions](/posts/activation-functions/)). When using the MSE, the loss can be reformulated as:


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


In the end, what we obtain after a full backward pass is [The Jacobian matrix](/posts/the-jacobian-matrix/), where each column is a gradient vector (since the output of $$\mathcal{L}$$ is a vector for vector-valued functions) as such:



$$
\nabla \mathcal{L} = [\frac{\partial \mathcal{L}}{\partial w_1}, \frac{\partial \mathcal{L}}{\partial w_2}, \cdots, \frac{\partial \mathcal{L}}{\partial w_n}]
$$


The Jacobian is simply the matrix of first-order partial derivatives.
{% endraw %}
