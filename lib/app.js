
const db = require('./db')
const express = require('express')
const app = express()

app.use(require('body-parser').json())

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
})

require("./app_channels.js")(app);
require("./app_messages.js")(app);
require("./app_users.js")(app);
require("./app_login.js")(app);


app.get('/clear', async (req, res) => {
	db.admin.clear()
	.then ( _ => {
		res.json({"status": "success"})
	})
	.catch( e => {
		console.error(e);
		res.status(403)
	})
	
})

module.exports = app
