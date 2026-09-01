---
title: "Des Idées Diamètralement Opposées à l'Intelligence Artificielle"
description: "Des Idées Diamètralement Opposées à l'Intelligence Artificielle — notes by Théo Morales"
date: 2023-09-08 12:00:00
categories: [conversations]
tags: [conversations]
math: true
media_subpath: /assets/img/blog
pin: false
---

{% raw %}
> Intention
> Cet essai est une traduction française d'un article originellement écrit en anglais pour mon blog. J'y ai rajouté des notes de fin de page que je vous incite à consulter lorsqu'un terme vous parait vague ou si la référence vous intéresse. Ici, je simplifie des concepts et principalement traite l'Intelligence Artificielle comme l'apprentissage profond. Bien qu'IA puisse être un terme qui ne signifie pas grand-chose, c'est ce que le public veut entendre. Cette simplification est utile pour expliquer de tels concepts avancés pour les masses. 

## Idées diamétralement opposées et où les trouver
*“Je ne participerai pas à ce débat. Nos idées sont diamétralement opposées !”*

*— “Mais qu'est-ce que ça veut donc dire d'être diamétralement opposé ?”*


![Diameter](diameter.svg)

Commençons par la définition du diamètre. Une manière de le définir est : le segment duquel les deux bouts sont adjacents au périmètre du cercle, et dont la longueur est maximale. Cela peut être vu comme la distance maximale entre deux points sur un cercle. Ceci s'applique aux sphères en trois dimensions. Ainsi, *diamétralement opposé* veut dire opposé par la *distance* maximale en une ligne droite, et par analogie au cercle : sur les bords opposés.


*“Comment peuvent des idées être séparées par une distance ? Ce n'est pas comme si l'on peut tirer un mètre ruban entre deux idées !”*

Bien que cela soit vrai pour le monde réel — et tangible — il ne veut pas nécessairement dire qu'une distance ne peut être mesurée entre des idées, des mots, des concepts. Ceci s'étend à n'importe quelle modalité d'information. Il est possible de représenter toute forme d'information, peu importe sa nature, en tant qu'un point dans l'espace : ce que l'on appelle le *plongement*[^8] (retenez ce mot, il est important).
À vrai dire, non seulement il est possible, mais c'est chose commune dans les domaines de l'Analyse de Données et l'Intelligence Artificielle.
Tout comme l'on peut tracer huit points dans un espace tridimensionnel pour former un cube, il est aussi possible de tracer des mots ou des images !

[^8]: En langage simple, un plongement est une représentation mathématique d'un objet mathématique ayant une autre représentation de base. Prenons l'analogie d'une musique : c'est notre représentation de base, elle est riche et expressive. En contrepartie, la cassette sur laquelle est enregistrée cette musique est un petit objet qui tient dans votre poche : c'est son *plongement*. La musique existe au sein de votre conscience lorsque vous la jouez sur le lecteur cassette, mais la cassette en elle-même est un objet fait de plastique. Les deux représentent la même chose, mais vivent dans deux espaces différents.



![Shared vector space](shared-vector-space.svg)
#### Trop abstrait ? Aplatissons les choses et pensons en 2D.
Un point dans l'espace est typiquement représenté par ses coordonnées, $$x$$  et $$y$$ pour les plans en 2D, ce qui correspond à la position du point sur chaque axe : l'axe $$X$$ et l'axe $$Y$$.
On qualifie cet espace d'*Euclidien*[^2] (pour le mathématicien grec Euclide), où l'on peut appliquer la *géométrie Euclidienne*, celle que vous apprenez à l'école primaire. Cependant, ces deux axes ne représentent pas *nécessairement* une position absolue et dénuée de sens.
Ils peuvent aussi représenter d'autres concepts, tels que le prix d'une maison et sa surface. Lorsque l'on enlève le sens de position absolue dans l'espace de ces points, on dit qu'ils vivent dans un *“espace vectoriel”*. En effet, on ne les appelle plus des points, mais des *vecteurs*. Dans cet espace, les vecteurs peuvent être ajoutés, multipliés ou soustraits les uns aux autres. Ils possèdent des propriétés additionnelles qui sont absentes de l'*“espace Euclidien”*. 
Un vecteur est simplement une entité abstraite, qui peut toujours être vue comme un point dans l'espace. Le vecteur représente de divers attributs de notre donnée[^1] sous la forme d'une liste. La magie ici est que l'on peut toujours traiter les vecteurs comme des points (et les points comme des vecteurs, ha !) et utiliser la géométrie Euclidienne pour, par exemple, calculer leur distance !
Reprenons l'exemple de la maison et utilisons cette liste d'attributs :
1. Prix (€)
2. Surface (m²)

