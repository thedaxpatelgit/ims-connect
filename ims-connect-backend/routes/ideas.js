const express = require('express');
const Idea = require('../models/Idea');
const Vote = require('../models/Vote');
const User = require('../models/User');
const OpenAI = require('openai'); /* open AI*/
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { title, description, userId } = req.body; // Destructure userId from the request body

    // Check if all required fields are provided
    if (!title || !description || !userId) {
      return res.status(400).json({ error: "Title, description, and userId are required" });
    }

    // Create a new idea with the provided data
    const newIdea = new Idea({
      title,
      description,
      status: 'Submitted', // Set a default status if needed
      voteCount: 0,        // Set initial vote count to 0
      userId                // Include userId in the new idea
    });

    await newIdea.save();
    res.status(201).json(newIdea);
  } catch (error) {
    console.error("Error submitting idea:", error); // Log the error for debugging
    res.status(500).json({ error: 'Error submitting idea' });
  }
});

router.post('/', async (req, res) => {
  try {
    const idea = new Idea({
      title: req.body.title,
      description: req.body.description,
      status: 'Submitted',
      voteCount: 0,
      userId: req.body._id // Attach userId from the request body
    });
    const savedIdea = await idea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    console.error("Error creating idea:", error);
    res.status(500).json({ error: "Failed to create idea" });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const ideas = await Idea.find({ userId });
    res.json(ideas);
  } catch (error) {
    console.error("Error fetching user's ideas:", error);
    res.status(500).json({ error: "Failed to retrieve ideas" });
  }
});

// fetch a recent idea
router.get('/recent/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const ideas = await Idea.find({ userId }).sort({ createdAt: -1 }).limit(3); // Fetch 5 most recent ideas
    res.json(ideas);
  } catch (error) {
    console.error("Error fetching recent ideas:", error);
    res.status(500).json({ error: "Failed to fetch recent ideas" });
  }
});

// fetch a new idea
router.get('/', async (req, res) => {
    try {
      const ideas = await Idea.find();
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching ideas' });
    }
  });

  // Update an idea's title or description
router.patch('/:id', async (req, res) => {
    try {
      const { title, description } = req.body;
      const updatedIdea = await Idea.findByIdAndUpdate(
        req.params.id,
        { title, description },
        { new: true }  // Return the updated document
      );
      
      if (!updatedIdea) {
        return res.status(404).json({ error: 'Idea not found' });
      }
  
      res.json(updatedIdea);
    } catch (error) {
      res.status(500).json({ error: 'Error updating idea' });
    }
  });

  // Cast a vote on an idea
  router.post('/:ideaId/vote', async (req, res) => {
    try {
      const { userId } = req.body;
      const { ideaId } = req.params;
  
      console.log("Received userId:", userId); // Debugging
      console.log("Received ideaId:", ideaId); // Debugging
  
      const existingVote = await Vote.findOne({ userId, ideaId });
      if (existingVote) return res.status(400).json({ error: 'You have already voted for this idea' });
  
      const newVote = new Vote({ userId, ideaId });
      await newVote.save();
  
      // Find the idea and make sure 'voters' is an array
      const idea = await Idea.findById(ideaId);
      if (!idea) return res.status(404).json({ error: "Idea not found" });
  
      // Ensure 'voters' array exists
      if (!idea.voters) {
        idea.voters = []; // Initialize as an empty array if it doesn’t exist
      }
  
      idea.voters.push(userId); // Now safe to push the userId
      idea.voteCount += 1;
      await idea.save();
  
      res.json({ message: 'Vote cast successfully' });
    } catch (error) {
      console.error("Error voting on idea:", error); // Additional logging for errors
      res.status(500).json({ error: 'Error casting vote' });
    }
  });
  

  // Notification router
  router.post('/update-status', async (req, res) => {
    console.log("Received Payload:", req.body);
    try {
      const { ideaId, status } = req.body;
  
      // Validate input data
      if (!ideaId || !status) {
        return res.status(400).json({ message: 'Invalid request data. All fields are required.' });
      }
  
      // Update the idea's status
      const updatedIdea = await Idea.findByIdAndUpdate(
        ideaId,
        { status },
        { new: true }
      );
  
      if (!updatedIdea) {
        return res.status(404).json({ message: 'Idea not found.' });
      }
  
      // Fetch the idea's creator
      const creator = await User.findById(updatedIdea.userId);
      if (!creator) {
        return res.status(404).json({ message: 'Idea creator not found.' });
      }
  
      // Generate and save the notification
      const notificationMessage = `The idea '${updatedIdea.title}' was ${status.toLowerCase()}.`;
      creator.notifications.unshift({ message: notificationMessage });
      await creator.save();
  
      res.status(200).json({
        message: 'Idea status updated successfully.',
        notification: notificationMessage,
      });
    } catch (error) {
      console.error('Error updating idea status:', error);
      res.status(500).json({ message: 'Failed to update idea status.' });
    }
  });

  /*_______________________________________________________________________________________*/
  
  /* AI CONFIGURATION */
  const HUGGINGFACE_API_KEY = "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";


