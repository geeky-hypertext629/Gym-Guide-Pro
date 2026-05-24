import { Router } from "express";

const router = Router();

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const bmiCategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

router.post("/tdee", async (req, res) => {
  try {
    const { weightKg, heightCm, ageYears, sex, activityLevel, goal } = req.body as {
      weightKg?: number;
      heightCm?: number;
      ageYears?: number;
      sex?: string;
      activityLevel?: string;
      goal?: string;
    };

    if (!weightKg || !heightCm || !ageYears || !sex || !activityLevel || !goal) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const bmr = sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;

    const multiplier = activityMultipliers[activityLevel] ?? 1.55;
    const tdee = bmr * multiplier;

    let targetCalories: number;
    if (goal === "muscle_gain") targetCalories = tdee + 300;
    else if (goal === "fat_loss") targetCalories = tdee - 500;
    else targetCalories = tdee;

    const proteinG = Math.round(weightKg * 2.0);
    const fatG = Math.round((targetCalories * 0.25) / 9);
    const carbsG = Math.round((targetCalories - proteinG * 4 - fatG * 9) / 4);

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    res.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      proteinG,
      carbsG: Math.max(0, carbsG),
      fatG,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory: bmiCategory(bmi),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to calculate TDEE");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
