// Import dependencies
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path based on your project structure

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ims-connect', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((error) => console.error('Database connection error:', error));

// Function to update old users to match the new schema
const updateOldUsers = async () => {
  try {
    // Find all users who are missing the 'userId' field or have other inconsistencies
    const users = await User.find({ userId: { $exists: false } }); // Adjust this query as needed

    for (const user of users) {
      // Add or modify necessary fields to align with the new schema
      user.userId = user._id; // Map _id to userId or adjust according to your schema requirements
      await user.save();
      console.log(`Updated user ${user.username}`);
    }

    console.log("Old users updated successfully.");
  } catch (error) {
    console.error("Error updating old users:", error);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};

// Execute the function
updateOldUsers();
