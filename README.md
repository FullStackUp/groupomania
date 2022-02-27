# I) Pré-requis (VsCode) :

1. Rendez-vous sur : `https://code.visualstudio.com/`
2. Cliquez sur : `Download` (en haut à droite en bleue)
3. Suivez les étapes de l'installation

# II) Pré-requis (NodeJs) :

1. Rendez-vous sur : `https://nodejs.org/fr/download/`
2. Selectionner votre système d'exploitation
3. Suivez les étapes par defaut pour l'installation

# III) Création de la DataBase :

1. Rendez-vous sur la page : `http://localhost:8888//MAMP/`
2. Allez sur l'onglet : `Tools` (en haut à gauche)
3. Cliquez sur : `phpMyAdmin` (ou `http://localhost:8888/phpMyAdmin5/`)

Remarque : si nécessaire créer un compte et installer MAMP pour pouvoir lancer la DataBase

4. Cliquez sur : `Nouvelle base de donnée` (à gauche)
5. Cliquez sur : `Nom de la base de donné`
6. Nommez là : `groupomania`
7. puis cliquez sur : `Créer`

# IV) Pré-requis (projet) :

1. Rendez-vous sur github : `https://github.com/Esheric/P7_02_code.git`
2. Cliquez sur : `Code` (vers la droite de couleur vert)
3. Cliquez sur : `Download ZIP`
4. L'extraire (doit contenir un dossier backend et frontend )
5. Nommez le dossier extrait : `P7_02_code`
6. Allez dans le dossier `backend`(P7_02_code > backend)
7. Supprimer le dossiers `migrations`(P7_02_code > backend > migrations) et son contenu
8. Renommez le dossier `models`(P7_02_code > backend > models) en `copie_models`
9. Renommez le dossier `config`(P7_02_code > backend > config) en `copie_config`

# V) P7_02_code (backend) :

1. Ouvrir `P7_02_code` dans `VsCode`
2. Ouvrir le `terminal`
3. Se rendre dans le dossier `backend` à en tapant `cd backend` puis la touche `entrer` du clavier
4. Tapez (toujours dans le terminal) : `npm install` puis la touche `entrer` du clavier
5. Tapez (toujours dans le termninal et dossier backend) : `npm install --save-dev sequelize-cli` (sans les backtick idem pour la suite des opérations)
6. Tapez (toujours dans le termninal et dossier backend) : `npx sequelize-cli init`

Remarque : 4 nouveaux dossier (`config`, `migrations`, `seeders` et `.models`) sont creer. C'est tout à fait normal qu'il y a un `.` devant le dossier `.models`

7. Rendez-vous rapidement dans le dossier `config` directement en cliquant sur la gauche dans Vscode.
8. remplacer les valeurs par les votres
9. En dessous de `"host": "localhost"` ajouter `"port": "your_port_mamp"`

Remarque : le `"your_port_mamp"`c'est celui de qui figure sur le logiciel `MAMP`(ex:8889)

10. Retourner dans le terminal (encore dans le dossier backend) et tapez : `npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,isAdmin:boolean,imageProfile:string`

Remarque : un ficher model et migration sont créer dans les dossier `migrations`et `.models`

11. toujours dans le terminal (le dossier backend) et tapez : `npx sequelize-cli model:generate --name Post --attributes userId:integer,content:string,imagePost:string,likes:string`

12. toujours dans le terminal (le dossier backend) et tapez : `npx sequelize-cli model:generate --name Comment --attributes postId:integer,userId:integer,content:string`

13. toujours dans le terminal (le dossier backend) et tapez : `npx sequelize-cli model:generate --name Like --attributes postId:integer,userId:integer`

14. Copier et coller tous les contenus des fichier du dossier `copie_models`(l'ancien dossier `models`) c'est-à-dire le contenu de `like.js` dans le nouveau `like.js` du nouveau dossier `.models`.

15. Faire de même pour le `user.js`, `comment.js` et `post.js` (ne pas le faire pour le `index.js` pour le moment)

Remarque : Assurez-vous d'avoir dans le dossier `config` un fichier `config.json`en format `JSON`(.json) et assurez-vous que dans le fichier `index.js`(backend>.models>index.js) que la variable `const config` prend bien le fichier `config.json` au format `JSON` (.json)

16. Toujours dans le terminal (et toujours dans le dossier backend), tapez : `npx sequelize-cli db:migrate`

Remarque : des `Tables`sont créer dans la DataBase `groupomania`.

17. Copiez et coller le contenu du `index.js`(P7_02_code > backend > copie_models >index.js) dans `index.js`(P7_02_code > backend > .models > index.js)

18. Supprimez le dossier `copie_models`

19. Renommez le fichier `config.json`(P7_02_code > backend > config > config.json) en `config.js`

20. Creer un fichier `.env`dans le dossier `config`(P7_02_code > backend > config)

21. Copiez et coller ces 8 donées en ramplaçant les 3 données qui commence par `your_` avec vos valeurs dans le fichier `.env` :

PORT="3000"
DB_USER="your_username_DataBase"
DB_PASSWORD="your_password_DataBase"
DB_NAME="groupomania"
DB_HOST="localhost"
DB_PORT="your_port_mamp "
DB_DIALECT="mysql"
JWT_SECRET_TOKEN="RANDOM_TOKEN"

22. Renommez le dossier `.models`(P7_02_code > backend > .models) en `models`

Remarque : l'API est prête, pour la lancer il suffira de faire `npm start` depuis le terminal dossier `backend`(P7_02_code > backend)

# VI) P7_02_code (frontend) :

1. Se rendre dans le dossier `frontend` (P7_02_code > frontend) à l'aide du terminal(cd frontend) puis taper : `npm install`

Remarque : le front est prêt pour la lancer il suffira de faire `npm run serve` depuis le terminal dossier `frontend` (P7_02_code > frontend)

2. Dans le terminal le lien de l'API est indiquer, normalement c'est : `http://localhost:8080/`

Remarque : Si necessaire il faudra installer la version `^3.0.0`de vue.js en tapant dans le terminal dossier `frontend`(P7_02_code > frontend) : `npm install vue`. Pour plus d'infos se rendre : `https://fr.vuejs.org/v2/guide/installation.html`

# VII) P7_02_code (API) :

1. Permet de `creer` des Users
2. Permet de `voir` le profil du User
3. Permet de `modifier` l'image de profil du User
4. Permet de `supprimer` l'User

Remarque : il se peut que la suppression de l'User creait un bug dans l'API dans ce cas il faut `vider` toutes les `Tables` de la DataBase `groupomania` c'est pour cela que je vous recommande de le faire en dernier recours.

5. Permet de se `connecter` a un User creer
6. Permet de `poster` des publications et commentaires
7. Permet de `poster`une image
8. Permet de `voir` des publications et commentaires
9. Permet de `modifier` des publications
10. Permet de `supprimer` des publications et commentaires
11. Permet de `aimer` des publications et commentaires
12. Permet de `ne pas aimer`des publication et commentaires
13. Permet d'être un `Admin`
14. Le `Admin`peut `modifier`et `supprimer` des publications et commentaires des Users sans qu'on sache que c'est lui.

Remarque: pour avoir un Admin après avoir créer un User il suffit d'aller dans la DataBase `groupomania` puis dans la `Tables` des `Users` editer un `User` dans la partie `isAdmin` remplacer le `0` par `1` puis enregister.

```

```

```

```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
