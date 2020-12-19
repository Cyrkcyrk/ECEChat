
const db = require('./db')
const express = require('express')
var cors = require('cors')
var path = require('path')

const app = express()

app.use(cors())
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, '../public/')));
console.log()

app.get('/', (req, res) => {
	console.log("GET ROOT")
	res.send([
		'<h1>ECE DevOps Chat GET</h1>'
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
