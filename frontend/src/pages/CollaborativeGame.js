// CollaborativeGame.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import TeamBoard from '../components/game/TeamBoard';
import { AlertDialog, AlertDialogDescription } from '@/components/ui/alert-dialog';

const CollaborativeGame = ({ userParams, settings }) => {
    const { teamId } = useParams();
    const { socket, dispatch } = useGame();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (socket) {
            // Initialize the collaborative game
            socket.emit('team:initialize', { teamId, userParams });

            // Listen for game state updates
            socket.on('game:state', (state) => {
                dispatch({ type: 'SET_GAME_STATE', payload: state });
                setLoading(false);
            });

            // Listen for errors
            socket.on('error', (error) => {
                setError(error.message);
                setLoading(false);
            });

            // Clean up event listeners on unmount
            return () => {
                socket.off('game:state');
                socket.off('error');
            };
        }
    }, [socket, teamId, dispatch, userParams]);

    if (error) {
        return (
            <AlertDialog>
                <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialog>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading game...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold text-center mb-4">Collaborative Sudoku</h1>
            <TeamBoard />
        </div>
    );
};

export default CollaborativeGame;