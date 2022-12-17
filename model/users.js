// Import
const mongoose = require('mongoose');

// Sub schema
const subSchema = mongoose.Schema(
  {
    _id: false,
    description: { type: String },
    duration: { type: Number },
    date: { type: Date, default: Date.now },
  }
);

// Main schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: { type: [subSchema] },  // Array of subSchema
});

// Model export
module.exports = mongoose.model('Users', userSchema);
