const db = require('./db')

module.exports = (app) => {
	app.get('/messages', async (req, res) => {
		const messages = await db.messages.list()
		res.json(messages)
	})

	app.post('/message', async (req, res) => {
		// console.log("Create message");
		try {
			const message = await db.messages.create(req.body);
			res.status(201).json(message);
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})

	app.get('/message/:id', async (req, res) => {
		// console.log("Get message");
		console.log(req.params);
		const message = await db.messages.get(req.params.id);
		console.log(message);
		res.json(message)
	})

	app.put('/message/:id', (req, res) => {
		const message = db.messages.update(req.params.id, req.body)
		res.json(message)
	})
	app.delete('/message/:id', (req, res) => {
		const message = db.messages.delete(req.params.id)
		res.json(message)
	})
}