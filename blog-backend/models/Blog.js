import mongoose, { Schema } from "mongoose";

class BlogModel {
    constructor() {
        this.schema = this.createSchema();
        this.model = mongoose.model("blogs", this.schema);
    }

    createSchema() {
        return new mongoose.Schema({
            blog_id: {
                type: String,
                required: true,
                unique: true,
                index: true
            },
            title: {
                type: String,
                required: true,
                trim: true,
                maxlength: 200
            },
            des: {
                type: String,
                maxlength: 200,
                trim: true
            },
            content: {
                type: Schema.Types.Mixed,
                default: {}
            },
            tags: {
                type: [String],
                validate: [arrayLimit, '{PATH} exceeds the limit of 10'],
                index: true
            },
            author: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'users',
                index: true
            },
            activity: {
                total_likes: { type: Number, default: 0 },
                total_comments: { type: Number, default: 0 },
                total_reads: { type: Number, default: 0 },
                total_parent_comments: { type: Number, default: 0 },
            },
            comments: {
                type: [Schema.Types.ObjectId],
                ref: 'comments',
                default: []
            },
            draft: {
                type: Boolean,
                default: false,
                index: true
            },
            featured: { type: Boolean, default: false },
            slug: { type: String, unique: true, sparse: true }
        }, {
            timestamps: { createdAt: 'publishedAt' }
        });
    }

    // Static methods
    static async getLatestBlogs(limit = 5) {
        return this.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ "publishedAt": -1 })
            .select("blog_id title des activity tags publishedAt -_id")
            .limit(limit);
    }

    static async getTrendingBlogs(limit = 5) {
        return this.find({ draft: false })
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({
                "activity.total_reads": -1,
                "activity.total_likes": -1,
                "publishedAt": -1
            })
            .select("blog_id title publishedAt -_id")
            .limit(limit);
    }

    static async searchByTag(tag, limit = 5) {
        const findQuery = {
            tags: { $regex: new RegExp(`^${tag}$`, 'i') },
            draft: false
        };
        
        return this.find(findQuery)
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({
                "activity.total_reads": -1,
                "activity.total_likes": -1,
                "publishedAt": -1
            })
            .select("blog_id title des activity tags publishedAt -_id")
            .limit(limit);
    }
}

function arrayLimit(val) {
    return val.length <= 10;
}

const blogModelInstance = new BlogModel();
export default blogModelInstance.model;
