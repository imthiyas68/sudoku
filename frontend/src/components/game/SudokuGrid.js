// frontend/src/components/game/SudokuGrid.js
import React from 'react';

const SudokuGrid = ({ grid = Array(9).fill(Array(9).fill(null)), onCellChange = () => {}, readOnly = {} }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-9 gap-0.5 bg-gray-300 p-0.5">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center 
                text-xl font-semibold bg-white cursor-pointer
                ${readOnly[`${rowIndex}-${colIndex}`] ? 'bg-gray-50 font-bold' : 'hover:bg-blue-50'}
              `}
              onClick={() => onCellChange(rowIndex, colIndex)}
            >
              {cell || ''}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default SudokuGrid;