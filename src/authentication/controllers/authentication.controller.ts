import {Request, Response} from "express";
import { validationResult } from "express-validator";
import {randomUUID} from "node:crypto";
import {decrypt, encrypt, generateResponse, hashPassword, sendVerificationEmail} from "../../common/services/common.service";
import {loggerService} from "../../common/services/logger.service";
import { emailQueue } from "../../common/services/queue.service";
import prisma from "../../common/services/database.service";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { findTimeDifference } from "../services/authentication.service";

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

    const {email, password} = req.body,
        jwtSecret:any = process.env.JWT_SECRET;

   try {
       const user:any = await prisma.users.findUnique({
           where: {
               email: email,
           }
       })

       if (!user)
           return generateResponse('error', 'User not found', {}, res)

       const isMatch:boolean = await bcrypt.compare(password, user.password)

       if (!isMatch)
           return generateResponse('error', 'Invalid credentials', {}, res)

       const payload = {id: user.id, email: user.email, uuid:user.uuid},
           token = jwt.sign(payload, jwtSecret, {expiresIn: "1D"})

       return generateResponse('success', 'Login successful', {token: token, user: user}, res)

   } catch (errors) {

       loggerService.error('User login failed', errors)

       return generateResponse('error', 'User login failed. Kindly try again after some time', errors, res)

   }

}

export const forgotPassword = async (req: Request, res: Response) =>  {
    try {
        const validationErrors = validationResult(req)

        if (!validationErrors.isEmpty())
            return generateResponse('error', 'validation errors', validationErrors.array(), res)

        const email:string = req.body.email,
            user:any = await prisma.users.findUnique({
                where: {
                    email: email,
                }
            })

        if (!user)
            return generateResponse('error', 'User not found', {}, res)

        const otp:any = Math.floor(1000 + Math.random() * 9000).toString(),
            expiration:Date = new Date(new Date().getTime() + 15 * 60000)

        const passwordReset:any = await prisma.password_Resets.create({
            data: {
                user_id: user.id,
                otp: otp,
                expiration: expiration
            }
        })

        if (passwordReset){

            console.log("OTP sent to", user.email, "is", otp, expiration, findTimeDifference(expiration))

            await emailQueue.add('sendEmail', {
                to: req.body.email,
                subject: 'Reset Password',
                template: 'passwordReset',
                context: {
                    name: user.name,
                    otp: otp,
                    expiration: findTimeDifference(expiration)
                }
            }, {removeOnComplete: true})

            const reset_data: {} = {
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                reset: passwordReset,
                url: process.env.BASE_URL+`/api/auth/password/reset/${passwordReset.token}`
            }

            return generateResponse('success', 'Password reset code sent successfully', reset_data, res)

        }

        return generateResponse('error', 'Password reset could not be initiated. Kindly try again', {}, res)

    } catch (errors) {

        loggerService.error('User login failed', errors)

        return generateResponse('error', 'Password reset could not be initiated. Kindly try again', {}, res)
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return generateResponse('error', 'validation errors', validationErrors.array(), res)

    const {password, confirmPassword} = req.body,
        token = req.params.token;

    if (token === '' || token === null)
        return generateResponse('error', 'Invalid token', {}, res)

    try {
        const password_reset = await prisma.password_Resets.findFirst({
            where: {
                token: token,
                is_used: false
            }
        })

        if (!password_reset)
            return generateResponse('error', 'Token expired or invalid', {}, res)

        const user = await prisma.users.findUnique({
            where: {
                id: password_reset.user_id
            }
        })

        if (!user)
            return generateResponse('error', 'User not found', {}, res)

        const new_password = await hashPassword(password)

        const updated_user = await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                password: new_password
            }
        })

        if (!updated_user)
            return generateResponse('error', 'Failed to update password. Kindly try again', {}, res)

        return generateResponse('success', 'Password updated successfully', {}, res);
    } catch (errors) {
        loggerService.error('Password reset failed', errors)

        return generateResponse('error', 'Password reset failed. Kindly try again', {}, res)
    }
}

export const profile = async (req:Request, res: Response) => {
    return res.json({headers: req.headers})
}