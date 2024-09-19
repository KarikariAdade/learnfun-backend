import {Request, Response} from 'express'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { emailQueue } from './queue.service'

export const generateResponse = (type: string, message: string, data:any, res: Response) => {
    if (type === 'success')
        return res.json({message: message, data: data})
    else
        return res.status(401).json({message: message, data: data})
}

export const hashPassword = (password:string) => {
    return bcrypt.hash(password, 256)
}

export const comparePasswords = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword)
}

export const encrypt = (text:string) => {
    const secret:any = process.env.ENCRYPTION_SECRET_KEY;

    const algorithm = 'aes-256-cbc';

    const iv = crypto.randomBytes(16); // Initialization vector

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret, 'hex'), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}

export const decrypt = (text: string) => {
    const secret:any = process.env.ENCRYPTION_SECRET_KEY;

    const algorithm = 'aes-256-cbc';

    const [iv, encrypted] = text.split(':');

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret, 'hex'), Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
}

export const sendVerificationEmail = async (req:Request, user:any) => {
    const protocol: string = req.protocol,
        hostname: string = req.hostname,
        encrypted_token: string = encrypt(user.uuid),
        verification_link: string = `${protocol}://${hostname}:${process.env.PORT}/auth/register/verify/${encrypted_token}`;

    console.log(verification_link, 'verification_link')

    await emailQueue.add('sendEmail', {
        to: req.body.email,
        subject: 'Verify Account',
        template: 'accountCreationTemplate',
        context: {
            'name': req.body.name,
            'url': verification_link
        }
    }, {removeOnComplete: true})
}