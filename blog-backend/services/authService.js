import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../models/User.js';

export const formatDataToSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY, {
        expiresIn: '7d' // Token expires in 7 days
    });
    
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        user_id: user._id
    };
};

export const generateUsername = async (email) => {
    let username = email.split("@")[0];
    
    // Remove any non-alphanumeric characters and convert to lowercase
    username = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    // Ensure minimum length
    if (username.length < 3) {
        username = username + 'user';
    }
    
    // Check if username exists
    const isUsernameNotUnique = await User.exists({ 
        "personal_info.username": username 
    });
    
    if (isUsernameNotUnique) {
        username += nanoid(5);
    }
    
    return username;
};

export const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET_ACCESS_KEY, {
        expiresIn: '7d'
    });
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_ACCESS_KEY);
    } catch (error) {
        return null;
    }
};
