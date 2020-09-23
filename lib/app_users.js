const db = require('./db')

module.exports = (app) => {
	app.get('/channels', async (req, res) => {
		const channels = await db.channels.list()
		res.json(channels)
	})

	app.post('/channel', async (req, res) => {
		// console.log("Create channel");
		try {
			const channel = await db.channels.create(req.body);
			res.status(201).json(channel);
		} catch (e) {
			console.error(e);
			res.status(301)
		}
	})

	app.get('/channel/:id', (req, res) => {
		// console.log("Get channel");
		const channel = db.channels.get(req.body)
		res.json(channel)
	})

	app.put('/channel/:id', (req, res) => {
		// console.log("Put channel");
		const channel = db.channels.update(req.body)
		res.json(channel)
	})
}