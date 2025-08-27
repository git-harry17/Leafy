// middleware/security.js
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const setupSecurity = (app) => {
    // Enhanced security headers
    app.use(helmet({
        contentSecurityPolicy: false, // Disable CSP for API
        crossOriginEmbedderPolicy: false
    }));
};

// Different rate limiters for different endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth routes
    message: {
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const createBlogLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 blog creations per hour
    message: {
        error: 'Too many blogs created, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
