const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Incentive = require('../models/Incentive');


// Route to assign incentives (points) to a user
router.post('/assign', async (req, res) => {
  const { userId, points } = req.body;

  try {
    // Fetch the user by ID and increment the points field
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: points } }, // Increment points by provided amount
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

// Create a new incentive document for tracking purposes
const incentive = new Incentive({
  userId,
  type: 'Assigned Points', // or whatever type you want to specify
  points,
});
await incentive.save(); // Save the incentive document

    res.json({ message: 'Points assigned successfully', currentPoints: user.points });
  } catch (error) {
    console.error("Error assigning points:", error);
    res.status(500).json({ error: 'Error assigning points' });
  }
});

module.exports = router;
