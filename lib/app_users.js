const db = require('./db')
const middleware = require('./middleware')

module.exports = (app) => {
	app.get('/users', middleware.admin, (req, res) => {
		db.users.list()
		.then( users => {
			res.json(users)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})
	
	app.get('/usernames', middleware.admin, (req, res) => {
		db.users.listUsername()
		.then( users => {
			res.json(users)
		})
		.catch( e => {
			console.error(e);
			res.status(403).json(e)
		});
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

	app.put('/user/:id', middleware.admin, (req, res) => {
		db.users.update(req.params.id, req.body)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})
	app.delete('/user/:id', middleware.adminOrSelf, (req, res) => {
		db.users.delete(req.params.id)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})
	app.delete('/username/:username', middleware.admin, (req, res) => {
		db.users.deleteUsername(req.params.username)
		.then(user => {
			res.json(user)
		})
		.catch(e => {
			console.error(e);
			res.status(403)
		});
	})
	
}