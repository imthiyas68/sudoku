// socket/src/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const gameHandler = require('./handlers/gameHandler'); // Import gameHandler
const roomManager = require('./utils/roomManager'); // Import roomManager

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend to connect
        methods: ["GET", "POST"]
    }
});

// Initialize room manager
const rooms = new roomManager();

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Pass io, socket, and roomManager to gameHandler
    gameHandler(io, socket, rooms);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Socket server is running on port ${PORT}`);
});