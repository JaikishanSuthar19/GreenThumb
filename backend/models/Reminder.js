const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reminder must belong to a user'],
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: [true, 'Reminder must be associated with a plant'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the reminder'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    reminderDate: {
      type: Date,
      required: [true, 'Please specify the reminder date and time'],
    },
    reminderType: {
      type: String,
      enum: ['Watering', 'Fertilizing', 'Repotting', 'Pruning', 'Misting', 'Sunlight Check', 'General Care'],
      default: 'Watering',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reminderSchema.index({ userId: 1, reminderDate: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
