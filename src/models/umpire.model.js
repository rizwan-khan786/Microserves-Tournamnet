const mongoose = require('mongoose');

const umpireSchema = new mongoose.Schema({
  name: { type: String, required: true },
  experience: { type: Number, default: 0 }, // in years
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Track creator

}, { timestamps: true });

module.exports = mongoose.model('Umpire', umpireSchema);
