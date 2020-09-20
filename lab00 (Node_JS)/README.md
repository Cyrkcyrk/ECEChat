# Initiation to NodeJS.

This code is supposed to be our first exercise with NodeJS and NPM. It create a simple webserver listening on the port 8080, and it answer a simple "Hello World" page.

- Launch `npm install` in the current directory
- Launch `node index.js` or `npm run dev`
- Open `http://localhost:8080/` in your browser. It shouls write "Hello World".
- Open `http://localhost:8080/hello?name=Cyrille` in your browser. It should write "Hello Cyrille". You can change the name in the URL, and refresh the webpage, which should change accordingly.
- Open `http://localhost:8080/cyrille` in your browser. It should show a small presentation of myself.
- If you open any other route, it should return an error 404. 
 