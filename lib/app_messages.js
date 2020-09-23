const db = require('./db')

module.exports = (app) => {
	app.get('/messages', async (req, res) => {
		try {
			const messages = await db.messages.list()
			res.json(messages)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
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
		try {
			const message = await db.messages.get(req.params.id);
			res.json(message)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})

	app.put('/message/:id', (req, res) => {
		try {
			const message = db.messages.update(req.params.id, req.body)
			res.json(message)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})
	app.delete('/message/:id', (req, res) => {
		try {
			const message = db.messages.delete(req.params.id)
			res.json(message)
		} catch (e) {
			console.error(e);
			res.status(403)
		}
	})
}