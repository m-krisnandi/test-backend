import { body, check } from "express-validator";

// Validation Category
const validateCategory = [
    body('name').trim().exists().withMessage('Name is required')
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters')
]

// Validation User
const validateUser = [
    body('name').trim().exists().withMessage('Name is required')
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),

    body('email').trim().exists().withMessage('Email is required')
        .notEmpty().withMessage('Email cannot be empty')
        .isEmail().withMessage('Invalid email format'),

    body('password').trim().exists().withMessage('Password is required')
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]

// Validation Post
const validatePost = [
    check('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
    check('content').trim().notEmpty().withMessage('Content is required'),
    check('category_id').trim().notEmpty().withMessage('Category ID is required')
];

export { validateCategory, validateUser, validatePost }