# Guide de Déploiement : Doctic-Care sur cPanel

Votre projet est une application hybride : **Vite (Frontend)** + **Express (Backend)**.
Le backend (`server.js`) sert l'API **ET** les fichiers statiques du frontend (dossier `dist`).

Voici le "Bon Chemin" adapté spécifiquement à votre structure pour éviter les erreurs 500 et les pages blanches.

## 1. Préparation Locale (CRITIQUE)

Contrairement à un simple site HTML, vous devez **construire** le frontend avant de déployer. cPanel ne doit pas exécuter `vite build`.

1.  **Nettoyer et Construire** :
    ```bash
    # Dans votre terminal local
    npm run build
    ```
    > Cela va créer un dossier `dist` optimisé. Ce dossier est INDISPENSABLE.

2.  **Vérification** :
    Assurez-vous que le dossier `dist` contient `index.html` et des fichiers JS/CSS.

## 2. Fichiers à Transférer

Ne transférez PAS tout votre ordinateur. Voici ce qui doit aller sur le serveur (via FTP ou Gestionnaire de fichiers) :

*   [x] `dist/` (Le dossier entier que vous venez de créer)
*   [x] `server.js` (Votre backend API + Serveur Web)
*   [x] `app.js` (Le point d'entrée pour cPanel/Passenger)
*   [x] `package.json` (Pour les dépendances)
*   [x] `.env` (Vos clés secrètes - créez-le sur le serveur si besoin)

> **NE PAS Transférer** : `node_modules` (on l'installera sur le serveur), `.git`, `src` (inutile en prod), `vite.config.ts`.

## 3. Configuration cPanel ("Setup Node.js App")

1.  **Créer l'application** :
    *   **Node.js Version** : 18.x ou 20.x (Recommandé).
    *   **Application Mode** : `Production`.
    *   **Application Root** : `/home/votreuser/doctic` (ou le dossier où vous avez mis les fichiers).
    *   **Application URL** : `doctic.cloudindustrie.com`.
    *   **Application Startup File** : `app.js` (C'est très important, car `app.js` appelle `server.js`).

2.  **Installer les dépendances** :
    *   Une fois l'app créée, cliquez sur le bouton "Run NPM Install".
    *   Cela va créer le dossier `node_modules` sur le serveur.

3.  **Variables d'Environnement** :
    *   Ajoutez vos variables dans l'interface cPanel (pas seulement dans `.env`) si possible, ou assurez-vous que `.env` est bien lu.
    *   `STRIPE_SECRET_KEY` = `...`
    *   `NODE_ENV` = `production`

## 4. Corrections Apportées (Automatiques)

J'ai déjà effectué deux corrections importantes dans votre code pour que cela fonctionne :

1.  **`package.json`** : Ajout du script `"start": "node server.js"`.
2.  **`server.js`** : Suppression d'un bloc de code en double qui provoquait des erreurs (tentative de lancer le serveur deux fois).

## 5. Dépannage (Si erreur 500)

*   **Logs** : Regardez le fichier `stderr.log` dans le dossier de l'app sur cPanel.
*   **Passenger** : Si Passenger ne démarre pas, créez ou vérifiez le fichier `.htaccess` généré par cPanel. Il doit pointer vers le gestionnaire Node.js.
*   **Port** : Ne forcez pas le port. `server.js` utilise `process.env.PORT` par défaut, ce qui est correct pour Passenger.

---

**Résumé** :
1. `npm run build` (Local)
2. Upload `dist`, `server.js`, `app.js`, `package.json`
3. cPanel -> Create App -> NPM Install -> Restart.
