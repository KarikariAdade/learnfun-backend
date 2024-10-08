import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {loggerService} from "../../common/services/logger.service";
import prisma from "../../common/services/database.service";
import {generateRandomString, generateResponse, validateFile} from "../../common/services/common.service";
import path from "path";
import fs from "fs";

export const viewPastQuestions = async (req:Request, res: Response) => {

    const questions = await prisma.past_Questions.findMany()

    return generateResponse('success', 'Past questions retrieved successfully', questions, res)

}

export const storePastQuestions = async (req:Request, res: Response) => {
    const {name, year, school_group, subject} = req.body
    const file:any = req.file;

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    if(!file)
        return generateResponse('error', 'No file provided', {}, res)

    validateFile(res, ['application/pdf', 'application/msword'], req)

    try {

        const file_name = `${generateRandomString(20)}${path.extname(file.originalname)}`

        const savePath = path.join(__dirname, '../../../uploads', file_name)

        const relative_path = `/uploads/${file_name}`

        fs.writeFileSync(savePath, file.buffer)

        prisma.$transaction(async (prisma) => {

            try {
                const past_question = await prisma.past_Questions.create({
                    data: {
                        name: name,
                        year: year,
                        school_group_id: parseInt(school_group),
                        subject_id: parseInt(subject)
                    }
                })

                await prisma.past_Questions_Files.create({
                    data: {
                        past_question_id: past_question.id,
                        file_url: relative_path
                    }
                })

            } catch (error) {
                loggerService.error('Error creating past_question', error)
            }

        })


        return generateResponse('success', 'Past Question created successfully', {}, res);
    } catch (errors) {
        loggerService.error('Error creating file', errors)
        return generateResponse('error', 'An error occurred while uploading past question.', {}, res)
    }

}

export const viewPastQuestion = async (req: Request, res: Response): Promise<any> => {
    const {past_question_id} = req.body

    try {
        const past_question = await prisma.past_Questions.findUnique({
            where: {
                id: parseInt(past_question_id)
            },
            include: {
                Past_Questions_Files: true
            }
        })

        if (!past_question)
            return generateResponse('error', 'Past Question not found', {}, res)

        return generateResponse('success', 'Past Question retrieved successfully', past_question, res)
    } catch (error) {
        loggerService.error('Error retrieving past_question', error)
        return generateResponse('error', 'An error occurred while retrieving past question.', {}, res)
    }
}

export const updatePastQuestions = async (req: Request, res: Response): Promise<any> => {
    const {name, year, school_group, subject, past_question_id} = req.body
    const file:any = req.file;

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const past_question:any = await prisma.past_Questions.findFirst({
        where: {
            id: parseInt(past_question_id)
        },
        include: {
            Past_Questions_Files: true
        }
    })

    if (!past_question)
        return generateResponse('error', 'Past Question not found', {}, res)

    let relative_path = ''

    try {

        if(file) {

            const file_path = path.join(__dirname, `../../..${past_question.Past_Questions_Files[0].file_url}`)

            fs.unlink(file_path, (err) => {
                if (err) {
                    loggerService.error('Error deleting file', err)
                    return generateResponse('error', 'An error occurred while updating file', {}, res)
                }
            })

            const file_name = `${generateRandomString(20)}${path.extname(file.originalname)}`

            const savePath = path.join(__dirname, '../../../uploads', file_name)

            relative_path = `/uploads/${file_name}`

            fs.writeFileSync(savePath, file.buffer)
        }else {
            relative_path = past_question.Past_Questions_Files[0].file_url
        }

        prisma.$transaction(async (prisma) => {

            try {
                const past_question_update = await prisma.past_Questions.update({
                    where: {
                        id: parseInt(past_question_id)
                    },
                    data: {
                        name: name,
                        year: year,
                        school_group_id: parseInt(school_group),
                        subject_id: parseInt(subject)
                    }
                })

                await prisma.past_Questions_Files.update({
                    where: {
                        id: parseInt(past_question.Past_Questions_Files[0].id)
                    },
                    data: {
                        past_question_id: past_question.id,
                        file_url: relative_path
                    }
                })

            } catch (error) {
                loggerService.error('Error updating past question', error)
            }

        })

        return generateResponse('success', 'Past Question updated successfully', {}, res)

    } catch (errors) {

        loggerService.error('Error creating file', errors)

        return generateResponse('error', 'An error occurred while updating past question.', {}, res)
    }

}

export const deletePastQuestions = async (req: Request, res: Response): Promise<any> => {
    const {past_question_id} = req.body

    try {
        const past_question:any = await prisma.past_Questions.findFirst({
            where: {
                id: parseInt(past_question_id)
            },
            include: {
                Past_Questions_Files: true
            }
        })

        if (!past_question)
            return generateResponse('error', 'Past Question not found', {}, res)

        const file_path = path.join(__dirname, `../../..${past_question.Past_Questions_Files[0].file_url}`)

        fs.unlink(file_path, (err) => {
            if (err) {
                loggerService.error('Error deleting file', err)
                return generateResponse('error', 'An error occurred while deleting file', {}, res)
            }
        })

        prisma.$transaction(async (prisma) => {
            try {
                await prisma.past_Questions_Files.delete({
                    where: {
                        id: parseInt(past_question.Past_Questions_Files[0].id)
                    }
                })

                await prisma.past_Questions.delete({
                    where: {
                        id: parseInt(past_question_id)
                    }
                })

            } catch (error) {
                loggerService.error('Error deleting past question', error)
            }
        })

    } catch (error) {
        loggerService.error('Error deleting file', error)
        return generateResponse('error', 'An error occurred while deleting file', {}, res)
    }
}

export const downloadPastQuestions = async (req: Request, res: Response) => {
    const {file_id} = req.body

    try {
        const past_question:any = await prisma.past_Questions_Files.findFirst({
            where: {
                id: parseInt(file_id)
            },
        })

        if (!past_question)
            return generateResponse('error', 'Past Question not found', {}, res)

        const file_path = path.join(__dirname, `../../..${past_question.Past_Questions_Files[0].file_url}`)

        res.download(file_path, (err) => {
            if (err) {
                loggerService.error('Error downloading file', err)
                return generateResponse('error', 'An error occurred while downloading file', {}, res)
            }
        })

    } catch (error) {
        loggerService.error('Error downloading file', error)
        return generateResponse('error', 'An error occurred while downloading file', {}, res)
    }
}

