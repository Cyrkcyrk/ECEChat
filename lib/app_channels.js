const db = require('./db')

module.exports = (app) => {
	app.get('/channels', (req, res) => {
		db.channels.list().then( channels => {
			res.json(channels);
		});
	})
	.post('/channel', (req, res) => {
		db.channels.create(req.body)
		.then( channel => {
			res.status(201).json(channel);
		})
		.catch (e => {
			console.error(e);
			res.status(403)
		});
	})
	.get('/channel/:id', (req, res) => {
		db.channels.get(req.params.id).then(channel => {
			console.log(channel);
			res.json(channel)
		})
		.catch (e => {
			console.error(e);
			res.status(403)
		});
	})
	.put('/channel/:id', (req, res) => {
		db.channels.update(req.params.id, req.body)
		.then( channel => {
			res.json(channel)
		})
		.catch (e => {
			console.error(e);
			res.status(403)
		});
	})
	.delete('/channel/:id', (req, res) => {
		db.channels.delete(req.params.id)
		.then(channel => {
			res.json(channel)
		})
		.catch(e => {
			console.error(e);
			res.status(403)
		});
	});
}