import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {randomUUID} from "node:crypto";
import {decrypt, encrypt, generateResponse, hashPassword, sendVerificationEmail} from "../../common/services/common.service";
import {loggerService} from "../../common/services/logger.service";
import { emailQueue } from "../../common/services/queue.service";
import prisma from "../../common/services/database.service";


export const registerUser = async (req: Request, res: Response) => {

    const {name, email, phone, password, confirmPassword, role} = req.body

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    try {

        const uuid:string = randomUUID();

        const existingUser = await prisma.users.findUnique({
            where: {
                email: email,
            }
        })

        if (existingUser)
            return generateResponse('error', 'Email already exists', null, res)

        const expiry_date = new Date(new Date().getTime() + 30 * 60 * 1000)

        const user = await prisma.users.create({
            data: {
                uuid: uuid,
                name: name,
                email: email,
                phone: phone,
                password: await hashPassword(password),
                role: role,
                verification_expiry: expiry_date
            }
        })

        await sendVerificationEmail(req, user);

        if (user) {

            loggerService.info('User registered successfully', user)

            return generateResponse('success', 'Registration successful', user, res)

        }

        return generateResponse('error', 'Registration failed', {}, res)

    } catch (errors) {

        loggerService.error('User registration failed', errors)

        return generateResponse('error', 'User registration failed', errors, res)

    }

}

export const verifyAccount = async (req: Request, res: Response) => {

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const data = req.params;

    const decrypted_data = decrypt(data.token);


    const user = await prisma.users.findFirst({
        where: {
            uuid: decrypted_data,
            verification_expiry: {gt: new Date()},
        }
    })

    console.log('user', user, decrypted_data)

    if (!user)
        return generateResponse('error', 'Invalid verification code', {}, res)

    try {
        const verifiedUser = await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                is_verified: true,
                verification_expiry: null
            }
        })

        return generateResponse('success', 'Account verified successfully', {}, res)

    } catch (errors) {

        loggerService.error('User registration failed', errors)

        return generateResponse('error', 'User registration failed', errors, res)
    }
}

export const reVerifyAccount = async (req:Request, res:Response) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const {email} = req.body;

    console.log('email', email)

    const user:any = await prisma.users.findFirst({
        where: {
            email: email
        }
    })
    
    if (!user)
        return generateResponse('error', 'User not found', {}, res)

    try {

        const expiry_date = new Date(new Date().getTime() + 30 * 60 * 1000)

        const selectedUser = await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                verification_expiry: expiry_date,
                is_verified: false
            }
        })

        await sendVerificationEmail(req, selectedUser);

        return generateResponse('success', 'Verification email sent successfully', {}, res)
        
    } catch (errors) {
        loggerService.error('User registration failed', errors)

        return generateResponse('error', 'User registration failed', errors, res)
    }
}

export const login = async (req:Request, res:Response) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)


}