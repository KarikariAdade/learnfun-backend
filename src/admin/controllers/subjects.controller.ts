import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {loggerService} from "../../common/services/logger.service";
import prisma from "../../common/services/database.service";
import { generateResponse } from "../../common/services/common.service";

export const viewSubjects = async (req: Request, res: Response) => {

    const subjects = await prisma.subjects.findMany()

    return generateResponse('success', 'Subjects retrieved successfully', subjects, res)
}


export const createSubject = async (req: Request, res: Response) => {
    const { name, description } = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    try {

        const existingSubject = await prisma.subjects.findFirst({
            where: {name: name}
        })

        if (existingSubject)
            return generateResponse('error', 'Subject with the same name already exists', {}, res)

        const createdSubject = await prisma.subjects.create({
            data: {
                name:name,
                description:description
            }
        })

        if (createdSubject)
            return generateResponse('success', 'Subject created successfully', createdSubject, res)

        return generateResponse('error', 'An error occurred while creating subject', {}, res)

    } catch (error) {

        loggerService.error('Error creating subject', error)

        return generateResponse('error', 'An error occurred while creating subject', error, res)
    }
}

export const updateSubject = async (req: Request, res: Response) =>  {
    const { name, description, subject_id } = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const check_subject = await prisma.subjects.findFirst({
        where: {
            id: subject_id
        }
    })

    if (!check_subject)
        return generateResponse('error', 'Subject not found', {}, res)

    try {

        const updatedSubject = await prisma.subjects.update({
            where: {
                id: subject_id
            },
            data: {
                name: name,
                description: description
            }
        })

        return generateResponse('success', 'Subject updated successfully', updatedSubject, res);

    }catch(errors) {

        loggerService.error('Error updating subject', errors)

        return generateResponse('error', 'Subject updated successfully', {}, res);

    }
}