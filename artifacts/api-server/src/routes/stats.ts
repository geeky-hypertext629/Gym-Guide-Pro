import { Router } from "express";
import { WorkoutLog } from "../models/WorkoutLog.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/summary", async (req, res) => {
  try {
    const allLogs = await WorkoutLog.find({ userId: req.userId }).sort({ date: -1 }).lean();

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split("T")[0];

    const workoutsThisWeek = allLogs.filter((l) => l.date >= startOfWeekStr).length;
    const totalWorkouts = allLogs.length;

    const allSets = allLogs.flatMap((l) => l.sets ?? []);
    const totalSets = allSets.length;

    const totalVolumeKg = allSets.reduce((sum, s) => sum + (s.weightKg ?? 0) * s.reps, 0);

    // Streak
    let currentStreakDays = 0;
    const logDates = new Set(allLogs.map((l) => l.date));
    const checkDate = new Date(today);
    while (true) {
      const ds = checkDate.toISOString().split("T")[0];
      if (logDates.has(ds)) {
        currentStreakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Favorite exercise
    const exerciseCounts: Record<string, number> = {};
    for (const s of allSets) {
      exerciseCounts[s.exerciseName] = (exerciseCounts[s.exerciseName] ?? 0) + 1;
    }
    const favoriteExercise = Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    res.json({
      workoutsThisWeek,
      totalWorkouts,
      totalSets,
      currentStreakDays,
      totalVolumeKg: Math.round(totalVolumeKg * 10) / 10,
      lastWorkoutDate: allLogs[0]?.date ?? null,
      favoriteExercise,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/progress/:exerciseId", async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;

    const logs = await WorkoutLog.find({ userId: req.userId }).lean();

    const byDate: Record<string, { weights: number[]; reps: number[]; sets: number }> = {};
    for (const log of logs) {
      for (const set of log.sets ?? []) {
        if (set.exerciseId?.toString() !== exerciseId) continue;
        if (!byDate[log.date]) byDate[log.date] = { weights: [], reps: [], sets: 0 };
        byDate[log.date].weights.push(set.weightKg ?? 0);
        byDate[log.date].reps.push(set.reps);
        byDate[log.date].sets++;
      }
    }

    const points = Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        bestWeightKg: data.weights.length > 0 ? Math.max(...data.weights) : null,
        totalReps: data.reps.reduce((s, r) => s + r, 0),
        totalSets: data.sets,
      }));

    res.json(points);
  } catch (err) {
    req.log.error({ err }, "Failed to get exercise progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
