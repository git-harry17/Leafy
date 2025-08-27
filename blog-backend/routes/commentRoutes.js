import express from 'express';
import { verifyJWT } from '../middleware/auth.js';
// Import comment controllers when implemented
// import { createComment, getComments, updateComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

/**
 * @route   POST /api/comment
 * @desc    Create a new comment
 * @access  Private
 */
// router.post('/', verifyJWT, createComment);

/**
 * @route   GET /api/comment/:blog_id
 * @desc    Get comments for a blog
 * @access  Public
 */
// router.get('/:blog_id', getComments);

/**
 * @route   PUT /api/comment/:comment_id
 * @desc    Update a comment
 * @access  Private (Author only)
 */
// router.put('/:comment_id', verifyJWT, updateComment);

/**
 * @route   DELETE /api/comment/:comment_id
 * @desc    Delete a comment
 * @access  Private (Author only)
 */
// router.delete('/:comment_id', verifyJWT, deleteComment);

export default router;
