const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Plant must belong to a user'],
    },
    name: {
      type: String,
      required: [true, 'Please provide a plant name'],
      trim: true,
      maxlength: [100, 'Plant name cannot exceed 100 characters'],
    },
    species: {
      type: String,
      required: [true, 'Please provide the plant species (e.g. Monstera Deliciosa)'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    location: {
      type: String,
      default: 'Living Room',
      trim: true,
    },
    wateringFrequency: {
      type: Number,
      required: [true, 'Please specify watering frequency in days'],
      min: [1, 'Watering frequency must be at least 1 day'],
      default: 7,
    },
    lastWatered: {
      type: Date,
      default: Date.now,
    },
    nextWatering: {
      type: Date,
      default: function () {
        const date = new Date(this.lastWatered || Date.now());
        date.setDate(date.getDate() + (this.wateringFrequency || 7));
        return date;
      },
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
    },
    sunlightRequirement: {
      type: String,
      enum: ['Direct Sunlight', 'Bright Indirect', 'Low Light', 'Partial Shade'],
      default: 'Bright Indirect',
    },
    healthStatus: {
      type: String,
      enum: ['Thriving', 'Healthy', 'Needs Water', 'Needs Attention'],
      default: 'Healthy',
    },
  },
  {
    timestamps: true,
  }
);

// Index for search by name, species, description
plantSchema.index({ name: 'text', species: 'text', description: 'text' });

module.exports = mongoose.model('Plant', plantSchema);
