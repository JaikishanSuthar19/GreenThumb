const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// Get recent messages for a room
router.get('/:room', protect, async (req, res, next) => {
  try {
    const room = req.params.room || 'general';
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
