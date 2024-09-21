import { body } from "express-validator";

export const registrationValidation: any = [
    body('name').notEmpty().withMessage('Name field is required').trim().escape(),
    body('email').notEmpty().withMessage('Email field is required').isEmail().withMessage('Invalid Email Address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password field is required')
        .isStrongPassword().withMessage('Password is required and must be strong'),
    body('confirmPassword').notEmpty().withMessage('Password Confirmation field is required')
        .custom((value, {req}) => value === req.body.password).withMessage('Passwords do not match')
]

export const verificationEmailValidation: any = [
    body('email').notEmpty().withMessage('Email field is required')
        .isEmail().withMessage('Invalid email address')
]

export const loginVerification: any = [
    body('email').notEmpty().withMessage('Email field is required')
        .isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password field is required')
]

export const passwordForgotValidation:any = [
    body('email').notEmpty().withMessage('Email field is required')
        .isEmail().withMessage('Invalid email address'),
]

export const passwordResetValidation:any = [
    body('password').notEmpty().withMessage('Password field is required')
        .isStrongPassword().withMessage('Password is required and must be strong'),
    body('confirmPassword').notEmpty().withMessage('Password Confirmation field is required')
        .custom((value, { req }) => value === req.body.password).withMessage('Passwords must match'),
];