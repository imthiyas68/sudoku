// socket/src/handlers/challengeHandler.js
const generatePuzzle = require('../../../backend/src/utils/generatePuzzle');
class ChallengeHandler {
  constructor(io, roomManager) {
    this.io = io;
    this.roomManager = roomManager;
    this.activeGames = new Map();
  }

  initialize(socket) {
    // Handle joining a challenge
    socket.on('challenge:join', async (data) => {
      try {
        const { challengeId, userId } = data;
        const challengeRoom = `challenge:${challengeId}`;
        
        // Join the socket room
        socket.join(challengeRoom);
        
        // Get or create game state
        let gameState = this.activeGames.get(challengeId);
        
        if (!gameState) {
          // Initialize new game
          gameState = {
            grid: generatePuzzle(9), // 9x9 grid for challenges
            participants: new Set(),
            startTime: Date.now(),
            timeLimit: 30 * 60 * 1000, // 30 minutes in milliseconds
            scores: new Map()
          };
          this.activeGames.set(challengeId, gameState);
        }
        
        // Add participant
        gameState.participants.add(userId);
        
        // Send initial state to the joining user
        socket.emit('challenge:state', {
          grid: gameState.grid,
          timeRemaining: gameState.timeLimit - (Date.now() - gameState.startTime),
          participants: gameState.participants.size,
          scores: Array.from(gameState.scores.entries()).map(([id, score]) => ({
            userId: id,
            score
          }))
        });

        // Notify others
        this.broadcastGameState(challengeId);
        
      } catch (error) {
        console.error('Error in challenge:join:', error);
        socket.emit('error', { message: 'Failed to join challenge' });
      }
    });

    // Handle moves
    socket.on('challenge:move', async (data) => {
      try {
        const { challengeId, row, col, value } = data;
        const gameState = this.activeGames.get(challengeId);
        
        if (!gameState) {
          throw new Error('Game not found');
        }

        // Validate and apply move
        // For now, we'll accept all moves - you can add validation later
        gameState.grid[row][col] = value;

        // Broadcast the updated state
        this.broadcastGameState(challengeId);
        
      } catch (error) {
        console.error('Error in challenge:move:', error);
        socket.emit('error', { message: 'Failed to process move' });
      }
    });

    // Handle leaving
    socket.on('challenge:leave', (data) => {
      const { challengeId, userId } = data;
      const gameState = this.activeGames.get(challengeId);
      
      if (gameState) {
        gameState.participants.delete(userId);
        socket.leave(`challenge:${challengeId}`);
        
        if (gameState.participants.size === 0) {
          this.activeGames.delete(challengeId);
        } else {
          this.broadcastGameState(challengeId);
        }
      }
    });
  }

  broadcastGameState(challengeId) {
    const gameState = this.activeGames.get(challengeId);
    if (!gameState) return;

    this.io.to(`challenge:${challengeId}`).emit('challenge:update', {
      grid: gameState.grid,
      participants: gameState.participants.size,
      timeRemaining: gameState.timeLimit - (Date.now() - gameState.startTime),
      scores: Array.from(gameState.scores.entries()).map(([id, score]) => ({
        userId: id,
        score
      }))
    });
  }
}

module.exports = function(io, socket, roomManager) {
  const handler = new ChallengeHandler(io, roomManager);
  handler.initialize(socket);
};