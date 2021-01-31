const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const PORT = process.env.SOCKET_PORT;

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', socket => {
  socket.on('subscribeToTimer', interval => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      socket.emit('timer', new Date());
    }, interval);
  });
});

io.listen(PORT);
console.log(`Socket server listening on port ${PORT}`);