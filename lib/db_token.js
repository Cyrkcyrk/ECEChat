const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const bcrypt = require('bcrypt');
const saltRounds = 10;

var tokenLib = require('./tokenLib');

db_token = {
	checkPassword : (userInfos, db) => {
		return new Promise ((resolve, reject) => {
			db.c.users.getIDFromUsername(userInfos.username, db).then(userID => {
				db.get(`users:${userID}`, function(err, user) {
					if (err) {
						reject({
							"type" : 1,
							"error" : err
						})
					}
					else {
						user = JSON.parse(user);
						bcrypt.compare(userInfos.password, user.hashedPassword, function(err, result) {
							if(err) {
								reject({
									"type" : 1,
									"error" : err
								})
							}
							else if (!result)
								reject({
									"type" : 2,
									"code" : 401,
									"name" : "badPassword",
									"message" : "Password incorrect"
								})
							else
								delete user.hashedPassword
								resolve(merge(user, {id: userID}))
						});
					}
				})
			})
			.catch (e => {
				reject(e);
			})
		})
	},
	login : (userInfos, db) => {
		return new Promise ((resolve, reject) => {
			if(typeof(userInfos.username) != "string") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingUsername",
					"message" : "Invalid user (username)"
				});
			}
			else if(typeof(userInfos.password) != "string") {
				reject({
					"type" : 2,
					"code" : 400,
					"name" : "missingPassword",
					"message" : "Invalid user (password)"
				});
			}
			else {
				db_token.checkPassword(userInfos, db).then( user => {
					resolve(
						tokenLib.generate(user)
					)
				}).catch(e => {
					reject(e);
				})
			}
		})
	}
}

module.exports = db_token;
