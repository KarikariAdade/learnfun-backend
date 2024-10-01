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

