import type {  FastifyRequest,  FastifyReply } from "fastify";
import { CreateTransactionBody, createTransactionSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";


export const createTransaction = async (
    request: FastifyRequest<{Body: CreateTransactionBody}>,
     reply: FastifyReply): Promise<void> => {
        const userId = request.userId

        if(!userId){
        return reply.status(401).send({error: "Unauthorized"});
            
        }

        const result = createTransactionSchema.safeParse(request.body);

        if(!result.success){

            const errorMessage = result.error.errors[0].message || "Invalid Validation"

             reply.status(400).send({error: errorMessage});
             return;
        }

        const transaction = result.data;

        try {
            
            const category = await prisma.category.findFirst({
                where: {
                    id: transaction.categoryId,
                    type: transaction.type,
                }
            });

            if(!category){
                reply.status(404).send({error: "Category not found"});
                return;
            }

            const parsedDate = new Date(transaction.date);

            const newTransaction = await prisma.transaction.create({
                data:{
                    ...transaction,
                    userId,
                    date: parsedDate,
                },
                include: {
                    category: true,
                },
            });

            reply.status(201).send({newTransaction});
        } catch (err) {
            request.log.error({ error: err }, "Error creating transaction");
            reply.status(500).send({error: "Internal Server Error"});
        }
}


export default createTransaction;