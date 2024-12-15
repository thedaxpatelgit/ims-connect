import React, { useEffect, useState } from 'react';
import { fetchIncentives } from '../../services/api';
import './incentives.css';

function IncentiveTracker() {
  const [incentives, setIncentives] = useState([]);
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const loadIncentives = async () => {
      if (!userId) {
        alert("User ID is missing. Please log in again.");
        return;
      }
      try {
        console.log("Fetching incentives for userId:", userId);
        const fetchedIncentives = await fetchIncentives(userId);
        console.log("Fetched incentives:", fetchedIncentives); // Debugging
        setIncentives(fetchedIncentives);
      } catch (error) {
        alert("Failed to load incentives.");
        console.error("Fetch incentives error:", error);
      }
    };

    loadIncentives();
  }, [userId]);

  return (
    <div className="incentive-tracker-page">
      <h2 className="incentive-tracker-title">Your Incentives</h2>
      {incentives.length > 0 ? (
        <div className="incentive-tracker-list">
          {incentives.map((incentive, index) => (
            <div key={index} className="incentive-card">
              <p className="incentive-type">
                {incentive.type}: <span className="incentive-points">{incentive.points} points</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="incentive-empty">No incentives available.</p>
      )}
    </div>
  );
}

export default IncentiveTracker;
