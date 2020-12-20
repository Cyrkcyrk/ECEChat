const level = require('level')
const db = level(__dirname + '/../db')

const db_channels = require('./db_channels')
const db_users = require('./db_users')
const db_messages = require('./db_messages')
const db_token = require('./db_token')

db.c = {
	channels :db_channels,
	users : db_users,
	messages : db_messages,
	token : db_token,
}


this_db = {
	channels : {
		create: (channel, owner) => {
			return db_channels.create(channel, owner, db)
		},
		list: (_) => {
			return db_channels.list(db)
		},
		listUserChannels: (user) => {
			return db_channels.listUserChannels(user, db)
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
			},
			fetch : (channelID) => {
				return db_channels.user.fetch(channelID, db)
			}
		},
		admin : {
			add : (channelID, userID) => {
				return db_channels.admin.add(channelID, userID, db)
			},
			remove : (channelID, userID) => {
				return db_channels.admin.remove(channelID, userID, db)
			}
		},
		fetchMessages : (channelID, messageID, admin = false, nb = 5000) => {
			if(!nb || nb > 5000)
				nb = 5000
			if(!admin)
				return db_channels.message.fetch(channelID, messageID, db, nb, db_messages.getUser)
			else
				return db_channels.message.fetch(channelID, messageID, db, nb, db_messages.getAdmin)
		}
	},
	admin: {
		clear: _ => {
			return new Promise((resolve, reject) => {
				db.clear((err) => {
					if(err)
						reject(err)
					resolve()
				})
			})
		},
		
		populate : _ => {
			return new Promise((resolve, reject) => {
				
				let returnValue = {}
				
				let createAndLogInUser = function (userObject) {
					return new Promise((resolve) => {
						this_db.users.create({...userObject})
						.then(usr => {
							this_db.login.connect({...userObject})
							.then(usrToken => {
								usr.token = usrToken.token
								resolve(usr)
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
					createAndLogInUser({
						username : "admin",
						password : "admin",
						adminPassword : "adminP4ssword"
					}).then(admin => {
						returnValue.admin = admin
						
						createAndLogInUser({
							username : "user1",
							password : "password",
						}).then(user1 => {
							returnValue.user1 = user1
							
							createAndLogInUser({
								username : "user2",
								password : "password",
							}).then(user2 => {
								returnValue.user2 = user2
								
								createAndLogInUser({
									username : "user3",
									password : "password",
								}).then(user3 => {
									returnValue.user3 = user3
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
		getLogged: (id) => {
			return db_users.getLogged(id, db)
		},
		get: (id) => {
			return db_users.get(id, db)
		},
		
		getFromUsername: (username) => {
			return db_users.getFromUsername(username, db)
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
		updateSelf : (userID, data) => {
			return db_users.updateSelf(userID, data, db)
		}
	},
	messages: {
		create: (message, userID, channelID) => {
			return db_messages.create(message, userID, channelID, db)
		},
		list : _ => {
			return db_messages.list(db)
		},
		get: (id) => {
			return db_messages.get(id, db)
		},
		getUser: (id) => {
			return db_messages.getUser(id, db)
		},
		
		getAdmin: (id) => {
			return db_messages.getAdmin(id, db)
		},
		update: (id, message) => {
			return db_messages.update(id, message, db)
		},
		delete: (id) => {
			return db_messages.delete(id, db)
		},
		remove: (id) => {
			return db_messages.remove(id, db)
		},
		edit: (id, content) => {
			return db_messages.edit(id, content, db)
		},
	},
	login : {
		connect : (userInfos) => {
			return db_token.login(userInfos, db)
		}
	}
}
module.exports = this_db