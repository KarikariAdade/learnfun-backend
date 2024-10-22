import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {loggerService} from "../../common/services/logger.service";
import prisma from "../../common/services/database.service";
import { generateResponse } from "../../common/services/common.service";

export const viewQuestions = async (req:Request, res:Response) => {
    const {exam_id} = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const exam = await prisma.exams.findFirst({
        where: {id: parseInt(exam_id)}
    })

    if (!exam)
        return generateResponse('error', 'Selected Exam not found', {}, res)

    const questions = await prisma.questions.findMany({
        where: { exam_id: parseInt(exam_id) },
        include: {
            Choices:true
        }
    })

    if (questions)
        return generateResponse('success', 'Questions retrieved successfully', questions, res)

    return generateResponse('error', 'No questions found for the given exam', {}, res)
}

export const storeQuestions = async (req:Request, res: Response) => {
    const data = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const exam = await prisma.exams.findFirst({
        where: {id: parseInt(data.exam_id)}
    })

    if (!exam)
        return generateResponse('error', 'Selected Exam not found', {}, res)

    try {
        prisma.$transaction(async (prisma) => {
            try {

                for (const question of data.questions) {

                    const choices = question.choices;

                    await prisma.questions.create({
                        data: {
                            exam_id: parseInt(data.exam_id),
                            question_text: question.question_text,
                            question_type: question.question_type,
                            points: question.points,
                            Choices:{
                                create: choices
                            }
                        }
                    })

                }

            } catch (errors:any) {
                loggerService.error(`Error in storeQuestions: ${errors.message}`);
                return generateResponse('error', 'Failed to store questions', {}, res);
            }
        })

        return generateResponse('success', 'Exam questions added successfully', {}, res)

    } catch (errors:any) {

        loggerService.error(`Error in storeQuestions: ${errors.message}`);

        return generateResponse('error', 'Failed to store questions', {}, res);
    }


}

export const updateQuestions = async (req:Request, res: Response) => {

    const data = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const exam = await prisma.exams.findFirst({
        where: {id: parseInt(data.exam_id)}
    })

    if (!exam)
        return generateResponse('error', 'Selected Exam not found', {}, res)

    try {
        prisma.$transaction(async (prisma) => {

            try {
                for(const question of data.questions) {

                    await prisma.questions.update({
                        where: {id: parseInt(question.question_id)},
                        data: {
                            exam_id: parseInt(data.exam_id),
                            question_text: question.question_text,
                            question_type: question.question_type,
                            points: question.points,
                        }
                    })

                    for (const choice of question.choices) {
                        await prisma.choices.upsert({
                            where: {
                                id: parseInt(choice.choice_id)
                            },
                            update: {
                                choice_text: choice.choice_text,
                                is_correct: choice.is_correct,
                                question_id: parseInt(question.question_id)
                            },
                            create: {
                                choice_text: choice.choice_text,
                                is_correct: choice.is_correct,
                                question_id: parseInt(question.question_id)
                            }
                        })
                    }
                }
            } catch (errors:any) {
                loggerService.error(`Error in update Questions Transaction: ${errors.message}`);

                return generateResponse('error', 'Failed to update questions', {}, res);

            }

        })

        return generateResponse('success', 'Exam Questions updated successfully', {}, res)

    } catch (errors:any) {
        loggerService.error(`Error in update Questions: ${errors.message}`);

        return generateResponse('error', 'Failed to update questions', {}, res);

    }


}

export const deleteQuestions = async (req:Request, res: Response) => {
    const {question_id} = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    try {

        const question = await prisma.questions.findFirst({
            where: {id: parseInt(question_id)}
        })

        if (!question) {
            return generateResponse('error', 'Selected Question not found', {}, res)
        }

        await prisma.choices.deleteMany({
            where: {question_id: parseInt(question_id)}
        })

        await prisma.questions.delete({
            where: {id: parseInt(question_id)},

        })

        return generateResponse('success', 'Question deleted successfully', {}, res)

    } catch (errors:any) {
        loggerService.error(`Error in delete Questions: ${errors.message}`);

        return generateResponse('error', 'Failed to delete questions', {}, res);
    }
}

export const viewQuestionsDetails = async (req:Request, res: Response) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const {question_id} = req.body

    const question = await prisma.questions.findFirst({
        where: {id: parseInt(question_id)},
        include: {
            Choices: true
        }
    })

    if (!question) {
        return generateResponse('error', 'Selected Question not found', {}, res)
    }

    return generateResponse('success', 'Question retrieved successfully', question, res)
}