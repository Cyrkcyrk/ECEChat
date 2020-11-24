const db = require('./db')
const tokenLib = require('./tokenLib')

module.exports = (app) => {
	app.get('/login', (req, res) => {
		db.login.connect(req.body)
		.then( user => {
			res.json(user)
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
	
	app.get('/checkToken', (req, res) => {
		if(!req.body.token)
			res.status(400).send("bad format (token)")
		else
			tokenLib.check(req.body.token).then(userdata => {
				res.json(userdata)
			})
	})
}