import mongoose, { Schema } from "mongoose";

class CommentModel {
    constructor() {
        this.schema = this.createSchema();
        this.model = mongoose.model("comments", this.schema);
    }

    createSchema() {
        return new mongoose.Schema({
            blog_id: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'blogs',
                index: true
            },
            blog_author: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'users',
                index: true
            },
            comment: {
                type: String,
                required: true,
                trim: true,
                maxlength: 1000
            },
            children: {
                type: [Schema.Types.ObjectId],
                ref: 'comments',
                default: []
            },
            commented_by: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'users',
                index: true
            },
            isReply: {
                type: Boolean,
                default: false
            },
            parent: {
                type: Schema.Types.ObjectId,
                ref: 'comments'
            }
        }, {
            timestamps: { createdAt: 'commentedAt' }
        });
    }
}

const commentModelInstance = new CommentModel();
export default commentModelInstance.model;