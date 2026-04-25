import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.type";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";

dayjs.extend(utc);

export const getTransactions = async (
    request: FastifyRequest<{ Querystring: GetTransactionQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = request.userId

    if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });

    }

    const { month, year, type, categoryId } = request.query;

    const filters: TransactionFilter = { userId };

    if (month && year) {
        const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = dayjs.utc(startDate).endOf('month').toDate();
        filters.date = { gte: startDate, lte: endDate };
    }

    if (type) {
        filters.type = type;
    }

    if (categoryId) {
        filters.categoryId = categoryId;
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: filters,
            orderBy: { date: 'desc' },
            include: {
                category: {
                    select: {
                        color: true,
                        name: true,
                        type: true,
                    },
                },
            },
        });
        reply.send({ transactions });
    } catch (err) {
        request.log.error(err, "Error fetching transactions");
        reply.status(500).send({ error: "Internal Server Error" });
    }
}