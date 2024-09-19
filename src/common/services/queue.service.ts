import {Queue, Worker} from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";
import handlebars from "nodemailer-express-handlebars";
import path from "path";
import fs from "node:fs";

const connection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
} as any)

const emailQueue = new Queue('emailQueue', {connection})

const emailTransporter:any = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'cd92ef3799c628',
        pass: '681ef0faaba48e'
    },
    debug: true,
    logger: true
} as any)

emailTransporter.use("compile", handlebars({
    viewEngine: {
        extname: ".hbs",
        partialsDir: path.join(__dirname, "../../templates"),
        layoutsDir: path.join(__dirname, "../../templates"),
        defaultLayout: "",
    },
    viewPath: path.join(__dirname, "../../templates"),
    extName: ".hbs"
}))


const worker = new Worker('emailQueue', async job => {
    console.log("jobdata", job.data)
    const mailOptions:any = {
        from: process.env.MAILER_FROM_EMAIL,
        to: job.data.to,
        subject: job.data.subject,
        template: job.data.template,
        context: job.data.context,
        attachments: job.data.attachments || []
    }

    await emailTransporter.sendMail(mailOptions)

    if (job.data.attachments > 0) {

        await fs.unlinkSync(job.data.attachments[0].path)

    }

}, {connection})

worker.on('failed', (job:any, err) => {
    console.error(`Failed job ${job.id}: ${err.message}`, err)
})

export {emailQueue, connection}