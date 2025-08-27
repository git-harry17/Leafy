import express from 'express';
import { verifyJWT } from '../middleware/auth.js';
// Import notification controllers when implemented
// import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';

const router = express.Router();

/**
 * @route   GET /api/notification
 * @desc    Get user notifications
 * @access  Private
 */
// router.get('/', verifyJWT, getNotifications);

/**
 * @route   PUT /api/notification/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
// router.put('/:id/read', verifyJWT, markAsRead);

/**
 * @route   PUT /api/notification/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
// router.put('/read-all', verifyJWT, markAllAsRead);

export default router;