import mongoose, { Schema, Document } from "mongoose";

export interface IMuscle extends Document {
  name: string;
  bodyPart: string;
  description?: string;
}

const MuscleSchema = new Schema<IMuscle>({
  name: { type: String, required: true },
  bodyPart: { type: String, required: true },
  description: { type: String },
});

export const Muscle = mongoose.model<IMuscle>("Muscle", MuscleSchema);
