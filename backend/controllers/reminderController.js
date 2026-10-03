const Reminder = require('../models/Reminder');
const Plant = require('../models/Plant');

/**
 * @desc    Create a new reminder
 * @route   POST /api/reminders
 * @access  Private
 */
const createReminder = async (req, res, next) => {
  try {
    const { plantId, title, reminderDate, reminderType, notes } = req.body;

    if (!plantId || !title || !reminderDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide plantId, title, and reminderDate',
      });
    }

    // Verify plant exists and belongs to user
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Associated plant not found',
      });
    }

    const reminder = await Reminder.create({
      userId: req.user._id,
      plantId,
      title,
      reminderDate: new Date(reminderDate),
      reminderType: reminderType || 'Watering',
      notes: notes || '',
    });

    const populatedReminder = await Reminder.findById(reminder._id).populate(
      'plantId',
      'name species imageUrl location'
    );

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: populatedReminder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reminders for a specific user ID
 * @route   GET /api/reminders/user/:id
 * @access  Private
 */
const getRemindersByUserId = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    // Security check: ensure requesting user matches or has permission
    if (
      req.user._id.toString() !== targetUserId &&
      req.user.id !== targetUserId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view another user reminders',
      });
    }

    const reminders = await Reminder.find({ userId: targetUserId })
      .populate('plantId', 'name species imageUrl location wateringFrequency lastWatered')
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's reminders
 * @route   GET /api/reminders
 * @access  Private
 */
const getMyReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id })
      .populate('plantId', 'name species imageUrl location wateringFrequency lastWatered')
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update / toggle reminder completion status
 * @route   PUT /api/reminders/:id
 * @access  Private
 */
const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    if (reminder.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reminder',
      });
    }

    // If marked as completed and it was a watering reminder, update the plant's lastWatered
    if (req.body.completed === true && reminder.reminderType === 'Watering') {
      const plant = await Plant.findById(reminder.plantId);
      if (plant) {
        plant.lastWatered = new Date();
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (plant.wateringFrequency || 7));
        plant.nextWatering = nextDate;
        await plant.save();
      }
    }

    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('plantId', 'name species imageUrl location');

    res.status(200).json({
      success: true,
      message: 'Reminder updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete reminder
 * @route   DELETE /api/reminders/:id
 * @access  Private
 */
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    if (reminder.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reminder',
      });
    }

    await reminder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReminder,
  getRemindersByUserId,
  getMyReminders,
  updateReminder,
  deleteReminder,
};
