
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
	
	it('get channels as user (empty list)', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.user1.token
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
					messages : {
						last : "",
						list : []
					},
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
	
	it('Add user2 (non member) to channel1 as user1 (member, channelAdmin)', (done) => {
		supertest(app)
		.put(`/channel/${channel1.id}/user/${users.user2.id}`)
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
					messages : {
						last : "",
						list : []
					},
					settings: { private: true },
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})

				supertest(app)
				.get(`/user/${users.user2.id}`)
				.send({
					token: users.admin.token
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.expect((res) => {
					try {
						res.body.should.match({
							username: users.user2.username,
							scope: users.user2.scope,
							channels: [
								channel1.id
							],
							createdAt: users.user2.createdAt,
							id: users.user2.id
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
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
		});
	})
	
	it('create second channel as user1', (done) => {
		supertest(app)
		.post('/channel')
		.send({
			token: users.user1.token,
			name : "channel Solo"
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					name: "channel Solo",
					admins: [
						users.user1.id
					],
					members: [
						users.user1.id
					],
					messages : {
						last : "",
						list : []
					},
					settings: {
						private: true
					},
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/
				})
				
				let channel = res.body
				channel2 = res.body
				
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
								/^\w+-\w+-\w+-\w+-\w+$/,
								/^\w+-\w+-\w+-\w+-\w+$/
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
	
	it('get channels as user3 (empty list)', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.user1.token
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
	
	it('get channels as user2 (1 channel)', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match([
					{
						name:  /^.+$/,
						admins: [
							users.user1.id
						],
						members: [
							/^\w+-\w+-\w+-\w+-\w+$/,
							/^\w+-\w+-\w+-\w+-\w+$/
						],
						messages : {
							last : "",
							list : []
						},
						settings: {
							private: true
						},
						createdAt: /^\d+$/,
						id: /^\w+-\w+-\w+-\w+-\w+$/
					}
				])
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
	
	it('get channels as user1 (2 channels)', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				if(res.body[0].id == channel1.id)
					res.body.should.match([
						{
							name: /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								/^\w+-\w+-\w+-\w+-\w+$/,
								/^\w+-\w+-\w+-\w+-\w+$/
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						},
						{
							name:  /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								users.user1.id
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						}
					])
				else
					res.body.should.match([
						{
							name: /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								users.user1.id
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						},
						{
							name:  /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								/^\w+-\w+-\w+-\w+-\w+$/,
								/^\w+-\w+-\w+-\w+-\w+$/
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						}
					])
				
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
	
	it('get channels as admin (all channels)', (done) => {
		supertest(app)
		.get('/channels')
		.send({
			token: users.admin.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				if(res.body[0].id == channel1.id)
					res.body.should.match([
						{
							name: /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								/^\w+-\w+-\w+-\w+-\w+$/,
								/^\w+-\w+-\w+-\w+-\w+$/
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						},
						{
							name:  /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								users.user1.id
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						}
					])
				else
					res.body.should.match([
						{
							name: /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								users.user1.id
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						},
						{
							name:  /^.+$/,
							admins: [
								users.user1.id
							],
							members: [
								/^\w+-\w+-\w+-\w+-\w+$/,
								/^\w+-\w+-\w+-\w+-\w+$/
							],
							messages : {
								last : "",
								list : []
							},
							settings: {
								private: true
							},
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						}
					])
				
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
})
