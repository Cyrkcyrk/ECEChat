const db = require('./db')
const tokenLib = require('./tokenLib')

module.exports = (app) => {
	app.get('/users', (req, res) => {
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d.error)
				}
				else {
					if(!d.value.scope.admin) {
						res.status(401).json({
							"type" : 2,
							"code" : 401,
							"name" : "missingPermission",
							"message" : "You must be an admin to do this."
						})
					}
					else {
						db.users.list()
						.then( users => {
							res.json(users)
						})
						.catch( e => {
							console.error(e);
							res.status(403)
						});
					}
				}
			})
		}
	})
	
	app.get('/usernames', (req, res) => {
		
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d)
				}
				else {
					if(!d.value.scope.admin) {
						res.status(401).json("Scope error: you're not an admin").json({
							"type" : 2,
							"code" : 401,
							"name" : "missingPermission",
							"message" : "You must be an admin to do this."
						})
					}
					else {
						db.users.listUsername()
						.then( users => {
							res.json(users)
						})
						.catch( e => {
							console.error(e);
							res.status(403).json(e)
						});

					}
				}
			})
		}
	})

	app.post('/user', (req, res) => {
		db.users.create(req.body)
		.then( user => {
			res.status(201).json(user);
		})
		.catch( e => {
			if (typeof(e.type) != "undefined" && e.type == 2) {
				console.error(e)
				res.status(e.error).json(e)
			}
			else {
				console.error(e)
				res.status(403).send(e)
			}
		});
	})

	app.get('/user/:id', (req, res) => {
		db.users.get(req.params.id)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			console.error(e);
			res.status(e.code).json(e)
		});
	})

	app.put('/user/:id', (req, res) => {
		db.users.update(req.params.id, req.body)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})
	app.delete('/user/:id', (req, res) => {
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d.error)
				}
				else {
					if(!d.value.scope.admin && d.value.id != req.params.id) {
						res.status(401).json({
							"type" : 2,
							"code" : 401,
							"name" : "missingPermission",
							"message" : "You must be an admin to do this."
						})
					}
					
					else {
						db.users.delete(req.params.id)
						.then( user => {
							res.json(user)
						})
						.catch( e => {
							console.error(e);
							res.status(403)
						});
					}
				}
			})
		}
		
	})
	app.delete('/username/:username', (req, res) => {
		db.users.deleteUsername(req.params.username)
		.then(user => {
			res.json(user)
		})
		.catch(e => {
			console.error(e);
			res.status(403)
		});
	})
	app.delete('/purgeUsers', (req, res) => {
		db.users.purgeUsers()
		.then( _ => {
			res.status(201).json({"status" : "Succes"})
		})
		.catch(e => {
			console.error(e);
			res.status(403)
		});
	})
	
}