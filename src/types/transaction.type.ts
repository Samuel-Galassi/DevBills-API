import type { Category, TransactionType } from "@prisma/client";
import type { CategorySummary } from "./category.types";



export interface TransactionFilter {
    userId: string;
    date?: {
        gte: Date,
        lte: Date,
    },
    type?: TransactionType,
    categoryId?: string,
}

export interface TransactionSummary {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
    expensesByCategory: CategorySummary[];
}