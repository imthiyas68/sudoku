import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import HomePage from './components/HomePage';
import SoloGame from './pages/SoloGame';
import CollaborativeGame from './pages/CollaborativeGame';
import Challenge from './pages/Challenge';
import { END_POINT } from './services/api';
import { AlertDialog, AlertDialogDescription } from './components/ui/alert-dialog';
import { GameProvider } from './contexts/GameContext'; // Import GameProvider

const Navigation = () => {
  const location = useLocation();
  const userParams = {
    userId: new URLSearchParams(location.search).get('userId') || sessionStorage.getItem('userId'),
    firstName: new URLSearchParams(location.search).get('firstName') || sessionStorage.getItem('firstName'),
    lastName: new URLSearchParams(location.search).get('lastName') || sessionStorage.getItem('lastName'),
    class: new URLSearchParams(location.search).get('class') || sessionStorage.getItem('class'),
    role: new URLSearchParams(location.search).get('role') || sessionStorage.getItem('role'),
    school: new URLSearchParams(location.search).get('school') || sessionStorage.getItem('school'),
  };

  const getLink = (path) => {
    const params = new URLSearchParams();
    Object.entries(userParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return `${path}?${params.toString()}`;
  };

  return (
    <nav className="p-4 bg-white shadow">
      <div className="flex space-x-4">
        <Link to={getLink("/solo")} className="px-4 py-2 rounded hover:bg-gray-100">
          Solo Game
        </Link>
        <Link to={getLink("/collaborative")} className="px-4 py-2 rounded hover:bg-gray-100">
          Collaborative
        </Link>
        <Link to={getLink("/challenge")} className="px-4 py-2 rounded hover:bg-gray-100">
          Challenge
        </Link>
      </div>
    </nav>
  );
};

const GameWrapper = () => {
  const [settings, setSettings] = useState({
    difficulty: 'easy',
    gridSize: 4,
    mode: 'unlimited',
    timeLimit: null,
    allowHints: true,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const userParams = {
    userId: queryParams.get('userId')?.trim() || sessionStorage.getItem('userId')?.trim(),
    firstName: queryParams.get('firstName')?.trim() || sessionStorage.getItem('firstName')?.trim(),
    lastName: queryParams.get('lastName')?.trim() || sessionStorage.getItem('lastName')?.trim(),
    class: queryParams.get('class')?.trim() || sessionStorage.getItem('class')?.trim(),
    role: queryParams.get('role')?.trim() || sessionStorage.getItem('role')?.trim(),
    school: queryParams.get('school')?.trim() || sessionStorage.getItem('school')?.trim(),
  };

  // Determine the game mode based on the route path
  const mode = location.pathname.replace('/', '');

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setLoading(true);

        Object.entries(userParams).forEach(([key, value]) => {
          if (value) sessionStorage.setItem(key, value);
        });

        if (userParams.userId && userParams.class) {
          const [userResponse, settingsResponse] = await Promise.all([
            axios.get(`${END_POINT}/api/users/${userParams.userId}`),
            axios.get(`${END_POINT}/api/admin/sudoku-settings`, {
              params: {
                class: userParams.class,
                role: userParams.role,
              },
            }),
          ]);

          setUserDetails(userResponse.data);
          setSettings({
            ...settingsResponse.data,
            gridSize: parseInt(userParams.class, 10) || settingsResponse.data.gridSize,
            timeLimit: settingsResponse.data.timeLimit || null,
          });
        }
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to load game settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, [location, navigate, queryParams, userParams]);

  const getGameComponent = () => {
    const commonProps = {
      settings,
      userDetails,
      userParams,
    };

    switch (mode) {
      case 'collaborative':
        return <CollaborativeGame {...commonProps} />;
      case 'challenge':
        return <Challenge {...commonProps} />;
      default:
        return <SoloGame {...commonProps} />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <AlertDialog variant="destructive">
        <AlertDialogDescription>{error}</AlertDialogDescription>
      </AlertDialog>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">{getGameComponent()}</main>
    </div>
  );
};

const App = () => {
  const isInIframe = window.self !== window.top;

  return (
    <Router>
      <GameProvider> {/* Wrap the entire app with GameProvider */}
        <Routes>
          {isInIframe ? (
            <Route path="*" element={<GameWrapper />} />
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/solo" element={<GameWrapper />} />
              <Route path="/collaborative" element={<GameWrapper />} />
              <Route path="/challenge" element={<GameWrapper />} />
            </>
          )}
        </Routes>
      </GameProvider>
    </Router>
  );
};

export default App;