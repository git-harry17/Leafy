import Blog from '../models/Blog.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

export class AnalyticsService {
    static async getBlogAnalytics(blogId, authorId) {
        const blog = await Blog.findOne({ blog_id: blogId, author: authorId });
        if (!blog) {
            throw new Error('Blog not found or unauthorized');
        }
        
        return {
            total_reads: blog.activity.total_reads,
            total_likes: blog.activity.total_likes,
            total_comments: blog.activity.total_comments,
            created_at: blog.publishedAt
        };
    }
    
    static async getUserAnalytics(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        const userBlogs = await Blog.find({ author: userId, draft: false });
        
        const totalReads = userBlogs.reduce((sum, blog) => sum + blog.activity.total_reads, 0);
        const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.activity.total_likes, 0);
        const totalComments = userBlogs.reduce((sum, blog) => sum + blog.activity.total_comments, 0);
        
        return {
            total_posts: user.account_info.total_posts,
            total_reads: totalReads,
            total_likes: totalLikes,
            total_comments: totalComments,
            joined_at: user.joinedAt
        };
    }
    
    static async getDashboardStats() {
        const totalUsers = await User.countDocuments();
        const totalBlogs = await Blog.countDocuments({ draft: false });
        const totalComments = await Comment.countDocuments();
        
        return {
            total_users: totalUsers,
            total_blogs: totalBlogs,
            total_comments: totalComments
        };
    }
}