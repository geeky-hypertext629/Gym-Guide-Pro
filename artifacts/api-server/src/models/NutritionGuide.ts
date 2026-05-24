import mongoose, { Schema, Document } from "mongoose";

export interface ISampleMeal {
  name: string;
  time: string;
  foods: string[];
  calories?: number;
}

export interface INutritionGuide extends Document {
  name: string;
  goal: string;
  level?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  description?: string;
  tips: string[];
  sampleMeals: ISampleMeal[];
}

const NutritionGuideSchema = new Schema<INutritionGuide>({
  name: { type: String, required: true },
  goal: { type: String, required: true },
  level: { type: String },
  calories: { type: Number, required: true },
  proteinG: { type: Number, required: true },
  carbsG: { type: Number, required: true },
  fatG: { type: Number, required: true },
  description: { type: String },
  tips: [{ type: String }],
  sampleMeals: [
    {
      name: { type: String, required: true },
      time: { type: String, required: true },
      foods: [{ type: String }],
      calories: { type: Number },
    },
  ],
});

export const NutritionGuide = mongoose.model<INutritionGuide>("NutritionGuide", NutritionGuideSchema);
