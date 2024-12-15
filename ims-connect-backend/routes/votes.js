const express = require('express');
const Vote = require('../models/Vote');
const Idea = require('../models/Idea');
const router = express.Router();

// Cast a vote on an idea
router.post('/:ideaId/vote', async (req, res) => {
  try {
    const { userId } = req.body;
    const { ideaId } = req.params;

    const existingVote = await Vote.findOne({ userId, ideaId });
    if (existingVote) return res.status(400).json({ error: 'You have already voted for this idea' });

    const newVote = new Vote({ userId, ideaId });
    await newVote.save();

    await Idea.findByIdAndUpdate(ideaId, { $inc: { voteCount: 1 } });
    res.json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error casting vote' });
  }
});

// Retract a vote
router.delete('/:ideaId/vote', async (req, res) => {
  try {
    const { userId } = req.body;
    const { ideaId } = req.params;

    const existingVote = await Vote.findOneAndDelete({ userId, ideaId });
    if (!existingVote) return res.status(404).json({ error: 'Vote not found' });

    await Idea.findByIdAndUpdate(ideaId, { $inc: { voteCount: -1 } });
    res.json({ message: 'Vote retracted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error retracting vote' });
  }
});

module.exports = router;
