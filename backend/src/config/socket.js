// backend/src/config/socket.js
const socketIo = require('socket.io');

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinGame', ({ gameId, userId, mode }) => {
      socket.join(gameId);
      io.to(gameId).emit('playerJoined', { userId, gameId });
    });

    socket.on('makeMove', async ({ gameId, position, value, userId }) => {
      io.to(gameId).emit('moveMade', { position, value, userId });
    });

    socket.on('updatePossibleValues', ({ gameId, position, values }) => {
      socket.to(gameId).emit('possibleValuesUpdated', { position, values });
    });
  });

  return io;
}

module.exports = initializeSocket; 
