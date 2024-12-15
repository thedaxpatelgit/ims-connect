import React, { useEffect, useState } from 'react';
import { fetchUserIdeas } from '../../services/api';
import './viewideas.css';

const ViewIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const userId = localStorage.getItem('userId'); // Retrieve the user ID from local storage
  console.log("Retrieved userId from localStorage:", userId); // Log userId for debugging

  useEffect(() => {
    const loadIdeas = async () => {
      if (!userId) {
        console.error("User ID is missing");
        return;
      }
      try {
        const ideasData = await fetchUserIdeas(userId);
        console.log("Fetched ideas data:", ideasData);
        setIdeas(ideasData);
      } catch (error) {
        console.error("Error loading user's ideas:", error);
      }
    };
  
    loadIdeas();
  }, [userId]);

  return (
    <div className="view-ideas-container">
      <h2>Your Submitted Ideas</h2>
      {ideas.length === 0 ? (
        <p className="no-ideas">You have not submitted any ideas yet.</p>
      ) : (
        <div className="ideas-grid">
          {ideas.map((idea) => (
            <div key={idea._id} className="idea-card-v">
              <h3 className="idea-title">{idea.title}</h3>
              <p className="idea-description">{idea.description}</p>
              <p className="idea-status">
                Status: <strong>{idea.status}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewIdeas;
