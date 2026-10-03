const express = require('express');
const router = express.Router();
const {
  createReminder,
  getRemindersByUserId,
  getMyReminders,
  updateReminder,
  deleteReminder,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All reminder routes are protected

router.route('/')
  .post(createReminder)
  .get(getMyReminders);

router.get('/user/:id', getRemindersByUserId);

router.route('/:id')
  .put(updateReminder)
  .delete(deleteReminder);

module.exports = router;
