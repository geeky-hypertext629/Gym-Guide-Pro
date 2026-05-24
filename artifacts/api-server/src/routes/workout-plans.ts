import { Router } from "express";
import { WorkoutPlan } from "../models/WorkoutPlan.js";
import { Exercise } from "../models/Exercise.js";
import { Muscle } from "../models/Muscle.js";

const router = Router();

async function buildPlanDetail(plan: any) {
  const allMuscles = await Muscle.find().lean();
  const muscleMap = new Map(allMuscles.map((m: any) => [m._id.toString(), m]));

  const days = await Promise.all(
    (plan.days ?? []).map(async (day: any) => {
      const exercises = await Promise.all(
        (day.exercises ?? []).map(async (pe: any) => {
          const ex = await Exercise.findById(pe.exerciseId).lean() as any;
          if (!ex) return null;

          const primaryMuscles: any[] = [];
          const secondaryMuscles: any[] = [];
          for (const em of ex.muscles ?? []) {
            const mid = em.muscleId?.toString();
            const muscle = muscleMap.get(mid);
            if (!muscle) continue;
            const entry = { id: mid, name: (muscle as any).name, bodyPart: (muscle as any).bodyPart, description: (muscle as any).description ?? null };
            if (em.isPrimary) primaryMuscles.push(entry);
            else secondaryMuscles.push(entry);
          }

          return {
            id: ex._id.toString(),
            name: ex.name,
            difficulty: ex.difficulty,
            equipment: ex.equipment,
            description: ex.description ?? null,
            instructions: ex.instructions ?? null,
            sets: ex.sets ?? null,
            repsMin: ex.repsMin ?? null,
            repsMax: ex.repsMax ?? null,
            restSeconds: ex.restSeconds ?? null,
            videoUrl: ex.videoUrl ?? null,
            primaryMuscles,
            secondaryMuscles,
          };
        })
      );

      return {
        id: day._id?.toString() ?? day.dayNumber.toString(),
        dayNumber: day.dayNumber,
        name: day.name,
        focus: day.focus ?? null,
        exercises: exercises.filter(Boolean),
      };
    })
  );

  return {
    id: plan._id.toString(),
    name: plan.name,
    level: plan.level,
    daysPerWeek: plan.daysPerWeek,
    goal: plan.goal,
    description: plan.description ?? null,
    estimatedWeeks: plan.estimatedWeeks ?? null,
    days,
  };
}

router.get("/", async (req, res) => {
  try {
    const { level } = req.query as { level?: string };
    const filter = level ? { level } : {};
    const plans = await WorkoutPlan.find(filter).sort({ _id: 1 }).lean();

    res.json(plans.map((p: any) => ({
      id: p._id.toString(),
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
    const plan = await WorkoutPlan.findById(req.params.id).lean();
    if (!plan) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await buildPlanDetail(plan));
  } catch (err) {
    req.log.error({ err }, "Failed to get workout plan");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
