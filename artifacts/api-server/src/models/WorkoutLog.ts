import mongoose, { Schema, Document } from "mongoose";

export interface ILoggedSet {
  _id?: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg?: number;
  notes?: string;
}

export interface IWorkoutLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  status: "in_progress" | "completed";
  notes?: string;
  durationMinutes?: number;
  workoutPlanId?: mongoose.Types.ObjectId;
  workoutDayId?: string;
  sets: ILoggedSet[];
}

const WorkoutLogSchema = new Schema<IWorkoutLog>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
  notes: { type: String },
  durationMinutes: { type: Number },
  workoutPlanId: { type: Schema.Types.ObjectId, ref: "WorkoutPlan" },
  workoutDayId: { type: String },
  sets: [
    {
      exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
      exerciseName: { type: String, required: true },
      setNumber: { type: Number, required: true },
      reps: { type: Number, required: true },
      weightKg: { type: Number },
      notes: { type: String },
    },
  ],
});

export const WorkoutLog = mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);
