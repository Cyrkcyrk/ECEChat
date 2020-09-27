const db = require('./db')

module.exports = (app) => {
	app.get('/messages', (req, res) => {
		db.messages.list()
		.then( messages => {
			res.json(messages)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})

	app.post('/message', (req, res) => {
		db.messages.create(req.body)
		.then( message =>{
			res.status(201).json(message);
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		})
	})

	app.get('/message/:id', (req, res) => {
		db.messages.get(req.params.id)
		.then( message => {
			res.json(message)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		})
	})

	app.put('/message/:id', (req, res) => {
		db.messages.update(req.params.id, req.body)
		.then( message => {
			res.json(message)
		})
		.catch ( e => {
			console.error(e);
			res.status(403)
		});
	})
	app.delete('/message/:id', (req, res) => {
		 db.messages.delete(req.params.id)
		.then( message => {
			res.json(message)
		})
		.catch( e => {
			console.error(e);
			res.status(403)
		});
	})
}