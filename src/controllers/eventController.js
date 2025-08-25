const Event = require('../models/event');
const { validationResult } = require('express-validator');

const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, date, time, location, organizerName } = req.body;
  const eventBanner = req.file ? `/uploads/${req.file.filename}` : undefined;

  const event = await Event.create({
    title,
    description,
    date,
    time,
    location,
    organizerName,
    eventBanner,
    createdBy: req.user._id
  });

  res.status(201).json({ event });
};

const getEvents = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
  res.json({ events });
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ event });
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: only creator can update' });
  }

  const fields = ['title','description','date','time','location','organizerName'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) event[f] = req.body[f];
  });
  if (req.file) event.eventBanner = `/uploads/${req.file.filename}`;

  await event.save();
  res.json({ event });
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.createdBy.toString() != req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: only creator can delete' });
  }

  await event.deleteOne();
  res.json({ message: 'Event deleted' });
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
