const db = require('./db')

module.exports = (app) => {
	app.get('/users', (req, res) => {
		db.users.list()
		.then( users => {
			res.json(users)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})

	app.post('/user', (req, res) => {
		db.users.create(req.body)
		.then( user => {
			res.status(201).json(user);
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})

	app.get('/user/:id', (req, res) => {
		db.users.get(req.params.id)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
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
		db.users.delete(req.params.id)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})
}