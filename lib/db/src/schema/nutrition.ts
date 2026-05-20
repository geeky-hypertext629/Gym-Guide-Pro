import { pgTable, serial, text, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const nutritionGuidesTable = pgTable("nutrition_guides", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  goal: text("goal").notNull(), // muscle_gain | fat_loss | maintenance | endurance
  level: text("level"),
  calories: integer("calories").notNull(),
  proteinG: integer("protein_g").notNull(),
  carbsG: integer("carbs_g").notNull(),
  fatG: integer("fat_g").notNull(),
  description: text("description"),
  tips: jsonb("tips").$type<string[]>().default([]),
  sampleMeals: jsonb("sample_meals").$type<Array<{ name: string; time: string; foods: string[]; calories?: number }>>().default([]),
});

export const insertNutritionGuideSchema = createInsertSchema(nutritionGuidesTable).omit({ id: true });
export type InsertNutritionGuide = z.infer<typeof insertNutritionGuideSchema>;
export type NutritionGuide = typeof nutritionGuidesTable.$inferSelect;
