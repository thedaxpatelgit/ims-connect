const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
console.log("Connection String:", process.env.MONGO_URI);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Database connected'))
  .catch((error) => console.error('Database connection error:', error));

  app.use(cors({
    origin: "https://ims-connect.vercel.app/",
    credentials: true
  }));

// Route Imports
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/votes');
const incentiveRoutes = require('./routes/incentives');
const ideasRoutes = require('./routes/ideas');
const employeeRoutes = require('./routes/employees');
//const ideaRoutes = require('./routes/ideas');
const assignIncentivesRoute = require('./routes/assign-incentives');
const usersRoutes = require('./routes/users');

// Route Middleware
app.use('/api/ideas', ideasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/incentives', incentiveRoutes);
//app.use('/api/ideas', ideaRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assign-incentives', assignIncentivesRoute);
app.use('/api/users', usersRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
