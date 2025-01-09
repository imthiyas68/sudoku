// frontend/src/services/socket.js

import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.gameListeners = new Map();
    this.connected = false;
    this.challengeCallbacks = new Map();
  }

  connect() {
    if (this.socket && this.connected) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

    this.socket = io(socketUrl, {
      auth: {
        token: localStorage.getItem('authToken')
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'] // Explicitly specify transports
    });

    this.setupBaseHandlers();
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        this.connected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.connected = false;
        reject(error);
      });

      // Set a timeout for the connection attempt
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Connection timeout'));
        }
      }, 5000);
    });
  }

  setupBaseHandlers() {
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Handle reconnection
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.connected = true;
      // Rejoin any active challenges
      this.challengeCallbacks.forEach((callback, challengeId) => {
        this.joinChallenge(challengeId);
      });
    });
  }

  async joinChallenge(challengeId) {
    if (!this.socket) {
      await this.connect();
    }
    
    return new Promise((resolve, reject) => {
      this.socket.emit('challenge:join', { 
        challengeId,
        userId: localStorage.getItem('userId') // Include user ID if available
      }, (response) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          // Store the challenge ID for reconnection handling
          this.challengeCallbacks.set(challengeId, true);
          resolve(response);
        }
      });
    });
  }

  leaveChallenge(challengeId) {
    if (this.socket) {
      this.socket.emit('challenge:leave', { challengeId });
      this.challengeCallbacks.delete(challengeId);
    }
  }

  onChallengeState(callback) {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }
    this.socket.on('challenge:state', callback);
    return () => this.socket.off('challenge:state', callback);
  }

  onChallengeUpdate(callback) {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }
    this.socket.on('challenge:update', callback);
    return () => this.socket.off('challenge:update', callback);
  }

  emitChallengeMove(challengeId, moveData) {
    if (!this.socket) return Promise.reject(new Error('Socket not initialized'));
    
    return new Promise((resolve, reject) => {
      this.socket.emit('challenge:move', {
        challengeId,
        ...moveData
      }, (response) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.challengeCallbacks.clear();
      this.gameListeners.clear();
    }
  }
}

export const socketService = new SocketService();