
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

let userAdmin = {}, userNormal = {}

describe('users', () => {

	
	it('add one admin user', (done) => {
		db.admin.clear().then(_ => {
			supertest(app)
			.post('/user')
			.send({
				username: 'admin_test',
				password: 'admin',
				adminPassword : 'adminP4ssword'
			})
			.expect(201)
			.expect('Content-Type', /json/)
			.expect((res) => {
				try {
					res.body.should.match({
						username: 'admin_test',
						scope: {
							user: true,
							test: true,
							admin: true
						},
						channels: [],
						createdAt: /^\d+$/,
						id: /^\w+-\w+-\w+-\w+-\w+$/
					})
					userAdmin = res.body
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
	
	it('add one normal user', (done) => {
		supertest(app)
		.post('/user')
		.send({
			username: 'user_test',
			password: 'password'
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					username: 'user_test',
					scope: {
						user: true,
						test: true,
						admin: false
					},
					channels: [],
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/
				})
				userNormal = res.body
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

	it('loging in as admin', (done) => {
		supertest(app)
		.get('/login')
		.send({
			username: 'admin_test',
			password: "admin"
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.\w+\.\w+/)
			} catch (e) {
				throw new Error(e)
			}
			userAdmin.token = res.body
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('loging in as user', (done) => {
		supertest(app)
		.get('/login')
		.send({
			username: 'user_test',
			password: 'password'
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.\w+\.\w+/)
			} catch (e) {
				throw new Error(e);
			}
			userNormal.token = res.body
		})
		.end((err, res) => {
			if (err) {
				console.error(res.error);
			}
			done(err);
		});
	})
	
	it('get user list as no one', (done) => {
		supertest(app)
		.get('/users')
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
	
	it('get user list with wrong token', (done) => {
		supertest(app)
		.get('/users')
		.send({
			token: userNormal.token.trim(0, -2) + "aa"
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					// status: 401,
					// text: /^{"name":"JsonWebTokenError","message":"[^"]+"}$/,
					// method: 'GET',
					// path: '/users'
					name: "JsonWebTokenError",
					message: /[^"]+/
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
	
	it('get user list as user', (done) => {
		supertest(app)
		.get('/users')
		.send({
			token: userNormal.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type : 2,
					code : 401,
					name : "missingPermission",
					message : "You must be an admin to do this."
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
	
	it('get user list as admin', (done) => {
		supertest(app)
		.get('/users')
		.send({
			token: userAdmin.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				if(res.body[0].username == "admin_test")
					res.body.should.match([ 
						{
							username: 'admin_test',
							scope: { user: true, test: true, admin: true },
							channels: [],
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						}, {
							username: 'user_test',
							scope: { user: true, test: true, admin: false },
							channels: [],
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						} 
					])
				else
					res.body.should.match([ 
						{
							username: 'user_test',
							scope: { user: true, test: true, admin: false },
							channels: [],
							createdAt: /^\d+$/,
							id: /^\w+-\w+-\w+-\w+-\w+$/
						}, {
							username: 'admin_test',
							scope: { user: true, test: true, admin: true },
							channels: [],
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

	it('delete OTHER user as normal', (done) => {
		supertest(app)
		.delete('/user/' + userAdmin.id)
		.send({
			token: userNormal.token
		})
		.expect(401)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					type : 2,
					code : 401,
					name : "missingPermission",
					message : "You must be an admin to do this."
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
	
	it('delete self user', (done) => {
		supertest(app)
		.delete('/user/' + userNormal.id)
		.send({
			token: userNormal.token
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.expect((res) => {
			try {
				res.body.should.match({
					username: 'user_test',
					scope: {
						user: true,
						test: true,
						admin: false
					},
					channels: [],
					createdAt: /^\d+$/,
					id: /^\w+-\w+-\w+-\w+-\w+$/,
					deleted : true
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
