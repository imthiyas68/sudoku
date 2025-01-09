import React from 'react';

const Board = ({ 
    grid, 
    activeCell, 
    onCellClick,
    isNotesMode,
    notes,
    initialGrid
}) => {
    const gridSize = grid?.length || 9;
    const boxSize = gridSize === 9 ? 3 : gridSize === 6 ? 2 : 2;

    const isCellInSameUnit = (row, col) => {
        if (!activeCell) return false;
        const [activeRow, activeCol] = activeCell;

        // Same row
        if (row === activeRow) return true;
        // Same column
        if (col === activeCol) return true;
        // Same box
        const sameBox = Math.floor(row / boxSize) === Math.floor(activeRow / boxSize) &&
                        Math.floor(col / boxSize) === Math.floor(activeCol / boxSize);
        return sameBox;
    };

    const renderCell = (row, col) => {
        const value = grid[row][col];
        const isInitial = initialGrid?.[row]?.[col] !== 0;
        const isActive = activeCell && activeCell[0] === row && activeCell[1] === col;
        const isRelated = isCellInSameUnit(row, col);
        const cellNotes = notes[row][col];

        return (
            <div
                key={`${row}-${col}`}
                onClick={() => onCellClick(row, col)}
                className={`
                    w-12 h-12 border border-gray-300 flex items-center justify-center relative
                    ${isInitial ? 'bg-gray-100 font-bold' : 'hover:bg-blue-50'}
                    ${isActive ? 'bg-blue-200' : ''}
                    ${isRelated && !isActive ? 'bg-blue-50' : ''}
                    ${(col + 1) % boxSize === 0 && col !== gridSize - 1 ? 'border-r-2 border-r-gray-800' : ''}
                    ${(row + 1) % boxSize === 0 && row !== gridSize - 1 ? 'border-b-2 border-b-gray-800' : ''}
                    cursor-pointer
                    transition-colors
                `}
            >
                {value !== 0 ? (
                    <span className="text-lg">{value}</span>
                ) : (
                    isNotesMode && cellNotes.size > 0 ? (
                        <div className="grid grid-cols-3 gap-0 w-full h-full p-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <div key={num} className="text-xs flex items-center justify-center">
                                    {cellNotes.has(num) ? num : ''}
                                </div>
                            ))}
                        </div>
                    ) : null
                )}
            </div>
        );
    };

    return (
        <div className="inline-block border-2 border-gray-800 bg-white">
            <div className="grid grid-cols-9 gap-0">
                {grid.map((row, rowIndex) =>
                    row.map((_, colIndex) => renderCell(rowIndex, colIndex))
                )}
            </div>
        </div>
    );
};

export default Board;