const tokenLib = require('./tokenLib')
const db = require('./db')


let middleware = {
	admin : (req, res, next) => {
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d.error)
				}
				else {
					db.users.get(d.value.id).then(user => {
						if(!user.scope.admin) {
							res.status(401).json({
								"type" : 2,
								"code" : 401,
								"name" : "missingPermission",
								"message" : "You must be an admin to do this."
							})
						}
						else {
							req.userData = user
							next()
						}
					})
				}
			})
		}
	},
	adminOrSelf : (req, res, next) => {
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d.error)
				}
				else {
					db.users.get(d.value.id).then(user => {
						if(!user.scope.admin && user.id != req.params.id) {
							res.status(401).json({
								"type" : 2,
								"code" : 401,
								"name" : "missingPermission",
								"message" : "You must be an admin to do this."
							})
						}
						else {
							req.userData = user
							next()
						}

					})
				}
			})
		}
	},
	default : (req, res, next) => {
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d.error)
				}
				else {
					db.users.get(d.value.id).then(user => {
						req.userData = user
						next()
					})
				}
			})
		}
	},
	channel : (req, res, next) => {
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d.error)
				}
				else {
					db.channels.get(req.params.id).then(channel => {
						db.users.get(d.value.id).then(user => {
							req.userData = user
							req.channelData = channel
							next()
						})
						.catch (e => {
							if (typeof(e.type) != "undefined" && e.type == 2)
								res.status(e.code).json(e)
							else 
								res.status(403).json(e)
						});
					})
					.catch (e => {
						if (typeof(e.type) != "undefined" && e.type == 2)
							res.status(e.code).json(e)
						else 
							res.status(403).json(e)
					});
				}
			})
		}
	},
	
	message : (req, res, next) => {
		if(typeof(req.body.token) == "undefined") {
			res.status(400).json({
				"type" : 2,
				"code" : 400,
				"name" : "missingToken",
				"message" : "Missing token"
			})
		}
		else {
			tokenLib.check(req.body.token).then(d => {
				if (!d.status) {
					res.status(401).json(d.error)
				}
				else {
					db.messages.get(req.params.id).then(channel => {
						db.users.get(d.value.id).then(user => {
							req.userData = user
							req.messageData = channel
							next()
						})
						.catch (e => {
							if (typeof(e.type) != "undefined" && e.type == 2)
								res.status(e.code).json(e)
							else 
								res.status(403).json(e)
						});
					})
					.catch (e => {
						if (typeof(e.type) != "undefined" && e.type == 2)
							res.status(e.code).json(e)
						else 
							res.status(403).json(e)
					});
				}
			})
		}
	},
	
	
}

module.exports = middleware