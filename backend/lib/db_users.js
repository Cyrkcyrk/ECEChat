const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const bcrypt = require('bcrypt');
const saltRounds = 10;

let db_users = {
	create: (userData, db) => {
		return new Promise((resolve, reject) => {
			if(typeof(userData.username) == "undefined") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingUsername",
					"message" : "Invalid user (username)"
				});
			}
			else if(typeof(userData.password) == "undefined") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingPassword",
					"message" : "Invalid user (password)"
				});
			}
			else {
				id = uuid()
				db_users.getIDFromUsername(userData.username, db)
				.then( (_) => {
					reject({
						"type" : 2,
						"code" : 409,
						"name" : "conflictUsername",
						"message" : "This username already exist"
					});
				}).catch (e => {
					if (typeof(e.type) != "undefined" && e.type == 2 && e.name == "unknownUser") {
						let buff = new Buffer.from(userData.username)
						let loginKey = buff.toString('base64')
						db.put(`usernames:${loginKey}`, JSON.stringify({"userID" : id}), function(err){
							if(err) 
								reject({
									"type" : 1,
									"error" : err
								});
							
							bcrypt.hash(userData.password, saltRounds, function(err, hash) {
								
								let user = {
									username : 			userData.username,
									email : 			"",
									hashedPassword : 	hash,
									channels :		[],
									createdAt :	Date.now() + "",
									avatar : {
										type : "Gravatar",
										link : null,
										nb : 0
									}
								}

								let adminStatus = false
								if(typeof(userData.adminPassword) != "undefined" && userData.adminPassword == "adminP4ssword") {
									adminStatus = true
								}
								user.scope = {
									"user"  : true,
									"test"  : true,
									"admin" : adminStatus
								}
								
								if(userData.email)
									user.email = userData.email
								
								db.put(`users:${id}`, JSON.stringify(user), function(err){
									if(err) 
										reject({
											"type" : 1,
											"error" : err
										})
									delete user.hashedPassword
									delete user.email
									resolve(merge(user, {id: id}))
								});

							});
						});
					}
					else
						reject(e);
				})
			}
		})
	},
	list : (db) => {
		return new Promise( (resolve, reject) => {
			 const users = []
			 db.createReadStream({
				 gt: "users:",
				 lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
			 })
			 .on( 'data', ({key, value}) => {
				 user = JSON.parse(value)
				 user.id = key.substring([..."users:"].length)
				 delete user.hashedPassword
				 delete user.email
				 users.push(user)
			 })
			 .on( 'error', (err) => {
				 reject({
					 "type" : 1,
					 "error" : err
				 })
			 })
			 .on( 'end', () => {
				 resolve(users)
			 })
		})
	},
	listUsername : (db) => {
		return new Promise( (resolve, reject) => {
			 const users = []
			 db.createReadStream({
				 gt: "usernames:",
				 lte: "usernames" + String.fromCharCode(":".charCodeAt(0) + 1),
			 })
			 .on( 'data', ({key, value}) => {
				 user = JSON.parse(value)
				 user.id = key.substring([..."usernames:"].length)
				 users.push(user)
			 })
			 .on( 'error', (err) => {
				 reject({
					"type" : 1,
					"error" : err
				 })
			 })
			 .on( 'end', () => {
				 resolve(users)
			 })
		})
	},
	getLogged: (id, db) => {
		return new Promise ((resolve, reject) => {
			db.get(`users:${id}`, function(err, result) {
				if (err) {
					if(err.notFound)
						reject({
							"type" : 2,
							"code" : 404,
							"name" : "unknownUser",
							"message" : "Couldn't find the user in the database"
						})
					else
						reject({
							"type" : 1,
							"error" : err
						})
				}
				else {
					result = JSON.parse(result);
					result["id"] = id;
					delete result.hashedPassword
					resolve(result);
				}
			})
		})
	},
	get: (id, db) => {
		return new Promise ((resolve, reject) => {
			db_users.getLogged(id, db).then(user => {
				delete user.email
				resolve(user)
			})
			.catch (e => {
				reject(e)
			})
		})
	},
	
	getFromUsername: (username, db) => {
		return new Promise ((resolve, reject) => {
			db_users.getIDFromUsername(username, db).then(userID => {
				db_users.get(userID, db).then(user => {
					resolve(user)
				})
				.catch (e => {
					reject(e)
				})
			})
			.catch (e => {
				reject(e)
			})
		})
	},
	getMail: (id, db) => {
		return new Promise ((resolve, reject) => {
			db.get(`users:${id}`, function(err, result) {
				if (err) {
					if(err.notFound)
						reject({
							"type" : 2,
							"code" : 404,
							"name" : "unknownUser",
							"message" : "Couldn't find the user in the database"
						})
					else
						reject({
							"type" : 1,
							"error" : err
						})
				}
				else {
					result = JSON.parse(result);
					resolve(result.email);
				}
			})
		})
	},
	update: (id, user, db) => {
		return new Promise ((resolve, reject) => {
			db.put(`users:${id}`, JSON.stringify(user), function(err){
				if(err) 
					reject({
						 "type" : 1,
						 "error" : err
					 });
				else
					resolve(merge(user, {id: id}))
			});
		})
	},
	delete: (id, db) => {
		return new Promise ((resolve, reject) => {
			db_users.get(id, db).then(user => {
				db.del(`users:${user.id}`, function(err){
					if(err) 
						reject({
							"type" : 1,
							"error" : err
						});
					else {
						let buff = new Buffer.from(user.username)
						let loginKey = buff.toString('base64')
						db.del(`usernames:${loginKey}`, function(err){
							if(err) 
								reject({
									"type" : 1,
									"error" : err
								});
							else 
								user.deleted = true
								resolve(user);
						});
					}
				});
			})
			.catch (e => {
				reject(e)
			})
		});
	},
	deleteUsername: (username, db) => {
		return new Promise ((resolve, reject) => {
			let buff = new Buffer.from(username)
			let loginKey = buff.toString('base64')
			db.del(`usernames:${loginKey}`, function(err){
				if(err) 
					reject({
						"type" : 1,
						"error" : err
					});
				else 
					resolve({
						"username": username,
						"base64Username" : loginKey
					});
			});
		});
	},
	getIDFromUsername: (username, db) => {
		return new Promise ((resolve, reject) => {
			let buff = new Buffer.from(username)
			let loginKey = buff.toString('base64')
			
			db.get(`usernames:${loginKey}`, function(err, result_login) {
				if (err) {
					if(err.notFound)
						reject({
							"type" : 2,
							"code" : 404,
							"name" : "unknownUser",
							"message" : "Couldn't find the user in the database"
						})
					else
						reject({
							"type" : 1,
							"error" : err
						})
				}
				else {
					let id = JSON.parse(result_login).userID
					resolve(id)
				}
			})
		})
	},
	purgeUsers : (db) => {
		return new Promise( (resolve, reject) => {
			 db.createReadStream({
				 gt: "usernames:",
				 lte: "usernames" + String.fromCharCode(":".charCodeAt(0) + 1),
			 })
			 .on( 'data', ({key, value}) => {
				userID = JSON.parse(value).userID
				db.del(key, function(err){
					if(err) 
						console.error(err);
					else
						console.log("success deleted username " + key)
				});
				 db.del(`users:${userID}`, function(err){
					if(err) 
						console.error(err);
					else
						console.log("success deleted user " + userID)
				});
			 })
			 .on( 'error', (err) => {
				reject({
					"type" : 1,
					"error" : err
				});
			 })
			 .on( 'end', () => {
				 resolve(true)
			 })
		})
	},
	channels : {
		add : (userID, channelID, db) => {
			return new Promise((resolve, reject) => {
				db.get(`users:${userID}`, function(err, result) {
					if (err) {
						if(err.notFound)
							reject({
								"type" : 2,
								"code" : 404,
								"name" : "unknownUser",
								"message" : "Couldn't find the user in the database"
							})
						else
							reject({
								"type" : 1,
								"error" : err
							})
					}
					else {
						result = JSON.parse(result)
						result.channels.unshift(channelID)
						db_users.update(userID, result, db)
						.then(u => {
							resolve ();
						}).catch (e => {
							reject(e);
						})
					}
				})

			})
		},
		
		remove : (userID, channelID, db) => {
			return new Promise((resolve, reject) => {
				db.get(`users:${userID}`, function(err, result) {
					if (err) {
						if(err.notFound)
							reject({
								"type" : 2,
								"code" : 404,
								"name" : "unknownUser",
								"message" : "Couldn't find the user in the database"
							})
						else
							reject({
								"type" : 1,
								"error" : err
							})
					}
					else {
						result = JSON.parse(result)
						newChannels = result.channels.filter((value, index, arr) => {
							return value != channelID
						})
						result.channels = newChannels
						db_users.update(userID, result, db)
						.then(u => {
							resolve ();
						}).catch (e => {
							reject(e);
						})
					}
				})

			})
		}

	},
	
	updateSelf : (userID, data, db) => {
		return new Promise((resolve, reject) => {
			db.get(`users:${userID}`, function(err, result) {
				if (err) {
					if(err.notFound)
						reject({
							"type" : 2,
							"code" : 404,
							"name" : "unknownUser",
							"message" : "Couldn't find the user in the database"
						})
					else
						reject({
							"type" : 1,
							"error" : err
						})
				}
				else {
					let user = JSON.parse(result);
					user["id"] = userID;
					
					bcrypt.compare(data.password, user.hashedPassword, function(err, result) {
						if(err) {
							reject({
								"type" : 1,
								"error" : err
							})
						}
						else if (!result)
							reject({
								"type" : 2,
								"code" : 401,
								"name" : "badPassword",
								"message" : "Password incorrect"
							})
						else
							if (data.email)
								user.email = data.email
							
							if (data.bday)
								user.bday = data.bday
							
							if (data.genre && data.genre >= 1 && data.genre <= 3)
								user.genre = data.genre
							
							if (data.avatar && data.avatar.type && (data.avatar.type === "Default" || 
								data.avatar.type === "Gravatar" || data.avatar.type === "Custom")) {
								
								if(!user.avatar)
									user.avatar = {}
								user.avatar.type = data.avatar.type
								if (data.avatar.type === 'Default') {
									user.avatar.nb = data.avatar.nb
								}
								else if (data.type === 'Custom') {
									user.avatar.nb = data.avatar.link
								}
							}
							db_users.update(userID, user, db).then(usr => {
								delete user.hashedPassword
								resolve(user)
							})
							.catch (e => {
								reject(e)
							})
							
					})
				}
			})
		})
	}
}

module.exports = db_users;