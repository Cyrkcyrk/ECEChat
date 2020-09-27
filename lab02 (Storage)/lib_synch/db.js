
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const this_db = require("./db.js");

const store =	{
	channels: {},
	users : {},
	messages : {}
}
// const level = require('level')
// const db = level(__dirname + '/../db')

module.exports = {
	channels: {
		create: async (channel) => {
			// console.log(channel);
			if(!channel.name) throw Error('Invalid channel')
			id = uuid()
			store.channels[id] = channel
			// await db.put(`channels:${id}`, JSON.stringify(channel))
			return merge(channel, {id: id})
		},
		list: async () => {
			return Object.keys(store.channels).map( (id) => {
				const channel = clone(store.channels[id])
				channel.id = id
				return channel
			})
		/*
			// return new Promise( (resolve, reject) => {
			//	 const channels = []
			//	 db.createReadStream({
			//		 gt: "channels:",
			//		 lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
			//	 }).on( 'data', ({key, value}) => {
			//		 channel = JSON.parse(value)
			//		 channel.id = key
			//		 channels.push(channel)
			//	 }).on( 'error', (err) => {
			//		 reject(err)
			//	 }).on( 'end', () => {
			//		 resolve(channels)
			//	 })
			// })
		*/
		},
		get: async (id) => {
			console.log(id);
			const original = store.channels[id];
			if(!original) throw Error('Unregistered channel id');
			channel = clone(original);
			channel.id = id;
			return channel
		},
		update: (id, channel) => {
			channel.id = id;
			const original = store.channels[id]
			if(!original) throw Error('Unregistered channel id')
			store.channels[id] = merge(original, channel)
			return channel
		},
		delete: (id) => {
			const original = store.channels[id]
			if(!original) throw Error('Unregistered channel id')
			delete store.channels[id]
			return {"id": id};
		}
	},
	admin: {
		clear: async () => {
			store.channels = {}
			store.users = {}
			store.messages = {}
			//await db.clear()
		}
	},
	users: {
		create: async (user) => {
			if(!user.username) throw Error('Invalid user')
			id = uuid()
			store.users[id] = user
			// await db.put(`users:${id}`, JSON.stringify(user))
			return merge(user, {id: id})
		},
		list: async () => {
			return Object.keys(store.users).map( (id) => {
				const user = clone(store.users[id])
				user.id = id
				return user
			})
		},
		get: async (id) => {
			console.log(id);
			const original = store.users[id];
			if(!original) throw Error('Unregistered user id');
			user = clone(original);
			user.id = id;
			return user
		},
		update: (id, user) => {
			user.id = id;
			const original = store.users[id]
			if(!original) throw Error('Unregistered user id')
			store.users[id] = merge(original, user)
			return user
		},
		delete: (id) => {
			const original = store.users[id]
			if(!original) throw Error('Unregistered user id')
			delete store.users[id]
			return {"id": id};
		}
	},
	messages: {
		create: async (message) => {
			if(!message.content) throw Error('Invalid message')
			id = uuid()
			store.messages[id] = message
			// await db.put(`messages:${id}`, JSON.stringify(message))
			return merge(message, {id: id})
		},
		list: async () => {
			return Object.keys(store.messages).map( (id) => {
				const message = clone(store.messages[id])
				message.id = id
				return message
			})
		},
		get: async (id) => {
			const original = store.messages[id];
			if(!original) throw Error('Unregistered message id');
			message = clone(original);
			message.id = id;
			return message
		},
		update: (id, message) => {
			message.id = id;
			const original = store.messages[id]
			if(!original) throw Error('Unregistered message id')
			store.messages[id] = merge(original, message)
			return message
		},
		delete: (id) => {
			const original = store.messages[id]
			if(!original) throw Error('Unregistered message id')
			delete store.messages[id]
			return {"id": id};
		}
	}
}
