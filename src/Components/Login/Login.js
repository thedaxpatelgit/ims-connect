import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { Link } from 'react-router-dom';
import './Login.css';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      const response = await loginUser(username, password);

      localStorage.setItem('token', response.token);    // Store token in localStorage
      localStorage.setItem('username', response.user.username);  // store user name
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('userId', response.user._id);
      console.log("Logged in successfully:", response);     // Log the response 
      navigate('/dashboard');                                
    } 
    
    catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
    {/* Sidebar Section */}
    <div className="sidebar">
      <img
        src="/ims.png"
        alt="IMS-Connect Logo"
        className="sidebar-logo"
      />
      <h2>Welcome to GreenFuture's IMS-Connect</h2>
      <p>
        The Idea Management System (IMS-Connect) helps teams collaborate, 
        share ideas, and drive innovation. Log in to submit ideas, vote, 
        and track progress.
      </p>
    </div>

    <div className="login-container">
      <h6 className="heading">Idea Management System Connect</h6>
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
    </div>
  );
}
export default Login;
