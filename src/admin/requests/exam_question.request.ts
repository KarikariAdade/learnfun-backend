import { body } from "express-validator";

export const examQuestionValidation:any = [
    body('exam_id').notEmpty().withMessage('Exam ID field is required').trim().escape(),
]

export const examQuestionCreateValidation:any = [
    body('exam_id').isInt().withMessage('Exam ID must be an integer'),

    // Validate 'questions' (must be an array)
    body('questions').isArray({ min: 1 }).withMessage('Questions must be an array with at least one question'),

    // Validate each question object in 'questions'
    body('questions.*.question_text')
        .notEmpty()
        .withMessage('Question text is required'),
    body('questions.*.question_type')
        .isIn(['MULTIPLE_CHOICE', 'ESSAY', 'TRUE_FALSE'])
        .withMessage('Question type must be one of MULTIPLE_CHOICE, ESSAY, or TRUE_FALSE'),
    body('questions.*.points')
        .isInt({ min: 1 })
        .withMessage('Points must be an integer greater than 0'),

    // Validate 'choices' array for each question (for multiple-choice questions)
    body('questions.*.choices')
        .if(body('questions.*.question_type').equals('MULTIPLE_CHOICE'))
        .isArray({ min: 2 })
        .withMessage('Multiple choice questions must have at least two choices'),

    // Validate each choice object
    body('questions.*.choices.*.choice_text')
        .notEmpty()
        .withMessage('Choice text is required'),
    body('questions.*.choices.*.is_correct')
        .isBoolean()
        .withMessage('Choice must specify if it is correct (true/false)'),
]

export const examQuestionUpdateValidation:any = [
    body('exam_id').isInt().withMessage('Exam ID must be an integer'),

    // Validate 'questions' (must be an array)
    body('questions').isArray({ min: 1 }).withMessage('Questions must be an array with at least one question'),

    // Validate each question object in 'questions'
    body('questions.*.question_text')
        .notEmpty()
        .withMessage('Question text is required'),
    body('questions.*.question_type')
        .isIn(['MULTIPLE_CHOICE', 'ESSAY', 'TRUE_FALSE'])
        .withMessage('Question type must be one of MULTIPLE_CHOICE, ESSAY, or TRUE_FALSE'),
    body('questions.*.points')
        .isInt({ min: 1 })
        .withMessage('Points must be an integer greater than 0'),
    body('questions.*.question_id')
        .isInt()
        .withMessage('Question ID must be an integer')
        .notEmpty()
        .withMessage('Question ID must not be empty'),

    // Validate 'choices' array for each question (for multiple-choice questions)
    body('questions.*.choices')
        .if(body('questions.*.question_type').equals('MULTIPLE_CHOICE'))
        .isArray({ min: 2 })
        .withMessage('Multiple choice questions must have at least two choices'),
    body('questions.*.choices.*.choice_id')
        .isInt()
        .withMessage('Choice ID must be an integer')
        .notEmpty()
        .withMessage('Choice ID must not be empty'),

    // Validate each choice object
    body('questions.*.choices.*.choice_text')
        .notEmpty()
        .withMessage('Choice text is required'),
    body('questions.*.choices.*.is_correct')
        .isBoolean()
        .withMessage('Choice must specify if it is correct (true/false)'),
]

export const examQuestionViewValidation:any = [
    body('question_id').isInt().withMessage('Question ID must be an integer')
        .notEmpty().withMessage('Question ID must not be empty'),
]