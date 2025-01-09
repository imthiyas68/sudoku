
// src/components/common/LeaderBoard.js
import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/api';

const LeaderBoard = ({ gameMode, timeFrame = 'all' }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(gameMode, timeFrame);
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameMode, timeFrame]);

  if (loading) {
    return <div className="text-center py-4">Loading leaderboard...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {leaderboardData.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-2 ${
              index < 3 ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`font-bold ${index < 3 ? 'text-blue-600' : ''}`}>
                #{index + 1}
              </span>
              <span>{entry.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Games: {entry.gamesPlayed}
              </span>
              <span className="font-bold">{entry.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard; 
 
