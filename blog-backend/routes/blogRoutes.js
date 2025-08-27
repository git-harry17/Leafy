import express from 'express';
import {
    createBlog,
    getLatestBlogs,
    getTrendingBlogs,
    searchBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import { verifyJWT, optionalAuth } from '../middleware/auth.js';
import { validateBlogCreation, validateBlogSearch } from '../middleware/validation.js';
import { createBlogLimiter } from '../middleware/security.js';

const router = express.Router();

/**
 * @route   POST /api/blog/create
 * @desc    Create a new blog post
 * @access  Private
 */
router.post('/create', createBlogLimiter, verifyJWT, validateBlogCreation, createBlog);

/**
 * @route   PUT /api/blog/:blog_id
 * @desc    Update a blog post
 * @access  Private (Author only)
 */
router.put('/:blog_id', verifyJWT, validateBlogCreation, updateBlog);

/**
 * @route   DELETE /api/blog/:blog_id
 * @desc    Delete a blog post
 * @access  Private (Author only)
 */
router.delete('/:blog_id', verifyJWT, deleteBlog);

/**
 * @route   GET /api/blog/latest
 * @desc    Get latest published blogs
 * @access  Public
 */
router.get('/latest', getLatestBlogs);

/**
 * @route   GET /api/blog/trending
 * @desc    Get trending blogs
 * @access  Public
 */
router.get('/trending', getTrendingBlogs);

/**
 * @route   POST /api/blog/search
 * @desc    Search blogs by tag
 * @access  Public
 */
router.post('/search', validateBlogSearch, searchBlogs);

/**
 * @route   GET /api/blog/:blog_id
 * @desc    Get a specific blog by ID
 * @access  Public
 */
router.get('/:blog_id', optionalAuth, getBlogById);

export default router;
