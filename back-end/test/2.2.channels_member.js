
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

let data = {}
let channel1 = {}, channel2 = {}
describe('channels as members', () => {

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
				.get(`/user/${users.user1.id}`)
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
	
	it('Add user2 to channel1 as user1 (channelAdmin)', (done) => {
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
					token: users.user2.token
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
	
	it('Add user2 to channel1 as self (member, non channelAdmin)', (done) => {
		supertest(app)
		.put(`/channel/${channel1.id}/user/${users.user2.id}`)
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
	
	it('Add user3 (non member) to channel1 as user2 (member, non channelAdmin)', (done) => {
		supertest(app)
		.put(`/channel/${channel1.id}/user/${users.user3.id}`)
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
	
	it('get channel1 as user2 (member, non channelAdmin)', (done) => {
		supertest(app)
		.get(`/channel/${channel1.id}`)
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					name: "channel de test",
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
						"private": true
					},
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/
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
	
	it('Add user2 to adminlist of channel1 as self (member, non channelAdmin)', (done) => {
		supertest(app)
		.put(`/channel/${channel1.id}/admin/${users.user2.id}`)
		.send({
			token: users.user2.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type: 2,
					code: 401,
					name: 'missingPermission',
					message: /^.+$/
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				throw new Error(res.error);
			}
			done(err);
		});
	})
	
	it('Remove user2 from adminlist of channel1 as self (member, channelAdmin)', (done) => {
		supertest(app)
		.delete(`/channel/${channel1.id}/admin/${users.user2.id}`)
		.send({
			token: users.user2.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type: 2,
					code: 401,
					name: 'missingPermission',
					message: /^.+$/
				})
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				throw new Error(res.error);
			}
			done(err);
		});
	})
	
	it('delete channel as user2 (member, non channelAdmin)', (done) => {
		supertest(app)
		.delete(`/channel/${channel1.id}`)
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
	
	it('Remove user3 (non member) from channel1 as user2 (member, non channeladmin)', (done) => {
		supertest(app)
		.delete(`/channel/${channel1.id}/user/${users.user3.id}`)
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
	
	it('Remove user1 (member) from channel1 as user2 (member, non channeladmin)', (done) => {
		supertest(app)
		.delete(`/channel/${channel1.id}/user/${users.user1.id}`)
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
	
	it('Remove user2 from channel1 as self (member, non channeladmin)', (done) => {
		supertest(app)
		.delete(`/channel/${channel1.id}/user/${users.user2.id}`)
		.send({
			token: users.user2.token
		})
		.expect(200)
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
