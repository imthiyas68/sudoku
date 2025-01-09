



// NumberPad.js
import React from 'react';

const NumberPad = ({ onNumberSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <button
          key={number}
          onClick={() => onNumberSelect(number)}
          className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600"
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default NumberPad;