const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await User.find({ role: 'Employee' });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: 'Error fetching employees' });
  }
});



// Route to assign incentive points to an employee
router.post('/:employeeId/incentives', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { points } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Add points to the employee's current points
    employee.points += points;
    await employee.save();

    res.json({ message: 'Points assigned successfully', points: employee.points });
  } catch (error) {
    console.error("Error assigning points:", error);
    res.status(500).json({ error: 'Error assigning points' });
  }
});

// fetch points
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ points: user.points, username: user.username }); // Return points and other relevant info
  } catch (error) {
    console.error("Error fetching user points:", error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});


module.exports = router;
