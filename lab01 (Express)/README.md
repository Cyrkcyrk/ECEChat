# Initiation to Express' route and Mysql.

## Description

This code is an initiation to learn to use the node module Express and Mysql.

## Functionnalitites

- Opening a webserver and allow us to look at users in a database.

## Instalation instruction

1. Clone that folder
2. Run the command `npm install`
3. Add a file name `local.js` that should look like that (edit so it work with your own database) :
```
exports.DB = {
	'HOST' : "localhost",
	'USER' : "root",
	'PSWD' : "",
	'DB'   : "ECE-WebAvance",
	'PORT' : "3306"
}
```
4. Import "database.sql" in your own database.

## Usage instructions

1. Run the command `npm run start` (or `npm start`) whenever you want to launch the webserver. 
2. Open the url [`http://localhost:3000/`](http://localhost:3000/) in the web browser of your choice.
3. Visit page like [`http://localhost:3000/users/2`](http://localhost:3000/users/2) or [`http://localhost:3000/name/Rackam`](http://localhost:3000/name/Rackam) .

## Author informations

Cyrille KASYC   
cyrille.kasyc@###.ece.fr <br>
ckasyc@#######.42.fr <br>
Student at [ECE Paris.Lyon](https://www.ece.fr/) and [42 Paris](http://42.fr/)
