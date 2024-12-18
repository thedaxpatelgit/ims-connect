/*
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

export default ViewIdeas;*/

import React, { useEffect, useState } from 'react';
import { fetchUserIdeas, deleteIdea, updateIdea } from '../../services/api';
import './viewideas.css';

const ViewIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [editingIdea, setEditingIdea] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const userId = localStorage.getItem('userId'); // Retrieve the user ID

  // Load user ideas
  useEffect(() => {
    const loadIdeas = async () => {
      if (!userId) {
        console.error("User ID is missing");
        return;
      }
      try {
        const ideasData = await fetchUserIdeas(userId);
        setIdeas(ideasData);
      } catch (error) {
        console.error("Error loading user's ideas:", error);
      }
    };
    loadIdeas();
  }, [userId]);

  // Handle delete idea
  const handleDelete = async (ideaId) => {
    try {
      await deleteIdea(ideaId);
      setIdeas(ideas.filter((idea) => idea._id !== ideaId));
      alert("Idea deleted successfully!");
    } catch (error) {
      console.error("Error deleting idea:", error);
      alert("Failed to delete the idea.");
    }
  };

  // Handle edit initiation
  const handleEdit = (idea) => {
    setEditingIdea(idea._id);
    setNewTitle(idea.title);
    setNewDescription(idea.description);
  };

  // Handle save edit
  const handleSaveEdit = async (ideaId) => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Title and description cannot be empty.");
      return;
    }
  
    try {
      const updatedData = { title: newTitle, description: newDescription };
      const response = await updateIdea(ideaId, updatedData);
  
      setIdeas(
        ideas.map((idea) =>
          idea._id === ideaId ? { ...idea, title: response.idea.title, description: response.idea.description } : idea
        )
      );
      setEditingIdea(null);
      alert("Idea updated successfully!");
    } catch (error) {
      console.error("Error saving updated idea:", error);
      alert("Failed to save updated idea. Please try again.");
    }
  };
  
  return (
    <div className="view-ideas-container">
      <h2>Your Submitted Ideas</h2>
      {ideas.length === 0 ? (
        <p className="no-ideas">You have not submitted any ideas yet.</p>
      ) : (
        <div className="ideas-grid">
          {ideas.map((idea) => (
            <div key={idea._id} className="idea-card-v">
              {editingIdea === idea._id ? (
                <div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="edit-input"
                  />
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="edit-textarea"
                  />
                  <div className="button-container">
                  <button onClick={() => handleSaveEdit(idea._id)} className="save-btn">
                    Save
                  </button>
                  <button onClick={() => setEditingIdea(null)} className="cancel-btn">
                    Cancel
                  </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="idea-title">{idea.title}</h3>
                  <p className="idea-description">{idea.description}</p>
                  
                  
                  <p className="idea-status">
                    
                    Status: <strong><span style={{ color: idea.status === 'Rejected' ? 'red' : 'green' }}>{idea.status}</span></strong>
                  </p>
                  <div className="idea-actions">
                    <button onClick={() => handleEdit(idea)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(idea._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                  
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewIdeas;
