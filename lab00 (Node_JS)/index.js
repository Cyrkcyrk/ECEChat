var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require("fs");
var app = express();
var server = require("http").createServer(app);

var handles = require("./handles.js").serverHandle(app);

server.listen(8080);
 