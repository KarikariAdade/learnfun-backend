import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {loggerService} from "../../common/services/logger.service";
import prisma from "../../common/services/database.service";
import { generateResponse } from "../../common/services/common.service";

export const viewExams = async (req:Request, res: Response) => {
    const exams = await prisma.exams.findMany()

    return generateResponse('success', 'Past questions retrieved successfully', exams, res)
}

export const storeExams = async (req:Request, res: Response) => {

    const {title, course_id, description, educator_id, duration, is_scheduled, start_date, end_date} = req.body;

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    if (course_id) {
        const course = await prisma.courses.findUnique({
            where: { id: course_id },
        })

        if (!course)
            return generateResponse('error', 'Course not found', {}, res)
    }

    if (educator_id) {
        const educator = await prisma.users.findUnique({
            where: { id: educator_id },
        })

        if (!educator)
            return generateResponse('error', 'Educator not found', {}, res)
    }

    if (is_scheduled){

        if (!start_date || !end_date)
            return generateResponse('error', 'Start date and end dates are required if exam is a scheduled exam.', {}, res)
    }

    try {

        return generateResponse('data', 'course', req.body, res)


    } catch (errors) {
        loggerService.error('Error creating an exam', errors)
        return generateResponse('error', 'An error occurred while creating an exam.', {}, res)
    }

}

export const updateExams = async (req:Request, res: Response) => {

}

export const viewDetails = async (req:Request, res: Response) => {

}