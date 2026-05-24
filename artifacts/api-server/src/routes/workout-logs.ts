import { Router } from "express";
import mongoose from "mongoose";
import { WorkoutLog } from "../models/WorkoutLog.js";
import { Exercise } from "../models/Exercise.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

function formatLog(log: any) {
  return {
    id: log._id.toString(),
    date: log.date,
    status: log.status,
    notes: log.notes ?? null,
    durationMinutes: log.durationMinutes ?? null,
    workoutPlanId: log.workoutPlanId?.toString() ?? null,
    workoutDayId: log.workoutDayId ?? null,
  };
}

function formatSet(s: any) {
  return {
    id: s._id.toString(),
    exerciseId: s.exerciseId?.toString(),
    exerciseName: s.exerciseName,
    setNumber: s.setNumber,
    reps: s.reps,
    weightKg: s.weightKg ?? null,
    notes: s.notes ?? null,
  };
}

router.get("/", async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.userId }).sort({ date: 1 }).lean();
    res.json(logs.map(formatLog));
  } catch (err) {
    req.log.error({ err }, "Failed to list workout logs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { date, notes, workoutPlanId, workoutDayId } = req.body as {
      date?: string;
      notes?: string;
      workoutPlanId?: string;
      workoutDayId?: string;
    };

    if (!date) {
      res.status(400).json({ error: "date is required" });
      return;
    }

    const log = await WorkoutLog.create({
      userId: req.userId,
      date,
      notes: notes ?? undefined,
      workoutPlanId: workoutPlanId ? new mongoose.Types.ObjectId(workoutPlanId) : undefined,
      workoutDayId: workoutDayId ?? undefined,
      status: "in_progress",
      sets: [],
    });

    res.status(201).json(formatLog(log));
  } catch (err) {
    req.log.error({ err }, "Failed to create workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const log = await WorkoutLog.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!log) { res.status(404).json({ error: "Not found" }); return; }

    res.json({
      ...formatLog(log),
      sets: (log.sets ?? []).map(formatSet),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { status, notes, durationMinutes } = req.body as {
      status?: string;
      notes?: string;
      durationMinutes?: number;
    };

    const update: Record<string, unknown> = {};
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (durationMinutes !== undefined) update.durationMinutes = durationMinutes;

    const log = await WorkoutLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: update },
      { new: true }
    ).lean();

    if (!log) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatLog(log));
  } catch (err) {
    req.log.error({ err }, "Failed to update workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await WorkoutLog.deleteOne({ _id: req.params.id, userId: req.userId });
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete workout log");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/sets", async (req, res) => {
  try {
    const { exerciseId, setNumber, reps, weightKg, notes } = req.body as {
      exerciseId?: string;
      setNumber?: number;
      reps?: number;
      weightKg?: number;
      notes?: string;
    };

    if (!exerciseId || !setNumber || !reps) {
      res.status(400).json({ error: "exerciseId, setNumber and reps are required" });
      return;
    }

    const exercise = await Exercise.findById(exerciseId).lean() as any;
    const exerciseName = exercise?.name ?? "Unknown Exercise";

    const setId = new mongoose.Types.ObjectId();
    const newSet = {
      _id: setId,
      exerciseId: new mongoose.Types.ObjectId(exerciseId),
      exerciseName,
      setNumber,
      reps,
      weightKg: weightKg ?? undefined,
      notes: notes ?? undefined,
    };

    const log = await WorkoutLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $push: { sets: newSet } },
      { new: true }
    ).lean();

    if (!log) { res.status(404).json({ error: "Not found" }); return; }

    const addedSet = (log.sets ?? []).find((s: any) => s._id.toString() === setId.toString());
    res.status(201).json(formatSet(addedSet));
  } catch (err) {
    req.log.error({ err }, "Failed to add set");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:logId/sets/:setId", async (req, res) => {
  try {
    await WorkoutLog.updateOne(
      { _id: req.params.logId, userId: req.userId },
      { $pull: { sets: { _id: new mongoose.Types.ObjectId(req.params.setId) } } }
    );
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete set");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
