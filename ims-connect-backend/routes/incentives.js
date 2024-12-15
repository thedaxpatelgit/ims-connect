const express = require('express');
const Incentive = require('../models/Incentive');
const User = require('../models/User');
const router = express.Router();




// Fetch incentives for a user
const mongoose = require('mongoose');

// Example of fetching incentives for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    // Ensure userId is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Convert userId to ObjectId
    //const userObjectId = new mongoose.Types.ObjectId(userId);
    const incentives = await Incentive.find({ userId });
    
    console.log("Fetched incentives:", incentives);
    res.json(incentives);
  } catch (error) {
    console.error("Error fetching incentives:", error); // Log full error details
    res.status(500).json({ error: "Error fetching incentives" });
  }
});

// Route to get total points for a user
router.get('/users/:userId/points', async (req, res) => {
  const { userId } = req.params;
  console.log("Backend: Fetching points for userId:", userId); // Debug log
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ points: user.points });
  } catch (error) {
    console.error("Backend: Error fetching points for userId:", error);
    res.status(500).json({ error: "Error fetching points" });
  }
});

module.exports = router;
