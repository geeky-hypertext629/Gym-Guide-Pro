import mongoose, { Schema, Document } from "mongoose";

export interface IExerciseMuscle {
  muscleId: mongoose.Types.ObjectId;
  isPrimary: boolean;
}

export interface IExercise extends Document {
  name: string;
  difficulty: string;
  equipment: string;
  description?: string;
  instructions?: string;
  sets?: number;
  repsMin?: number;
  repsMax?: number;
  restSeconds?: number;
  videoUrl?: string;
  muscles: IExerciseMuscle[];
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  difficulty: { type: String, required: true },
  equipment: { type: String, required: true },
  description: { type: String },
  instructions: { type: String },
  sets: { type: Number },
  repsMin: { type: Number },
  repsMax: { type: Number },
  restSeconds: { type: Number },
  videoUrl: { type: String },
  muscles: [
    {
      muscleId: { type: Schema.Types.ObjectId, ref: "Muscle", required: true },
      isPrimary: { type: Boolean, required: true, default: true },
    },
  ],
});

export const Exercise = mongoose.model<IExercise>("Exercise", ExerciseSchema);
