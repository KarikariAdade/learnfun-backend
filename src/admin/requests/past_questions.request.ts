import { body } from "express-validator";

export const pastQuestionCreationValidation: any = [
    body('name').notEmpty().withMessage('Name field is required').trim().escape(),
    body('year').notEmpty().withMessage('Year field is required').trim().escape(),
    body('school_group').notEmpty().withMessage('School Group field is required').trim().escape(),
    body('subject').notEmpty().withMessage('Subject field is required').trim().escape(),
]