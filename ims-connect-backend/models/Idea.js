// models/Idea.js
const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Submitted' }, // Optional, with default value
  voteCount: { type: Number, default: 0 },        // Optional, with default value
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' } // Link to User model
},
 { timestamps: true } // This automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Idea', IdeaSchema);
