import type { FastifyReply, FastifyRequest } from "fastify";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";

export const deleteTransaction = async (
    request: FastifyRequest<{ Params: DeleteTransactionParams}>,
    reply: FastifyReply,
): Promise<void> => {

    const userId = request.userId
    const { id } = request.params;

    if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });
    }


    try {
        const transaction = await prisma.transaction.findFirst({
             where: {
                 id, userId 
                }
        });

        if (!transaction) {
            reply.status(404).send({ error: "ID Transaction not found" });
            return;
        }
        
        await prisma.transaction.delete({
            where: {
                id,
            },
        });

        reply.status(200).send({ message: "Transaction deleted successfully" });

    } catch (err) {
        reply.log.error({ error: err }, "Error deleting transaction");
        reply.status(500).send({ error: "Internal server error" });
    }
}