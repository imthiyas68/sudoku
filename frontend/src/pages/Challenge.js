import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertDialog, AlertDialogDescription } from '@/components/ui/alert-dialog';
import Cell from '../components/game/Cell';
import NumberPad from '../components/game/NumberPad';
import Timer from '../components/game/Timer';
import ScoreBoard from '../components/game/ScoreBoard';
import { validateMove, calculateScore } from '../utils/sudokuLogic';
import SudokuGenerator from '../utils/sudokuGenerator';

const Challenge = ({ userParams, settings }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [puzzle, setPuzzle] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [error, setError] = useState(null);
    const [isNotesMode, setIsNotesMode] = useState(false);
    const [notes, setNotes] = useState(Array(9).fill().map(() => Array(9).fill().map(() => new Set())));

    useEffect(() => {
        if (userParams?.class) {
            const generator = new SudokuGenerator();
            const { puzzle: newPuzzle } = generator.generateBoard(userParams.class, 'HARD');
            setPuzzle(newPuzzle);
        } else {
            const currentSearch = new URLSearchParams(location.search);
            currentSearch.append('error', 'missing_params');
            navigate(`/?${currentSearch.toString()}`, { replace: true });
            setError('Missing required parameters. Redirecting...');
        }
    }, [userParams?.class, navigate, location.search]);

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
    };

    const handleNumberPadClick = (number) => {
        if (!selectedCell || !puzzle) return;

        const { row, col } = selectedCell;

        if (isNotesMode) {
            const newNotes = notes.map(row => [...row]);
            const cellNotes = new Set(newNotes[row][col]);

            if (cellNotes.has(number)) {
                cellNotes.delete(number);
            } else {
                cellNotes.add(number);
            }

            newNotes[row][col] = cellNotes;
            setNotes(newNotes);
        } else {
            if (validateMove(puzzle, row, col, number)) {
                const newPuzzle = puzzle.map(row => [...row]);
                newPuzzle[row][col] = number;
                setPuzzle(newPuzzle);
                setScore(calculateScore(newPuzzle));
                // Clear notes for this cell
                const newNotes = notes.map(row => [...row]);
                newNotes[row][col] = new Set();
                setNotes(newNotes);
            }
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!selectedCell) return;

            if (e.key === 'n') {
                setIsNotesMode(!isNotesMode);
                return;
            }

            const num = parseInt(e.key);
            if (num >= 1 && num <= 9) {
                handleNumberPadClick(num);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedCell, isNotesMode]);

    const handleGameComplete = () => {
        const gameData = {
            ...userParams,
            score,
            timeTaken: Math.floor((Date.now() - startTime) / 1000),
            mode: 'challenge'
        };

        const searchParams = new URLSearchParams(userParams);
        navigate('/completion', { 
            state: gameData,
            search: searchParams.toString()
        });
    };

    if (error) {
        return (
            <AlertDialog>
                <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialog>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <Timer startTime={startTime} />
                        <div className="text-right">
                            <p className="font-medium">Player: {userParams?.firstName} {userParams?.lastName}</p>
                            <p className="text-gray-600">Class: {userParams?.class}</p>
                            <p className="text-blue-600">{isNotesMode ? 'Notes Mode (N)' : 'Number Mode (N)'}</p>
                        </div>
                    </div>

                    {puzzle ? (
                        <div className="grid grid-cols-9 gap-0 mb-6 border-2 border-gray-400 bg-white rounded-lg p-2 max-w-fit mx-auto">
                            {puzzle.map((row, rowIndex) => (
                                row.map((value, colIndex) => (
                                    <Cell
                                        key={`${rowIndex}-${colIndex}`}
                                        value={value || ''}
                                        notes={notes[rowIndex][colIndex]}
                                        isNotesMode={isNotesMode}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                                        fixed={value !== null} // Add this prop to indicate initial puzzle numbers
                                    />
                                ))
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-gray-500">Loading puzzle...</div>
                        </div>
                    )}

                    <NumberPad onClick={handleNumberPadClick} />
                    <ScoreBoard score={score} scores={[]} />

                    <button
                        onClick={() => setIsNotesMode(!isNotesMode)}
                        className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Toggle Notes Mode (N)
                    </button>

                    <button 
                        onClick={handleGameComplete}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={!puzzle}
                    >
                        Complete Challenge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Challenge;