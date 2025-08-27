import { body, validationResult, query } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// Validation rules
export const validateSignup = [
    body('fullname')
        .isLength({ min: 3 })
        .withMessage('Fullname must be at least 3 letters long')
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
        .withMessage('Password should be 6 to 20 characters long with at least 1 numeric, 1 lowercase and 1 uppercase letter'),
    handleValidationErrors
];

export const validateSignin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

export const validateBlogCreation = [
    body('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be provided and less than 200 characters')
        .trim(),
    body('des')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Description should not exceed 200 characters')
        .trim(),
    body('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Tags should be an array with maximum 10 items'),
    body('content')
        .optional()
        .isObject()
        .withMessage('Content should be a valid object'),
    body('draft')
        .optional()
        .isBoolean()
        .withMessage('Draft should be a boolean value'),
    handleValidationErrors
];

export const validateUserSearch = [
    body('query')
        .isLength({ min: 1, max: 50 })
        .withMessage('Search query must be between 1 and 50 characters')
        .trim()
        .escape(),
    handleValidationErrors
];

export const validateBlogSearch = [
    body('tag')
        .isLength({ min: 1, max: 50 })
        .withMessage('Tag must be between 1 and 50 characters')
        .trim(),
    handleValidationErrors
];

export const validateProfileRequest = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .trim()
        .escape(),
    handleValidationErrors
];
