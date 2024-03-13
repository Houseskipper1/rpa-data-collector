# Organisation des fichiers

## Backend

- **Documents de Configuration**: Tous les documents à la racine sont des documents de configuration.

- **Ressources**: Ce dossier contient les fichiers téléchargés lors de l’initialisation de notre BDD avec l’API SIRENE et BAN. Le principe sera détaillé plus tard dans ce document.

- **Script**: Ce dossier contient un docker-compose pour créer une base de données MongoDB sous Docker en local.

- **Src**: Ce dossier contient l’intégralité du code, divisé en plusieurs parties :

  - **API**: Cette partie englobe les différents services qui font des appels à l'API SIRENE et BAN. Elle gère également l'intégration des fichiers CSV téléchargés depuis SIRENE.

  - **Entreprise**: Cette section contient les schémas d'entités et les contrôleurs nécessaires pour gérer les actions liées aux entreprises dans l'application.

  - **Paramètres**: Cette partie fonctionne de manière similaire à la partie Entreprise, mais elle est dédiée à la gestion des différents paramètres de l'application.

  - **Scraping**: Cette section regroupe toutes les fonctionnalités liées au scraping des entreprises, y compris les méthodes pour récupérer des données depuis Pappers et Societe.com. Bien que cette partie ne soit plus utilisée dans l'application actuelle, elle contient également des services de scraping de sites d'avis (dans un dossier distinct nommé "review") qui ont été utilisés pour des tests. Ces services ne sont pas intégrés à l'application principale car ils ne correspondent pas aux clés de la base de données.

  - **Sirene-Entreprise**: Cette partie concerne les entreprises SIRENE, détaillées plus tard dans le rapport, ainsi que des codes NAF. Elle inclut les contrôleurs et autres fichiers nécessaires au bon fonctionnement et à l'organisation du projet Nest.

## Frontend

# Structure du Projet

Dans la structure du projet, plusieurs fichiers de configuration sont présents à la racine, tels que ceux pour Angular, Tailwind CSS, ainsi que les fichiers nécessaires à la création de conteneurs Docker pour le serveur.

Le dossier `src` contient également l'intégralité du code de l'application frontend, avec `main.ts` comme point d'entrée à la racine de ce dossier. Dans le dossier `app`, on retrouve principalement le fichier définissant les différentes routes de l'application.

Les différents composants (`components`) correspondent aux différentes parties que nous assemblons dans notre application.

Le dossier `shared` regroupe les divers types correspondant aux entités de notre backend, ainsi que les services qui permettent de les consommer.

Enfin, le dossier `environments` contient les différentes variables d'environnement. Il convient de noter qu'elles sont poussées sur Git, mais à terme, il faudra les retirer si elles contiennent des variables sensibles.

# Fonctionnement de l'application en local

Une fois le frontend et le backend lancé en parallèle de la base de données MongoDB, on peut accéder à l’application (en local) en suivant ce lien : [https://localhost:4200](https://localhost:4200). On peut également accéder au Swagger de l’API en suivant ce lien : [http://localhost:3000/api](http://localhost:3000/api). On peut donc effectuer les différentes requêtes depuis Postman ou d'autres applications frontend.

L'application se présente principalement en 4 pages :

1. La liste des entreprises Sirene ([http://localhost:4200/sireneEntreprises](http://localhost:4200/sireneEntreprises)) :

   Elle présente une liste d'entreprises récupérées sur le CSV de SIRENE. Pour que le chargement soit possible et rapide, seulement 1000 entreprises sont récupérées et affichées.

   Chaque entreprise dispose d’un bouton permettant de l’afficher ou de forcer un scraping. Si on clique sur "Voir", alors l’application essaiera dans un premier temps de charger les données déjà présentes dans la base de données. Si le dernier scraping est trop vieux ou si l’on force le scraping, alors l’application backend effectuera un nouveau scraping de l’entreprise concernée.

2. La seconde page regroupe sous le même format la même liste, mais cette fois-ci uniquement avec les entreprises déjà scrappées ([http://localhost:4200/scrapingEntreprises](http://localhost:4200/scrapingEntreprises)).

3. La troisième page permet de saisir une entreprise et une distance et de récupérer la liste des entreprises dans cette même zone ([http://localhost:4200/sireneEntreprisesSearch](http://localhost:4200/sireneEntreprisesSearch)). Ici les résultats pour une recherche aux alentours de Nancy.

   Là encore, la liste permet de scraper ou de voir les différentes entreprises. Au-dessus, un nouveau bouton apparaît “Récupérer”, et permet de scraper la liste des entreprises récupérées en dessous. Cependant, un problème survient suite à l’utilisation du scraping.

4. La dernière page présente les différents paramètres de scraping et permet de les régler (changer les temps).

De plus, sur la page d'accueil, un bouton “export JSON” est disponible pour extraire l’intégralité des données sur les entreprises scrapées au format JSON.

# Fonctionnement de l'application sur le serveur

Actuellement, le déploiement de l'application sur le serveur nécessite de copier le contenu du dépôt Git sur le serveur, suivi de l'exécution du docker-compose. Cependant, cette méthode a posé des problèmes de place, ce qui a nécessité le remplissage de la base de données à distance.

Bien que cette approche fonctionne, elle n'est pas optimale et présente des inconvénients en termes de gestion et de scalabilité. Toutefois, en raison de contraintes techniques et de contraintes de temps, nous avons dû l'adopter temporairement.

Pour améliorer le fonctionnement du serveur, plusieurs pistes à envisager sont décrites dans la section suivante.

- La BDD MongoDB : [http://51.68.95.251:27020/](http://51.68.95.251:27020/)
- Le Backend NestJS : [http://51.68.95.251:3020/](http://51.68.95.251:3020/)
- La documentation Swagger : [http://51.68.95.251:3020/api](http://51.68.95.251:3020/api)
- Le frontend Angular : [http://51.68.95.251:4220/](http://51.68.95.251:4220/)

# Perspectives d'améliorations à envisager pour l'application

Comme discuté précédemment, plusieurs pistes d'amélioration doivent être envisagées. Tout d'abord, il serait judicieux d'explorer des solutions permettant de contourner les limitations persistantes du scraping, telles que l'utilisation de proxies ou simplement l'intégration d'APIs lorsque disponibles.

En outre, il est crucial d'intensifier les tests au sein de l'application et d'optimiser certains aspects du code pour garantir sa fiabilité et ses performances.

En ce qui concerne la mise en place d'une chaîne de déploiement automatique, un premier pas a été franchi avec la création d'images et de conteneurs. Cependant, pour une gestion plus aisée des mises à jour depuis le serveur, il serait préférable de les héberger directement sur Docker Hub ou une autre plateforme similaire, et d'adapter en conséquence le docker-compose.

De plus, il est impératif de résoudre le problème de taille du serveur. Bien qu'un nouveau disque soit disponible, il n'est actuellement pas utilisé, ce qui entrave le fonctionnement de l'application (notamment Puppeteer qui ne peut pas créer son cache, empêchant ainsi le scraping lorsque le serveur est saturé).

Ces améliorations permettront d'optimiser le fonctionnement de l'application, d'améliorer sa stabilité et sa scalabilité, tout en assurant une gestion plus efficace des ressources serveur.
