import type { FastifyInstance } from "fastify";
import { getCategories } from "../controller/category.Controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const categoryRoutes = async (fastify: FastifyInstance): Promise<void> => {
    fastify.addHook("preHandler", authMiddleware);
    fastify.get("/", getCategories);
};

export default categoryRoutes;