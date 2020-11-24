const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

let db_messages = {
	create: (message, db) => {
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
	get: (id, db) => {
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
	update: (id, message, db) => {
		return new Promise ((resolve, reject) => {
			db.put(`messages:${id}`, JSON.stringify(message), function(err){
				if(err) 
					reject(err);
				resolve(merge(message, {id: id}))
			});
		})
	},
	delete: (id, db) => {
		return new Promise ((resolve, reject) => {
			db.del(`messages:${id}`, JSON.stringify(message), function(err){
				if(err) 
					reject(err);
				resolve({id: id});
			});
		});
	}
}

module.exports = db_messages;