const mongoose = require('mongoose')

// Define the model schema
const schema = new mongoose.Schema({
  field: { type: String, required: true },
  reference: { type: mongoose.Types.ObjectId, ref: 'AnotherModel' }
}, { timestamps: true })

module.exports = mongoose.model('Model', schema)