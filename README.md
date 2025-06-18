# Guide de déploiement Vue/React sur BrightSign

Ce guide détaille les étapes pour publier un projet Vue ou React sur un dispositif BrightSign.

## Préparation du projet

### 1. Build du projet Vue/React
```bash
npm run build
```

### 2. Récupération des fichiers de build
- Copier le contenu du dossier `dist` généré par la commande build

## Configuration du repository BrightSign

### 3. Préparation du repository bixie-node
- Récupérer le repository `bixie-node`
- Coller le contenu du dossier `dist` dans le dossier `client` du repository

## Configuration dans BrightAuthor:Connected

### 4. Création d'une nouvelle présentation
- Ouvrir BrightAuthor:Connected (BA:Connected)
- Créer une nouvelle présentation avec un nom de projet aléatoire
- **Destination** : Sélectionner `SD Card`
- **Type de projet** : Choisir `Node.js`

### 5. Configuration du projet Node.js
- Pointer la source du projet vers le fichier `bundle.js`
- Cliquer sur `Start` pour initialiser le projet

### 6. Ajout du widget HTML5
- Glisser/déposer un **widget HTML5** dans la zone principale de la présentation
- Dans la configuration du widget :
  - Paramétrer l'URL vers : `http://localhost:9090`

### 7. Publication
- Cliquer sur **Publier** pour finaliser le déploiement

## Résumé des étapes

1. ✅ Build du projet (`npm run build`)
2. ✅ Copie du contenu de `dist`
3. ✅ Intégration dans `bixie-node/client`
4. ✅ Création de présentation BA:Connected
5. ✅ Configuration Node.js avec `bundle.js`
6. ✅ Ajout widget HTML5 (`http://localhost:9090`)
7. ✅ Publication

---

*Ce processus permet de déployer efficacement des applications Vue.js ou React sur des dispositifs BrightSign via BrightAuthor:Connected.*
