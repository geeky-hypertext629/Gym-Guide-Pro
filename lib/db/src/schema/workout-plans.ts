import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workoutPlansTable = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level").notNull(), // beginner | intermediate | advanced
  daysPerWeek: integer("days_per_week").notNull(),
  goal: text("goal").notNull(), // strength | hypertrophy | fat_loss | endurance
  description: text("description"),
  estimatedWeeks: integer("estimated_weeks"),
});

export const workoutDaysTable = pgTable("workout_days", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => workoutPlansTable.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  name: text("name").notNull(),
  focus: text("focus"),
});

export const planDayExercisesTable = pgTable("plan_day_exercises", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => workoutDaysTable.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlansTable).omit({ id: true });
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlan = typeof workoutPlansTable.$inferSelect;
export type WorkoutDay = typeof workoutDaysTable.$inferSelect;
