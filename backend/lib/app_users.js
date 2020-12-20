const md5 = require('md5')
var request = require('request');
var path = require('path');
const multer = require('multer');

const db = require('./db')
const middleware = require('./middleware')



// configure storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.resolve(__dirname, `../public/img/`));
	},
	filename: (req, file, cb) => {
		/*
		  uuidv4() will generate a random ID that we'll use for the
		  new filename. We use path.extname() to get
		  the extension from the original file name and add that to the new
		  generated ID. These combined will create the file name used
		  to save the file on the server and will be available as
		  req.file.pathname in the router handler.
		*/
		const newFilename = `Avatar${req.userData.id}` //${path.extname(file.originalname)}`;
		cb(null, newFilename);
	},
});
// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });



module.exports = (app) => {
	app.get('/users', middleware.admin, (req, res) => {
		db.users.list()
		.then( users => {
			res.json(users)
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})
	
	app.get('/usernames', middleware.admin, (req, res) => {
		db.users.listUsername()
		.then( users => {
			res.json(users)
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})

	app.post('/user', (req, res) => {
		db.users.create(req.body)
		.then( user => {
			res.status(201).json(user);
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})

	app.get('/user/:id', (req, res) => {
		db.users.get(req.params.id)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})
	
	app.get('/user', middleware.default, (req, res) => {
		db.users.getLogged(req.userData.id)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})
	
	
	
	app.get('/username/:username', (req, res) => {
		db.users.getFromUsername(req.params.username)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})

	app.put('/user/:id', middleware.adminOrSelf, (req, res) => {
		db.users.updateSelf(req.params.id, req.body)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})
	app.delete('/user/:id', middleware.adminOrSelf, (req, res) => {
		db.users.delete(req.params.id)
		.then( user => {
			res.json(user)
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})
	app.delete('/username/:username', middleware.admin, (req, res) => {
		db.users.deleteUsername(req.params.username)
		.then(user => {
			res.json(user)
		})
		.catch(e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})
	
	app.get('/user/:id/avatar', (req, res) => {
		db.users.getLogged(req.params.id)
		.then( user => {
			if(user.avatar) {
				switch(user.avatar.type) {
					case "Default": 
						let fileName = ''
						res.sendFile(path.resolve(__dirname, `../public/img/Avatar${user.avatar.nb}.png`))
						break
					case "Custom":
						res.sendFile(path.resolve(__dirname, `../public/img/Avatar${user.id}`));
						break
					case "Gravatar":
					default:
						let hash
						if(user.email)
							hash = md5(user.email.trim().toLowerCase())
						else
							hash = md5(user.id)
						let link = `https://www.gravatar.com/avatar/${hash}?s=500&d=identicon`
						request(link).pipe(res)
						break
				}
			}
			else {
				let hash
				if(user.email)
					hash = md5(user.email.trim().toLowerCase())
				else
					hash = md5(user.id)
				let link = `https://www.gravatar.com/avatar/${hash}?s=500&d=identicon`
				request(link).pipe(res)
			}
		})
		.catch( e => {
			// console.error(e)
			if (typeof(e.type) != "undefined" && e.type == 2)
				res.status(e.code).json(e)
			else 
				res.status(403).json(e)
		});
	})
	
	app.post('/uploadAvatar', middleware.default, upload.single('selectedFile'), (req, res) => {
		res.status(201).json({
			link : `img/Avatar${req.userData.id}`
		});
	})
}