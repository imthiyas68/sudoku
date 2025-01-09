// frontend/src/components/game/TeamBoard.js
import React from 'react';
import SudokuGrid from './SudokuGrid';

const TeamBoard = ({ grid, onMove }) => {
  return (
    <SudokuGrid 
      grid={grid || Array(9).fill(Array(9).fill(null))}
      onCellChange={(row, col) => {
        const value = prompt('Enter a number (1-9):');
        if (value && /^[1-9]$/.test(value)) {
          onMove(row, col, parseInt(value));
        }
      }}
    />
  );
};

export default TeamBoard;