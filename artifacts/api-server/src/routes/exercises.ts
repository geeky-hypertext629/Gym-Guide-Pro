import { Router } from "express";
import { db } from "@workspace/db";
import { exercisesTable, exerciseMusclesTable, musclesTable } from "@workspace/db";
import { eq, and, ilike, SQL } from "drizzle-orm";

const router = Router();

async function getExerciseWithMuscles(exerciseId: number) {
  const exercise = await db.select().from(exercisesTable).where(eq(exercisesTable.id, exerciseId)).limit(1);
  if (!exercise[0]) return null;

  const muscleMappings = await db
    .select({ isPrimary: exerciseMusclesTable.isPrimary, muscle: musclesTable })
    .from(exerciseMusclesTable)
    .innerJoin(musclesTable, eq(exerciseMusclesTable.muscleId, musclesTable.id))
    .where(eq(exerciseMusclesTable.exerciseId, exerciseId));

  const primaryMuscles = muscleMappings.filter((m) => m.isPrimary === 1).map((m) => ({
    id: m.muscle.id,
    name: m.muscle.name,
    bodyPart: m.muscle.bodyPart,
    description: m.muscle.description ?? null,
  }));
  const secondaryMuscles = muscleMappings.filter((m) => m.isPrimary === 0).map((m) => ({
    id: m.muscle.id,
    name: m.muscle.name,
    bodyPart: m.muscle.bodyPart,
    description: m.muscle.description ?? null,
  }));

  const e = exercise[0];
  return {
    id: e.id,
    name: e.name,
    difficulty: e.difficulty,
    equipment: e.equipment,
    description: e.description ?? null,
    instructions: e.instructions ?? null,
    sets: e.sets ?? null,
    repsMin: e.repsMin ?? null,
    repsMax: e.repsMax ?? null,
    restSeconds: e.restSeconds ?? null,
    videoUrl: e.videoUrl ?? null,
    primaryMuscles,
    secondaryMuscles,
  };
}

router.get("/", async (req, res) => {
  try {
    const { muscleId, equipment, difficulty, search } = req.query as Record<string, string | undefined>;

    const conditions: SQL[] = [];
    if (equipment) conditions.push(eq(exercisesTable.equipment, equipment));
    if (difficulty) conditions.push(eq(exercisesTable.difficulty, difficulty));
    if (search) conditions.push(ilike(exercisesTable.name, `%${search}%`));

    let exerciseIds: number[] = [];

    if (muscleId) {
      const mid = parseInt(muscleId, 10);
      const mappings = await db
        .select({ exerciseId: exerciseMusclesTable.exerciseId })
        .from(exerciseMusclesTable)
        .where(eq(exerciseMusclesTable.muscleId, mid));
      exerciseIds = mappings.map((m) => m.exerciseId);
      if (exerciseIds.length === 0) return res.json([]);
    }

    const exercises = conditions.length > 0
      ? await db.select().from(exercisesTable).where(and(...conditions)).orderBy(exercisesTable.name)
      : await db.select().from(exercisesTable).orderBy(exercisesTable.name);

    const filtered = muscleId
      ? exercises.filter((e) => exerciseIds.includes(e.id))
      : exercises;

    const results = await Promise.all(filtered.map((e) => getExerciseWithMuscles(e.id)));
    res.json(results.filter(Boolean));
  } catch (err) {
    req.log.error({ err }, "Failed to list exercises");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const exercise = await getExerciseWithMuscles(id);
    if (!exercise) return res.status(404).json({ error: "Not found" });
    res.json(exercise);
  } catch (err) {
    req.log.error({ err }, "Failed to get exercise");
    res.status(500).json({ error: "Internal server error" });
  }
});

export { getExerciseWithMuscles };
export default router;
