import { Router } from "express";
import { db } from "@workspace/db";
import { nutritionGuidesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function formatGuide(g: typeof nutritionGuidesTable.$inferSelect) {
  return {
    id: g.id,
    name: g.name,
    goal: g.goal,
    level: g.level ?? null,
    calories: g.calories,
    proteinG: g.proteinG,
    carbsG: g.carbsG,
    fatG: g.fatG,
    description: g.description ?? null,
    tips: (g.tips as string[]) ?? [],
    sampleMeals: (g.sampleMeals as Array<{ name: string; time: string; foods: string[]; calories?: number }>) ?? [],
  };
}

router.get("/", async (req, res) => {
  try {
    const guides = await db.select().from(nutritionGuidesTable).orderBy(nutritionGuidesTable.id);
    res.json(guides.map(formatGuide));
  } catch (err) {
    req.log.error({ err }, "Failed to list nutrition guides");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [guide] = await db.select().from(nutritionGuidesTable).where(eq(nutritionGuidesTable.id, id)).limit(1);
    if (!guide) return res.status(404).json({ error: "Not found" });
    res.json(formatGuide(guide));
  } catch (err) {
    req.log.error({ err }, "Failed to get nutrition guide");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
