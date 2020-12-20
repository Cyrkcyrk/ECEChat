const db = require('./db')
const middleware = require('./middleware')

module.exports = (app) => {
	app.get('/messages', middleware.admin, (req, res) => {
		db.messages.list()
		.then( messages => {
			res.json(messages)
		})
		.catch (e => {
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		})
	})

	app.post('/message', middleware.default, (req, res) => {
		if(typeof(req.body.channelID) == "undefined" && (typeof(req.body.channel) == "undefined" 
			|| (typeof(req.body.channel) != "undefined" && typeof(req.body.channel.id) == "undefined")))
			{
				res.status(400).json({
					"type" : 2,
					"code" : 400,
					"name" : "missingChannel",
					"message" : "Invalid body (Please send {\'channel\' : \'AAAA-BBBB-CCCC-DDDD\'}}"
				});
			}
		else {
			let channelID = "";
			if(typeof(req.body.channelID) != "undefined")
				channelID = req.body.channelID
			else
				channelID = req.body.channel.id
			db.channels.get(channelID).then(channel => {
				if(req.userData.scope.admin || channel.members.includes(req.userData.id)) {
					db.messages.create(req.body, req.userData.id, channel.id)
					.then( channel => {
						
						if(app.io) {
							try {
								app.io.sockets.emit('newMessage', { channelID : channelID, messageID : message.id})
							}catch (e) {
								console.error("Error socket")
								console.error(e)
							}
							
						}
						
						res.status(201).json(channel);
					})
					.catch (e => {
						if (typeof(e.type) != "undefined" && e.type == 2)
							res.status(e.code).json(e)
						else 
							res.status(403).json(e)
					});
				}
				else {
					res.status(401).json({
						"type" : 2,
						"code" : 401,
						"name" : "missingPermission",
						"message" : "You must be at least a members of the channel to do this."
					})
				}
			})
			.catch (e => {
				if (typeof(e.type) != "undefined" && e.type == 2)
					res.status(e.code).json(e)
				else 
					res.status(403).json(e)
			});
		}
	})

	app.get('/message/:id', middleware.message, (req, res) => {
		db.channels.get(req.messageData.channelID).then(channel => {
			if(req.userData.scope.admin)
				db.messages.getAdmin(req.messageData.id).then(message => {
					res.json(message)
				})
				.catch (e => {
					// console.error(e)
					if (typeof(e.type) != "undefined" && e.type == 2)
						res.status(e.code).json(e)
					else 
						res.status(403).json(e)
				})
				
			else if (channel.members.includes(req.userData.id)) {
				db.messages.getUser(req.messageData.id).then(message => {
					res.json(message)
				})
				.catch (e => {
					// console.error(e)
					if (typeof(e.type) != "undefined" && e.type == 2)
						res.status(e.code).json(e)
					else 
						res.status(403).json(e)
				})
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
		.catch (e => {
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		})
	})

	app.put('/message/:id', middleware.message, (req, res) => {
		if(req.userData.scope.admin || req.messageData.author == req.userData.id)
		{
			if(typeof(req.body.content) == "undefined") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingContent",
					"message" : "Invalid message (content)"
				})
			}
			else if (req.messageData.deleted && !req.userData.scope.admin)
				reject({
					"type" : 2,
					"code" : 403,
					"name" : "messageRemoved",
					"message" : "You can't edit a removed message."
				})
			else {
				db.messages.edit(req.params.id, req.body.content)
				.then( message => {
					res.json(message)
				})
				.catch (e => {
					// console.error(e)
					if (typeof(e.type) != "undefined" && e.type == 2)
						res.status(e.code).json(e)
					else 
						res.status(403).json(e)
				})
			}
		}
		else {
			res.status(401).json({
				"type" : 2,
				"code" : 401,
				"name" : "missingPermission",
				"message" : "You must be at least admin of the channel to do this."
			})
			
		}
	})
	
	app.delete('/message/:id', middleware.message, (req, res) => {
		if(req.userData.scope.admin || req.messageData.author == req.userData.id)
		{
			db.messages.remove(req.params.id)
			.then( message => {
				if(!req.userData.scope.admin)
					message.content = "Message deleted."
				res.json(message)
			})
			.catch (e => {
				// console.error(e)
				if (typeof(e.type) != "undefined" && e.type == 2)
					res.status(e.code).json(e)
				else 
					res.status(403).json(e)
			});
		}
		else {
			db.channels.get(req.messageData.channelID).then(channel => {
				if(channel.admins.includes(req.userData.id)) {
					db.messages.remove(req.params.id)
					.then( message => {
						message.content = "Message deleted."
						res.json(message)
					})
					.catch (e => {
						// console.error(e)
						if (typeof(e.type) != "undefined" && e.type == 2)
							res.status(e.code).json(e)
						else 
							res.status(403).json(e)
					})
				}
				else {
					res.status(401).json({
						"type" : 2,
						"code" : 401,
						"name" : "missingPermission",
						"message" : "You must be at least admin of the channel to do this."
					})
				}
			})
			.catch (e => {
				if (typeof(e.type) != "undefined" && e.type == 2)
					res.status(e.code).json(e)
				else 
					res.status(403).json(e)
			})
		}
	})
}