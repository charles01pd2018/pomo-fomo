import { io } from 'socket.io-client';
const PORT = process.env.REACT_APP_SOCKET_PORT || 3002;
const socket = io(`http://localhost:${PORT}`);

function joinRoomAndSubscribe(username, roomName, status_cb, user_join_cb) {
  // Emit an event to the server to join the socket room
  socket.emit('joinRoom', username, roomName);

  // Add a listener for the room status
  socket.on('status', (status, timeLeft) => status_cb(null, status, timeLeft));

  socket.on('userJoined', (newUsername) => user_join_cb(null, `${newUsername} joined!`));
}

export {
  joinRoomAndSubscribe
};