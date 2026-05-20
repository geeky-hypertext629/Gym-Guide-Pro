import { pgTable, serial, text, integer, date, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workoutLogsTable = pgTable("workout_logs", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  status: text("status").notNull().default("in_progress"), // in_progress | completed
  notes: text("notes"),
  durationMinutes: integer("duration_minutes"),
  workoutPlanId: integer("workout_plan_id"),
  workoutDayId: integer("workout_day_id"),
});

export const loggedSetsTable = pgTable("logged_sets", {
  id: serial("id").primaryKey(),
  logId: integer("log_id").notNull().references(() => workoutLogsTable.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").notNull(),
  exerciseName: text("exercise_name").notNull(),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps").notNull(),
  weightKg: real("weight_kg"),
  notes: text("notes"),
});

export const insertWorkoutLogSchema = createInsertSchema(workoutLogsTable).omit({ id: true });
export const insertLoggedSetSchema = createInsertSchema(loggedSetsTable).omit({ id: true });
export type InsertWorkoutLog = z.infer<typeof insertWorkoutLogSchema>;
export type InsertLoggedSet = z.infer<typeof insertLoggedSetSchema>;
export type WorkoutLog = typeof workoutLogsTable.$inferSelect;
export type LoggedSet = typeof loggedSetsTable.$inferSelect;
