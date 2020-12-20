var fs = require("fs");
var app = require("./app.js");
var cors = require('cors')
app.use(cors())

var server = require("http").Server(app);
// const io = require('socket.io')(server, {
	// cors: {
		// origin: '*',
	// }
// });

// const io = require('socket.io')(server, {
	// cors: true,
	// origin: ['*', '*:*'],
// });

const io = require('socket.io')(server)

// app.setSocket(io)


io.on('connection', socket => {
	console.log('User connected')
	
	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})



/*
io.on('connection', (socket) => {
	console.log("CLIENT CONNECTED SOCKET connection")
	socket.emit('message', 'connected to server')
	
	socket.on('message', (message) => {
		console.log("Message du client 1")
		console.log(message)
	})
})
.on('connect', (socket) => {
	console.log("CLIENT CONNECTED SOCKET connect")
	socket.emit('message', 'connected to server')
	
	socket.on('message', (message) => {
		console.log("Message du client 2")
		console.log(message)
	})
})
.on('message', (message) => {
	console.log("Message du client SOCKETS")
	console.log(message)
	socket.emit('message', 'connected to server')
})
*/




server.listen(3001);
