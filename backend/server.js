// Chemin d'accès pour le fichier .env
require("dotenv").config({ path: "./config/.env" });

// Permet d'importer le package http de Node
const http = require("http");

// Permet d'importer l'application
const app = require("./app");

// Indique à l'application sur quel port elle doit être lancée
app.set("port", process.env.PORT || 3000);

// Crée le serveur
const server = http.createServer(app);

// Indique le port qui doit utilisé par le serveur
server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

// Socket.io
// const io = require('socket.io')(server);
// const cfg = require('./config.json');
// const tw = require('node-tweet-stream')(cfg);

// tw.track('socket.io');
// tw.track('javascript');

// io.on('connection', function(socket) {
//     console.log('A user is connected');
//     socket.on('chatPost', function(post) {
//         console.log('message reçu : ' + post);
//     })
// })

// io.on('connection', () => {
//     console.log('A user is connected');
//     socket.on('chatPost', function(post) {
//         console.log('message reçu : ' + post);
//     })
// })
