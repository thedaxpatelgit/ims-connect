import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/dashboard';
import IdeaSubmission from './Components/IdeaSubmission/ideasubmission';
import VotingPanel from './Components/VotingPanel/votingpanel';
import IncentiveTracker from './Components/IncentiveTracker/incentivetracker';
import AssignIncentives from './Components/AssignIncentives/AssignIncentives'; // Create this component if it doesn't exist
import ManageIdeas from './Components/ManageIdeas/ManageIdeas';          // Create this component if it doesn't exist
import ManagerRoute from './Components/ManagerRoute/ManagerRoute'; 
import ViewIdeas from './Components/ViewIdeas/ViewIdeas';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-idea" element={<IdeaSubmission />} />
          <Route path="/vote" element={<VotingPanel />} />
          <Route path="/incentives" element={<IncentiveTracker />} />
          <Route path="/assign-incentives" element={<ManagerRoute> <AssignIncentives /> </ManagerRoute>} />
          <Route path="/manage-ideas" element={<ManagerRoute><ManageIdeas /></ManagerRoute>} />
          <Route path="/view-ideas" element={<ViewIdeas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
