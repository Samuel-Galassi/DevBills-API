import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import routes from "./routes";
import { env } from "node:process";
import cors from "@fastify/cors"

const app: FastifyInstance = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  }
});

app.register(cors, {
  origin: [
    "http://localhost:5173",
    "https://interface-dev-bills-tau.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
})

app.register(routes, { prefix: "/api" });

export default app;
