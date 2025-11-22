const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db'); // Import the modular database connection

const reportRoutes = require('./routes/reportRoutes');
const dailyInputRoutes = require('./routes/dailyInputRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using the modular db utility
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reports', reportRoutes);
app.use('/api/daily-inputs', dailyInputRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
