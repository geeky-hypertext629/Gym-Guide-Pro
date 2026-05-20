import { Router } from "express";
import { db } from "@workspace/db";
import { workoutLogsTable, loggedSetsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateWorkoutLogBody,
  UpdateWorkoutLogBody,
  UpdateWorkoutLogParams,
  DeleteWorkoutLogParams,
  AddSetBody,
  AddSetParams,
  DeleteSetParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const logs = await db.select().from(workoutLogsTable).orderBy(workoutLogsTable.date);
    res.json(logs.map((l) => ({
      id: l.id,
      date: l.date,
      status: l.status,
      notes: l.notes ?? null,
      durationMinutes: l.durationMinutes ?? null,
      workoutPlanId: l.workoutPlanId ?? null,
      workoutDayId: l.workoutDayId ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list workout logs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = CreateWorkoutLogBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

    const body = parsed.data;
    const [log] = await db
      .insert(workoutLogsTable)
      .values({
        date: body.date,
        notes: body.notes,
        workoutPlanId: body.workoutPlanId ?? null,
        workoutDayId: body.workoutDayId ?? null,
        status: "in_progress",
      })
      .returning();

    res.status(201).json({
      id: log.id,
      date: log.date,
      status: log.status,
      notes: log.notes ?? null,
      durationMinutes: log.durationMinutes ?? null,
      workoutPlanId: log.workoutPlanId ?? null,
      workoutDayId: log.workoutDayId ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [log] = await db.select().from(workoutLogsTable).where(eq(workoutLogsTable.id, id)).limit(1);
    if (!log) return res.status(404).json({ error: "Not found" });

    const sets = await db.select().from(loggedSetsTable).where(eq(loggedSetsTable.logId, id)).orderBy(loggedSetsTable.exerciseId, loggedSetsTable.setNumber);

    res.json({
      id: log.id,
      date: log.date,
      status: log.status,
      notes: log.notes ?? null,
      durationMinutes: log.durationMinutes ?? null,
      workoutPlanId: log.workoutPlanId ?? null,
      workoutDayId: log.workoutDayId ?? null,
      sets: sets.map((s) => ({
        id: s.id,
        exerciseId: s.exerciseId,
        exerciseName: s.exerciseName,
        setNumber: s.setNumber,
        reps: s.reps,
        weightKg: s.weightKg ?? null,
        notes: s.notes ?? null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const params = UpdateWorkoutLogParams.safeParse({ id: parseInt(req.params.id, 10) });
    const body = UpdateWorkoutLogBody.safeParse(req.body);
    if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });

    const updates: Record<string, unknown> = {};
    if (body.data.status !== undefined) updates.status = body.data.status;
    if (body.data.notes !== undefined) updates.notes = body.data.notes;
    if (body.data.durationMinutes !== undefined) updates.durationMinutes = body.data.durationMinutes;

    const [log] = await db
      .update(workoutLogsTable)
      .set(updates)
      .where(eq(workoutLogsTable.id, params.data.id))
      .returning();

    if (!log) return res.status(404).json({ error: "Not found" });

    res.json({
      id: log.id,
      date: log.date,
      status: log.status,
      notes: log.notes ?? null,
      durationMinutes: log.durationMinutes ?? null,
      workoutPlanId: log.workoutPlanId ?? null,
      workoutDayId: log.workoutDayId ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const params = DeleteWorkoutLogParams.safeParse({ id: parseInt(req.params.id, 10) });
    if (!params.success) return res.status(400).json({ error: "Invalid id" });

    await db.delete(workoutLogsTable).where(eq(workoutLogsTable.id, params.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/sets", async (req, res) => {
  try {
    const params = AddSetParams.safeParse({ id: parseInt(req.params.id, 10) });
    const body = AddSetBody.safeParse(req.body);
    if (!params.success || !body.success) return res.status(400).json({ error: "Invalid request" });

    const { exerciseId, setNumber, reps, weightKg, notes } = body.data;

    // Look up exercise name
    const [exRow] = await db.query.exercisesTable.findMany({ where: (t, { eq }) => eq(t.id, exerciseId), limit: 1 }) as Array<{ id: number; name: string }>;
    const exerciseName = exRow?.name ?? "Unknown Exercise";

    const [set] = await db
      .insert(loggedSetsTable)
      .values({
        logId: params.data.id,
        exerciseId,
        exerciseName,
        setNumber,
        reps,
        weightKg: weightKg ?? null,
        notes: notes ?? null,
      })
      .returning();

    res.status(201).json({
      id: set.id,
      exerciseId: set.exerciseId,
      exerciseName: set.exerciseName,
      setNumber: set.setNumber,
      reps: set.reps,
      weightKg: set.weightKg ?? null,
      notes: set.notes ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to add set");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:logId/sets/:setId", async (req, res) => {
  try {
    const params = DeleteSetParams.safeParse({
      logId: parseInt(req.params.logId, 10),
      setId: parseInt(req.params.setId, 10),
    });
    if (!params.success) return res.status(400).json({ error: "Invalid params" });

    await db.delete(loggedSetsTable).where(eq(loggedSetsTable.id, params.data.setId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete set");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
