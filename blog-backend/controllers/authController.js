import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateUsername, formatDataToSend } from '../services/authService.js';
import { verifyGoogleToken } from '../services/googleAuthService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

export const signup = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    // Create user
    const user = new User({
        personal_info: {
            fullname,
            email,
            password: hashedPassword,
            username
        }
    });

    const savedUser = await user.save();
    
    logger.info(`New user registered: ${email}`);
    res.status(201).json(formatDataToSend(savedUser));
});

export const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { last_login: new Date() });
    
    logger.info(`User signed in: ${email}`);
    res.status(200).json(formatDataToSend(user));
});

export const googleAuth = asyncHandler(async (req, res) => {
    const { access_token } = req.body;

    const decodedUser = await verifyGoogleToken(access_token);
    if (!decodedUser) {
        return res.status(400).json({ 
            error: "Failed to authenticate with Google. Try with another account" 
        });
    }

    let { email, name, picture } = decodedUser;
    picture = picture.replace("s96-c", "s384-c");

    let user = await User.findOne({ "personal_info.email": email })
        .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

    if (user) {
        if (!user.google_auth) {
            return res.status(403).json({
                error: "This email was signed up without Google. Please log in with password to access the account"
            });
        }
    } else {
        // Create new user
        const username = await generateUsername(email);
        user = new User({
            personal_info: {
                fullname: name,
                email,
                profile_img: picture,
                username
            },
            google_auth: true
        });
        await user.save();
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { last_login: new Date() });
    
    logger.info(`User authenticated via Google: ${email}`);
    res.status(200).json(formatDataToSend(user));
});
