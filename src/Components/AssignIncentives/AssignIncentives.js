import React, { useEffect, useState } from 'react';
import { fetchEmployees, assignIncentivePoints } from '../../services/api';
import './assignincentives.css';

const AssignIncentives = () => {
  const [employees, setEmployees] = useState([]);
  const [points, setPoints] = useState({});

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await fetchEmployees();
        setEmployees(employeesData); // Set fetched employees
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };

    loadEmployees();
  }, []);

  const handleAssignPoints = async (employeeId) => {
    if (!points[employeeId]) {
      alert("Please enter points to assign.");
      return;
    }

    try {
      await assignIncentivePoints(employeeId, points[employeeId]);
      alert("Points assigned successfully!");
    } catch (error) {
      console.error("Error assigning points:", error);
      alert("Failed to assign points.");
    }
  };

  const handlePointsChange = (e, employeeId) => {
    setPoints({ ...points, [employeeId]: e.target.value });
  };

  return (
    <div className="assign-incentives-container">
      <h2 className="section-title">Assign Incentives</h2>
      {employees.length === 0 ? (
        <p className="no-employees">No employees available to assign incentives.</p>
      ) : (
        <div className="employee-grid">
          {employees.map((employee) => (
            <div key={employee._id} className="employee-card">
              <h3 className="employee-name">{employee.username}</h3>
              <p className="employee-points">Current Points: {employee.points}</p>
              <div className="input-container">
                <input
                  type="number"
                  className="points-input"
                  placeholder="Points to assign"
                  value={points[employee._id] || ""}
                  onChange={(e) => handlePointsChange(e, employee._id)}
                />
                <button
                  className="assign-button"
                  onClick={() => handleAssignPoints(employee._id)}
                >
                  Assign Points
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignIncentives;
