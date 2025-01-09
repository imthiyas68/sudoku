// src/components/game/Timer.js
import React, { useEffect, useState } from 'react';

const Timer = ({ initialTime = 3600, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (!timeLeft) {
            onTimeUp?.();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow text-center">
            <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
        </div>
    );
};

export default Timer;