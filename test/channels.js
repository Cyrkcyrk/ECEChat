
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

let data = {}
let channel1 = {}, channel2 = {}
describe('channels', () => {

	it('Clear and populate the database', (done) => {
		db.admin.populate()
		.then(tmpUsers => {
			users = tmpUsers;
			done();
		}).catch (e => {
			console.log(e)
			done();
		})
	})
	
	it('get channels as no one', (done) => {
		supertest(app)
		.get('/channels')
		.expect(400)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type : 2,
					code : 400,
					name : "missingToken",
					message : "Missing token"
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('get channels with wrong token', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.user1.token.trim(0, -2) + "aa"
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					name: "JsonWebTokenError",
					message: /[^"]+/
				});
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('get channels as user', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.user1.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type : 2,
					code : 401,
					name : "missingPermission",
					message : /^.+$/
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('get channels as admin (empty list)', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.admin.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match([])
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('create channel as user1', (done) => {
		supertest(app)
		.post('/channel')
		.send({
			token: users.user1.token,
			name : "channel de test"
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					name: "channel de test",
					admins: [
						users.user1.id
					],
					members: [
						users.user1.id
					],
					messages: [],
					settings: {
						private: true
					},
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/
				})
				
				let channel = res.body
				channel1 = res.body
				
				supertest(app)
				.get('/user/' + users.user1.id)
				.send({
					token: users.user1.token
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.expect((res) => {
					try {
						res.body.should.match({
							username: users.user1.username,
							scope: users.user1.scope,
							channels: [
								channel.id
							],
							createdAt: users.user1.createdAt,
							id: users.user1.id
						})
					} catch (e) {
						throw new Error(e);
					}
				})
				.end((err, res) => {
					if (err)
						throw new(res.error);
				});
				
				
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Add user2 to channel1 as user2 (non channelAdmin, non public)', (done) => {
		supertest(app)
		.put('/channel/' + channel1.id + "/user/" + users.user2.id)
		.send({
			token: users.user2.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type : 2,
					code : 401,
					name : "missingPermission",
					message : /^.+$/
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Add user2 to channel1 as user1 (channelAdmin, non public)', (done) => {
		supertest(app)
		.put('/channel/' + channel1.id + "/user/" + users.user2.id)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({ 
					name: 'channel de test',
					admins: [ users.user1.id ],
					members: [ /^\w+-\w+-\w+-\w+-\w+$/, /^\w+-\w+-\w+-\w+-\w+$/ ],
					messages: [],
					settings: { private: true },
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Remove user2 from channel1 as user1 (channelAdmin)', (done) => {
		supertest(app)
		.delete('/channel/' + channel1.id + "/user/" + users.user2.id)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({ 
					name: 'channel de test',
					admins: [ users.user1.id ],
					members: [ users.user1.id ],
					messages: [],
					settings: { private: true },
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Add user2 to channel1 as admin', (done) => {
		supertest(app)
		.put('/channel/' + channel1.id + "/user/" + users.user2.id)
		.send({
			token: users.admin.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({ 
					name: 'channel de test',
					admins: [ users.user1.id ],
					members: [ /^\w+-\w+-\w+-\w+-\w+$/, /^\w+-\w+-\w+-\w+-\w+$/ ],
					messages: [],
					settings: { private: true },
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Remove user2 from channel1 as admin', (done) => {
		supertest(app)
		.delete('/channel/' + channel1.id + "/user/" + users.user2.id)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({ 
					name: 'channel de test',
					admins: [ users.user1.id ],
					members: [ users.user1.id ],
					messages: [],
					settings: { private: true },
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Remove user2 to channel1 as self (non channelAdmin, non public)', (done) => {
		
		supertest(app)
		.put('/channel/' + channel1.id + "/user/" + users.user2.id)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			supertest(app)
			.delete('/channel/' + channel1.id + "/user/" + users.user2.id)
			.send({
				token: users.user2.token
			})
			.expect(200)
			.expect('Content-Type', /json/)
			.expect((res) => {
				try {
					res.body.should.match({ 
						name: 'channel de test',
						admins: [ users.user1.id ],
						members: [ users.user1.id ],
						messages: [],
						settings: { private: true },
						createdAt: /^\d+$/,
						id: /^\w+-\w+-\w+-\w+-\w+$/,
					})
				} catch (e) {
					throw new Error(e);
				}
			})
			.end((err, res) => {
				if (err) {
					throw new Error(res.error);
				}
			});
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
		
		
		
		
		
	})
	
	it('delete channel as user2 (non channelAdmin)', (done) => {
		supertest(app)
		.delete('/channel/' + channel1.id)
		.send({
			token: users.user2.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type : 2,
					code : 401,
					name : "missingPermission",
					message : /^.+$/
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('delete channel as user1 (channelAdmin)', (done) => {
		supertest(app)
		.delete('/channel/' + channel1.id)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({ 
					name: 'channel de test',
					admins: [ users.user1.id ],
					members: [ users.user1.id ],
					messages: [],
					settings: { private: true },
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
					deleted: true 
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	/*
	it('list empty', async () => {
		db.admin.clear();
		// Return an empty channel list by default
		const {body: channels} = await supertest(app)
		.get('/channels')
		.expect(200)
		channels.should.match([])
	})
	
	it('list one element', async () => {
		db.admin.clear();
		// Create a channel
		await supertest(app)
		.post('/channel')
		.send({name: 'channel 1'})
		// Ensure we list the channels correctly
		const {body: channels} = await supertest(app)
		.get('/channels')
		.expect(200)
		channels.should.match([{
			// id: /^\w+-\w+-\w+-\w+-\w+$/,
			id: /^channels:\w+-\w+-\w+-\w+-\w+$/,
			name: 'channel 1'
		}])
	})
	
	it('add one element', async () => {
		db.admin.clear();
		// Create a channel
		const {body: channel} = await supertest(app)
		.post('/channel')
		.send({name: 'channel 1'})
		.expect(201)
		// Check its return value
		channel.should.match({
			id: /^\w+-\w+-\w+-\w+-\w+$/,
			name: 'channel 1'
		})
		// Check it was correctly inserted
		const {body: channels} = await supertest(app)
		.get('/channels')
		channels.length.should.eql(1)
	})
	*/
	
})
