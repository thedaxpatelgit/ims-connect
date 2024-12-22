
import React, { useEffect, useState } from 'react';
import { fetchIdeas, updateIdeaStatusWithNotification } from '../../services/api';
import axios from 'axios';
import './manageideas.css';
import { analyzeIdeas } from '../../services/api';

const ManageIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [bestIdeas, setBestIdeas] = useState([]);

  useEffect(() => {
    loadIdeas();
  }, []);

  // Fetch all ideas
  const loadIdeas = async () => {
    try {
      const response = await fetchIdeas();
      setIdeas(response);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
  };

  

// Handle AI-filtered ideas
const filterBestIdeas = async (ideas) => {
  try {
    // Clean up ideas to send only titles and descriptions
    const cleanIdeas = ideas.map((idea) => ({
      title: idea.title,
      description: idea.description,
    }));

    const response = await analyzeIdeas(cleanIdeas);

    console.log("API Response:", response);

    // Simply display the raw response as text
    const bestIdeasRaw = response.bestIdeas;

    // Update the UI to show the "best ideas"
    setBestIdeas([{ title: "Top AI-Selected Ideas", description: bestIdeasRaw }]);

    alert("AI filtered the best ideas successfully!");
  } catch (error) {
    console.error("Error filtering ideas:", error);
    alert("Failed to filter ideas.");
  }
};



  // Handle approve or reject with notification
  const handleStatusChange = async (ideaId, status) => {
    try {
      const response = await updateIdeaStatusWithNotification(ideaId, status);
      alert(response.message);
      loadIdeas();
    } catch (error) {
      console.error("Error updating idea status:", error);
      alert("Failed to update idea status.");
    }
  };

  return (
    <div className="manage-ideas-page">
      <h2 className="manage-ideas-title">Manage Ideas</h2>
      <button 
  className="custom-ai-button" 
  onClick={() => filterBestIdeas(ideas)}
>
  <img 
    src="/gemini.png" 
    alt="Gemini Icon" 
    className="icon-img"
  />
  Filter Best Ideas with AI
</button>

      {bestIdeas.length > 0 && (
  <div className="best-ideas-section">
    <h3>Top Ideas Recommended by AI</h3>
    {bestIdeas.map((idea, index) => (
      <div key={index}>
        <p>
          <strong>{idea.title}</strong>: {idea.description}
        </p>
      </div>
    ))}
  </div>
)}


      {ideas.length === 0 ? (
        <p className="manage-ideas-empty">No ideas to manage at the moment.</p>
      ) : (
        <div className="manage-ideas-grid">
          {ideas.map((idea) => (
            <div key={idea._id} className="manage-idea-card">
              <h3 className="manage-idea-title">{idea.title}</h3>
              <p className="manage-idea-description">{idea.description}</p>
              
              <div className="idea-info">
              <p className="idea-votes-m">
                Votes: <strong className="vote-count">{idea.voteCount || 0}</strong>
              </p>
              
              <p className="idea-user">
                Submitted by: <strong style={ {color: '#007bff'}}>{idea.userId?.username || 'Unknown User'}</strong>
              </p>

              <p className="manage-idea-status">
                Status: <strong><span style={{ color: idea.status === 'Rejected' ? 'red' 
                                                    : idea.status === 'Approved' ? 'green'
                                                    : idea.status === 'Submitted' ? '#007bff' :'black', }}>{idea.status}</span></strong>
              </p>
              </div>
              
              <div className="manage-idea-buttons">
                <button
                  className="manage-approve-btn"
                  onClick={() => handleStatusChange(idea._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="manage-reject-btn"
                  onClick={() => handleStatusChange(idea._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageIdeas;


