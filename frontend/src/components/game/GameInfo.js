import React from 'react';

const GameInfo = ({ score, errors, isComplete }) => {
  return (
    <div className="flex gap-4 text-sm">
      <div>Score: {score}</div>
      <div>Errors: {errors}</div>
      {isComplete && (
        <div className="text-green-500 font-bold">
          Puzzle Complete!
        </div>
      )}
    </div>
  );
};

export default GameInfo;