import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import SudokuGenerator from '@/utils/sudokuGenerator';

export const useGameSocket = (difficulty = 'MEDIUM') => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    grid: Array(9).fill().map(() => Array(9).fill(0)),
    initialGrid: Array(9).fill().map(() => Array(9).fill(0)),
    players: [],
    messages: [],
    isComplete: false,
    score: 0,
  });

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      query: { difficulty },
    });

    newSocket.on('connect', () => {
      console.log('Connected to game server');
    });

    newSocket.on('gameState', (state) => {
      setGameState(state);
    });

    newSocket.on('playerJoined', (player) => {
      setGameState((prev) => ({
        ...prev,
        players: [...prev.players, player],
      }));
    });

    newSocket.on('playerLeft', (playerId) => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.filter((p) => p.id !== playerId),
      }));
    });

    newSocket.on('move', ({ cell, value }) => {
      setGameState((prev) => {
        const newGrid = prev.grid.map((row, rowIndex) =>
          row.map((cellValue, colIndex) =>
            rowIndex === cell.row && colIndex === cell.col ? value : cellValue
          )
        );
        return { ...prev, grid: newGrid };
      });
    });

    newSocket.on('chatMessage', (message) => {
      setGameState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    });

    setSocket(newSocket);

    // Generate initial puzzle
    const generator = new SudokuGenerator();
    const { puzzle, solution } = generator.generateBoard(9, difficulty);
    setGameState((prev) => ({
      ...prev,
      grid: puzzle,
      initialGrid: puzzle,
    }));

    return () => {
      newSocket.close();
    };
  }, [difficulty]);

  const makeMove = useCallback(
    (cell, value) => {
      if (socket) {
        socket.emit('move', { cell, value });
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (message) => {
      if (socket) {
        socket.emit('chatMessage', message);
      }
    },
    [socket]
  );

  return {
    gameState,
    makeMove,
    sendMessage,
  };
};