Pour une maison de $$78$$m² à $$2750000$$€, on obtient un vecteur constitué de chaque attribut tel que $$[275000, 78]$$. Celui-ci est point $$-$$ maison $$1$$ $$-$$ dans un espace à $$2$$ dimensions :

![maisons](maisons.png)

Ce vecteur "maison 1" est un *plongement* de cette maison spécifique dans un espace 2D.
Imaginons maintenant que l'on veuille entraîner un modèle d'IA à classer les maisons en deux catégories, *vertes* et *bleues*, selon leur rapport qualité/prix. Pour ce faire, le modèle essaye de séparer les points dans l'espace par une droite, de sorte que les maisons d'un côté de la droite appartiennent à une classe et à l'inverse pour l'autre côté. Il est clair que pour cette configuration de maisons, il est impossible de séparer la classe *bleue* de la classe *verte* par une droite.
Ici le *plongement* est simplement le vecteur de base, mais nous pourrions tout à fait avoir une fonction mathématique qui transforme ce vecteur en un plongement en haute dimension ($$5$$, $$30$$, ou $$200$$ par exemple), ainsi permettant une meilleure séparation dans l'espace des maisons.

[^1]: Dans notre exemple, une donnée peut correspondre à une maison et peut être formée comme un vecteur avec des attributs tels que le *prix* et la *surface*.
[^2]: L'espace Euclidien est l'espace fondamental de la géométrie classique, gouverné par un jeu de règles telles que le *parallélisme*.

### N'importe quelle modalité de données peut être plongée dans l'espace

*“Mais comment des mots peuvent être plongés dans l'espace ? Les lettres ne sont pas des nombres !”*

Sans rentrer dans les détails, à l'heure actuelle, nous plongeons l'information dans l'*espace vectoriel* à l'aide de *réseaux de neurones artificiels*. Par exemple, les images sont représentées sous forme de nombres correspondant aux quantités de chaque couleur (rouge, vert, bleu) et pour chaque pixel, alors que les mots sont simplement encodés par correspondance avec un nombre unique grâce à un dictionnaire.
Ainsi, deux mots identifiés par deux nombres différents peuvent être plongés dans un *espace vectoriel* par un réseau de neurones de telle que leur distance est proportionnelle à la similarité de leurs significations. La manière dont ce "plongement" opère est *apprise* en *entrainant* le réseau de neurones de tel que les mots ayant une signification similaire soient proches entre eux dans cet espace, et que ceux ayant une signification opposée soient éloignés. Malin, n'est-ce pas ?
### L'IA raisonne par similarité

*“Aah je vois ! Donc l'Intelligence Artificielle fonctionne par association d'idées ?”*[^3]


D'une certaine manière oui ! L'idée des réseaux de neurones artificiels, dans ce domaine que l'on nomme *Apprentissage Profond*, est de représenter des concepts dans un espace, de tel que de nouveaux concepts peuvent être assimilés à d'autres vus auparavant. Prenons l'exemple de la classification d'images de chiens et de chats.
Un réseau de neurones apprend à plonger des images de chats afin qu'elles soient proches dans cet espace, et de même pour que les images de chiens soient groupées ensemble dans une autre région de cet espace. 

