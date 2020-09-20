var express = require('express');
var fs = require("fs");
var render_readme = require('render-readme');
var app = express();
var server = require("http").createServer(app);

var mysql = require("mysql");
var local = require("./local.js");

console.log(local.DB);

let con = mysql.createConnection({
	host: local.DB["HOST"],
	user: local.DB["USER"],
	password: local.DB["PSWD"],
	database: local.DB["DB"],
	port: local.DB["PORT"]
});

app.get('/', function (req, res) {
	fs.readFile('./README.md', 'utf8', function(err, contents) {
		if(err) {
			res.writeHead(403, {'Content-Type': 'text/json'});
			res.write(JSON.stringify(err));
			res.end();
		}
		else {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(render_readme(contents));
			res.end();
		}
		console.log(contents);
	});
})
.get('/users/:id(\\d+)', function (req, res) {
	let response = {"page" : "name", "parameters" : req.params };
	
	let query = con.query("SELECT * FROM `users` WHERE `id` = ?",[
		req.params.id
	], function (err, result) {
		if (err) {
			console.log(query.sql)
			response["error"] = err;
			res.send(JSON.stringify(response));
		}
		else {
			response["result"] = result;
			res.send(JSON.stringify(response));
		}
	});
})

.get('/name/:name(\\S+)', function (req, res) {
	let response = {"page" : "name", "parameters" : req.params };
	let query = con.query("SELECT * FROM `users` WHERE `first_name` LIKE ? OR `last_name` LIKE ?", [
		"%" + req.params.name + "%",
		"%" + req.params.name + "%"
	], function (err, result) {
		if (err) {
			console.log(query.sql)
			response["error"] = err;
			res.send(JSON.stringify(response));
		}
		else {
			response["result"] = result;
			res.send(JSON.stringify(response));
		}
	});
})

.use(function (req, res) {
	res.redirect("/");
});

server.listen(3000);
