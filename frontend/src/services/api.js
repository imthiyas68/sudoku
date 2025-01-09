import axios from 'axios';

export const END_POINT = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: END_POINT,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to check authentication status
export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/auth/status');
    return response.data;
  } catch (error) {
    console.error('Error checking auth status:', error);
    throw error;
  }
};

// Function to join a team game
export const joinTeamGame = async (userId) => {
  try {
    const response = await api.post('/team/join', { userId });
    return response.data;
  } catch (error) {
    console.error('Error joining team game:', error);
    throw error;
  }
};

// Function to create a new game
export const createGame = async (mode, classLevel) => {
  try {
    const response = await api.post('/games', { mode, classLevel });
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

// Function to make a move in the game
export const makeMove = async (gameId, position, value) => {
  try {
    const response = await api.post(`/games/${gameId}/move`, { position, value });
    return response.data;
  } catch (error) {
    console.error('Error making move:', error);
    throw error;
  }
};

// Function to get the leaderboard
export const getLeaderboard = async () => {
  try {
    const response = await api.get('/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export default api;
