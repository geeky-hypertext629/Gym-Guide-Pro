import { Router } from "express";
import { db } from "@workspace/db";
import { musclesTable } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const muscles = await db.select().from(musclesTable).orderBy(musclesTable.bodyPart, musclesTable.name);
    res.json(muscles.map((m) => ({
      id: m.id,
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
