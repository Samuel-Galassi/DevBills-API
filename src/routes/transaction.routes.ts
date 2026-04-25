import type { FastifyInstance } from "fastify";
import createTransaction from "../controller/transactions/createTransaction.Controller";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createTransactionSchema, DeleteTransactionSchema, getHistoricalTransactionsSchema, getTransactionSchema, getTransactionsSummarySchema } from "../schemas/transaction.schema";
import { getTransactions } from "../controller/transactions/getTransactions.Controller";
import { getTransactionsSummary } from "../controller/transactions/getTransactionsSummary.Controller";
import { deleteTransaction } from "../controller/transactions/deleteTransaction.Controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getHistoricalTransactions } from "../controller/transactions/getHistoricalTransaction.Controller";
export const transactionRoutes = async (fastify: FastifyInstance): Promise<void> => {

    fastify.addHook("preHandler", authMiddleware);

    //C-CRUD
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: zodToJsonSchema(createTransactionSchema)
        },
        handler: createTransaction,
    })

    //R-CRUD with filters
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: zodToJsonSchema(getTransactionSchema),
        },
        handler: getTransactions,
    })

     //R-CRUD the resume
     fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSummarySchema),
        },
        handler: getTransactionsSummary,
    })

    //R-CRUD the historical transactions
     fastify.route({
        method: "GET",
        url: "/historical",
        schema: {
            querystring: zodToJsonSchema(getHistoricalTransactionsSchema),
        },
        handler: getHistoricalTransactions,
    })

      //D-CRUD 
    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: zodToJsonSchema(DeleteTransactionSchema),
        },
        handler: deleteTransaction,
    })
}

export default transactionRoutes;