const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const bcrypt = require('bcrypt');
const saltRounds = 10;

let db_users = {
	create: (user, db) => {
		return new Promise((resolve, reject) => {
			if(typeof(user.username) == "undefined") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingUsername",
					"message" : "Invalid user (username)"
				});
			}
			else if(typeof(user.password) == "undefined") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingPassword",
					"message" : "Invalid user (password)"
				});
			}
			else {
				id = uuid()
				db_users.getIDFromUsername(user.username, db)
				.then( (_) => {
					reject({
						"type" : 2,
						"code" : 409,
						"name" : "conflictUsername",
						"message" : "This username already exist"
					});
				}).catch (e => {
					if (typeof(e.type) != "undefined" && e.type == 2 && e.name == "unknownUser") {
						let buff = new Buffer.from(user.username)
						let loginKey = buff.toString('base64')
						db.put(`usernames:${loginKey}`, JSON.stringify({"userID" : id}), function(err){
							if(err) 
								reject(JSON.stringify({
									"type" : 1,
									"error" : err
								}));
							
							bcrypt.hash(user.password, saltRounds, function(err, hash) {
								delete user.password
								user.hashedPassword = hash
								
								let adminStatus = false
								if(typeof(user.adminPassword) != "undefined" && user.adminPassword == "adminP4ssword") {
									adminStatus = true
									delete user.adminPassword
								}
									
								
								user.scope = {
									"user"  : true,
									"test"  : true,
									"admin" : adminStatus
								}
								user.channels = []
								user.createdAt = Date.now() + "";
								db.put(`users:${id}`, JSON.stringify(user), function(err){
									if(err) 
										reject({
											"type" : 1,
											"error" : err
										});
									delete user.hashedPassword
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
	get: (id, db) => {
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
	}
}

module.exports = db_users;