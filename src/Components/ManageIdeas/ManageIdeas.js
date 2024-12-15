/*
import React, { useEffect, useState } from 'react';
import { fetchIdeas, updateIdeaStatusWithNotification } from '../../services/api'; // Ensure these API functions exist
import './manageideas.css';

const ManageIdeas = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    loadIdeas();
  }, []);

  // Fetch all ideas
  const loadIdeas = async () => {
    try {
      const response = await fetchIdeas();
      setIdeas(response); // Assuming response is an array of ideas
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
  };

  // Handle approve or reject with notification
  const handleStatusChange = async (ideaId, status) => {
    
    console.log({ ideaId, status }); // Debugging log
 
    try {
        const response = await updateIdeaStatusWithNotification(ideaId, status);
        alert(response.message);
        loadIdeas(); // Reload ideas to reflect changes
    } catch (error) {
        console.error("Error updating idea status:", error);
        alert("Failed to update idea status.");
    }
};


return (
  <div className="manage-ideas-page">
    <h2 className="manage-ideas-title">Manage Ideas</h2>
    {ideas.length === 0 ? (
      <p className="manage-ideas-empty">No ideas to manage at the moment.</p>
    ) : (
      <div className="manage-ideas-grid">
        {ideas.map((idea) => (
          <div key={idea._id} className="manage-idea-card">
            <h3 className="manage-idea-title">{idea.title}</h3>
            <p className="manage-idea-description">{idea.description}</p>
            <p className="manage-idea-status">
              Status: <strong>{idea.status}</strong>
            </p>
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

export default ManageIdeas; */
/*__________________________*/

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

  /*//handle AI filtered ideas
  const filterBestIdeas = async (ideas) => {
    try {
      const cleanIdeas = ideas.map((idea) => ({
        title: idea.title,
        description: idea.description,
      }));
  
      const response = await analyzeIdeas(cleanIdeas);
  
      console.log('API Response:', response);
  
      // Parse the API response to extract the top titles
      const responseText = response.bestIdeas;
      const extractedTitles = responseText
        .split('\n') // Split by lines
        .filter((line) => line.trim() !== '') // Remove empty lines
        .map((line) => {
          const match = line.match(/Title: (.+)/); // Extract titles
          return match ? match[1].trim() : null; // Return only the title
        })
        .filter((title) => title !== null); // Remove null values
  
      console.log('Filtered Titles:', extractedTitles);
  
      // Match the extracted titles with the original ideas array
      const topIdeas = ideas.filter((idea) => extractedTitles.includes(idea.title));
  
      console.log('Top Ideas:', topIdeas);
  
      // Update the state with the filtered top ideas
      setBestIdeas(topIdeas);
  
      alert("AI filtered the best ideas successfully!");
    } catch (error) {
      console.error("Error filtering ideas:", error);
      alert("Failed to filter ideas.");
    }
  };*/
  
// Handle AI filtered ideas 
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
              <p className="manage-idea-status">
                Status: <strong>{idea.status}</strong>
              </p>
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


