import { Router } from "express";
import mongoose from "mongoose";
import { Exercise } from "../models/Exercise.js";
import { Muscle } from "../models/Muscle.js";

const router = Router();

function formatExercise(ex: any, muscleMap: Map<string, any>) {
  const primaryMuscles: any[] = [];
  const secondaryMuscles: any[] = [];

  for (const em of ex.muscles ?? []) {
    const mid = em.muscleId?.toString();
    const muscle = muscleMap.get(mid);
    if (!muscle) continue;
    const entry = { id: mid, name: muscle.name, bodyPart: muscle.bodyPart, description: muscle.description ?? null };
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
}

router.get("/", async (req, res) => {
  try {
    const { muscleId, equipment, difficulty, search } = req.query as Record<string, string | undefined>;

    const filter: Record<string, unknown> = {};
    if (equipment) filter.equipment = equipment;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (muscleId) filter["muscles.muscleId"] = new mongoose.Types.ObjectId(muscleId);

    const exercises = await Exercise.find(filter).sort({ name: 1 }).lean();
    const allMuscles = await Muscle.find().lean();
    const muscleMap = new Map(allMuscles.map((m: any) => [m._id.toString(), m]));

    res.json(exercises.map((ex) => formatExercise(ex, muscleMap)));
  } catch (err) {
    req.log.error({ err }, "Failed to list exercises");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).lean();
    if (!exercise) { res.status(404).json({ error: "Not found" }); return; }

    const allMuscles = await Muscle.find().lean();
    const muscleMap = new Map(allMuscles.map((m: any) => [m._id.toString(), m]));

    res.json(formatExercise(exercise, muscleMap));
  } catch (err) {
    req.log.error({ err }, "Failed to get exercise");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
