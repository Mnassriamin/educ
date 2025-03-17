// server.js

// Load environment variables from .env
require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();

const mongo_url = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
      console.log('MongoDB Connected...');
  })
  .catch((err) => {
      console.error('MongoDB Connection Error: ', err);
  });

// Middleware to parse JSON bodies in requests
app.use(express.json());



// Optionally, mount other routes here (e.g., journaux, users, etc.)
// Default endpoint for testing
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
