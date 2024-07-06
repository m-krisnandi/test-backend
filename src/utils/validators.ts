import { body } from "express-validator";

// Validation Category
const validateCategory = [
    body('name')
        .trim()
        .exists().withMessage('Name is required')
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters')
]

export { validateCategory }