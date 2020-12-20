# ECEChat
## Description

This project is supposed to be a webchat application, made with React for the front and Node.JS & Express for the back. Unit tests were made with Mocha and Should.js, and storage with LevelDB. 

It was made to learn the base of web development, during our cursus at ECE Paris.

## Before usage

You need to understand before installing / using / reading that code that it was made as a student project. There are fundamental security flaws, either made on purpose to test the code, either because of lack of time to patch them. For example, here is a list of the error we are aware of but didn't had time to fix:

- When creating a new user, you just need to add the attribute `adminPassword : 'adminP4ssword'` to the body of the request to make it a super admin user that have access to all the channels, users, etc. This has been made so unit tests can create a superadmin user.
- There are no limits on the size / type of file you can upload as your avatar picture
- Admin do have the "leave channel" button showing, even if they're not member of the channel (and they have an error alert if they click on it).
- When Admins leave a channel, the channel is deleted from their channel list eventhough they still can access it. They need to refresh the page.
- In order to have all the avatar update when there is a change, we added a `#randomNumber` at the end of the source link, to force react to update the image each time it appear. It work well, but is really intensive as it request the avatar each time. There are probably way around it, but we lacked time to research for these solutions.
- When a user disconnect, its token is only erased locally and still can be used as long as it didn't expired.
- The "last message sent" that is visible on the channel thumbnail doesn't refresh when a user send a new message. The page need to be refreshed so that the last message change.
- The number of messages per channel loaded by the front is currently limited to the last 50 one. It has been thought to load more message as the user load the previous one (with `react-on-screen` package), so the application doesn't fill entirely the user's RAM, but we didn't had enough time to implement it. So we made the limit at 500, for now.

## Instalation instruction

1. Clone that folder
2. Run the command `npm install` on both `backend` and `frontend` folder.

## Usage instructions

### Run unit tests

1. `cd backend`
2. `npm run test`

That should run 100 unit tests made to verify that the backend work well. We tried to be as complete as possible and try every possibilities, and we hope we did, but because of lack of time, we can't garanty that.

### Launch the application
Port 3000 and 3001 need to be free to use. Open a terminal in the folder where you cloned that repo and
1.  `cd backend` 
2. `npm run start` to run the backend
In a second terminal
3. `cd frontend` 
4. `npm run start` to start the front end. It should be accessible at `http://localhost:3000/`.

### Use the application

*More informations can be found  on each part's Readme file.*

## Notes (in french)
Nous pensons avoir remplis la plus grosse majoritée des points demandés dans le barème. Le backend est censé être totalement sécurisé (si ce n'est les failles abordées dans le point *Before Usage*), et un utilisateur ne pourra pas, par exemple, modifier le message d'un autre utilisateur.
### Permissions
#### Utilisateur
- Peut *post* un message dans un channel dont il est (au moins) membre;
- Peut *get* un message d'un channel dont il est (au moins) membre;
- Peut *put* (edit) un message dont il est l'auteur. Il ne pourra pas modifier les messages d'un autre utilisateur. Une sauvegarde des anciens messages (permettant un tracage a chaques edit) aurait été préférable à un simple edit dans la BDD, mais complexifiait grandement la manière de gérer les messages avec laquelle nous avions commencé à travailler. Un tag "*edited*" est cependant ajouté au message;
- Peut *delete* (remove) un message dont il est l'auteur. Le contenus du message n'est pas effacé de la BDD, mais il n'est plus visible par les utilisateurs normaux (remplacé par le texte "*Message deleted.*";
- Peut quitter un channel dont il est membre;
- Peut créer un nouveau channel, dont il sera directement ajouté en tant que "Membre", mais également "Channel Admin"
- Peut changer ses informations personnelles (email, avatar, 
#### Channel Admin
"Le channel" désigne ici le channel ou l'utilisateur est administrateur. Dans les autres channels, il reste un simple membre/utilisateur.
- Peut faire la même chose qu'un utilisateur normale;
- Peut également *delete* (remove) les messages d'autres utilisateurs dans le channel;
- Peut ajouter des membres au channel, via leurs *username* qui est unique;
- Peut exclure un membre du channel via la liste des membres;
- Peut ajouter et retirer d'autres *Channel Admins* via la liste des membres;
#### Super admin
- Peut acceder à tous les channels, qu'il soit membre ou pas;
- Est considéré comme un "channel admin" de tous les channels
- Peut supprimer **et** modifier les messages de n'importe quel utilisateur

### Bucket et images
Acutellement, les images uploads par l'utilisateurs sont stockés dans un dossier du backend (`./public/img/Avatar${userID}`), et ils ne sont pas analysés (taille, type, contenus). Nous avons bien conscience que ce n'est pas idéal, et que les fichiers devraient au moins être limités en taille et type. Nous savons également qu'ils devraient être stockés sur un autre serveur, fait pour le stockage de données utilisateurs (un *bucket* d'images), mais par manque de temps et de connaissance (aucun de nous deux ne sait utiliser les services AWS, qui sont à notre connaissance les seuls gratuits pour les étudiants), nous avons préféré rester sur un stockage local.

### Base de donnée et tests unitaires
Les test unitaires vident complètement la base de donnée de tout historique. Si tous les test se déroulent bien, la base de donnée se retrouve normalement remplie avec 4 utilisateurs, 1 channel, et un echange de messages entre user1 et user2 dans ce channel.  Voici les identifiants et mots de passes des utillisateurs créés
| Username 	|  Password  	|
|:--------:	|:----------:	|
|  `admin` 	|   `admin`  	|
|  `user1` 	| `password` 	|
|  `user2` 	| `password` 	|
| `user3`  	| `password` 	|

### Interface

Le front a été majoritairement développé avec des composants de Material UI. Nous avons tenté une interface similaire à celle du logiciel de discution *Discord*. Un utilisateur peut donc créer un nouveau channel sur la gauche, en bas du panel de channels. Il peut editer et supprimer les messages en cliquant sur les trois points verticaux qui apparaissent au passage de la souris sur un message. Il peut gérer un channel en ouvrant le panel de droite, et gérer ses options utilisateurs en cliquant sur l'icone "utilisateur" en haut a droite. 

### Cahier des charges
Nous pensons avoir répondu a l'entièretée du cahier des charges. Cependant, si nous avons essayé de faire un code le plus clair possible, nous n'avons pas respecté la norme demandé d'AirBNB, car beaucoup trop longue à apprendre dans le temps impartis. Avec une semaine de plus, nous aurions probablement eu le temps d'installer et d'apprendre a utiliser le module Eslint, mais nous avons préféré rendre un projet fonctionnel pas à la norme plutot que risquer de causer un bug dans un code modifié que nous n'aurions pas eu le temps de retester en détail. Nous esperons que les différents bonus (Permissions et emoji picker) permettront de palier à ce soucis.

## Author informations

Cyrille KASYC
cyrille.kasyc@###.ece.fr<br>
ckasyc@#######.42.fr<br>
Student at [ECE Paris.Lyon](https://www.ece.fr/) and [42 Paris](http://42.fr/)

Fanny MARCUCCINI<br>
fanny.marcuccini@###.ece.fr<br>
Student at [ECE Paris.Lyon](https://www.ece.fr/) 
