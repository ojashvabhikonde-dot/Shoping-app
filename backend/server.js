const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/orders', require('./routes/orders'));

// Production Static Serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  // Base API route for development
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the E-Commerce API' });
  });
}

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

