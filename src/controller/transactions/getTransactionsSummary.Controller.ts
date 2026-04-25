import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionSummaryQuery } from "../../schemas/transaction.schema";
import  type { TransactionSummary } from "../../types/transaction.type";
import  type { CategorySummary } from "../../types/category.types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import  { TransactionType } from "@prisma/client";


dayjs.extend(utc);

export const getTransactionsSummary = async (
    request: FastifyRequest<{ Querystring: GetTransactionSummaryQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = request.userId
        //se não existir o userId, retorna 401
    if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });

    }

    //puxa o mês e o ano da query do frontend pela request
    const { month, year } = request.query;


    //se não existir mes ou ano, retorna 400(mes e ano são obrigatórios)
    if(!month || !year){
        reply.send(400).send({error: "Month and Year are required"}); 
    }
            //2 constantes define o inicio e o fim do mês
            const startDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
            const endDate = dayjs.utc(startDate).endOf('month').toDate();
    

    try {
            // puxa a lista de transações do banco de dados com prisma usando o userId e o filtro de data
            const transactions = await prisma.transaction.findMany({
                where: {
                    userId,
                    date: {
                         gte: startDate,
                          lte: endDate
                         },
                },
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

            let totalExpenses = 0;
            let totalIncomes = 0;

            //mapear as despesas por categoria usando um Map para agrupar
            const groupedExpenses = new Map<String, CategorySummary>();

            //percorre as transações e puxa as despesas
            for (const transaction of transactions) {
                    //se o tipo for igual a despesa
                if(transaction.type === TransactionType.expense){

                    //se existir a categoria, agrupa as despesas por categoria, senão cria uma nova entrada
                    const existing = groupedExpenses.get(transaction.categoryId) ?? {
                        categoryId: transaction.categoryId,
                        categoryName: transaction.category.name,
                        categoryColor: transaction.category.color,
                        amount: 0,
                        porcentage: 0,
                    };
                    existing.amount += transaction.amount;
                    groupedExpenses.set(transaction.categoryId, existing);

                    totalExpenses += transaction.amount;
            } 
            //se o tipo não for despesa, é receita
            else{
                totalIncomes += transaction.amount;
            }
            }


            //monta o resumo final das transações
            const summary: TransactionSummary = {
                totalExpenses,
                totalIncomes,
                balance: Number((totalIncomes - totalExpenses).toFixed(2)),
                expensesByCategory: Array.from(groupedExpenses.values()).map((entry) => ({ //para cada entrada no map, calcula a porcentagem
                    ...entry,
                    porcentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
                })).sort( (a,b) => b.amount - a.amount),
            };
            reply.send(summary);
        } catch (err) {
            request.log.error(err, "Error fetching transactions");
            reply.status(500).send({ error: "Internal Server Error" });
        }
}


