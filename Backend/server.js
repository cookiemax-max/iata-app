const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db'); // Import the modular database connection

// Routes
const reportRoutes = require('./routes/reportRoutes');
const dailyInputRoutes = require('./routes/dailyInputRoutes');
const aiRoutes = require('./routes/aiRoutes');
const emissionsRoutes = require('./routes/emissionsRoutes');
const flightRoutes = require('./routes/flightRoutes'); // ADD THIS LINE
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
app.use('/api/emissions', emissionsRoutes);
app.use('/api/flights', flightRoutes); // ADD THIS LINE

// Error handling middleware - must be last
app.use(errorHandler);

// Health check endpoint (optional but useful)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
