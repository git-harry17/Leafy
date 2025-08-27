import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
    const { username } = req.body;

    const user = await User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -updatedAt -blogs");

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
});

export const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const users = await User.searchByUsername(query, 50);
    res.status(200).json({ users });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user)
        .select("-personal_info.password -updatedAt")
        .populate('blogs', 'title blog_id publishedAt draft');

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
});
