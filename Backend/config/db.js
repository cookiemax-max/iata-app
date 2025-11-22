// config/db.js
const mongoose = require('mongoose');

// Use MONGO_URI from .env or default to Docker Compose standard URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/iata';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process if unable to connect
    }
};

module.exports = connectDB;
