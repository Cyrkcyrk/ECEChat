var jwt = require('jsonwebtoken');
var secret = 'shhhhh'


let tokenLib = {
	generate : (payload) => {
		return jwt.sign(payload, secret, {
			algorithm : 'HS256',
			expiresIn : 60*60
		})
	},
	check : (token) => {
		return new Promise((resolve) => {
			
			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					resolve({
						status : false,
						error : err
					})
				}
				else {
					resolve({
						status : true,
						value : decoded
					})
				}
			});
			
		})
	}
}

module.exports = tokenLib