const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // e.g 14:30
  location: { type: String, required: true },
  organizerName: { type: String, required: true },
  eventBanner: { type: String }, // URL to uploaded banner
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;