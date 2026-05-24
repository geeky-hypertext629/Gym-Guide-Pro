import mongoose, { Schema, Document } from "mongoose";

export interface IPlanDayExercise {
  exerciseId: mongoose.Types.ObjectId;
  orderIndex: number;
}

export interface IWorkoutDay {
  dayNumber: number;
  name: string;
  focus?: string;
  exercises: IPlanDayExercise[];
}

export interface IWorkoutPlan extends Document {
  name: string;
  level: string;
  daysPerWeek: number;
  goal: string;
  description?: string;
  estimatedWeeks?: number;
  days: IWorkoutDay[];
}

const WorkoutPlanSchema = new Schema<IWorkoutPlan>({
  name: { type: String, required: true },
  level: { type: String, required: true },
  daysPerWeek: { type: Number, required: true },
  goal: { type: String, required: true },
  description: { type: String },
  estimatedWeeks: { type: Number },
  days: [
    {
      dayNumber: { type: Number, required: true },
      name: { type: String, required: true },
      focus: { type: String },
      exercises: [
        {
          exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
          orderIndex: { type: Number, required: true },
        },
      ],
    },
  ],
});

export const WorkoutPlan = mongoose.model<IWorkoutPlan>("WorkoutPlan", WorkoutPlanSchema);
