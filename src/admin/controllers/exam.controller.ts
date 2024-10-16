import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {loggerService} from "../../common/services/logger.service";
import prisma from "../../common/services/database.service";
import { generateResponse } from "../../common/services/common.service";

export const viewExams = async (req:Request, res: Response) => {
    const exams = await prisma.exams.findMany()

    return generateResponse('success', 'Exams retrieved successfully', exams, res)
}

export const storeExams = async (req:Request, res: Response) => {

    const {title, course_id, description, educator_id, duration, is_scheduled, start_date, owned_by, end_date, past_question_id} = req.body;

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    if (course_id) {
        const course = await prisma.courses.findFirst({
            where: { id: parseInt(course_id) },
        })

        if (!course)
            return generateResponse('error', 'Selected course not found or invalid', {}, res)
    }

    if (educator_id) {
        const educator = await prisma.users.findFirst({
            where: { id: parseInt(educator_id),  role: 'EDUCATOR'},
        })

        if (!educator)
            return generateResponse('error', 'Selected Educator not found or invalid', {}, res)
    }

    if (past_question_id) {
        const past_question = await prisma.past_Questions.findFirst({
            where: { id: parseInt(past_question_id) },
        })

        if (!past_question)
            return generateResponse('error', 'Selected past question not found or invalid', {}, res)

    }

    if (is_scheduled){

        if (!start_date || !end_date)
            return generateResponse('error', 'Start date and end dates are required if exam is a scheduled exam.', {}, res)
    }

    if (!past_question_id && !course_id)
        return generateResponse('error', 'Kindly select if the exam is for a past question or course', {}, res)

    try {

        const exam = await prisma.exams.create({
            data: {
                title: title,
                course_id: parseInt(course_id) ?? null,
                description: description,
                educator_id: parseInt(educator_id) ?? null,
                duration_in_minutes: parseInt(duration),
                is_scheduled: is_scheduled,
                past_question_id: past_question_id ? parseInt(past_question_id) : null,
                start_time: is_scheduled ? new Date(start_date) : null,
                end_time: is_scheduled ? new Date(end_date) : null,
                owned_by: owned_by
            }
        })

        if (exam)
            return generateResponse('success', 'Exam created successfully', {}, res)

        return generateResponse('error', 'An error occurred while creating an exam.', {}, res)

    } catch (errors) {

        loggerService.error('Error creating an exam', errors)

        return generateResponse('error', 'An error occurred while creating an exam.', {}, res)
    }

}

export const updateExams = async (req:Request, res: Response) => {
    const {title, course_id, description, educator_id, duration, is_scheduled, start_date, owned_by, end_date, past_question_id, exam_id} = req.body;

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const selected_exam = await prisma.exams.findFirst({
        where: { id: parseInt(exam_id) },
    })

    if (!selected_exam)
        return generateResponse('error', 'Selected Exam not found', {}, res)

    if (course_id) {
        const course = await prisma.courses.findFirst({
            where: { id: parseInt(course_id) },
        })

        if (!course)
            return generateResponse('error', 'Selected course not found or invalid', {}, res)
    }

    if (educator_id) {
        const educator = await prisma.users.findFirst({
            where: { id: parseInt(educator_id),  role: 'EDUCATOR'},
        })

        if (!educator)
            return generateResponse('error', 'Selected Educator not found or invalid', {}, res)
    }

    if (past_question_id) {
        const past_question = await prisma.past_Questions.findFirst({
            where: { id: parseInt(past_question_id) },
        })

        if (!past_question)
            return generateResponse('error', 'Selected past question not found or invalid', {}, res)

    }

    if (is_scheduled){

        if (!start_date || !end_date)
            return generateResponse('error', 'Start date and end dates are required if exam is a scheduled exam.', {}, res)
    }

    if (!past_question_id && !course_id)
        return generateResponse('error', 'Kindly select if the exam is for a past question or course', {}, res)

    try{

        const exam = await prisma.exams.update({
            where: {id: parseInt(exam_id)},
            data: {
                title: title,
                course_id: parseInt(course_id) ?? null,
                description: description,
                educator_id: parseInt(educator_id) ?? null,
                duration_in_minutes: parseInt(duration),
                is_scheduled: is_scheduled,
                past_question_id: past_question_id ? parseInt(past_question_id) : null,
                start_time: is_scheduled ? new Date(start_date) : null,
                end_time: is_scheduled ? new Date(end_date) : null,
                owned_by: owned_by
            }
        })

        if (exam)
            return generateResponse('success', 'Exam updating successfully', {}, res)

        return generateResponse('error', 'An error occurred while updating an exam.', {}, res)

    } catch (errors) {

        loggerService.error('Error creating an exam', errors)

        return generateResponse('error', 'An error occurred while creating an exam.', {}, res)
    }

}

export const viewDetails = async (req:Request, res: Response) => {
    const {exam_id} = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const exam = await prisma.exams.findFirst({
        where: {id: parseInt(exam_id)},
        include: {
            Questions: true,
            Past_Questions:true
        }
    })

    if (exam)
        return generateResponse('success', 'Exam details retrieved successfully', exam, res)

    return generateResponse('error', 'Selected exam not found', {}, res)
}