import mongoose, { Schema } from "mongoose";

class NotificationModel {
    constructor() {
        this.schema = this.createSchema();
        this.model = mongoose.model("notifications", this.schema);
    }

    createSchema() {
        return new mongoose.Schema({
            type: {
                type: String,
                enum: ["like", "comment", "reply"],
                required: true,
                index: true
            },
            blog: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'blogs',
                index: true
            },
            notification_for: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'users',
                index: true
            },
            user: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'users'
            },
            comment: {
                type: Schema.Types.ObjectId,
                ref: 'comments'
            },
            reply: {
                type: Schema.Types.ObjectId,
                ref: 'comments'
            },
            replied_on_comment: {
                type: Schema.Types.ObjectId,
                ref: 'comments'
            },
            seen: {
                type: Boolean,
                default: false,
                index: true
            },
            message: { type: String, trim: true }
        }, {
            timestamps: true
        });
    }
}

const notificationModelInstance = new NotificationModel();
export default notificationModelInstance.model;