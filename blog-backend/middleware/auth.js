import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No access token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
        
        // Optional: Check if user still exists and is active
        const user = await User.findById(decoded.id).select('is_active');
        if (!user || !user.is_active) {
            return res.status(401).json({ error: "User account is inactive" });
        }

        req.user = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Access token has expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: "Access token is invalid" });
        }
        
        logger.error('JWT verification error:', error);
        return res.status(403).json({ error: "Authentication failed" });
    }
};

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
        req.user = decoded.id;
    } catch (error) {
        req.user = null;
    }
    
    next();
};
