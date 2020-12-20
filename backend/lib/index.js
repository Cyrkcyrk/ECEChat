var fs = require("fs");
var app = require("./app.js");

var server = require("http").createServer(app);

server.listen(3001);
