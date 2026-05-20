import { Router } from "express";
import { db } from "@workspace/db";
import { workoutPlansTable, workoutDaysTable, planDayExercisesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getExerciseWithMuscles } from "./exercises.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { level } = req.query as { level?: string };
    const plans = level
      ? await db.select().from(workoutPlansTable).where(eq(workoutPlansTable.level, level)).orderBy(workoutPlansTable.id)
      : await db.select().from(workoutPlansTable).orderBy(workoutPlansTable.id);

    res.json(plans.map((p) => ({
      id: p.id,
      name: p.name,
      level: p.level,
      daysPerWeek: p.daysPerWeek,
      goal: p.goal,
      description: p.description ?? null,
      estimatedWeeks: p.estimatedWeeks ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list workout plans");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [plan] = await db.select().from(workoutPlansTable).where(eq(workoutPlansTable.id, id)).limit(1);
    if (!plan) return res.status(404).json({ error: "Not found" });

    const days = await db.select().from(workoutDaysTable).where(eq(workoutDaysTable.planId, id)).orderBy(workoutDaysTable.dayNumber);

    const daysWithExercises = await Promise.all(
      days.map(async (day) => {
        const pde = await db
          .select()
          .from(planDayExercisesTable)
          .where(eq(planDayExercisesTable.dayId, day.id))
          .orderBy(planDayExercisesTable.orderIndex);

        const exercises = await Promise.all(pde.map((p) => getExerciseWithMuscles(p.exerciseId)));

        return {
          id: day.id,
          dayNumber: day.dayNumber,
          name: day.name,
          focus: day.focus ?? null,
          exercises: exercises.filter(Boolean),
        };
      })
    );

    res.json({
      id: plan.id,
      name: plan.name,
      level: plan.level,
      daysPerWeek: plan.daysPerWeek,
      goal: plan.goal,
      description: plan.description ?? null,
      estimatedWeeks: plan.estimatedWeeks ?? null,
      days: daysWithExercises,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get workout plan");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
