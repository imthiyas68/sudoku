// src/components/common/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Sudoku Challenge
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link to="/solo" className="text-gray-600 hover:text-blue-600">
                Solo Game
              </Link>
              <Link to="/team" className="text-gray-600 hover:text-blue-600">
                Team Play
              </Link>
              <Link to="/challenge" className="text-gray-600 hover:text-blue-600">
                Challenges
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
