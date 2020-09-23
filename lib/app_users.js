const db = require('./db')

module.exports = (app) => {
	app.get('/users', async (req, res) => {
		const users = await db.users.list()
		res.json(users)
	})

	app.post('/user', async (req, res) => {
		// console.log("Create user");
		try {
			const user = await db.users.create(req.body);
			res.status(201).json(user);
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})

	app.get('/user/:id', async (req, res) => {
		// console.log("Get user");
		console.log(req.params);
		const user = await db.users.get(req.params.id);
		console.log(user);
		res.json(user)
	})

	app.put('/user/:id', (req, res) => {
		const user = db.users.update(req.params.id, req.body)
		res.json(user)
	})
	app.delete('/user/:id', (req, res) => {
		const user = db.users.delete(req.params.id)
		res.json(user)
	})
}