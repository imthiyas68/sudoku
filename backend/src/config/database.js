require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Construct the MongoDB URI
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of waiting indefinitely
      autoIndex: true,               // Automatically build indexes (useful in dev, disable in prod for large datasets)
    });

    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Listen for MongoDB connection errors after the initial connection
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB Runtime Connection Error: ${err.message}`);
});

module.exports = connectDB;
