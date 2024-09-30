import { body } from "express-validator";

export const subjectCreationValidation: any = [
    body('name').notEmpty().withMessage('Name field is required').trim().escape(),
]

export const subjectUpdateValidation: any = [
    body('name').notEmpty().withMessage('Name field is required').trim().escape(),
    body('subject_id').notEmpty().withMessage('Subject ID field is required')
]