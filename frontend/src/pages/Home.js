// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LeaderBoard from '../components/common/LeaderBoard';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-6">Welcome to Sudoku Challenge</h1>
          {user ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Game Modes</h2>
                <div className="grid gap-4">
                  <Link
                    to="/solo"
                    className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    <h3 className="text-xl font-semibold">Solo Play</h3>
                    <p className="text-gray-600">Challenge yourself in individual games</p>
                  </Link>
                  <Link
                    to="/team"
                    className="block p-4 bg-green-50 rounded-lg hover:bg-green-100"
                  >
                    <h3 className="text-xl font-semibold">Team Play</h3>
                    <p className="text-gray-600">Collaborate with 4 other players</p>
                  </Link>
                  <Link
                    to="/challenge"
                    className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100"
                  >
                    <h3 className="text-xl font-semibold">Daily Challenge</h3>
                    <p className="text-gray-600">Compete in daily puzzles</p>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">Join the Challenge</h2>
              <p className="mb-4">Login to start playing and competing with others!</p>
              <Link
                to="/login"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Login Now
              </Link>
            </div>
          )}
        </div>
        <div>
          <LeaderBoard gameMode="all" timeFrame="weekly" />
        </div>
      </div>
    </div>
  );
};

export default Home; 
