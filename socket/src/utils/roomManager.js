// socket/src/utils/roomManager.js
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(roomId) {
        this.rooms.set(roomId, new GameRoom(roomId));
    }

    getRoom(roomId) {
        return this.rooms.get(roomId);
    }

    deleteRoom(roomId) {
        this.rooms.delete(roomId);
    }
}

class GameRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.players = new Map();
        this.gameState = null;
        this.moves = [];
    }

    addPlayer(playerId, playerInfo) {
        this.players.set(playerId, { ...playerInfo, score: 0 });
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    updateGameState(newState) {
        this.gameState = newState;
    }

    addMove(playerId, move) {
        this.moves.push({ playerId, move, timestamp: Date.now() });
    }
}

module.exports = RoomManager;