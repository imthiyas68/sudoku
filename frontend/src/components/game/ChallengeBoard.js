import React, { useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { socketService } from '../../services/socket';

const ChallengeBoard = ({ challengeId }) => {
    const { state, dispatch } = useGame();
    const [selectedCell, setSelectedCell] = useState(null);

    const handleCellClick = (rowIndex, colIndex) => {
        setSelectedCell({ row: rowIndex, col: colIndex });
        dispatch({ 
            type: 'SELECT_CELL', 
            payload: { row: rowIndex, col: colIndex } 
        });
    };

    const handleNumberInput = (number) => {
        if (!selectedCell) return;

        socketService.emitChallengeMove(challengeId, {
            row: selectedCell.row,
            col: selectedCell.col,
            value: number
        });
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!selectedCell) return;
            
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= 9) {
                handleNumberInput(num);
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [selectedCell]);

    if (!state.puzzle || !state.puzzle.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Waiting for game to start...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-9 gap-px bg-gray-200 border-2 border-gray-800">
                {state.puzzle.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`
                                aspect-square flex items-center justify-center
                                bg-white text-xl font-medium cursor-pointer
                                ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-blue-100' : ''}
                                ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2 border-gray-800' : ''}
                                ${(colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2 border-gray-800' : ''}
                            `}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {cell || ''}
                        </div>
                    ))
                ))}
            </div>
            
            <div className="mt-6 grid grid-cols-9 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                    <button
                        key={number}
                        className="p-4 bg-gray-100 rounded hover:bg-gray-200 font-medium"
                        onClick={() => handleNumberInput(number)}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChallengeBoard;