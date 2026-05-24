import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import musclesRouter from "./muscles.js";
import exercisesRouter from "./exercises.js";
import workoutPlansRouter from "./workout-plans.js";
import workoutLogsRouter from "./workout-logs.js";
import nutritionRouter from "./nutrition.js";
import statsRouter from "./stats.js";
import calculatorRouter from "./calculator.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/muscles", musclesRouter);
router.use("/exercises", exercisesRouter);
router.use("/workout-plans", workoutPlansRouter);
router.use("/workout-logs", workoutLogsRouter);
router.use("/nutrition-guides", nutritionRouter);
router.use("/stats", statsRouter);
router.use("/calculator", calculatorRouter);

export default router;
