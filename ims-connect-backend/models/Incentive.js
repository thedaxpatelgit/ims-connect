const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incentiveSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  points: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Incentive', incentiveSchema);
