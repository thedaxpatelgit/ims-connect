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

export default VotingPanel;
