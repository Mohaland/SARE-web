const mongoose = require('mongoose')

// Define the model schema
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['agent', 'customer'], default: 'customer' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('User', schema)