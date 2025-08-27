import express from 'express';
import { signup, signin, googleAuth } from '../controllers/authController.js';
import { validateSignup, validateSignin } from '../middleware/validation.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validateSignup, signup);

/**
 * @route   POST /api/auth/signin
 * @desc    Login user
 * @access  Public
 */
router.post('/signin', validateSignin, signin);

/**
 * @route   POST /api/auth/google-auth
 * @desc    Authenticate user with Google
 * @access  Public
 */
router.post('/google-auth', googleAuth);

export default router;
