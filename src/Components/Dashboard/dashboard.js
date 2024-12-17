import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, fetchRecentIdeas, getUserPoints } from '../../services/api';
import './dashboard.css';
import axios from 'axios';

function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [points, setPoints] = useState(0);
  const [username] = useState(localStorage.getItem('username') || "User");
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {    
    loadNotifications();
    loadRecentIdeas();
    fetchPoints();
  }, []);

 
  
  const loadNotifications = async () => {
    try {
      console.log("Fetching notifications for userId:", userId);
      const data = await fetchNotifications(userId);
      
      setNotifications(data || []); // Ensure data is an array
      console.log("Notifications:", data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]); // Set empty array on failure
    }
  };

  const loadRecentIdeas = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage
      const recentIdeasData = await fetchRecentIdeas(userId);
      console.log("Fetched recent ideas:", recentIdeasData); // Debugging
      setRecentIdeas(recentIdeasData); // Update state with fetched ideas
    } catch (error) {
      console.error("Error loading recent ideas:", error);
    }
  };
 
  const fetchPoints = async () => {
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  console.log("Dashboard: Retrieved userId:", userId); // Debug log

  if (!userId) {
    alert("User ID is missing. Please log in again.");
    return;
  }

  try {
    const response = await getUserPoints(userId); // Pass userId to API call
    console.log("Dashboard: Fetched points response:", response); // Debug log to check the API response
    setPoints(response.points);
  } catch (error) {
    console.error("Error fetching points:", error);
  }
};

  


return (
  <div className="dashboard-container">
  <h2>Welcome to IMS-Connect, {username} !</h2>
  <div className="dashboard">

  <div className="notifications-container">
  <h3>Notifications</h3>
  <div className="notifications-box">
    <ul>
      {notifications.length > 0 ? (
        notifications.map((note, index) => (
          <li key={index}>{note.message}</li>
        ))
      ) : (
        <li>No notifications available.</li>
      )}
    </ul>
  </div>
</div>
    
    
    <div className='ideas-text'>
    <h3>Your Recent Ideas</h3>
      <div className="ideas">
        <div className="ideas-placeholder">
        {recentIdeas.length === 0 ? (
            <li>No ideas submitted yet.</li>
          ) : (
            <ul>
              {recentIdeas.map((idea, index) => (
                <li key={index}>
                  <strong>{idea.title}</strong>: {idea.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ideas-buttons">
          <button onClick={() => navigate("/submit-idea")}>Submit a New Idea</button>
          <button onClick={() => navigate("/view-ideas")}>View Your Ideas</button>
        </div>
      </div>
    </div>
    
    <div className='incentives-text'>
      <h3>Your Incentives</h3>
      <div className="incentives">  
        <div className="incentives-placeholder">
          <p>You have earned <strong>{points} Incentives</strong>.</p>
        </div>
        <div className="incentives-buttons">
          <button onClick={() => navigate("/incentives")}>View Incentives</button>
        </div>
      </div>
    </div>
    <div className="quick-access">
      <h3>Quick Access</h3>
      <div className="quick-access-buttons">
        <button onClick={() => navigate("/submit-idea")}>Submit an Idea</button>
        <button onClick={() => navigate("/vote")}>Vote on Ideas</button>
      </div>
    </div>

    {role === 'Manager' && (
      <div className="manager-section.active">
        <h3>Manager Actions</h3>
        <div className='manager-section-button'>
        <button onClick={() => navigate("/assign-incentives")}>Assign Incentives</button>
        <button onClick={() => navigate("/manage-ideas")}>Manage Ideas</button>
        </div>
      </div>
    )}
  </div>
</div>

);

}

export default Dashboard;
