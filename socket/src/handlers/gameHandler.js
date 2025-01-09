// socket/src/handlers/gameHandler.js
const axios = require('axios');

module.exports = (io, socket, roomManager) => {
    socket.on('join_room', async ({ roomId, playerId, firstName, lastName, class: userClass }) => {
        try {
            // Fetch Sudoku grid from backend server
            const response = await axios.get('http://localhost:5000/api/grid', {
                params: { 
                    class: userClass, 
                    mode: 'collaborative', 
                    userId: playerId, 
                    firstName, 
                    lastName 
                },
            });

            const { grid } = response.data;

            // Join the room and initialize game state
            socket.join(roomId);

            if (!roomManager.getRoom(roomId)) {
                roomManager.createRoom(roomId);
            }

            const room = roomManager.getRoom(roomId);
            room.addPlayer(playerId, { firstName, lastName, class: userClass, socketId: socket.id });

            // Broadcast game state to all players in the room
            io.to(roomId).emit('game_state', {
                grid,
                players: Array.from(room.players.entries()),
            });
        } catch (error) {
            console.error('Error fetching grid:', error);
            socket.emit('error', { message: 'Failed to fetch Sudoku grid' });
        }
    });

    socket.on('make_move', async ({ roomId, playerId, row, col, value }) => {
        try {
            // Send move to backend server for validation and saving
            const response = await axios.post('http://localhost:5000/api/move', {
                roomId,
                playerId,
                row,
                col,
                value,
            });

            const { isValid, updatedGrid } = response.data;

            if (isValid) {
                // Broadcast updated grid to all players in the room
                io.to(roomId).emit('update_grid', updatedGrid);
            } else {
                // Notify the player that the move is invalid
                socket.emit('invalid_move', { message: 'Invalid move' });
            }
        } catch (error) {
            console.error('Error making move:', error);
            socket.emit('error', { message: 'Failed to make move' });
        }
    });

    // Add more event handlers here
};