
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

let data = {}
let channel1 = {}
let messages = []

let delay = (nb) => {
	return new Promise((resolve) => {
		setTimeout(resolve, nb)
	})
}

describe('Fetch messages from channels', () => {

	it('Clear and populate the database', (done) => {
		
		db.admin.populate().then(tmpUsers => {
			users = tmpUsers
			db.channels.create({name : 'channel de test'}, users.user1, db).then(tmpChannel => {
				delay(10).then( (_) => { db.channels.user.add(tmpChannel.id, users.user2.id, db).then(tmpChannel2 => {
					channel1 = tmpChannel2
					delay(10).then( (_) => { db.messages.create({content: "Bonjour"}, users.user1.id, channel1.id, db).then(msg => {
						messages.push(msg)
						delay(10).then( (_) => { db.messages.create({content: "Salut"}, users.user2.id, channel1.id, db).then(msg => {
							messages.push(msg)
							delay(10).then( (_) => { db.messages.create({content: "C'est des messages de test"}, users.user1.id, channel1.id, db).then(msg => {
								messages.push(msg)
								delay(10).then( (_) => { db.messages.create({content: "Et puis celui là vas être delete d'ailleurs"}, users.user1.id, channel1.id, db).then(msg => {
									delay(10).then( (_) => {  
									db.messages.remove(msg.id, db).then(msg => {
										messages.push(msg)
										delay(10).then( (_) => { db.messages.create({content: "Haha, j'ai vus avant que tu delete"}, users.user2.id, channel1.id, db).then(msg => {
											messages.push(msg)
											delay(10).then( (_) => { db.messages.create({content: "Okay, j'ai besoins d\'écrire d\'autres trucs"}, users.user1.id, channel1.id, db).then(msg => {
												messages.push(msg)
												delay(10).then( (_) => { db.messages.create({content: "Mais je sais pas quoi ecrire"}, users.user1.id, channel1.id, db).then(msg => {
													messages.push(msg)
													delay(10).then( (_) => { db.messages.create({content: "Bah je sais pas non plus"}, users.user2.id, channel1.id, db).then(msg => {
														messages.push(msg)
														delay(10).then( (_) => { db.messages.create({content: "Ducoup blablabla"}, users.user1.id, channel1.id, db).then(msg => {
															delay(10).then( (_) => { db.messages.edit(msg.id, "J\'ai edite ce message huehuehue").then(msg => {
																messages.push(msg)
																delay(10).then( (_) => { db.messages.create({content: "\"Don't ever, for any reason, do anything, to anyone, for any reason, ever, no matter what, no matter where, or who, or who you are with, or where you are going, or where you've been, ever, for any reason whatsoever. - Michael Scott\""}, users.user2.id, channel1.id, db).then(msg => {
																	messages.push(msg)
																	done();
																}).catch (e => {
																	console.log(e)
																	done(e);
																} )})
															}).catch (e => {
																console.log(e)
																done(e);
															} )})
														}).catch (e => {
															console.log(e)
															done(e);
														} )})
													}).catch (e => {
														console.log(e)
														done(e);
													} )})
												}).catch (e => {
													console.log(e)
													done(e);
												} )})
											}).catch (e => {
												console.log(e)
												done(e);
											} )})
										}).catch (e => {
											console.log(e)
											done(e);
										} )})
									}).catch (e => {
										console.log(e)
										done(e);
									} )})
								}).catch (e => {
									console.log(e)
									done(e);
								} )})
							}).catch (e => {
								console.log(e)
								done(e);
							} )})
						}).catch (e => {
							console.log(e)
							done(e);
						} )})
					}).catch (e => {
						console.log(e)
						done(e);
					} )})
				}).catch (e => {
					console.log(e)
					done(e);
				} )})
			}).catch (e => {
				console.log(e)
				done(e);
			})
		}).catch (e => {
			console.log(e)
			done(e);
		})
	})

	it('Fetch the last 50 (default) messages from channel1 as user3 (non member, non admin)', (done) => {
		supertest(app)
		.get(`/channel/${channel1.id}/fetch/`)
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
	
	it('Fetch the last 50 (default) messages from channel1 as user2 (member, non admin)', (done) => {
		supertest(app)
		.get(`/channel/${channel1.id}/fetch/`)
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match([ 
					{
						author: users.user2.id,
						channelID: channel1.id,
						content: `"Don't ever, for any reason, do anything, to anyone, for any reason, ever, no matter what, no matter where, or who, or who you are with, or where you are going, or where you've been, ever, for any reason whatsoever. - Michael Scott"`,
						createdAt: messages[9].createdAt,
						id: messages[9].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "J'ai edite ce message huehuehue",
						edited: true,
						createdAt: messages[8].createdAt,
						id: messages[8].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: 'Bah je sais pas non plus',
						createdAt: messages[7].createdAt,
						id: messages[7].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Mais je sais pas quoi ecrire',
						createdAt: messages[6].createdAt,
						id: messages[6].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "Okay, j'ai besoins d'écrire d'autres trucs",
						createdAt: messages[5].createdAt,
						id: messages[5].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: "Haha, j'ai vus avant que tu delete",
						createdAt: messages[4].createdAt,
						id: messages[4].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Message deleted.',
						removed: true,
						createdAt: messages[3].createdAt,
						id: messages[3].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "C'est des messages de test",
						createdAt: messages[2].createdAt,
						id: messages[2].id
					},
					{
						author: users.user2.id,
						channelID: channel1.id,
						content: 'Salut',
						createdAt: messages[1].createdAt,
						id: messages[1].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Bonjour',
						createdAt: messages[0].createdAt,
						id: messages[0].id
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
	
	it('Fetch the last 50 (default) messages from channel1 as user1 (member, admin)', (done) => {
		supertest(app)
		.get(`/channel/${channel1.id}/fetch/`)
		.send({
			token: users.user1.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match([ 
					{
						author: users.user2.id,
						channelID: channel1.id,
						content: `"Don't ever, for any reason, do anything, to anyone, for any reason, ever, no matter what, no matter where, or who, or who you are with, or where you are going, or where you've been, ever, for any reason whatsoever. - Michael Scott"`,
						createdAt: messages[9].createdAt,
						id: messages[9].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "J'ai edite ce message huehuehue",
						edited: true,
						createdAt: messages[8].createdAt,
						id: messages[8].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: 'Bah je sais pas non plus',
						createdAt: messages[7].createdAt,
						id: messages[7].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Mais je sais pas quoi ecrire',
						createdAt: messages[6].createdAt,
						id: messages[6].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "Okay, j'ai besoins d'écrire d'autres trucs",
						createdAt: messages[5].createdAt,
						id: messages[5].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: "Haha, j'ai vus avant que tu delete",
						createdAt: messages[4].createdAt,
						id: messages[4].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Message deleted.',
						removed: true,
						createdAt: messages[3].createdAt,
						id: messages[3].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "C'est des messages de test",
						createdAt: messages[2].createdAt,
						id: messages[2].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: 'Salut',
						createdAt: messages[1].createdAt,
						id: messages[1].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Bonjour',
						createdAt: messages[0].createdAt,
						id: messages[0].id
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
	
	it('Fetch the last 50 (default) messages from channel1 as admin (superadmin)', (done) => {
		supertest(app)
		.get(`/channel/${channel1.id}/fetch/`)
		.send({
			token: users.admin.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match([ 
					{
						author: users.user2.id,
						channelID: channel1.id,
						content: `"Don't ever, for any reason, do anything, to anyone, for any reason, ever, no matter what, no matter where, or who, or who you are with, or where you are going, or where you've been, ever, for any reason whatsoever. - Michael Scott"`,
						createdAt: messages[9].createdAt,
						id: messages[9].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "J'ai edite ce message huehuehue",
						edited: true,
						createdAt: messages[8].createdAt,
						id: messages[8].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: 'Bah je sais pas non plus',
						createdAt: messages[7].createdAt,
						id: messages[7].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Mais je sais pas quoi ecrire',
						createdAt: messages[6].createdAt,
						id: messages[6].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "Okay, j'ai besoins d'écrire d'autres trucs",
						createdAt: messages[5].createdAt,
						id: messages[5].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: "Haha, j'ai vus avant que tu delete",
						createdAt: messages[4].createdAt,
						id: messages[4].id
					},
					{
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Et puis celui là vas être delete d\'ailleurs',
						removed: true,
						createdAt: messages[3].createdAt,
						id: messages[3].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "C'est des messages de test",
						createdAt: messages[2].createdAt,
						id: messages[2].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: 'Salut',
						createdAt: messages[1].createdAt,
						id: messages[1].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Bonjour',
						createdAt: messages[0].createdAt,
						id: messages[0].id
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
	
	it('Fetch the last 5 messages from channel1 as user2 (member, non admin)', (done) => {
		supertest(app)
		.get(`/channel/${channel1.id}/fetch/5`)
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			
			try {
				res.body.should.match([ 
					{
						author: users.user2.id,
						channelID: channel1.id,
						content: `"Don't ever, for any reason, do anything, to anyone, for any reason, ever, no matter what, no matter where, or who, or who you are with, or where you are going, or where you've been, ever, for any reason whatsoever. - Michael Scott"`,
						createdAt: messages[9].createdAt,
						id: messages[9].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "J'ai edite ce message huehuehue",
						edited: true,
						createdAt: messages[8].createdAt,
						id: messages[8].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: 'Bah je sais pas non plus',
						createdAt: messages[7].createdAt,
						id: messages[7].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: 'Mais je sais pas quoi ecrire',
						createdAt: messages[6].createdAt,
						id: messages[6].id
					}, {
						author: users.user1.id,
						channelID: channel1.id,
						content: "Okay, j'ai besoins d'écrire d'autres trucs",
						createdAt: messages[5].createdAt,
						id: messages[5].id
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
	
	it('Fetch the last 2 messages from channel1 as user2 (member, non admin), starting from 5 messages ago', (done) => {
		supertest(app)
		.get(`/channel/${channel1.id}/fetch/2/${messages[5].id}`)
		.send({
			token: users.user2.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match([ 
					{
						author: users.user1.id,
						channelID: channel1.id,
						content: "Okay, j'ai besoins d'écrire d'autres trucs",
						createdAt: messages[5].createdAt,
						id: messages[5].id
					}, {
						author: users.user2.id,
						channelID: channel1.id,
						content: "Haha, j'ai vus avant que tu delete",
						createdAt: messages[4].createdAt,
						id: messages[4].id
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
