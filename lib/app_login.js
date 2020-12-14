const db = require('./db')
const tokenLib = require('./tokenLib')

module.exports = (app) => {
	app.get('/login', (req, res) => {
		console.log("USER CONNECT GET")
		// console.log(req)
		console.log(req.body)
		db.login.connect(req.body)
		.then( token => {
			res.json(token)
		})
		.catch( e => {
			if (typeof(e.type) != "undefined" && e.type == 2) {
				res.status(e.code).json(e)
			}
			else {
				console.error(e);
				res.status(403).send(e)
			}
		});
	})
	.post('/login', (req, res) => {
		console.log("USER CONNECT POST")
		console.log(req.body)
		db.login.connect(req.body)
		.then( token => {
			res.json(token)
		})
		.catch( e => {
			if (typeof(e.type) != "undefined" && e.type == 2) {
				res.status(e.code).json(e)
			}
			else {
				console.error(e);
				res.status(403).send(e)
			}
		});
	})
	.get('/checkToken', (req, res) => {
		if(!req.body.token)
			res.status(400).send("bad format (token)")
		else
			tokenLib.check(req.body.token).then(userdata => {
				res.json(userdata)
			})
	})
}