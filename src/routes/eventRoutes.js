const express = require('express');
const { body, param } = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');

const router = express.Router();

// All routes protected
router.use(protect);

router.post('/',
  upload.single('eventBanner'),
  [
    body('title').notEmpty(),
    body('date').notEmpty(),
    body('time').notEmpty(),
    body('location').notEmpty(),
    body('organizerName').notEmpty()
  ],
  createEvent
);

router.get('/', getEvents);

router.get('/:id', [param('id').isMongoId()], getEventById);

router.put('/:id',
  upload.single('eventBanner'),
  [param('id').isMongoId()],
  updateEvent
);

router.delete('/:id', [param('id').isMongoId()], deleteEvent);

module.exports = router;
