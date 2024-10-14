import { body } from "express-validator";

export const examCreationValidation: any = [
    body('title').notEmpty().withMessage('Title field is required').trim().escape(),
    body('course_id').notEmpty().withMessage('Course field is required').trim().escape(),
    body('educator_id').notEmpty().withMessage('Educator field is required').trim().escape(),
    body('duration').isNumeric().withMessage('Duration Field should be number of minutes').notEmpty().withMessage('Duration field is required').trim().escape(),
]

export const examUpdateValidation: any = [
    body('title').notEmpty().withMessage('Title field is required').trim().escape(),
    body('course_id').notEmpty().withMessage('Course field is required').trim().escape(),
    body('educator_id').notEmpty().withMessage('Educator field is required').trim().escape(),
    body('duration').isNumeric().withMessage('Duration Field should be number of minutes').notEmpty().withMessage('Duration field is required').trim().escape(),
]