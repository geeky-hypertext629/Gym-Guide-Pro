import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  difficulty: text("difficulty").notNull(), // beginner | intermediate | advanced
  equipment: text("equipment").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  sets: integer("sets"),
  repsMin: integer("reps_min"),
  repsMax: integer("reps_max"),
  restSeconds: integer("rest_seconds"),
  videoUrl: text("video_url"),
});

export const exerciseMusclesTable = pgTable("exercise_muscles", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id").notNull().references(() => exercisesTable.id, { onDelete: "cascade" }),
  muscleId: integer("muscle_id").notNull(),
  isPrimary: integer("is_primary").notNull().default(1), // 1=primary, 0=secondary
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
export type ExerciseMuscle = typeof exerciseMusclesTable.$inferSelect;
