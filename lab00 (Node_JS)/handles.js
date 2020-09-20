module.exports.serverHandle = function (app) {
	app.get('/', function (req, res) {
 
		const content = '<!DOCTYPE html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8" />' +
		'        <title>ECE AST</title>' +
		'    </head>' + 
		'    <body>' +
		'         <p>Hello World !</p>' +
		'    </body>' +
		'</html>'
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(content);
		res.end();
	})
	.get('/hello', function (req, res) {
		
		if(typeof(req.query.name) !== "undefined")
		{
			const content = '<!DOCTYPE html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8" />' +
			'        <title>ECE AST</title>' +
			'    </head>' + 
			'    <body>' +
			'         <p>Hello '+ req.query.name +'!</p>' +
			'    </body>' +
			'</html>'
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(content);
			res.end();
		}
		else
		{
			const content = '<!DOCTYPE html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8" />' +
			'        <title>ECE AST</title>' +
			'    </head>' + 
			'    <body>' +
			'         <form method="GET" action="./hello">' +
			'             <label for="name">Please enter your name</label>' +
			'             <input type="text" name="name">' +
			'             <input type="submit">' +
			'         </form>' +
			'    </body>' +
			'</html>'
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(content);
			res.end();
		}
	})
	.get('/cyrille', function (req, res) {

		const content = '<!DOCTYPE html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8" />' +
		'        <title>ECE AST</title>' +
		'    </head>' + 
		'    <body>' +
		'         <p>Hello ! <br> My name is Cyrille, and i\'m a student at ECE-Paris and 42-Paris who enjoy programming. <br>I\'ve been trying for the fast year and a half to form myself to NodeJS (I focused more on the back-end part, not the "create a webpage" and front-end one), so this exercise didn\'t felt that difficult.</p>' +
		'    </body>' +
		'</html>'
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(content);
		res.end();
	})
	.use(function (req, res) {
		const content = '<!DOCTYPE html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8" />' +
		'        <title>ECE AST</title>' +
		'    </head>' + 
		'    <body>' +
		'         <p>ERROR 404: Page not found.</p>' +
		'    </body>' +
		'</html>'
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write(content);
		res.end();
	});
}