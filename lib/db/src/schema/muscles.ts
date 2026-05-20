import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const musclesTable = pgTable("muscles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bodyPart: text("body_part").notNull(),
  description: text("description"),
});

export const insertMuscleSchema = createInsertSchema(musclesTable).omit({ id: true });
export type InsertMuscle = z.infer<typeof insertMuscleSchema>;
export type Muscle = typeof musclesTable.$inferSelect;
