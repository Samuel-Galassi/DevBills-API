import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async () => {

    try {
        await prisma.$connect()
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed", err);
    }
}

export default prisma;