import { body } from "express-validator";

export const profileUpdateValidation: any = [
    body('name').notEmpty().withMessage('Name field is required').trim().escape(),
    body('email').notEmpty().withMessage('Email field is required').isEmail().withMessage('Invalid Email Address').normalizeEmail(),
    body('phone').notEmpty().withMessage('Phone field is required')
]

