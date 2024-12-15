import React, { useState } from 'react';
import { registerUser } from '../../services/api'; // Ensure this function is in `api.js`
import './Register.css';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee'); // Default role as Employee
  const [region, setRegion] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(username, password, role);
      alert("Registration successful! Please login.");
    } catch (error) {
      console.error("Registration error:", error.response ? error.response.data : error.message);
      alert("Registration failed. Please try again.");
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
        The Idea Management System (IMS-Connect) empowers teams to submit, 
        manage, and vote on ideas, fostering innovation and collaboration 
        across the organization.
      </p>
    </div>
    
    <div className="register-container">
      <h1 className="heading">Idea Management System Connect</h1>
      <div className="register-box">
        <h2>Register a New User</h2>
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>
      
      {/* New Region Dropdown */}
      <select
        className="region-dropdown"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="">Select Region</option>
        <option value="India">India</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Canada">Canada</option>
        <option value="Australia">Australia</option>
        <option value="Germany">Germany</option>
        <option value="France">France</option>
        <option value="Japan">Japan</option>
        <option value="China">China</option>
        <option value="Brazil">Brazil</option>
      </select>

        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <Link to="/">Login here</Link></p>
      </div>
    </div>
    </div>
  );

}

export default Register;
