# Sudoku-MathGame Integration Project

## Project Overview
This project integrates two applications: **Math Game** and **Sudoku Game**, enabling seamless navigation and parameter passing between the two platforms. The Math Game serves as the entry point, passing essential user data to the Sudoku Game, which supports three modes: **Solo**, **Collaborative**, and **Challenge**.

## Directory Structure
```
main-project/
├── math-game/            # Frontend for Math Game
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── NavBar.js
│   │   │   ├── AdminSidebar.js
│   │   │   └── other components...
├── math-game-backend/    # Backend for Math Game
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   └── other routes...
├── sudoku/
│   ├── frontend/         # Frontend for Sudoku
│   │   ├── src/
│   │   │   ├── App.js
│   │   │   ├── pages/
│   │   │   │   ├── SoloGame.js
│   │   │   │   ├── CollaborativeGame.js
│   │   │   │   ├── Challenge.js
│   │   │   ├── components/
│   │   │   └── utils/
│   ├── backend/          # Backend for Sudoku
│   │   ├── src/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── server.js
│   ├── socket/           # Socket server for Sudoku
│   │   ├── src/
│   │   │   └── utils/
```

## Key Features

### Parameter Passing
- Math Game passes the following parameters to Sudoku:
  - `userId`
  - `firstName`
  - `lastName`
  - `class`
  - `role` (normal/admin)
  - `school`

### Sudoku Modes
- **Solo**: Single-player mode with customized difficulty.
- **Collaborative**: Multi-player mode with real-time collaboration.
- **Challenge**: Competitive mode with a leaderboard.

### MongoDB Integration
- Math Game uses collections:
  - `users`
  - `games`
  - `certificates`
- Sudoku requires:
  - `sudoku_grids` (for puzzles)
  - `game_sessions` (for tracking progress and scores).

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)
- React (v18 or higher)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd main-project
   ```

2. Install dependencies:
   ```bash
   cd math-game && npm install
   cd ../math-game-backend && npm install
   cd ../sudoku/frontend && npm install
   cd ../sudoku/backend && npm install
   ```

3. Set up environment variables:
   - Create `.env` files in each backend folder with the following:
     ```
     MONGO_URI=mongodb://<your_mongo_connection_string>
     PORT=5000 (Math Game Backend)
     PORT=5001 (Sudoku Backend)
     ```

4. Run the servers:
   ```bash
   # Math Game Backend
   cd math-game-backend
   npm start

   # Sudoku Backend
   cd ../sudoku/backend
   npm start

   # Sudoku Frontend
   cd ../frontend
   npm start

   # Math Game Frontend
   cd ../../math-game
   npm start
   ```

## Contribution Guidelines
1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/<feature_name>
   ```
2. Commit changes with meaningful messages:
   ```bash
   git commit -m "Added feature to ..."
   ```
3. Push changes and create a pull request.

## To-Do List
1. Finalize Sudoku grid generation and fetching.
2. Ensure parameter persistence across all navigation.
3. Refine styles for Sudoku grids and improve number entry.
4. Integrate Sudoku progress tracking with MongoDB.

## Contact
For questions or support, contact the project maintainer at [email@example.com].

