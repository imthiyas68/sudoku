// src/components/game/ScoreBoard.js
import React from 'react';

const ScoreBoard = ({ score = 0, scores = [] }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Score</h2>
            
            {/* Current Score */}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Current</span>
                    <span className="font-bold text-lg">{score}</span>
                </div>
            </div>

            {/* Historical Scores */}
            {scores.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold mb-2">History</h3>
                    {scores.map((scoreItem, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="font-medium">{scoreItem.name}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Correct: {scoreItem.correct}
                                </span>
                                <span className="text-sm text-gray-600">
                                    Errors: {scoreItem.errors}
                                </span>
                                <span className="font-bold text-lg">
                                    {scoreItem.total}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScoreBoard;