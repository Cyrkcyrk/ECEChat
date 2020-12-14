
let websiteURL = 'http://localhost:3001'

module.exports = {
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

