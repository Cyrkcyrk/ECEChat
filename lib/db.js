
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
		create: (channel) => {
			return db_channels.create(channel, db)
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