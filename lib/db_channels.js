const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const db_users = require('./db_users')

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
				newChannel.messages = []
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
						db_users.channels.remove(usrID, id, db)
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
			db_users.get(userData.id, db).then (user => {
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
						db_users.channels.add(userID, channelID, db).then(() => {
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
						db_users.channels.remove(userID, channelID, db).then(() => {
							newMembers = channel.members.filter((value, index, arr) => {
								return value != userID
							})
							channel.members = newMembers;
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
							"message" : "User must be admin of the channel. BLABLA"  
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