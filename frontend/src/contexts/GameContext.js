// GameContext.js
import React, { createContext, useContext, useReducer, useMemo } from 'react';

const GameContext = createContext();

const initialState = {
  socket: null,
  gameState: null,
  puzzle: Array(9).fill(Array(9).fill(0)),  // Add this
  currentGame: null  // Add this
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'START_GAME':
      return { ...state, currentGame: action.payload };
    case 'UPDATE_GAME':
      return { ...state, puzzle: action.payload.board };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const contextValue = useMemo(() => ({ ...state, dispatch }), [state, dispatch]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};