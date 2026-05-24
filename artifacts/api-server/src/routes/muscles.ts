import { Router } from "express";
import { Muscle } from "../models/Muscle.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const muscles = await Muscle.find().sort({ bodyPart: 1, name: 1 }).lean();
    res.json(muscles.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      bodyPart: m.bodyPart,
      description: m.description ?? null,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list muscles");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
