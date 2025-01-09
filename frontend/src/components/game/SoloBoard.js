import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { GameContext } from '../../contexts/GameContext';
import Board from './Board';
import NumberPad from './NumberPad';
import Timer from './Timer';
import ScoreBoard from './ScoreBoard';
import SudokuGrid from './SudokuGrid';  // Now imports from the local frontend directory
const SoloBoard = () => {
    const { roomId } = useParams();
    const { state, dispatch } = useContext(GameContext);
    const [activeCell, setActiveCell] = useState(null);
    const [stats, setStats] = useState({
        moves: 0,
        mistakes: 0,
        score: 0
    });
    const [autoSaveTimer, setAutoSaveTimer] = useState(null);

    // Initialize or resume game
    useEffect(() => {
        const initializeGame = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/solo/initialize`, { // Use the environment variable for the API URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: localStorage.getItem('userId'),
                        grade: localStorage.getItem('userGrade')
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    dispatch({ type: 'START_GAME', payload: data.game });
                }
            } catch (error) {
                console.error('Failed to initialize game:', error);
            }
        };

        initializeGame();
    }, [dispatch]);

    // Auto-save game state every 30 seconds
    useEffect(() => {
        const saveGameState = async () => {
            if (state.currentGame?.id) {
                try {
                    await fetch(`${import.meta.env.VITE_API_URL}/api/solo/${state.currentGame.id}/save`, { // Use the environment variable for the API URL
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            grid: state.puzzle,
                            score: stats.score,
                            moves: state.currentGame.moves
                        })
                    });
                } catch (error) {
                    console.error('Failed to save game state:', error);
                }
            }
        };

        const timer = setInterval(saveGameState, 30000);
        setAutoSaveTimer(timer);

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [state.currentGame, state.puzzle, stats.score]);

    // Handle keyboard input
    const handleKeyPress = useCallback((event) => {
        if (activeCell && /^[1-9]$/.test(event.key)) {
            handleNumberSelect(parseInt(event.key));
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            handleNumberSelect(0); // Clear cell
        } else if (event.key.startsWith('Arrow')) {
            handleArrowNavigation(event.key);
        }
    }, [activeCell]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const handleArrowNavigation = (key) => {
        if (!activeCell) return;

        const { row, col } = activeCell;
        const gridSize = state.puzzle.length;
        let newRow = row;
        let newCol = col;

        switch (key) {
            case 'ArrowUp':
                newRow = (row - 1 + gridSize) % gridSize;
                break;
            case 'ArrowDown':
                newRow = (row + 1) % gridSize;
                break;
            case 'ArrowLeft':
                newCol = (col - 1 + gridSize) % gridSize;
                break;
            case 'ArrowRight':
                newCol = (col + 1) % gridSize;
                break;
            default:
                break;
        }

        setActiveCell({ row: newRow, col: newCol });
    };

    const handleNumberSelect = (number) => {
        if (!activeCell) return;

        const { row, col } = activeCell;
        const newPuzzle = [...state.puzzle];
        newPuzzle[row][col] = number;
        dispatch({ type: 'UPDATE_GAME', payload: { board: newPuzzle } });

        setStats(prevStats => ({
            ...prevStats,
            moves: prevStats.moves + 1,
            score: prevStats.score + (number === 0 ? -1 : 1)
        }));
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-4">
            <SudokuGrid 
    grid={state.puzzle || Array(9).fill(Array(9).fill(null))}
    onCellChange={(row, col) => setActiveCell({ row, col })}
    readOnly={state.currentGame?.initialGrid || {}}
/>
            <NumberPad onNumberSelect={handleNumberSelect} />
            <Timer />
            <ScoreBoard scores={state.scores} gameMode="solo" />
        </div>
    );
};

export default SoloBoard;