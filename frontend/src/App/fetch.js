let MD5 = require('md5')
let websiteURL = 'http://localhost:3001'

module.exports = {
	url : websiteURL,
	gravatar : (email, userID) => {
		
		let hash
		if(email) {
			email = email.trim().toLowerCase()
			if(email.length > 3)
				hash = MD5(email)
			else
				hash = MD5(userID)
		}
		else
			hash = MD5(userID)
		let link = `https://www.gravatar.com/avatar/${hash}?s=100&d=identicon`
		
		
		console.log(hash)
		return (link)
	},
	
	get : (token, route) => {
		return new Promise((resolve, reject) => {
			try {
				const requestOptions = {
					method: 'GET',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				};
				fetch(`${websiteURL}/${route}`, requestOptions)
				.then(response => {
					response.json()
					.then(data => {
						if(response.status >= 200 && response.status < 300)
							resolve({
								status : response.status,
								content : data
							})
						else 
							reject({
								status : response.status,
								error : data
							})
					})
				})
			} catch (e) {
				reject({
					status : -1,
					error : e
				})
			}
		})
	},
	
	post : (token, route, body) => {
		return new Promise((resolve, reject) => {
			try {
				if(typeof(body) == "object")
					body = JSON.stringify(body);
				const requestOptions = {
					method: 'POST',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: body
				};
				fetch(`${websiteURL}/${route}`, requestOptions)
				.then(response => {
					response.json()
					.then(data => {
						if(response.status >= 200 && response.status < 300)
							resolve({
								status : response.status,
								content : data
							})
						else 
							reject({
								status : response.status,
								error : data
							})
					})
				})
			} catch (e) {
				reject({
					status : -1,
					error : e
				})
			}
		})
	},
	postFile : (token, route, data) => {
		return new Promise((resolve, reject) => {
			try {
				const requestOptions = {
					method: 'POST',
					headers: { 
						'Authorization': `Bearer ${token}`
					},
					body: data
				};
				fetch(`${websiteURL}/${route}`, requestOptions)
				.then(response => {
					response.json()
					.then(data => {
						if(response.status >= 200 && response.status < 300)
							resolve({
								status : response.status,
								content : data
							})
						else 
							reject({
								status : response.status,
								error : data
							})
					})
				})
			} catch (e) {
				reject({
					status : -1,
					error : e
				})
			}
		})
	},
	
	put : (token, route, body) => {
		return new Promise((resolve, reject) => {
			try {
				if(typeof(body) == "object")
					body = JSON.stringify(body);
				const requestOptions = {
					method: 'PUT',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: body
				};
				fetch(`${websiteURL}/${route}`, requestOptions)
				.then(response => {
					response.json()
					.then(data => {
						if(response.status >= 200 && response.status < 300)
							resolve({
								status : response.status,
								content : data
							})
						else 
							reject({
								status : response.status,
								error : data
							})
					})
				})
			} catch (e) {
				reject({
					status : -1,
					error : e
				})
			}
		})
	},
	
	delete : (token, route, body) => {
		return new Promise((resolve, reject) => {
			try {
				if(typeof(body) == "object")
					body = JSON.stringify(body)
				
				const requestOptions = {
					method: 'DELETE',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: body
				};
				fetch(`${websiteURL}/${route}`, requestOptions)
				.then(response => {
					response.json()
					.then(data => {
						if(response.status >= 200 && response.status < 300)
							resolve({
								status : response.status,
								content : data
							})
						else 
							reject({
								status : response.status,
								error : data
							})
					})
				})
			} catch (e) {
				reject({
					status : -1,
					error : e
				})
			}
		})
	}
}

