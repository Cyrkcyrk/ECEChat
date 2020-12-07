
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

let data = {}
let channel1 = {}, channel2 = {}
let message1 = {}, message2 = {}, message3 = {}
describe('messages', () => {

	it('Clear and populate the database', (done) => {
		db.admin.populate()
		.then(tmpUsers => {
			users = tmpUsers;
			done();
		}).catch (e => {
			console.log(e)
			done(e);
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
					done(err);
				});
				
				
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
				done(err);
			}
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
				done(err);
			}
		});
	})
	
	it('Post message to channel1 as user3 (non member, non admin) ', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Ceci est un message d\'un non membre.',
			token: users.user3.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
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
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Post message to channel1 as user2 (member, non admin) ', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Bonjour ceci est un premier message.',
			token: users.user2.token
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Bonjour ceci est un premier message.',
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
				
				message1 = res.body
				
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
							name: 'channel de test',
							admins: [ users.user1.id ],
							members: [ /^\w+-\w+-\w+-\w+-\w+$/, /^\w+-\w+-\w+-\w+-\w+$/ ],
							messages : {
								last : {
									id: message1.id,
									createdAt: message1.createdAt,
									content: message1.content
								},
								list : [message1.id]
							},
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
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
				done(err);
			}
		});
	})
	
	it('Post message to channel1 as user1 (member, admin) ', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Bonjour ceci est un second message.',
			token: users.user1.token
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
					author: users.user1.id,
					channelID: channel1.id,
					content: 'Bonjour ceci est un second message.',
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
				
				message2 = res.body
				
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
							name: 'channel de test',
							admins: [ users.user1.id ],
							members: [ /^\w+-\w+-\w+-\w+-\w+$/, /^\w+-\w+-\w+-\w+-\w+$/ ],
							messages : {
								last : {
									id: message2.id,
									createdAt: message2.createdAt,
									content: message2.content
								},
								list : [message2.id, message1.id]
							},
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
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
				done(err);
			}
		});
	})
	
	it('Post message to channel1 as admin (superadmin) ', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Woaw, un super admin est ici!',
			token: users.admin.token
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
					author: users.admin.id,
					channelID: channel1.id,
					content: 'Woaw, un super admin est ici!',
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
				
				message3 = res.body
				
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
							name: 'channel de test',
							admins: [ users.user1.id ],
							members: [ /^\w+-\w+-\w+-\w+-\w+$/, /^\w+-\w+-\w+-\w+-\w+$/ ],
							messages : {
								last : {
									id: message3.id,
									createdAt: message3.createdAt,
									content: message3.content
								},
								list : [message3.id, message2.id, message1.id]
							},
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
			} catch (e) {
				throw new Error(e);
			}
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
				done(err);
			}
		});
	})

	it('Get message1 of channel1 as user3 (non member, non admin) ', (done) => {
		supertest(app)
		.get(`/message/${message1.id}`)
		.send({
			token: users.user3.token
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
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('Get message1 of channel1 as user2 (member, non admin) ', (done) => {
		supertest(app)
		.get(`/message/${message1.id}`)
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Bonjour ceci est un premier message.',
					createdAt: message1.createdAt,
					id: message1.id
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
	
	it('Get message1 of channel1 as user1 (member, admin) ', (done) => {
		supertest(app)
		.get(`/message/${message1.id}`)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Bonjour ceci est un premier message.',
					createdAt: message1.createdAt,
					id: message1.id
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
	
	it('Get message1 of channel1 as admin (superadmin) ', (done) => {
		supertest(app)
		.get(`/message/${message1.id}`)
		.send({
			token: users.admin.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Bonjour ceci est un premier message.',
					createdAt: message1.createdAt,
					id: message1.id
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
	
	it('edit message1 as user3 (non author, non member, non admin) ', (done) => {
		supertest(app)
		.put(`/message/${message1.id}`)
		.send({
			content : "Ceci est un message edite par user3",
			token: users.user3.token
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
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('edit message1 of channel1 as user2 (author, member, non admin)', (done) => {
		supertest(app)
		.put(`/message/${message1.id}`)
		.send({
			content : 'Ceci est un message edite par l\'auteur',
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Ceci est un message edite par l\'auteur',
					createdAt: message1.createdAt,
					edited : true,
					id: message1.id
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
	
	it('edit message1 as user1 (non author, member, admin) ', (done) => {
		supertest(app)
		.put(`/message/${message1.id}`)
		.send({
			content : "Ceci est un message edite par user1",
			token: users.user3.token
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
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('edit message1 of channel1 as admin (non author, superadmin)', (done) => {
		supertest(app)
		.put(`/message/${message1.id}`)
		.send({
			content : 'Ceci est un message edite par superadmin',
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Ceci est un message edite par superadmin',
					createdAt: message1.createdAt,
					edited : true,
					id: message1.id
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
	
	it('Remove message as author', (done) => {
		supertest(app)
		.delete(`/message/${message1.id}`)
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Message deleted.',
					createdAt: message1.createdAt,
					removed: true,
					id: message1.id
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
		})
	})
	
	it('Remove message as non member (non author)', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Ce message sera supprime.',
			token: users.user1.token
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
					author: users.user1.id,
					channelID: channel1.id,
					content: 'Ce message sera supprime.',
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
				msg = res.body
				
				supertest(app)
				.delete(`/message/${msg.id}`)
				.send({
					token: users.user3.token
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
				done(err);
			}
		});
	})
	
	it('Remove message as member (non author)', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Ce message sera supprime.',
			token: users.user1.token
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
					author: users.user1.id,
					channelID: channel1.id,
					content: 'Ce message sera supprime.',
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
				msg = res.body
				
				supertest(app)
				.delete(`/message/${msg.id}`)
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
				done(err);
			}
		});
	})
	
	it('Remove message as channelAdmin', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Ce message sera supprime.',
			token: users.user2.token
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Ce message sera supprime.',
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
				msg = res.body
				
				supertest(app)
				.delete(`/message/${msg.id}`)
				.send({
					token: users.user1.token
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.expect((res) => {
					try {
						res.body.should.match({
							author: users.user2.id,
							channelID: channel1.id,
							content: 'Message deleted.',
							createdAt: msg.createdAt,
							removed: true,
							id: msg.id
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
				done(err);
			}
		});
	})
	
	it('Remove message as admin (superadmin)', (done) => {
		supertest(app)
		.post(`/message/`)
		.send({
			channelID : channel1.id,
			content : 'Ce message sera supprime.',
			token: users.user2.token
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(
				{
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Ce message sera supprime.',
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
				})
				msg = res.body
				
				supertest(app)
				.delete(`/message/${msg.id}`)
				.send({
					token: users.admin.token
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.expect((res) => {
					try {
						res.body.should.match({
							author: users.user2.id,
							channelID: channel1.id,
							content: 'Message deleted.',
							createdAt: msg.createdAt,
							removed: true,
							id: msg.id
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
				done(err);
			}
		});
	})
	
	it('Get removed message1 of channel1 as user2 (member, non admin) ', (done) => {
		supertest(app)
		.get(`/message/${message1.id}`)
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Message deleted.',
					createdAt: message1.createdAt,
					id: message1.id,
					removed : true
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
	
	it('Get removed message1 of channel1 as user1 (member, admin) ', (done) => {
		supertest(app)
		.get(`/message/${message1.id}`)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Message deleted.',
					createdAt: message1.createdAt,
					id: message1.id,
					removed : true
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
	
	it('Get removed message1 of channel1 as admin (superadmin) ', (done) => {
		supertest(app)
		.get(`/message/${message1.id}`)
		.send({
			token: users.admin.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					author: users.user2.id,
					channelID: channel1.id,
					content: 'Ceci est un message edite par superadmin',
					createdAt: message1.createdAt,
					id: message1.id,
					removed : true
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
