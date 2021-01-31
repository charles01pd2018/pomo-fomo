const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const PORT = process.env.SOCKET_PORT;

const WAITING_TIME_LENGTH = 30;
const POMODORO_TIME_LENGTH = 15; // seconds
const ACTIVITY_TIME_LENGTH = 10;
const ACTIVITY_CHOICES = [
  'yoga',
  'dance',
];
const rooms = {};

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', socket => {
  socket.on('joinRoom', (username, roomName) => {

    console.log(`${username} is joining room ${roomName}`);

    socket.join(roomName);

    if (!rooms[roomName]) {
      rooms[roomName] = {
        status: 'waiting',
        timer: WAITING_TIME_LENGTH,
        lastActivity: null
      };
      setInterval(() => {
        console.log(rooms[roomName].status, rooms[roomName].timer);
        socket.emit('status', rooms[roomName].status, rooms[roomName].timer);
        socket.to(roomName).emit('status', rooms[roomName].status, (rooms[roomName].timer)--);

        // If the timer is now 0, handle accordingly
        if (rooms[roomName].timer === 0) {
          // If we were waiting, enter a pomodoro period
          if (rooms[roomName].status === 'waiting') {
            rooms[roomName].status = 'pomodoro';
            rooms[roomName].timer = POMODORO_TIME_LENGTH;
          }

          // If a pomodoro period ends, start a new activity
          else if (rooms[roomName].status === 'pomodoro') {
            let randomActivity = ACTIVITY_CHOICES[Math.floor(Math.random() * ACTIVITY_CHOICES.length)];
            while (randomActivity === rooms[roomName].lastActivity) {
              randomActivity = ACTIVITY_CHOICES[Math.floor(Math.random() * ACTIVITY_CHOICES.length)];
            }
            rooms[roomName].lastActivity = randomActivity; 
            rooms[roomName].status = randomActivity;
            rooms[roomName].timer = ACTIVITY_TIME_LENGTH;
          } 

          // If an activity period ends, enter back into pomodoro
          else {
            rooms[roomName].status = 'pomodoro';
            rooms[roomName].timer = POMODORO_TIME_LENGTH;
          }
        }

      }, 1000);
    } else {
      socket.to(roomName).emit('userJoined', username);
    }

    console.log(rooms);

  });
});

io.listen(PORT);
console.log(`Socket server listening on port ${PORT}`);