// Route to analyze ideas
// Route: POST /api/ideas/analyze-ideas
/*router.post('/analyze-ideas', async (req, res) => {
  try {
    const { ideas } = req.body;

    if (!ideas || ideas.length === 0) {
      return res.status(400).json({ error: "Ideas array cannot be empty." });
    }

    const prompt = `Here are some submitted ideas:\n${ideas
      .map((idea, index) => `${index + 1}. Title: ${idea.title}\nDescription: ${idea.description}`)
      .join('\n')}

      From these ideas, select and summarize the top 3 ideas based on creativity and usefulness.`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2", // Replace with an available model
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Hugging Face Response:", response.data);

    const bestIdeas = response.data[0]?.generated_text || 'No ideas found.';
    res.status(200).json({ bestIdeas });
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error('Error analyzing ideas:', error.message);
      res.status(500).json({ error: 'Failed to analyze ideas' });
    }
  }
});*/


// Route: POST /api/ideas/analyze-ideas
router.post('/analyze-ideas', async (req, res) => {
  try {
    const { ideas } = req.body;

    if (!ideas || ideas.length === 0) {
      return res.status(400).json({ error: "Ideas array cannot be empty." });
    }

    // Construct the prompt
    const prompt = `
Here are some submitted ideas:\n${ideas
      .map((idea, index) => `${index + 1}. Title: ${idea.title}\nDescription: ${idea.description}`)
      .join('\n')}

Select the **top 3 ideas** based on creativity and usefulness. Respond with their titles and descriptions directly.
`;

    // Call Hugging Face API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large", // Replace with your chosen model
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Hugging Face Response:", response.data);

    // Send the raw response back to the frontend
    const bestIdeas = response.data?.[0]?.generated_text || "No good ideas found.";
    res.status(200).json({ bestIdeas });
  } catch (error) {
    console.error("Error analyzing ideas:", error.message);
    res.status(500).json({ error: "Failed to analyze ideas." });
  }
});

//for update delete
// Route: PUT /api/ideas/:id - Update an existing idea

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find and update the idea
    const updatedIdea = await Idea.findByIdAndUpdate(
      id,
      { title, description },
      { new: true } // Return updated document
    );

    if (!updatedIdea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    res.status(200).json({ message: 'Idea updated successfully', idea: updatedIdea });
  } catch (error) {
    console.error('Error updating idea:', error);
    res.status(500).json({ message: 'Failed to update idea' });
  }
});

module.exports = router;


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIdea = await Idea.findByIdAndDelete(id);
    if (!deletedIdea) {
      return res.status(404).json({ message: "Idea not found." });
    }

    res.status(200).json({ message: "Idea deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete idea." });
  }
});






module.exports = router;


