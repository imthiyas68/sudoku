const Game = require('../models/Game');
const User = require('../models/User');
const { getConfigForGrade, calculateTimeBonus } = require('../utils/gameConfig');

class ChallengeHandler {
    constructor(io) {
        this.io = io;
        this.activeChallenges = new Map();
        this.globalLeaderboard = new Map();
    }

    async initializeChallenge({ challengeId, grade, difficulty, duration }) {
        const challenge = {
            id: challengeId,
            startTime: new Date(),
            endTime: new Date(Date.now() + duration * 60000), // duration in minutes
            participants: new Set(),
            leaderboard: [],
            config: getConfigForGrade(grade),
            difficulty,
            status: 'ACTIVE'
        };
        
        this.activeChallenges.set(challengeId, challenge);
        
        // Schedule challenge end
        setTimeout(() => {
            this.endChallenge(challengeId);
        }, duration * 60000);

        return challenge;
    }

    async handlePlayerJoin(socket, { userId, challengeId }) {
        try {
            const challenge = this.activeChallenges.get(challengeId);
            if (!challenge || challenge.status !== 'ACTIVE') {
                throw new Error('Challenge not available');
            }

            socket.join(`challenge:${challengeId}`);
            challenge.participants.add(userId);

            // Generate puzzle if not exists
            let game = await Game.findOne({ challengeId });
            if (!game) {
                game = await this.createChallengePuzzle(challenge);
            }

            // Initialize player state
            const playerState = {
                startTime: new Date(),
                moves: 0,
                mistakes: 0,
                score: 0
            };
            this.globalLeaderboard.set(socket.id, playerState);

            socket.emit('challenge:state', {
                grid: game.grid,
                timeRemaining: challenge.endTime - new Date(),
                participants: Array.from(challenge.participants).length,
                leaderboard: challenge.leaderboard.slice(0, 10)
            });

            this.broadcastChallengeUpdate(challengeId);
        } catch (error) {
            socket.emit('error', { message: 'Failed to join challenge' });
        }
    }

    async handleMove(socket, { challengeId, cell, value }) {
        const playerState = this.globalLeaderboard.get(socket.id);
        if (!playerState) return;

        try {
            const game = await Game.findOne({ challengeId });
            const isValid = this.validateMove(game.grid, cell, value);

            if (isValid) {
                playerState.moves++;
                await this.updatePlayerMove(socket.id, challengeId, cell, value);
                socket.emit('move:valid', { cell, value });

                if (this.isGameComplete(game.grid)) {
                    await this.handlePlayerCompletion(socket, challengeId);
                }
            } else {
                playerState.mistakes++;
                socket.emit('move:invalid', { cell });
            }
        } catch (error) {
            socket.emit('error', { message: 'Failed to process move' });
        }
    }

    async handlePlayerCompletion(socket, challengeId) {
        const challenge = this.activeChallenges.get(challengeId);
        const playerState = this.globalLeaderboard.get(socket.id);

        if (!challenge || !playerState) return;

        try {
            const completionTime = new Date() - playerState.startTime;
            const score = this.calculateChallengeScore(playerState, completionTime, challenge.config);

            // Update leaderboard
            challenge.leaderboard.push({
                userId: socket.userId,
                score,
                completionTime,
                moves: playerState.moves,
                mistakes: playerState.mistakes
            });

            // Sort leaderboard by score
            challenge.leaderboard.sort((a, b) => b.score - a.score);

            // Notify player and broadcast update
            socket.emit('challenge:completed', {
                score,
                rank: challenge.leaderboard.findIndex(entry => entry.userId === socket.userId) + 1,
                leaderboard: challenge.leaderboard.slice(0, 10)
            });

            this.broadcastChallengeUpdate(challengeId);
        } catch (error) {
            socket.emit('error', { message: 'Failed to process completion' });
        }
    }

    async endChallenge(challengeId) {
        const challenge = this.activeChallenges.get(challengeId);
        if (!challenge) return;

        challenge.status = 'COMPLETED';

        // Award certificates and update global rankings
        await this.processChallengeResults(challengeId);

        // Notify all participants
        this.io.to(`challenge:${challengeId}`).emit('challenge:ended', {
            finalLeaderboard: challenge.leaderboard.slice(0, 10),
            totalParticipants: challenge.participants.size
        });

        // Cleanup
        this.activeChallenges.delete(challengeId);
    }

    async processChallengeResults(challengeId) {
        const challenge = this.activeChallenges.get(challengeId);
        if (!challenge) return;

        // Update global rankings and generate certificates
        const topPlayers = challenge.leaderboard.slice(0, 3);
        for (const player of topPlayers) {
            await User.findByIdAndUpdate(player.userId, {
                $inc: { challengeWins: 1 },
                $push: {
                    certificates: {
                        type: 'CHALLENGE',
                        challengeId,
                        rank: challenge.leaderboard.indexOf(player) + 1,
                        date: new Date()
                    }
                }
            });
        }
    }

    broadcastChallengeUpdate(challengeId) {
        const challenge = this.activeChallenges.get(challengeId);
        if (!challenge) return;

        this.io.to(`challenge:${challengeId}`).emit('challenge:update', {
            participants: challenge.participants.size,
            leaderboard: challenge.leaderboard.slice(0, 10),
            timeRemaining: challenge.endTime - new Date()
        });
    }

    // Helper methods
    calculateChallengeScore(playerState, completionTime, config) {
        const baseScore = 1000;
        const movesPenalty = playerState.moves * 5;
        const mistakesPenalty = playerState.mistakes * 20;
        const timeBonus = calculateTimeBonus(completionTime, config.grade);
        return baseScore + timeBonus - movesPenalty - mistakesPenalty;
    }

    validateMove(grid, cell, value) {
        // Implementation similar to solo validation
        return true; // Placeholder - implement actual validation
    }

    async createChallengePuzzle(challenge) {
        // Create new game instance with generated puzzle
        return new Game({
            challengeId: challenge.id,
            config: challenge.config,
            difficulty: challenge.difficulty
        });
    }
}

module.exports = ChallengeHandler;