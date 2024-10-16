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

    return res.json({data: data})
}

export const updateQuestions = async (req:Request, res: Response) => {

}

export const deleteQuestions = async (req:Request, res: Response) => {

}

export const viewQuestionsDetails = async (req:Request, res: Response) => {

}