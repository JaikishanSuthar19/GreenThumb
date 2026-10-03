const Plant = require('../models/Plant');
const Reminder = require('../models/Reminder');
const { uploadToFirebaseStorage } = require('../config/firebase');

// Built-in catalog of common plant species for rich search & instant cataloging
const SPECIES_CATALOG = [
  {
    name: 'Jade Plant',
    species: 'Crassula ovata (Succulent)',
    description: 'A popular succulent houseplant with fleshy, oval-shaped leaves and thick, woody stems.',
    location: 'Sunny Window',
    wateringFrequency: 14,
    sunlightRequirement: 'Direct Sunlight',
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop&q=80',
    tags: ['succulent', 'easy-care', 'indoor'],
  },
  {
    name: 'Echeveria Elegans',
    species: 'Echeveria (Succulent)',
    description: 'Stunning rosette-forming succulent known as Mexican snow ball with pale silvery-blue leaves.',
    location: 'Balcony',
    wateringFrequency: 10,
    sunlightRequirement: 'Direct Sunlight',
    imageUrl: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=600&auto=format&fit=crop&q=80',
    tags: ['succulent', 'rosette', 'drought-tolerant'],
  },
  {
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    description: 'Iconic Swiss Cheese Plant famous for dramatic natural leaf fenestrations and tropical lushness.',
    location: 'Living Room',
    wateringFrequency: 7,
    sunlightRequirement: 'Bright Indirect',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
    tags: ['tropical', 'foliage', 'indoor'],
  },
  {
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata (Succulent)',
    description: 'Virtually indestructible air-purifying plant with upright sword-like green and yellow foliage.',
    location: 'Bedroom',
    wateringFrequency: 14,
    sunlightRequirement: 'Low Light',
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=600&auto=format&fit=crop&q=80',
    tags: ['succulent', 'air-purifying', 'low-light'],
  },
  {
    name: 'Golden Pothos',
    species: 'Epipremnum aureum',
    description: 'Fast-growing trailing vine with heart-shaped, variegated green and golden leaves.',
    location: 'Bookshelf',
    wateringFrequency: 6,
    sunlightRequirement: 'Bright Indirect',
    imageUrl: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=600&auto=format&fit=crop&q=80',
    tags: ['trailing', 'fast-growing', 'beginner-friendly'],
  },
  {
    name: 'Aloe Vera',
    species: 'Aloe barbadensis (Succulent)',
    description: 'Beloved medicinal succulent known for thick gel-filled spiked leaves and therapeutic benefits.',
    location: 'Kitchen Windowsill',
    wateringFrequency: 14,
    sunlightRequirement: 'Direct Sunlight',
    imageUrl: 'https://images.unsplash.com/photo-1567689265664-1c48de61db0b?w=600&auto=format&fit=crop&q=80',
    tags: ['succulent', 'medicinal', 'healing'],
  },
  {
    name: 'Boston Fern',
    species: 'Nephrolepis exaltata',
    description: 'Lush graceful arching fronds that thrive in high humidity and gentle filtered light.',
    location: 'Bathroom',
    wateringFrequency: 4,
    sunlightRequirement: 'Bright Indirect',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&auto=format&fit=crop&q=80',
    tags: ['fern', 'humidity-lover', 'foliage'],
  },
  {
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    description: 'A stately indoor statement tree with broad violin-shaped leaves and architectural grandeur.',
    location: 'Living Room Corner',
    wateringFrequency: 7,
    sunlightRequirement: 'Bright Indirect',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
    tags: ['tree', 'statement', 'modern'],
  }
];

/**
 * @desc    Get all plants for logged in user
 * @route   GET /api/plants
 * @access  Private
 */
const getPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single plant by ID
 * @route   GET /api/plants/:id
 * @access  Private
 */
const getPlantById = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found with specified ID',
      });
    }

    // Verify ownership
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this plant',
      });
    }

    // Also get any pending reminders for this plant
    const reminders = await Reminder.find({
      plantId: plant._id,
      userId: req.user._id,
    }).sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...plant.toObject(),
        reminders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new plant
 * @route   POST /api/plants
 * @access  Private
 */
