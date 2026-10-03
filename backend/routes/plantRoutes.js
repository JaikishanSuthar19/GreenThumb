const express = require('express');
const router = express.Router();
const {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  searchPlants,
} = require('../controllers/plantController');
const {
  identifyPlant,
  getCatalog,
} = require('../controllers/speciesController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Search and catalog routes (MUST be defined before /:id)
router.get('/search', optionalProtect, searchPlants);
router.get('/catalog', getCatalog);
router.post('/identify', upload.single('image'), identifyPlant);

// CRUD routes
router
  .route('/')
  .get(protect, getPlants)
  .post(protect, upload.single('image'), createPlant);

router
  .route('/:id')
  .get(protect, getPlantById)
  .put(protect, upload.single('image'), updatePlant)
  .delete(protect, deletePlant);

module.exports = router;
