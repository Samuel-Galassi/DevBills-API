import { z } from "zod";
import { ObjectId } from "mongodb";
import { TransactionType } from "@prisma/client";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.number().positive("Amount must be a positive number"),
    date: z.coerce.date({
        errorMap: () => ({ message: "Invalid date format" })
    }),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Invalid category"
    }),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        errorMap: () => ({ message: "Invalid transaction type" })
    })
});


export const getTransactionSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        errorMap: () => ({ message: "Invalid transaction type" })
    }).optional(),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Invalid category"
    }).optional(),
})

export const getTransactionsSummarySchema = z.object({
    month: z.string({ required_error: "Month is required" }),
    year: z.string({ required_error: "year is required" }),
})

export const getHistoricalTransactionsSchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    months: z.coerce.number().min(1).max(12).optional(),
})

export const DeleteTransactionSchema = z.object({
    id: z.string().refine(isValidObjectId, {
        message: "Invalid transaction ID"
    })
})

export type GetHistoricalTransactionsQuery = z.infer<typeof getHistoricalTransactionsSchema>;
export type DeleteTransactionParams = z.infer<typeof DeleteTransactionSchema>;
export type GetTransactionQuery = z.infer<typeof getTransactionSchema>;
export type GetTransactionSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;