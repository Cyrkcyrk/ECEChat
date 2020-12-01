const db = require('./db')
const middleware = require('./middleware')

module.exports = (app) => {
	app.get('/channels', middleware.admin, (req, res) => {
		db.channels.list().then( channels => {
			res.json(channels);
		});
	})
	.post('/channel', middleware.default, (req, res) => {
		db.channels.create(req.body, req.userData)
		.then( channel => {
			res.status(201).json(channel);
		})
		.catch (e => {
			console.error(e);
			res.status(403).json(e)
		});
	})
	.get('/channel/:id', middleware.channel, (req, res) => {
		if(req.userData.scope.admin || req.channelData.membres.includes(req.userData.id)) 
		{
			db.channels.get(req.params.id).then(channel => {
				console.log(channel);
				res.json(channel)
			})
			.catch (e => {
				console.error(e);
				res.status(403).json(e)
			});
		}
		else {
			res.status(401).json({
				"type" : 2,
				"code" : 401,
				"name" : "missingPermission",
				"message" : "You must be at least member of the channel to do this."
			})
		}
		
	})
	.put('/channel/:id', middleware.admin, (req, res) => {
		db.channels.update(req.params.id, req.body)
		.then( channel => {
			res.json(channel)
		})
		.catch (e => {
			console.error(e);
			res.status(403).json(e)
		});
	})
	.delete('/channel/:id', middleware.channel, (req, res) => {
		if(req.userData.scope.admin || req.channelData.admins.includes(req.userData.id)) 
		{
			db.channels.delete(req.params.id)
			.then(channel => {
				res.json(channel)
			})
			.catch(e => {
				console.error(e);
				res.status(403).json(e)
			});

		}
		else {
			res.status(401).json({
				"type" : 2,
				"code" : 401,
				"name" : "missingPermission",
				"message" : "You must be at least a channel admin to do this."
			})
		}
	})
	.put('/channel/:id/user/:userID', middleware.channel, (req, res) => {
		if(req.userData.scope.admin || req.channelData.admins.includes(req.userData.id) 
			|| !req.channelData.settings.private) {
			db.channels.user.add(req.params.id, req.params.userID, req.body)
			.then( channel => {
				res.json(channel)
			})
			.catch (e => {
				console.error(e);
				res.status(403).json(e)
			});
		}
		else {
			res.status(401).json({
				"type" : 2,
				"code" : 401,
				"name" : "missingPermission",
				"message" : "You must be at least a channel admin to do this."
			})
		}
	})
	.delete('/channel/:id/user/:userID', middleware.channel, (req, res) => {
		
		if(req.userData.scope.admin || req.channelData.admins.includes(req.userData.id) 
			|| req.userData.id === req.params.userID) 
		{
			db.channels.user.remove(req.params.id, req.params.userID, req.body)
			.then(channel => {
				res.json(channel)
			})
			.catch(e => {
				console.error(e);
				res.status(403).json(e)
			});
		}
		else {
			res.status(401).json({
				"type" : 2,
				"code" : 401,
				"name" : "missingPermission",
				"message" : "You must be at least a channel admin to do this."
			})
		}
	})
	
	.put('/channel/:id/admin/:userID', middleware.channel, (req, res) => {
		if(req.userData.scope.admin || req.channelData.admins.includes(req.userData.id)) {
			db.channels.admin.add(req.params.id, req.params.userID, req.body)
			.then( channel => {
				res.json(channel)
			})
			.catch (e => {
				console.error(e);
				res.status(403).json(e)
			});
		}
		else {
			res.status(401).json({
				"type" : 2,
				"code" : 401,
				"name" : "missingPermission",
				"message" : "You must be at least a channel admin to do this."
			})
		}
	})
	.delete('/channel/:id/admin/:userID', middleware.channel, (req, res) => {
		
		if(req.userData.scope.admin || req.channelData.admins.includes(req.userData.id) || req.userData.id == req.params.userID) 
		{
			db.channels.admin.remove(req.params.id, req.params.userID, req.body)
			.then(channel => {
				res.json(channel)
			})
			.catch(e => {
				console.error(e);
				res.status(403).json(e)
			});
		}
		else {
			res.status(401).json({
				"type" : 2,
				"code" : 401,
				"name" : "missingPermission",
				"message" : "You must be at least a channel admin to do this."
			})
		}
	});
}