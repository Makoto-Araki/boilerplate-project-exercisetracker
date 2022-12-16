// Import
const mongoose = require('mongoose');

// Sub schema
const subSchema = mongoose.Schema(
  {
    description: { type: String },
    duration: { type: Number },
    date: { type: Date, default: Date.now }
  }, 
  {_id: false}
);

// Main schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [subSchema]
});

// Model export
module.exports = mongoose.model('Users', userSchema);
