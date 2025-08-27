import Notification from '../models/Notification.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export class NotificationService {
    static async createNotification(data) {
        try {
            const notification = new Notification(data);
            await notification.save();
            
            // Could trigger real-time notification here (WebSocket, etc.)
            logger.info(`Notification created for user: ${data.notification_for}`);
            
            return notification;
        } catch (error) {
            logger.error('Failed to create notification:', error);
            throw error;
        }
    }
    
    static async getNotificationsForUser(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        
        const notifications = await Notification.find({ notification_for: userId })
            .populate('user', 'personal_info.username personal_info.profile_img -_id')
            .populate('blog', 'title blog_id -_id')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Notification.countDocuments({ notification_for: userId });
        
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    
    static async markNotificationAsRead(notificationId, userId) {
        await Notification.findOneAndUpdate(
            { _id: notificationId, notification_for: userId },
            { seen: true }
        );
    }
    
    static async markAllNotificationsAsRead(userId) {
        await Notification.updateMany(
            { notification_for: userId, seen: false },
            { seen: true }
        );
    }
    
    static async getUnreadNotificationCount(userId) {
        return await Notification.countDocuments({
            notification_for: userId,
            seen: false
        });
    }
}
