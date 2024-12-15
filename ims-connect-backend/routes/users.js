const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Idea = require('../models/Idea');

// Route to fetch user points
router.get('/:userId/points', async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching points for userId:", userId); // Debugging log
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ points: user.points });
  } catch (error) {
    console.error("Error fetching points:", error);
    res.status(500).json({ error: "Error fetching points" });
  }
});

// Fetch notifications for a specific user
// Route: /:userId/notifications
router.get('/:userId/notifications', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user data by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user's notifications
    const notifications = user.notifications || [];
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});




router.post('/update-status', async (req, res) => {
  console.log("Received Payload:", req.body);
  try {
    const { ideaId, status } = req.body;

    // Validate input
    if (!ideaId || !status) {
      return res.status(400).json({ message: 'Invalid request data. All fields are required.' });
    }

    // Find the idea and update its status
    const updatedIdea = await Idea.findByIdAndUpdate(
      ideaId,
      { status },
      { new: true } // Return updated idea
    );

    if (!updatedIdea) {
      return res.status(404).json({ message: 'Idea not found.' });
    }

    // Fetch the creator of the idea
    const creator = await User.findById(updatedIdea.userId);

    if (!creator) {
      return res.status(404).json({ message: 'Idea creator not found.' });
    }

    // Push a notification to the creator's notifications array
    const notificationMessage = `The idea '${updatedIdea.title}' by '${creator.username}' was ${status.toLowerCase()}.`;
    creator.notifications.push({ message: notificationMessage });

    await creator.save(); // Save the updated user with the new notification

    console.log('Notification Saved:', notificationMessage);

    res.status(200).json({
      message: 'Idea status updated successfully.',
      notification: notificationMessage,
    });
  } catch (error) {
    console.error('Error updating idea status:', error);
    res.status(500).json({ message: 'Failed to update idea status.' });
  }
});

module.exports = router;
