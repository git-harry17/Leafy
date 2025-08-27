import { nanoid } from 'nanoid';
import Blog from '../models/Blog.js';

export const generateBlogId = (title) => {
    // Create a URL-friendly slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
    
    // Add random ID to ensure uniqueness
    return `${slug}-${nanoid(8)}`;
};

export const generateBlogSlug = async (title) => {
    let baseSlug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    
    let slug = baseSlug;
    let counter = 1;
    
    // Keep checking until we find a unique slug
    while (await Blog.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    
    return slug;
};

export class BlogSearchService {
    static async searchBlogs({ query, tags, author, page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const searchQuery = { draft: false };
        
        // Text search
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { des: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ];
        }
        
        // Filter by tags
        if (tags && tags.length > 0) {
            searchQuery.tags = { $in: tags };
        }
        
        // Filter by author
        if (author) {
            searchQuery.author = author;
        }
        
        const blogs = await Blog.find(searchQuery)
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ "publishedAt": -1 })
            .select("blog_id title des activity tags publishedAt -_id")
            .skip(skip)
            .limit(limit);
        
        const total = await Blog.countDocuments(searchQuery);
        
        return {
            blogs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    
    static async getPopularTags(limit = 20) {
        const tags = await Blog.aggregate([
            { $match: { draft: false } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit }
        ]);
        
        return tags.map(tag => ({
            name: tag._id,
            count: tag.count
        }));
    }
}