const createPlant = async (req, res, next) => {
  try {
    const {
      name,
      species,
      description,
      location,
      wateringFrequency,
      lastWatered,
      sunlightRequirement,
      healthStatus,
    } = req.body;

    let imageUrl = req.body.imageUrl;

    // Handle file upload if provided
    if (req.file) {
      imageUrl = await uploadToFirebaseStorage(req.file, 'plants');
    }

    if (!name || !species) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both plant name and species',
      });
    }

    const freq = wateringFrequency ? Number(wateringFrequency) : 7;
    const lastWateredDate = lastWatered ? new Date(lastWatered) : new Date();
    const nextWateringDate = new Date(lastWateredDate);
    nextWateringDate.setDate(nextWateringDate.getDate() + freq);

    const plant = await Plant.create({
      userId: req.user._id,
      name,
      species,
      description: description || '',
      location: location || 'Living Room',
      wateringFrequency: freq,
      lastWatered: lastWateredDate,
      nextWatering: nextWateringDate,
      sunlightRequirement: sunlightRequirement || 'Bright Indirect',
      healthStatus: healthStatus || 'Healthy',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
    });

    // Automatically create the first watering reminder for this plant
    await Reminder.create({
      userId: req.user._id,
      plantId: plant._id,
      title: `Water ${plant.name}`,
      reminderDate: nextWateringDate,
      reminderType: 'Watering',
      notes: `Scheduled every ${freq} days.`,
    });

    res.status(201).json({
      success: true,
      message: 'Plant created successfully',
      data: plant,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update plant
 * @route   PUT /api/plants/:id
 * @access  Private
 */
const updatePlant = async (req, res, next) => {
  try {
    let plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found with specified ID',
      });
    }

    // Ownership check
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this plant',
      });
    }

    const updates = { ...req.body };

    // Handle new file upload if provided
    if (req.file) {
      updates.imageUrl = await uploadToFirebaseStorage(req.file, 'plants');
    }

    // Recalculate nextWatering if lastWatered or wateringFrequency changed
    if (updates.wateringFrequency || updates.lastWatered) {
      const freq = updates.wateringFrequency
        ? Number(updates.wateringFrequency)
        : plant.wateringFrequency;
      const lastW = updates.lastWatered
        ? new Date(updates.lastWatered)
        : plant.lastWatered;
      const nextW = new Date(lastW);
      nextW.setDate(nextW.getDate() + freq);
      updates.nextWatering = nextW;
    }

    plant = await Plant.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Plant updated successfully',
      data: plant,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete plant
 * @route   DELETE /api/plants/:id
 * @access  Private
 */
const deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found',
      });
    }

    // Ownership check
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this plant',
      });
    }

    // Clean up associated reminders
    await Reminder.deleteMany({ plantId: plant._id });

    await plant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Plant and associated reminders deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search plants by keyword
 * @route   GET /api/plants/search?keyword=succulent
 * @access  Private / Public compatible
 */
const searchPlants = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search keyword (e.g., succulent)',
      });
    }

    const regex = new RegExp(keyword.trim(), 'i');

    // 1. Search in user's saved plants (if authenticated) or all saved plants
    const query = {
      $or: [
        { name: regex },
        { species: regex },
        { description: regex },
        { location: regex },
      ],
    };

    if (req.user) {
      query.userId = req.user._id;
    }

    const userPlants = await Plant.find(query).sort({ createdAt: -1 });

    // 2. Also search our rich botanical species catalog for suggestions
    const catalogMatches = SPECIES_CATALOG.filter(
      (item) =>
        regex.test(item.name) ||
        regex.test(item.species) ||
        regex.test(item.description) ||
        (item.tags && item.tags.some((tag) => regex.test(tag)))
    );

    res.status(200).json({
      success: true,
      keyword: keyword.trim(),
      totalMatches: userPlants.length + catalogMatches.length,
      data: userPlants,
      speciesGuide: catalogMatches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  searchPlants,
  SPECIES_CATALOG,
};
