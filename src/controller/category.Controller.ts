import type { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../config/prisma";

export const getCategories = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        reply.status(200).send(categories);
    } catch (err) {
        reply.status(500).send({ error: "Failed to fetch categories" });  //fetch = buscar
    }
}

