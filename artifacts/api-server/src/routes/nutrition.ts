import { Router } from "express";
import { NutritionGuide } from "../models/NutritionGuide.js";

const router = Router();

function formatGuide(g: any) {
  return {
    id: g._id.toString(),
    name: g.name,
    goal: g.goal,
    level: g.level ?? null,
    calories: g.calories,
    proteinG: g.proteinG,
    carbsG: g.carbsG,
    fatG: g.fatG,
    description: g.description ?? null,
    tips: g.tips ?? [],
    sampleMeals: g.sampleMeals ?? [],
  };
}

router.get("/", async (req, res) => {
  try {
    const guides = await NutritionGuide.find().sort({ _id: 1 }).lean();
    res.json(guides.map(formatGuide));
  } catch (err) {
    req.log.error({ err }, "Failed to list nutrition guides");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const guide = await NutritionGuide.findById(req.params.id).lean();
    if (!guide) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatGuide(guide));
  } catch (err) {
    req.log.error({ err }, "Failed to get nutrition guide");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
