const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

let db_messages = {
	create: (message, userID, channelID, db) => {
		return new Promise((resolve, reject) => {
			if(typeof(message.content) == "undefined") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingContent",
					"message" : "Invalid message (content)"
				});
			}
			
			else {
				id = uuid()
				let newMessage = {
					author : userID,
					channelID : channelID,
					content : message.content,
					createdAt : Date.now() + ""
				}
				db.c.channels.message.add(channelID, merge(newMessage, {id: id}), db)
				.then(channel => {
					db.put(`messages:${id}`, JSON.stringify(newMessage), function(err){
						if(err) 
							reject({
								"type" : 1,
								"error" : err
							})
						else
							resolve(merge(newMessage, {id: id}))
					});
				})
				.catch (e => {
					reject(e);
				})
			}
		})
	},
	list : (db) => {
		return new Promise( (resolve, reject) => {
			 const messages = []
			 db.createReadStream({
				 gt: "messages:",
				 lte: "messages" + String.fromCharCode(":".charCodeAt(0) + 1),
			 })
			 .on( 'data', ({key, value}) => {
				 message = JSON.parse(value)
				 message.id = key
				 messages.push(message)
			 })
			 .on( 'error', (err) => {
				 reject(err)
			 })
			 .on( 'end', () => {
				 resolve(messages)
			 })
		})
	},
	get : (id, db) => {
		return new Promise ((resolve, reject) => {
			db.get(`messages:${id}`, function(err, result) {
				if (err){
					if(err.notFound)
						reject({
							"type" : 2,
							"code" : 404,
							"name" : "unknownMessage",
							"message" : "Couldn't find the message in the database"
						})
					else
						reject({
							"type" : 1,
							"error" : err
						})
					return;
				}
				else {
					message = JSON.parse(result)
					message["id"] = id;
					resolve(message);
					
				}
			})
		})
	},
	
	getAdmin: (id, db) => {
		return new Promise ((resolve, reject) => {
			db.get(`messages:${id}`, function(err, result) {
				if (err){
					if(err.notFound)
						reject({
							"type" : 2,
							"code" : 404,
							"name" : "unknownMessage",
							"message" : "Couldn't find the message in the database"
						})
					else
						reject({
							"type" : 1,
							"error" : err
						})
					return;
				}
				else {
					message = JSON.parse(result)
					message["id"] = id;
					// resolve(message);
					
					const getUser = function(msg) {
						db.c.users.get(msg.author, db).then(user => {
							msg.author = {username: user.username, id: user.id, scope : user.scope};
							resolve(msg);
						})
						.catch (e => {
							if(e.type && e.type == 2 && e.name == 'unknownUser') {
								let author = {
									username : "Unknown User",
									id : msg.author,
									scope : {
										"user"  : false,
										"test"  : false,
										"admin" : false
									}
								}
								msg.author = author
								console.log(msg.content)
								resolve(msg)
							}
							else
								reject(e)
						})
					}
					getUser({...message})
				}
			})
		})
	},
	getUser: (id, db) => {
		return new Promise ((resolve, reject) => {
			db_messages.getAdmin(id, db).then(message => {
				if (message.removed)
					message.content = "Message deleted."
				resolve(message)
			})
			.catch(e => {
				reject(e)
			})
		})
	},
	update: (id, message, db) => {
		return new Promise ((resolve, reject) => {
			db.put(`messages:${id}`, JSON.stringify(message), function(err){
				if(err) 
					reject({
						"type" : 1,
						"error" : err
					})
				else
					resolve(merge(message, {id: id}))
			});
		})
	},
	delete: (id, db) => {
		return new Promise ((resolve, reject) => {
			db_messages.get(id, db).then(message => {
				db.c.channels.messages.remove(message.channelID, message.id, db).then(channel => {
					db.del(`messages:${id}`, JSON.stringify(message), function(err){
						if(err) 
							reject({
								"type" : 1,
								"error" : err
							})
						else {
							message.id = id;
							message.deleted = true;
							resolve(message);
						}
					});
				})
				.catch (e => {
					reject(e);
			})
			})
			.catch (e => {
				reject(e);
			})
		});
	},
	remove : (id, db) => {
		return new Promise ((resolve, reject) => {
			db_messages.get(id, db).then(message => {
				message.removed = true
				delete message.id
				db.put(`messages:${id}`, JSON.stringify(message), function(err){
					if(err) 
						reject({
							"type" : 1,
							"error" : err
						})
					else {
						message.id = id;
						resolve(message);
					}
				});
			})
			.catch (e => {
				reject(e);
			})
		});
	},
	edit : (id, content, db) => {
		return new Promise ((resolve, reject) => {
			db_messages.get(id, db).then(message => {
				message.content = content
				message.edited = true
				delete message.id
				db_messages.update(id, message, db).then(msg => {
					resolve(msg);
				})
				.catch (e => {
					reject(e);
				})
			})
			.catch (e => {
				reject(e);
			})
		});
	},
}

module.exports = db_messages;