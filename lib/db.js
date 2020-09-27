
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const this_db = require("./db.js");

const store =	{
	channels: {},
	users : {},
	messages : {}
}
const level = require('level')
const db = level(__dirname + '/../db')

module.exports = {
	channels: {
		create: (channel) => {
			return new Promise((resolve, reject) => {
				if(!channel.name) 
					reject(Error('Invalid channel'));
				id = uuid()
				db.put(`channels:${id}`, JSON.stringify(channel), function(err){
					if(err) 
						reject(err);
					resolve(merge(channel, {id: id}))
				});

			})
		},
		list : _ => {
			return new Promise( (resolve, reject) => {
				 const channels = []
				 db.createReadStream({
					 gt: "channels:",
					 lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
				 })
				 .on( 'data', ({key, value}) => {
					 channel = JSON.parse(value)
					 channel.id = key
					 channels.push(channel)
				 })
				 .on( 'error', (err) => {
					 reject(err)
				 })
				 .on( 'end', () => {
					 resolve(channels)
				 })
			})
		},
		get: (id) => {
			return new Promise ((resolve, reject) => {
				db.get(`channels:${id}`, function(err, result) {
					if (err){
						reject(Error(err));
					}
					result = JSON.parse(result);
					result["id"] = id;
					resolve(result);
				})
			})
		},
		update: (id, channel) => {
			return new Promise ((resolve, reject) => {
				db.put(`channels:${id}`, JSON.stringify(channel), function(err){
					if(err) 
						reject(err);
					resolve(merge(channel, {id: id}))
				});
			})
		},
		delete: (id) => {
			return new Promise ((resolve, reject) => {
				db.del(`channels:${id}`, JSON.stringify(channel), function(err){
					if(err) 
						reject(err);
					resolve({id: id});
				});
			});
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
			return new Promise((resolve, reject) => {
				if(!user.username) 
					reject(Error('Invalid user'));
				id = uuid()
				db.put(`users:${id}`, JSON.stringify(user), function(err){
					if(err) 
						reject(err);
					resolve(merge(user, {id: id}))
				});

			})
		},
		list : _ => {
			return new Promise( (resolve, reject) => {
				 const users = []
				 db.createReadStream({
					 gt: "users:",
					 lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
				 })
				 .on( 'data', ({key, value}) => {
					 user = JSON.parse(value)
					 user.id = key
					 users.push(user)
				 })
				 .on( 'error', (err) => {
					 reject(err)
				 })
				 .on( 'end', () => {
					 resolve(users)
				 })
			})
		},
		get: (id) => {
			return new Promise ((resolve, reject) => {
				db.get(`users:${id}`, function(err, result) {
					if (err){
						reject(Error(err));
					}
					result = JSON.parse(result);
					result["id"] = id;
					resolve(result);
				})
			})
		},
		update: (id, user) => {
			return new Promise ((resolve, reject) => {
				db.put(`users:${id}`, JSON.stringify(user), function(err){
					if(err) 
						reject(err);
					resolve(merge(user, {id: id}))
				});
			})
		},
		delete: (id) => {
			return new Promise ((resolve, reject) => {
				db.del(`users:${id}`, JSON.stringify(user), function(err){
					if(err) 
						reject(err);
					resolve({id: id});
				});
			});
		}
	},
	messages: {
		create: (message) => {
			return new Promise((resolve, reject) => {
				if(!message.content) 
					reject(Error('Invalid message'));
				id = uuid()
				db.put(`messages:${id}`, JSON.stringify(message), function(err){
					if(err) 
						reject(err);
					resolve(merge(message, {id: id}))
				});

			})
		},
		list : _ => {
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
		get: (id) => {
			return new Promise ((resolve, reject) => {
				db.get(`messages:${id}`, function(err, result) {
					if (err){
						reject(Error(err));
					}
					result = JSON.parse(result);
					result["id"] = id;
					resolve(result);
				})
			})
		},
		update: (id, message) => {
			return new Promise ((resolve, reject) => {
				db.put(`messages:${id}`, JSON.stringify(message), function(err){
					if(err) 
						reject(err);
					resolve(merge(message, {id: id}))
				});
			})
		},
		delete: (id) => {
			return new Promise ((resolve, reject) => {
				db.del(`messages:${id}`, JSON.stringify(message), function(err){
					if(err) 
						reject(err);
					resolve({id: id});
				});
			});
		}
	}
}
