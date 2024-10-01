import { randomUUID } from "crypto";
import {hashPassword, } from "../src/common/services/common.service";
import prisma from "../src/common/services/database.service";


const main = async () => {
    const password:string = await hashPassword('password')

    await prisma.users.create({
        data: {
            name: "Karikari Adade",
            email: "admin@bizzle.com",
            uuid: randomUUID(),
            password: password,
            is_verified: true,
            role: "ADMIN"
        }
    })

    await prisma.school_Groups.create({
        data: {
            name: "Junior High School",
        }
    })
    await prisma.school_Groups.create({
        data: {
            name: "Senior High School",
        }
    })
}

main().then(async () => {
    console.log("Admin created successfully")
    await prisma.$disconnect()
}).catch(async (error) => {
    console.error("Error creating admin", error)
    await prisma.$disconnect()
    process.exit(1)
})