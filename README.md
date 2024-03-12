# rpa-data-collector

### Développeurs :
- Zinédine Ait Aider
- Hugo Mathieu Steinbach
- Lucas Grosjean
- Paul Gsell
- Samuel Darras
- Oussama Bourasse

### Prérequis :
Pour faire fonctionner le projet, assurez-vous d'avoir installé :
- Node.js (20.9.0)
- Docker (25.0.3)
- Angular CLI (17.1)
- NestJS CLI (10.1.18)

### Configuration de la base de données :
Pour lancer la base de données :
1. Créez la base de données en exécutant les commandes suivantes :
```bash
cd backend/scripts
docker-compose up -d # pour lancer la base de données
docker-compose down -v # pour supprimer la base de données
```
Le port par défaut est le 27017.

### Lancement du backend :
Pour lancer le backend :
1. Allez dans le dossier backend.
2. Exécutez la commande `npm install`.
3. Exécutez la commande `npm start`.
4. Le backend est lancé sur le port 3000.

### Lancement du frontend :
Pour lancer le frontend :
1. Allez dans le dossier frontend.
2. Exécutez la commande `npm install`.
3. Exécutez la commande `npm start`.
4. Le frontend est lancé sur le port 4200.

### Utilisation de conteneurs Docker :
Des conteneurs Docker sont disponibles pour le backend, le frontend et la base de données. Pour les lancer, exécutez les commandes suivantes :
```bash
cd server && docker-compose -f docker-compose.yml up
```
Cela construira trois images Docker et lancera les conteneurs correspondants. Ces conteneurs sont utilisés pour le déploiement de l'application.

### Exécution des tests :
Pour exécuter les tests, exécutez la commande `npm run test` dans le dossier backend. Pour exécuter les tests en mode watch, exécutez la commande `npm run test:watch`.
