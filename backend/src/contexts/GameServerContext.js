import React, { createContext, useContext, useState, useEffect } from 'react';
import generatePuzzle from '../utils/generatePuzzle';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [puzzle, setPuzzle] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    const newPuzzle = generatePuzzle(9);
    setPuzzle(newPuzzle);
  }, []);

  const updatePuzzle = (newPuzzle) => setPuzzle(newPuzzle);
  const selectCell = (cell) => setSelectedCell(cell);

  return (
    <GameContext.Provider value={{ 
      puzzle,
      selectedCell,
      updatePuzzle,
      selectCell
    }}>
      {children}
    </GameContext.Provider>
  );
};

const useGameContext = () => useContext(GameContext);

export { GameProvider, useGameContext };