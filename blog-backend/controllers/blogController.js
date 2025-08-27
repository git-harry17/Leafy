import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { generateBlogId } from '../services/blogService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

export const createBlog = asyncHandler(async (req, res) => {
    const authorId = req.user;
    const { title, des, tags, content, draft } = req.body;

    // Validate required fields for published blogs
    if (!draft) {
        if (!des || des.length > 200) {
            return res.status(400).json({ error: "Description length invalid" });
        }
        if (!content || !content.blocks || !content.blocks.length) {
            return res.status(400).json({ error: "Need some content to publish" });
        }
        if (!tags || !tags.length || tags.length > 10) {
            return res.status(400).json({ error: "Tags length invalid" });
        }
    }

    // Process tags
    const processedTags = tags ? tags.map(tag => tag.toLowerCase()) : [];
    
    // Generate unique blog ID
    const blog_id = generateBlogId(title);

    // Create blog
    const blog = new Blog({
        title,
        des: des || "",
        content: content || {},
        tags: processedTags,
        author: authorId,
        blog_id,
        draft: Boolean(draft)
    });

    const savedBlog = await blog.save();

    // Update user's blog count
    const incrementVal = draft ? 0 : 1;
    await User.findByIdAndUpdate(authorId, {
        $inc: { "account_info.total_posts": incrementVal },
        $push: { "blogs": savedBlog._id }
    });

    logger.info(`Blog ${draft ? 'drafted' : 'published'}: ${blog_id} by user: ${authorId}`);
    res.status(201).json({ id: blog_id });
});

export const getLatestBlogs = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const blogs = await Blog.getLatestBlogs(limit);
    res.status(200).json({ blogs });
});

export const getTrendingBlogs = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const blogs = await Blog.getTrendingBlogs(limit);
    res.status(200).json({ blogs });
});

export const searchBlogs = asyncHandler(async (req, res) => {
    const { tag } = req.body;
    const limit = parseInt(req.query.limit) || 5;
    
    const blogs = await Blog.searchByTag(tag, limit);
    res.status(200).json({ blogs });
});

export const getBlogById = asyncHandler(async (req, res) => {
    const { blog_id } = req.params;

    const blog = await Blog.findOne({ blog_id, draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .populate({
            path: "comments",
            populate: {
                path: "commented_by",
                select: "personal_info.profile_img personal_info.username -_id"
            }
        });

    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }

    // Increment read count
    await Blog.findOneAndUpdate(
        { blog_id },
        { $inc: { "activity.total_reads": 1 } }
    );

    res.status(200).json({ blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
    const { blog_id } = req.params;
    const authorId = req.user;
    const { title, des, tags, content, draft } = req.body;

    // Find blog and verify ownership
    const blog = await Blog.findOne({ blog_id, author: authorId });
    if (!blog) {
        return res.status(404).json({ error: "Blog not found or unauthorized" });
    }

    // Validate fields for published blogs
    if (!draft) {
        if (!des || des.length > 200) {
            return res.status(400).json({ error: "Description length invalid" });
        }
        if (!content || !content.blocks || !content.blocks.length) {
            return res.status(400).json({ error: "Need some content to publish" });
        }
        if (!tags || !tags.length || tags.length > 10) {
            return res.status(400).json({ error: "Tags length invalid" });
        }
    }

    // Update blog
    const wasPublished = !blog.draft;
    const willBePublished = !draft;
    
    const updateData = {
        title: title || blog.title,
        des: des || blog.des,
        content: content || blog.content,
        tags: tags ? tags.map(tag => tag.toLowerCase()) : blog.tags,
        draft: Boolean(draft)
    };

    await Blog.findOneAndUpdate({ blog_id }, updateData);

    // Update user's post count if publishing status changed
    if (!wasPublished && willBePublished) {
        await User.findByIdAndUpdate(authorId, {
            $inc: { "account_info.total_posts": 1 }
        });
    } else if (wasPublished && !willBePublished) {
        await User.findByIdAndUpdate(authorId, {
            $inc: { "account_info.total_posts": -1 }
        });
    }

    logger.info(`Blog updated: ${blog_id} by user: ${authorId}`);
    res.status(200).json({ message: "Blog updated successfully" });
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const { blog_id } = req.params;
    const authorId = req.user;

    // Find blog and verify ownership
    const blog = await Blog.findOne({ blog_id, author: authorId });
    if (!blog) {
        return res.status(404).json({ error: "Blog not found or unauthorized" });
    }

    // Delete blog
    await Blog.findOneAndDelete({ blog_id });

    // Update user's blog count and remove from blogs array
    const decrementVal = blog.draft ? 0 : 1;
    await User.findByIdAndUpdate(authorId, {
        $inc: { "account_info.total_posts": -decrementVal },
        $pull: { "blogs": blog._id }
    });

    logger.info(`Blog deleted: ${blog_id} by user: ${authorId}`);
    res.status(200).json({ message: "Blog deleted successfully" });
});
