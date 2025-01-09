import React from 'react';

const Cell = ({ value, fixed, selected, notes = new Set(), isNotesMode, onClick }) => {
    // Helper to determine if cell is at a block boundary
    const getPositionClasses = (index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const classes = [];

        // Add thicker borders between 3x3 blocks
        if (col % 3 === 0) classes.push('border-l-2 border-l-gray-400');
        if (col === 8) classes.push('border-r-2 border-r-gray-400');
        if (row % 3 === 0) classes.push('border-t-2 border-t-gray-400');
        if (row === 8) classes.push('border-b-2 border-b-gray-400');

        return classes.join(' ');
    };

    return (
        <div
            onClick={onClick}
            className={`
                w-12 h-12 
                flex items-center justify-center
                text-xl font-medium relative
                border border-gray-200
                cursor-pointer
                ${fixed ? 'bg-gray-50 text-gray-900 font-bold' : 'bg-white'}
                ${selected ? 'bg-blue-100' : ''}
                ${getPositionClasses()}
                hover:bg-blue-50
                transition-colors duration-200
            `}
        >
            {value ? (
                <span className={`
                    ${fixed ? 'text-gray-900' : 'text-blue-600'}
                    text-lg
                `}>
                    {value}
                </span>
            ) : (
                notes.size > 0 && (
                    <div className="grid grid-cols-3 gap-0 w-full h-full p-1 text-gray-600">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <div key={num} className="text-[8px] flex items-center justify-center">
                                {notes.has(num) ? num : ''}
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Cell;