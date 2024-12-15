// src/services/api.js
import axios from 'axios';

// Set the base URL for API calls
const API_URL = 'http://localhost:5000/api';  // Adjust this to match the actual server address

// User Authentication (Login)
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register User
export const registerUser = async (username, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password, role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Idea Submission
export const submitIdea = async (ideaData) => {
  try {
    const response = await axios.post(`${API_URL}/ideas`, ideaData);
    return response.data;
  } catch (error) {
    console.error("Error submitting idea:", error);
    throw error;
  }
};

export const fetchUserIdeas = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/ideas/user/${userId}`);
    return response.data; // Should return an array of ideas
  } catch (error) {
    console.error("Error fetching user's ideas:", error);
    throw error;
  }
};

// Fetch All Ideas for Voting
export const fetchIdeas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ideas`);
    return response.data;
  } catch (error) {
    console.error("Fetch ideas error:", error);
    throw error;
  }
};

// Vote on an Idea
export const voteOnIdea = async (ideaId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/ideas/${ideaId}/vote`, { userId });
    return response.data;
  } catch (error) {
    console.error("Voting error:", error);
    throw error;
  }
};



// Fetch Incentives for a User
export const fetchIncentives = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/incentives/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch incentives error:", error);
    throw error;
  }
};



// fetch recent ideas
export const fetchRecentIdeas = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/ideas/recent/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent ideas:", error);
    throw error;
  }
};

export const getUserPoints = async (userId) => {
  console.log("API: getUserPoints called with userId:", userId); // Debug log
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/points`);
    console.log("API: Response from getUserPoints:", response.data); // Debug log to inspect data from backend
    return response.data;
  } catch (error) {
    console.error("Error fetching user points:", error);
    throw error;
  }
};


export const updateIdeaStatus = async (ideaId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/ideas/${ideaId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating idea status:", error);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const assignIncentivePoints = async (userId, points) => {
  try {
    const response = await axios.post(`${API_URL}/assign-incentives/assign`, {
      userId,
      points,
      type: "Performance Bonus" // or another type
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning incentive points:", error);
    throw error;
  }
};


export const updateIdeaStatusWithNotification = async (ideaId, status, username) => {
  try {
    const response = await axios.post(`${API_URL}/ideas/update-status`, {
      ideaId,
      status,
      username,
    });
    return response.data; // Return the notification message
  } catch (error) {
    console.error('Error updating idea status with notification:', error);
    throw error;
  }
};


export const fetchNotifications = async (userId) => {
  try {
    console.log('Fetching notifications for userId:', userId);
    const response = await axios.get(`${API_URL}/users/${userId}/notifications`);
    console.log('API Response:', response.data);
    return response.data.notifications; // Ensure it's an array
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Analyze ideas with AI
// Analyze ideas with AI
export const analyzeIdeas = async (ideas) => {
  try {
    const response = await axios.post(`${API_URL}/ideas/analyze-ideas`, { ideas });
    return response.data; // Returns the best ideas
  } catch (error) {
    console.error('Error analyzing ideas:', error);
    throw error;
  }
};