import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {loggerService} from "../../common/services/logger.service";
import prisma from "../../common/services/database.service";
import { generateResponse } from "../../common/services/common.service";

export const viewProfile = async (req:Request, res:Response) => {

    const requested_user:any = req.user

    try {
        const user = await prisma.users.findUnique({where: {id: requested_user.id}})

        if (!user)
            return generateResponse('error', 'User not found', {}, res)

        return generateResponse('success', 'User retrieved successfully', user, res)
    } catch (error) {

        loggerService.error('Error retrieving user profile', error)

        return generateResponse('error', 'An error occurred while retrieving user profile', error, res)
    }

}

export const updateProfile = async (req:Request, res:Response) => {
    const requested_user:any = req.user

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const {name, email, phone} = req.body

    try {
        const updatedUser = await prisma.users.update({
            where: {id: requested_user.id},
            data: {name, email, phone}
        })

        if (!updatedUser)
            return generateResponse('error', 'User not found', {}, res)

        return generateResponse('success', 'User profile updated successfully', updatedUser, res)
    } catch (error) {

        loggerService.error('Error updating user profile', error)

        return generateResponse('error', 'An error occurred while updating user profile', error, res)
    }
}