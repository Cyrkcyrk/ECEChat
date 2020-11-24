const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

let db_channels =  {
	create: (channel, db) => {
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
	list : (db) => {
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
	get: (id, db) => {
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
	update: (id, channel, db) => {
		return new Promise ((resolve, reject) => {
			db.put(`channels:${id}`, JSON.stringify(channel), function(err){
				if(err) 
					reject(err);
				resolve(merge(channel, {id: id}))
			});
		})
	},
	delete: (id, db) => {
		return new Promise ((resolve, reject) => {
			db.del(`channels:${id}`, JSON.stringify(channel), function(err){
				if(err) 
					reject(err);
				resolve({id: id});
			});
		});
	}
}

module.exports = db_channels;