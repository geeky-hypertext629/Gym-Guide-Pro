import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import mongoose from "mongoose";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { seedDatabase } from "./seed.js";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env["FRONTEND_URL"];
    if (!origin) return callback(null, true);
    if (allowed) return callback(null, origin === allowed);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export async function connectAndSeed(): Promise<void> {
  const mongoUri = process.env["MONGODB_URI"] ?? "mongodb://localhost:27017/gymguide";
  await mongoose.connect(mongoUri);
  logger.info("Connected to MongoDB");
  await seedDatabase();
}

export default app;
