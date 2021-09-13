const mongoose = require('mongoose')

// Define the model schema
const schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  house: { type: mongoose.Types.ObjectId, ref: 'House', required: true },
  agent: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['WAITING', 'ACCEPTED', 'CANCELLED', 'DONE'], default: 'WAITING' }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', schema)