![dogs vs cats](dogs-vs-cats.png)

Après cette phase d'entraînement, une nouvelle image de chien est plongée par le réseau de neurones en concordance avec ce qu'il a appris. Si nous prenons le vecteur de plongement, il ne reste qu'à comparer ses distances avec le centre de chaque groupe[^4] : c'est ainsi que le réseau de neurones décide que c'est une image de chien, car son vecteur correspondant est plus proche du groupe de chiens que du groupe de chats dans l'espace vectoriel. Ceci est une simplification de la manière dont les réseaux de neurones fonctionnent, bien que ce soit précisément comment les "Réseaux Prototypiques" apprennent de nouveaux concepts avec vraiment peu d'exemples[^5] ! Voir mon article sur le méta-apprentissage pour une vision plus détaillée de cette famille de méthodes : [A Gentle Introduction to Meta-Learning](../a-gentle-introduction-to-meta-learning/).

[^3]: "L'association des idées est la faculté qu'ont nos idées de s'enchaîner. Rien n'est isolé dans le monde, toutes ses parties s'attirent ; il en est de même de nos idées. L'affinité qui rattache certaines d'entre elles est ce qu'on nomme l'association des idées." (https://fr.wikisource.org/wiki/Cours_de_philosophie/Le%C3%A7on_XXIV._L%27association_des_id%C3%A9es)
[^4]: Nous utilisons en fait la *similarité cosinus* pour une mesure de distance entre deux vecteurs, dérivée du produit scalaire entre deux vecteurs  (voir [The Scaled Dot-Product Attention function](../attention-is-all-you-need/#the-scaled-dot-product-attention-function)). 
[^5]: Snell, Jake et al. “Prototypical Networks for Few-shot Learning.” _NIPS_ (2017).


### L'IA ne consiste pas seulement à raisonner par similarité

*“Alors c'est cela qu'est l'Intelligence Artificielle après tout ?”*

Eh bien oui et non. Le paradigme d'association d'idées est une bonne simplification de l'Intelligence Artificielle pour l'expliquer. Mais en réalité, l'IA est avant tout de la reconnaissance de formes ! Reconnaitre des motifs permet de faire des prédictions (météo, mouvements de la bourse, etc.) ou de classer des images et autres types de données (prévention de fraude, détection de courrier indésirable, tumeur sur une radiographie etc.).

L'Apprentissage Profond et les réseaux de neurones sont un moyen efficace de reconnaître des motifs à grosse échelle (l'image requiert un espace vectoriel de très haute dimensionnalité pour exprimer son contenu). Cependant, ils demandent aussi des quantités astronomiques de données pour apprendre, c'est dû au "Fléau de la dimension"[^6].
Avec les réseaux de neurones, la généralisation $$-$$ la capacité à reconnaître des motifs hors de leurs exemples d'entraînement $$-$$ reste un problème à résoudre. Ces modèles sont entraînés en leur montrant beaucoup d'exemples des archétypes de ce que l'on veut qu'ils comprennent (par exemple des chats et des chiens). Lorsque déployés dans le monde réel, on attend d'eux qu'ils reconnaissent ces archétypes sur des nouveaux exemples qui ne faisaient pas partie de leurs données d'entraînement : c'est tout ce en quoi l'apprentissage consiste !
La famille de méthodes présentée dans [A Gentle Introduction to Meta-Learning](../a-gentle-introduction-to-meta-learning/) aborde ce problème.

Il existe de nombreuses autres méthodes qui relèvent de l'Intelligence Artificielle, ou ce qui devrait plutôt être appelé l'*Apprentissage Machine*. Pour de nombreux défis du monde réel, des méthodes plus simples sont mieux adaptées que les réseaux de neurones. Mais si votre seul outil est un marteau, alors tout problème ressemble à un clou.

[^6]: https://fr.wikipedia.org/wiki/Fl%C3%A9au_de_la_dimension
{% endraw %}
