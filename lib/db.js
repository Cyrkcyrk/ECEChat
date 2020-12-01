
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const level = require('level')
const db = level(__dirname + '/../db')

const jwt = require("jsonwebtoken")

const db_channels = require('./db_channels')
const db_users = require('./db_users')
const db_messages = require('./db_messages')
const db_token = require('./db_token')

this_db = {
	channels : {
		create: (channel, owner) => {
			return db_channels.create(channel, owner, db)
		},
		list: (_) => {
			return db_channels.list(db)
		},
		get: (id) => {
			return db_channels.get(id, db)
		},
		update: (id, channel) => {
			return db_channels.update(id, channel, db)
		},
		delete: (id) => {
			return db_channels.delete(id, db)
		},
		user : {
			add : (channelID, userID) => {
				return db_channels.user.add(channelID, userID, db)
			},
			remove : (channelID, userID) => {
				return db_channels.user.remove(channelID, userID, db)
			}
		},
		admin : {
			add : (channelID, userID) => {
				return db_channels.admin.add(channelID, userID, db)
			},
			remove : (channelID, userID) => {
				return db_channels.admin.remove(channelID, userID, db)
			}
		}
		
	},
	admin: {
		clear: _ => {
			return new Promise((resolve, reject) => {
				db.clear((err) => {
					if(err)
						reject(err);
					resolve();
				});
			});
		},
		
		populate : _ => {
			return new Promise((resolve, reject) => {
				
				let returnValue = {}
				
				let createLogUser = function (userObject) {
					return new Promise((resolve) => {
						this_db.users.create({...userObject})
						.then(usr => {
							this_db.login.connect({...userObject})
							.then(usrToken => {
								usr.token = usrToken
								resolve(usr);
							}).catch(e => {
								reject(e)
								return;
							})
						}).catch(e => {
							reject(e)
							return;
						})
					})
				}
				
				this_db.admin.clear()
				.then ( (_) => {
					createLogUser({
						username : "admin",
						password : "admin",
						adminPassword : "adminP4ssword"
					}).then(admin => {
						returnValue.admin = admin
						createLogUser({
							username : "user1",
							password : "password",
						}).then(user1 => {
							returnValue.user1 = user1
							
							createLogUser({
								username : "user2",
								password : "password",
							}).then(user2 => {
								returnValue.user2 = user2
								resolve(returnValue)
							}).catch (e => {
								reject(e)
								return;
							})
						}).catch (e => {
							reject(e)
							return;
						})
					}).catch (e => {
						reject(e)
						return;
					})
				})
			})
		}
	},
	users: {
		create: (user) => {
			return db_users.create(user, db)
		},
		list : (_) => {
			return db_users.list(db)
		},
		get: (id) => {
			return db_users.get(id, db)
		},
		update: (id, user) => {
			return db_users.update(id, user, db)
		},
		delete: (id) => {
			return db_users.delete(id, db)
		},
		listUsername: (_) => {
			return db_users.listUsername(db)
		},
		deleteUsername: (id) => {
			return db_users.deleteUsername(id, db)
		},
		purgeUsers: () => {
			return db_users.purgeUsers(db)
		},
	},
	messages: {
		create: (message) => {
			return db_messages.create(message, db)
		},
		list : _ => {
			return db_messages.list(db)
		},
		get: (id) => {
			return db_messages.get(id, db)
		},
		update: (id, message) => {
			return db_messages.update(id, message, db)
		},
		delete: (id) => {
			return db_messages.delete(id, db)
		}
	},
	login : {
		connect : (userInfos) => {
			return db_token.login(userInfos, db)
		}
	}
}
module.exports = this_db;