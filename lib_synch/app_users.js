const db = require('./db')

module.exports = (app) => {
	app.get('/users', async (req, res) => {
		try {
			const users = await db.users.list()
			res.json(users)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})

	app.post('/user', async (req, res) => {
		try {
			const user = await db.users.create(req.body);
			res.status(201).json(user);
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})

	app.get('/user/:id', async (req, res) => {
		try {
			const user = await db.users.get(req.params.id);
			res.json(user)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})

	app.put('/user/:id', (req, res) => {
		try {
			const user = db.users.update(req.params.id, req.body)
			res.json(user)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})
	app.delete('/user/:id', (req, res) => {
		try {
			const user = db.users.delete(req.params.id)
			res.json(user)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})
}