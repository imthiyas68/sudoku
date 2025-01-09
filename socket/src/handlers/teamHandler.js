// socket/src/handlers/teamHandler.js
const teamHandler = (io, socket, roomManager) => {
  // Create team
  socket.on('createTeam', ({ teamId, userId, teamName }) => {
    try {
      const team = roomManager.createTeam(teamId, userId, teamName);
      socket.join(`team_${teamId}`);
      socket.emit('teamCreated', { team });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Join team
  socket.on('joinTeam', ({ teamId, userId }) => {
    try {
      const team = roomManager.joinTeam(teamId, userId);
      socket.join(`team_${teamId}`);
      
      io.to(`team_${teamId}`).emit('teamUpdated', { team });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Team chat
  socket.on('teamMessage', ({ teamId, userId, message }) => {
    io.to(`team_${teamId}`).emit('teamMessage', {
      userId,
      message,
      timestamp: Date.now()
    });
  });
};

module.exports = { teamHandler };
