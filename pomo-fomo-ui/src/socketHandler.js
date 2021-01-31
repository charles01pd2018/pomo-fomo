import { io } from 'socket.io-client';
const PORT = process.env.REACT_APP_SOCKET_PORT || 3002;
const socket = io(`http://localhost:${PORT}`);

function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

export { subscribeToTimer };