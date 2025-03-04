const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

let db_channels =  {
	create: (channel, owner, db) => {
		return new Promise((resolve, reject) => {
			if(!channel.name) {
				reject({
					type : 2,
					error : 400,
					name : "missingChannelName",
					message : "Invalid channel (name)"
				})
			}
			else if(!owner) {
				reject({
					type : 2,
					error : 400,
					name : "missinChannelOwner",
					message : "Invalid channel (owner)"
				})
			}
			else {
				let id = uuid()
				let newChannel = {};
				newChannel.name = channel.name
				newChannel.admins = [owner.id]
				newChannel.members = []
				newChannel.messages = {
					last : "",
					list : []
				}
				newChannel.settings = {
					private : true
				}
				newChannel.createdAt = Date.now() + "";
				db.put(`channels:${id}`, JSON.stringify(newChannel), function(err){
					if(err) 
						reject({
							"type" : 1,
							"error" : err
						})
					else {
						db_channels.user.add(id, owner.id, db).then(channel => {
							resolve(channel)
						}).catch(e => {
							reject(e)
						})
					}
				});
			}
		})
	},
	get: (id, db) => {
		return new Promise ((resolve, reject) => {
			db.get(`channels:${id}`, function(err, result) {
				if (err){
					if(err.notFound)
						reject({
							"type" : 2,
							"code" : 404,
							"name" : "unknownChannel",
							"message" : "Couldn't find the channel in the database"
						})
					else
						reject({
							"type" : 1,
							"error" : err
						})
					return;
				}
				else {
					result = JSON.parse(result);
					result["id"] = id;
					resolve(result);
				}
			})
		})
	},
	update: (id, channel, db) => {
		return new Promise ((resolve, reject) => {
			db.put(`channels:${id}`, JSON.stringify(channel), function(err){
				if(err) 
					reject({
						"type" : 1,
						"error" : err
					})
				else
					resolve(merge(channel, {id: id}))
			});
		})
	},
	delete: (id, db) => {
		return new Promise ((resolve, reject) => {
			db_channels.get(id, db).then(channel => {
				let PromiseArray = [];
				channel.members.forEach(usrID => {
					PromiseArray.push(
						db.c.users.channels.remove(usrID, id, db)
						.catch(e => {
							reject(e)
							return;
						})
					)
				})
				Promise.all(PromiseArray).then(() => {
					db.del(`channels:${id}`, JSON.stringify(channel), function(err){
						if(err) 
							reject({
								"type" : 1,
								"error" : err
							})
						else {
							channel.id = id;
							channel.deleted = true;
							resolve(channel);
						}
							
					});
				});
			})
			
			
			
			
		});
	},
	list : (db) => {
		return new Promise( (resolve, reject) => {
			const channels = []
			db.createReadStream({
				 gt: "channels:",
				 lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
			})
			.on('data', ({key, value}) => {
				channel = JSON.parse(value)
				channel.id = key.substring([..."channels:"].length)
				channels.push(channel)
			})
			.on('error', (err) => {
				reject({
					"type" : 1,
					"error" : err
				})
			})
			.on('end', () => {
				resolve(channels)
			})
		})
	},
	listUserChannels : (userData, db) => {
		return new Promise( (resolve, reject) => {
			db.c.users.get(userData.id, db).then (user => {
				let promiseArray = []
				let channelArray = []
				user.channels.forEach(chanID => {
					promiseArray.push(
						db_channels.get(chanID, db)
						.then(c => {
							channelArray.push(c);
						})
						.catch(e => {
							reject(e);
							return;
						})
					)
				})
				Promise.all(promiseArray).then(_ => {
					resolve(channelArray)
				})
			});
		})
	},
	
	message : {
		add : (channelID, message, db) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db)
				.then(channel => {
					delete channel.id
					
					
					let newList = [...channel.messages.list]
					newList.unshift(message.id);
					let newMessages = {
						last : {
							id : message.id,
							createdAt : message.createdAt,
							content : message.content
						},
						list : newList
					}
					channel.messages = newMessages;
					db_channels.update(channelID, channel, db).then(channel => {
						resolve(merge(channel, {id: channelID}));
					})
					.catch (e => {s
						reject(e)
					})
				})
				.catch ((e) => {
					reject(e)
				})
			})
		},
		remove : (channelID, messageID, db) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db).then(channel => {
					if (!channel.messages.list.includes(messageID)) {
						reject ({
							"type" : 2,
							"code" : 409,
							"name" : "messageNotExist",
							"message" : "Message isn't in that channel"  
						})
						return;
					}
					else {
						newMessagesList = channel.message.list.filter((value, index, arr) => {
							return value != messageID
						})
						channel.messages.list = newMessagesList;
						if(channel.messages.last.id == messageID)
							channel.messages.last.content == "Content deleted."
						delete channel.id
						db_channels.update(channelID, channel, db).then(channel => {
							resolve(merge(channel, {id: channelID}))
						})
						.catch (e => {s
							reject(e)
						})
					}
				})
				.catch ((e) => {
					reject(e)
				})
			})
		},
		fetch : (channelID, messageID, db, nb, getFunction) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db).then(channel => {
					let indexOfMessage = 0
					if(messageID.length != 0)
						indexOfMessage = channel.messages.list.indexOf(messageID)
					if(indexOfMessage < 0) {
						reject ({
							"type" : 2,
							"code" : 409,
							"name" : "messageNotExist",
							"message" : "Message isn't in that channel"  
						})
						return
					}
					else {
						let promiseArray = []
						let fetchedMessages = [];
						for (let i = 0; i < nb && indexOfMessage + i < channel.messages.list.length; i++ ) {
							promiseArray.push(
								getFunction(channel.messages.list[indexOfMessage + i], db).then(message => {
									fetchedMessages.push(message);
								})
								.catch ((e) => {
									reject(e)
									return;
								})
							)
						}
						
						Promise.all(promiseArray).then(_ => {
							fetchedMessages.sort((m1, m2) => {
								if(m1.createdAt > m2.createdAt)
									return -1
								if(m1.createdAt < m2.createdAt)
									return 1
								return 0
							})
							resolve(fetchedMessages)
						})
					}
				})
				.catch ((e) => {
					reject(e)
				})
			})
		}
	},
	user : {
		add : (channelID, userID, db) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db)
				.then(channel => {
					if (channel.members.includes(userID)) {
						reject ({
							"type" : 2,
							"code" : 409,
							"name" : "memberAlreadyExist",
							"message" : "Member is already member of the channel."  
						})
						return;
					}
					else {
						db.c.users.channels.add(userID, channelID, db).then(() => {
							channel.members.push(userID)
							delete channel.id
							db_channels.update(channelID, channel, db).then(channel => {
								resolve(merge(channel, {id: channelID}));
							})
							.catch (e => {s
								reject(e)
							})
						})
						.catch ((e) => {
							reject(e)
						})
					}
				})
				.catch ((e) => {
					reject(e)
				})
			})
		},
		remove : (channelID, userID, db) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db).then(channel => {
					if (!channel.members.includes(userID)) {
						reject ({
							"type" : 2,
							"code" : 409,
							"name" : "memberNotExist",
							"message" : "Member must be member of the channel."  
						})
						return;
					}
					else {
						db.c.users.channels.remove(userID, channelID, db).then(() => {
							newMembers = channel.members.filter((value, index, arr) => {
								return value != userID
							})
							channel.members = newMembers;
							newAdmins = channel.admins.filter((value, index, arr) => {
								return value != userID
							})
							channel.admins = newAdmins;
							delete channel.id
							db_channels.update(channelID, channel, db).then(channel => {
								resolve(merge(channel, {id: channelID}));
							})
							.catch (e => {s
								reject(e)
							})
						})
						.catch ((e) => {
							reject(e)
						})
					}
				})
				.catch ((e) => {
					reject(e)
				})
			})
		},
		fetch : (channelID, db) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db).then(channel => {
					let promiseArray = []
					let fetchedMembers = {};
					channel.members.forEach(memberID => {
						promiseArray.push(
							db.c.users.get(memberID, db).then(member => {
								fetchedMembers[memberID] = member;
							})
							.catch ((e) => {
								reject(e)
								return;
							})
						)
					})
					
					Promise.all(promiseArray).then(_ => {
						resolve(fetchedMembers)
					})
				})
				.catch ((e) => {
					reject(e)
				})
			})
		}
	},
	admin : {
		add : (channelID, userID, db) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db)
				.then(channel => {
					if (channel.admins.includes(userID)) {
						reject ({
							"type" : 2,
							"code" : 409,
							"name" : "adminAlreadyExist",
							"message" : "User is already in admin of the channel ."  
						})
						return;
					}
					else if (!channel.members.includes(userID)) {
						reject ({
							"type" : 2,
							"code" : 409,
							"name" : "memberNotExist",
							"message" : "User must be member of the channel."  
						})
						return;
					}
					else {
						channel.admins.push(userID)
						delete channel.id
						db_channels.update(channelID, channel, db).then(channel => {
							resolve(merge(channel, {id: channelID}));
						})
						.catch (e => {s
							reject(e)
						})
					}
				})
				.catch ((e) => {
					reject(e)
				})
			})
		},
		remove : (channelID, userID, db) => {
			return new Promise ((resolve, reject) => {
				db_channels.get(channelID, db).then(channel => {
					if (!channel.admins.includes(userID)) {
						reject ({
							"type" : 2,
							"code" : 409,
							"name" : "adminNotExist",
							"message" : "User must be admin of the channel."  
						})
						return;
					}
					else {
						newAdmins = channel.admins.filter((value, index, arr) => {
							return value != userID
						})
						channel.admins = newAdmins;
						delete channel.id
						db_channels.update(channelID, channel, db).then(channel => {
							resolve(merge(channel, {id: channelID}));
						})
						.catch (e => {s
							reject(e)
						})
					}
				})
				.catch ((e) => {
					reject(e)
				})
			})
		}
	}
}

module.exports = db_channels;