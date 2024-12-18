/*import React, { useEffect, useState } from 'react';
import { fetchIdeas, voteOnIdea } from '../../services/api';
import './votingpanel.css';

function VotingPanel() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const fetchedIdeas = await fetchIdeas();
        setIdeas(fetchedIdeas);
      } catch (error) {
        alert("Failed to load ideas.");
      }
    };
    loadIdeas();
  }, []);

  const handleVote = async (ideaId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    console.log("User ID:", userId); // Debugging: Check if userId is correctly retrieved
    console.log("Idea ID:", ideaId); // Debugging: Check if ideaId is correct
  
    if (!userId) {
      alert("Error: User is not logged in.");
      return;
    }
  
    try {
      await voteOnIdea(ideaId, userId); // Pass both ideaId and userId
      alert("Voted successfully!");
    } catch (error) {
      console.error("Error voting on idea:", error);
      alert("Failed to vote. Please try again.");
    }
  };
  

  return (
    <div className="voting-panel-container">
      <h2 className="voting-title">Vote on Ideas</h2>
      <div className="voting-grid">
        {ideas.map((idea) => (
          <div key={idea._id} className="idea-card">
            <h3>{idea.title}</h3>
            <p>{idea.description}</p>
            <button className="vote-button" onClick={() => handleVote(idea._id)}>
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotingPanel; */

import React, { useEffect, useState } from 'react';
import { fetchIdeas, voteOnIdea } from '../../services/api';
import './votingpanel.css';

function VotingPanel() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const fetchedIdeas = await fetchIdeas();
        setIdeas(fetchedIdeas);
      } catch (error) {
        alert("Failed to load ideas.");
      }
    };
    loadIdeas();
  }, []);

  const handleVote = async (ideaId, action) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  
    if (!userId) {
      alert("Error: User is not logged in.");
      return;
    }
  
    console.log("Request Payload:", { userId, action }); // Log payload being sent
  
    try {
      const response = await voteOnIdea(ideaId, userId, action);
      console.log("Response:", response); // Log response
      alert(`Idea ${action}d successfully!`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Specific error for already voted
        if (error.response.data.error === 'You have already voted for this idea.') {
          alert('You have already voted for this idea.');
        } else {
          alert(error.response.data.error || 'Failed to vote. Please try again.');
        }
      } else {
        console.error(`Error ${action}ing idea:`, error);
        alert(`Failed to ${action}. Please try again.`);
      }
    
    }
  };
  

  return (
    <div className="voting-panel-container">
      <h2 className="voting-title">Vote on Ideas</h2>
      <div className="voting-grid">
        {ideas.map((idea) => (
          <div key={idea._id} className="idea-card">
            <h3>{idea.title}</h3>
            <p>{idea.description}</p>
            <div className="vote-buttons">
              <button
                className="vote-button upvote"
                onClick={() => handleVote(idea._id, 'upvote')}
              >
                Upvote
              </button>
              <button
                className="vote-button downvote"
                onClick={() => handleVote(idea._id, 'downvote')}
              >
                Downvote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotingPanel;

