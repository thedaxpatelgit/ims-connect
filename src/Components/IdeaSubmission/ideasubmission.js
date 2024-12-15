import React, { useState } from 'react';
import { submitIdea } from '../../services/api';
import './ideasubmission.css';
function IdeaSubmission() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
   
  const handleSubmitIdea = async () => {
    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');
    console.log("Retrieved userId:", userId);
    if (!userId) {
      alert("Error: User not logged in.");
      return;
    }

    // Prepare the idea data including the userId
    const ideaData = {
      title,
      description,
      status: "Submitted", // Default status
      voteCount: 0, // Initial vote count
      userId // Attach userId to the idea
    };

    try {
      const newIdea = await submitIdea(ideaData);
      console.log("Idea submitted:", newIdea);
      setTitle('');
      setDescription('');
      alert("Idea submitted successfully!");
    } catch (error) {
      alert("Failed to submit idea. Please try again.");
    }
  };

  return (
    <div className="submit-idea-container">
      <h2>Submit an Idea</h2>
      <form className="idea-form" onSubmit={handleSubmitIdea}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            placeholder="Enter the title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            placeholder="Describe your idea"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">Submit Idea</button>
      </form>
    </div>
  );
}

export default IdeaSubmission;
