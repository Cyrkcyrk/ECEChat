
const db = require('./db')
const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({extended: false}));

app.get('/', (req, res) => {
	console.log("GET ROOT")
	res.send([
		'<h1>ECE DevOps Chat GET</h1>'
	].join(''))
})
.put('/', (req, res) => {
	console.log("PUT ROOT")
	res.send([
	'<h1>ECE DevOps Chat PUT</h1>'
	].join(''))
})
.delete('/', (req, res) => {
	console.log("DELETE ROOT")
	res.send([
		'<h1>ECE DevOps Chat DELETE</h1>'
	].join(''))
})
.post('/', (req, res) => {
	console.log("POST ROOT")
	res.send([
		'<h1>ECE DevOps Chat POST</h1>'
	].join(''))
})


require("./app_channels.js")(app)
require("./app_messages.js")(app)
require("./app_users.js")(app)
require("./app_login.js")(app)


app.get('/clear', async (req, res) => {
	db.admin.clear()
	.then ( _ => {
		res.json({"status": "success"})
	})
	.catch( e => {
		console.error(e)
		res.status(403)
	})
})

.get('/populate', (req, res) => {
	db.admin.populate()
	.then ( data => {
		res.json(data)
	})
	.catch( e => {
		console.error(e)
		res.status(403).json(e)
	})
})

module.exports = app
