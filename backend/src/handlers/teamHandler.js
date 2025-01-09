const Team = require('../models/Team');
const Game = require('../models/Game');

class TeamHandler {
    constructor(io) {
        this.io = io;
    }

    async handleTeamJoin(socket, { teamId, userId, gameId }) {
        try {
            // Join team-specific socket room
            socket.join(`team:${teamId}`);
            
            // Update team member status
            await Team.findByIdAndUpdate(
                teamId,
                { $addToSet: { activeMembers: userId } }
            );

            // Notify team members
            this.io.to(`team:${teamId}`).emit('team:memberJoined', { userId });

            // Get current game state
            const gameState = await Game.findById(gameId);
            socket.emit('game:state', gameState);
        } catch (error) {
            socket.emit('error', { message: 'Failed to join team' });
        }
    }

    async handleMove(socket, { teamId, userId, cell, value, gameId }) {
        try {
            // Validate move
            const game = await Game.findById(gameId);
            const isValid = this.validateMove(game.grid, cell, value);

            if (isValid) {
                // Update game state
                await Game.findByIdAndUpdate(gameId, {
                    [`grid.${cell.row}.${cell.col}`]: value,
                    $push: { moves: { userId, cell, value, timestamp: new Date() } }
                });

                // Broadcast move to team
                this.io.to(`team:${teamId}`).emit('team:move', {
                    userId,
                    cell,
                    value
                });

                // Check if puzzle is complete
                if (this.isPuzzleComplete(game.grid)) {
                    this.handleGameCompletion(teamId, gameId);
                }
            } else {
                socket.emit('move:invalid', { cell });
            }
        } catch (error) {
            socket.emit('error', { message: 'Failed to process move' });
        }
    }

    validateMove(grid, cell, value) {
        // Check row
        if (grid[cell.row].includes(value)) return false;
        
        // Check column
        if (grid.some(row => row[cell.col] === value)) return false;
        
        // Check sub-grid
        const subGridRow = Math.floor(cell.row / 3) * 3;
        const subGridCol = Math.floor(cell.col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[subGridRow + i][subGridCol + j] === value) {
                    return false;
                }
            }
        }
        
        return true;
    }

    async handleGameCompletion(teamId, gameId) {
        try {
            const game = await Game.findById(gameId);
            const team = await Team.findById(teamId);
            
            // Calculate team score
            const score = this.calculateTeamScore(game.moves, game.startTime);
            
            // Update team statistics
            await Team.findByIdAndUpdate(teamId, {
                $inc: { 
                    gamesCompleted: 1,
                    totalScore: score
                },
                $push: { 
                    gameHistory: {
                        gameId,
                        score,
                        completionTime: new Date()
                    }
                }
            });

            // Notify team members
            this.io.to(`team:${teamId}`).emit('game:completed', {
                score,
                moves: game.moves,
                completionTime: new Date()
            });
        } catch (error) {
            this.io.to(`team:${teamId}`).emit('error', {
                message: 'Failed to process game completion'
            });
        }
    }

    calculateTeamScore(moves, startTime) {
        const completionTime = new Date() - new Date(startTime);
        const baseScore = 1000;
        const timeBonus = Math.max(0, 500 - Math.floor(completionTime / 1000));
        const movesPenalty = moves.length * 10;
        
        return baseScore + timeBonus - movesPenalty;
    }

    isPuzzleComplete(grid) {
        return grid.every(row => row.every(cell => cell !== 0));
    }
}

module.exports = TeamHandler;