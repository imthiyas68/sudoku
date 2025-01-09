import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cell from '../components/game/Cell';
import NumberPad from '../components/game/NumberPad';
import Timer from '../components/game/Timer';
import ScoreBoard from '../components/game/ScoreBoard';
import { validateMove, calculateScore } from '../utils/sudokuLogic';
import { AlertDialog, AlertDialogDescription } from '@/components/ui/alert-dialog';

const SoloGame = ({ userParams, settings }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, firstName, lastName, class: userClass, role, school } = userParams;

    const [puzzle, setPuzzle] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [error, setError] = useState(null);
    const [isNotesMode, setIsNotesMode] = useState(false);
    const [notes, setNotes] = useState(Array(9).fill().map(() => Array(9).fill().map(() => new Set())));

    useEffect(() => {
        if (!userId || !userClass) {
            const currentParams = new URLSearchParams(location.search);
            navigate(`/?${currentParams.toString()}&error=missing_params`);
            return;
        }
    }, [userId, userClass, navigate, location]);

    useEffect(() => {
        const initializePuzzle = async () => {
            try {
                setError(null); // Clear any previous errors
                const response = await axios.get('http://localhost:5000/api/grid', {
                    params: { 
                        class: userClass, 
                        mode: 'solo', 
                        userId, 
                        firstName, 
                        lastName 
                    },
                });

                if (response.data && response.data.grid) {
                    setPuzzle(response.data.grid);
                } else {
                    setError('Failed to fetch puzzle. Please try again.');
                }
            } catch (err) {
                console.error('Error fetching puzzle:', err);
                setError('Failed to connect to the server. Please check your internet connection or try again later.');
            }
        };

        initializePuzzle();
    }, [userClass, userId, firstName, lastName]);

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
    };

    const handleNumberPadClick = (number) => {
        if (selectedCell) {
            const { row, col } = selectedCell;
            const newPuzzle = [...puzzle];
            newPuzzle[row][col] = number;
            setPuzzle(newPuzzle);

            if (validateMove(puzzle, row, col, number)) {
                setScore(calculateScore(puzzle));
            }
        }
    };

    const handleGameComplete = useCallback(() => {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;

        const gameData = {
            userId,
            firstName,
            lastName,
            class: userClass,
            role,
            school,
            score,
            timeTaken,
            mode: 'solo'
        };

        navigate('/completion', { 
            state: gameData,
            search: new URLSearchParams(userParams).toString()
        });
    }, [startTime, score, userParams, navigate]);

    if (error) {
        return (
            <AlertDialog variant="destructive">
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
                            <p className="font-medium">Player: {firstName} {lastName}</p>
                            <p className="text-gray-600">Class: {userClass}</p>
                            <p className="text-blue-600">{isNotesMode ? 'Notes Mode (N)' : 'Number Mode (N)'}</p>
                        </div>
                    </div>

                    {puzzle ? (
                        <div className="grid grid-cols-9 gap-0 mb-6 border-2 border-gray-400 bg-white rounded-lg p-2 max-w-fit mx-auto">
                            {puzzle.map((row, rowIndex) => (
                                <div key={rowIndex} className="puzzle-row">
                                    {row.map((colValue, colIndex) => (
                                        <Cell
                                            key={colIndex}
                                            value={colValue}
                                            onClick={() => handleCellClick(rowIndex, colIndex)}
                                            isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Loading puzzle...</div>
                    )}

                    <NumberPad onClick={handleNumberPadClick} />
                    <ScoreBoard score={score} />
                    <button 
                        onClick={handleGameComplete}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Complete Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SoloGame;