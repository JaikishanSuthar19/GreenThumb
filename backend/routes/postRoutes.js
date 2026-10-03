const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  addComment,
  toggleLike,
  deletePost,
} = require('../controllers/postController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(optionalProtect, getPosts)
  .post(protect, upload.single('image'), createPost);

router
  .route('/:id')
  .get(optionalProtect, getPostById)
  .delete(protect, deletePost);

router.post('/:id/comment', protect, addComment);
router.put('/:id/like', protect, toggleLike);

module.exports = router;
