const Post = require('../models/Post');
const { uploadToFirebaseStorage } = require('../config/firebase');

/**
 * @desc    Get all community posts
 * @route   GET /api/posts
 * @access  Public / Private
 */
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public / Private
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new community post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    let imageUrl = req.body.imageUrl;
    let tags = [];

    if (req.body.tags) {
      tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(',').map((t) => t.trim());
    }

    // Handle file upload if provided
    if (req.file) {
      imageUrl = await uploadToFirebaseStorage(req.file, 'posts');
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty',
      });
    }

    const post = await Post.create({
      userId: req.user._id,
      title: title || '',
      content: content.trim(),
      imageUrl: imageUrl || null,
      tags: tags,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'userId',
      'name avatar bio'
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to community post
 * @route   POST /api/posts/:id/comment
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const newComment = {
      userId: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Re-populate to send back complete user profile on the comment
    const updatedPost = await Post.findById(req.params.id)
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle like on post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userId = req.user._id;
    const isLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      likesCount: post.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  addComment,
  toggleLike,
  deletePost,
};
