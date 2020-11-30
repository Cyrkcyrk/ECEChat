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
					if(!d.value.scope.admin) {
						res.status(401).json({
							"type" : 2,
							"code" : 401,
							"name" : "missingPermission",
							"message" : "You must be an admin to do this."
						})
					}
					else {
						req.userData = d.value
						next()
					}
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
					if(!d.value.scope.admin && d.value.id != req.params.id) {
						res.status(401).json({
							"type" : 2,
							"code" : 401,
							"name" : "missingPermission",
							"message" : "You must be an admin to do this."
						})
					}
					else {
						req.userData = d.value
						next()
					}
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
					req.userData = d.value
					next()
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
						req.userData = d.value
						req.channelData = channel
						next()
					})
				}
			})
		}
	}
}

module.exports = middleware