import mongoose, { Schema } from "mongoose";

class UserModel {
    constructor() {
        this.profileImgNames = [
            "Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", 
            "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", 
            "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"
        ];
        
        this.profileImgCollections = [
            "notionists-neutral", "adventurer-neutral", "fun-emoji"
        ];
        
        this.schema = this.createSchema();
        this.model = mongoose.model("users", this.schema);
    }

    createSchema() {
        return new mongoose.Schema({
            personal_info: {
                fullname: {
                    type: String,
                    lowercase: true,
                    required: true,
                    minlength: [3, 'fullname must be 3 letters long'],
                    trim: true
                },
                email: {
                    type: String,
                    required: true,
                    lowercase: true,
                    unique: true,
                    trim: true,
                    index: true
                },
                password: {
                    type: String,
                    required: function() { return !this.google_auth; }
                },
                username: {
                    type: String,
                    minlength: [3, 'Username must be 3 letters long'],
                    unique: true,
                    trim: true,
                    index: true
                },
                bio: {
                    type: String,
                    maxlength: [200, 'Bio should not be more than 200'],
                    default: "",
                    trim: true
                },
                profile_img: {
                    type: String,
                    default: () => this.generateDefaultProfileImg()
                },
            },
            social_links: {
                youtube: { type: String, default: "", trim: true },
                instagram: { type: String, default: "", trim: true },
                facebook: { type: String, default: "", trim: true },
                twitter: { type: String, default: "", trim: true },
                github: { type: String, default: "", trim: true },
                website: { type: String, default: "", trim: true }
            },
            account_info: {
                total_posts: { type: Number, default: 0 },
                total_reads: { type: Number, default: 0 },
            },
            google_auth: { type: Boolean, default: false },
            blogs: {
                type: [Schema.Types.ObjectId],
                ref: 'blogs',
                default: [],
            },
            is_active: { type: Boolean, default: true },
            last_login: { type: Date }
        }, {
            timestamps: { createdAt: 'joinedAt' }
        });
    }

    generateDefaultProfileImg() {
        const randomCollection = this.profileImgCollections[
            Math.floor(Math.random() * this.profileImgCollections.length)
        ];
        const randomName = this.profileImgNames[
            Math.floor(Math.random() * this.profileImgNames.length)
        ];
        return `https://api.dicebear.com/6.x/${randomCollection}/svg?seed=${randomName}`;
    }

    // Instance methods
    static async findByEmail(email) {
        return this.findOne({ "personal_info.email": email });
    }

    static async findByUsername(username) {
        return this.findOne({ "personal_info.username": username });
    }

    static async searchByUsername(query, limit = 50) {
        return this.find({
            "personal_info.username": new RegExp(query, 'i')
        })
        .limit(limit)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id");
    }
}

const userModelInstance = new UserModel();
export default userModelInstance.model;