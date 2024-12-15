const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true }
});

module.exports = mongoose.model('Vote', voteSchema);
