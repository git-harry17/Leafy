import express from 'express';
import { getProfile, searchUsers, getCurrentUser } from '../controllers/userController.js';
import { verifyJWT } from '../middleware/auth.js';
import { validateUserSearch, validateProfileRequest } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/user/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', verifyJWT, getCurrentUser);

/**
 * @route   POST /api/user/profile
 * @desc    Get user profile by username
 * @access  Public
 */
router.post('/profile', validateProfileRequest, getProfile);

/**
 * @route   POST /api/user/search
 * @desc    Search users by username
 * @access  Public
 */
router.post('/search', validateUserSearch, searchUsers);

export default router;