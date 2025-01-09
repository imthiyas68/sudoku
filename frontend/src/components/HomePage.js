import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  
  // Get parameters from URL or session storage
  const userParams = {
    userId: new URLSearchParams(location.search).get('userId') || sessionStorage.getItem('userId'),
    firstName: new URLSearchParams(location.search).get('firstName') || sessionStorage.getItem('firstName'),
    lastName: new URLSearchParams(location.search).get('lastName') || sessionStorage.getItem('lastName'),
    class: new URLSearchParams(location.search).get('class') || sessionStorage.getItem('class'),
    role: new URLSearchParams(location.search).get('role') || sessionStorage.getItem('role'),
    school: new URLSearchParams(location.search).get('school') || sessionStorage.getItem('school')
  };

  const getLink = (path) => {
    const params = new URLSearchParams();
    const mode = path.replace('/', '');
    params.append('mode', mode);
    
    // Add user parameters if they exist
    Object.entries(userParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    return `${path}?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Sudoku Game</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center space-x-4">
            <Link 
              to={getLink('/solo')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Play Solo
            </Link>
            <Link 
              to={getLink('/collaborative')}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Play Collaborative
            </Link>
            <Link 
              to={getLink('/challenge')}
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
            >
              Challenge Mode
            </Link>
          </div>
        </div>
        
        {/* Debug info - can be removed in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-semibold mb-2">Current Parameters:</h2>
            <pre className="text-sm">
              {JSON.stringify(userParams, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;