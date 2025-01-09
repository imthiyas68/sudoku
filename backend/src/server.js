const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const gridRoutes = require('./routes/gridRoutes');
const SudokuGrid = require('./models/SudokuGrid'); // Corrected import
const app = express();

// Suppress Mongoose deprecation warning
mongoose.set('strictQuery', false);

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user1:JAjMCmxIqyBGerzU@cluster0.iggrage.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('Failed to connect to MongoDB Atlas:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Use gridRoutes
app.use('/api', gridRoutes);

// Start the server
const PORT = process.env.PORT || 5002; // Changed to port 5002
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});