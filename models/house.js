const mongoose = require('mongoose')

// Define the model schema
const schema = new mongoose.Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  room: { type: Number, default: 1 },
  bathroom: { type: Number, default: 0 },
  kitchen: { type: Number, default: 0 },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['AVAILABLE', 'SOLD'], default: 'AVAILABLE' },
  gallery: [{ type: String, required: true }]
}, { timestamps: true })

module.exports = mongoose.model('House', schema)