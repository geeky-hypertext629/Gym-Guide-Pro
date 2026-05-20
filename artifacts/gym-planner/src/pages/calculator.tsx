import { useState } from "react";
import { useCalculateTdee } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Flame, Activity } from "lucide-react";
import { motion } from "framer-motion";

type TdeeResult = {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  bmi: number;
  bmiCategory: string;
};

const activityOptions = [
  { value: "sedentary", label: "Sedentary (office job, little exercise)" },
  { value: "light", label: "Light (1-3 days/week exercise)" },
  { value: "moderate", label: "Moderate (3-5 days/week exercise)" },
  { value: "active", label: "Active (6-7 days/week exercise)" },
  { value: "very_active", label: "Very Active (physical job + training)" },
];

const goalOptions = [
  { value: "muscle_gain", label: "Build Muscle (+300 kcal surplus)" },
  { value: "maintenance", label: "Maintain Weight" },
  { value: "fat_loss", label: "Lose Fat (-500 kcal deficit)" },
];

const bmiColor = (cat: string) => {
  if (cat === "Underweight") return "text-blue-500";
  if (cat === "Normal weight") return "text-green-500";
  if (cat === "Overweight") return "text-yellow-500";
  return "text-red-500";
};

export default function CalcPage() {
  const [form, setForm] = useState({
    weightKg: "",
    heightCm: "",
    ageYears: "",
    sex: "",
    activityLevel: "",
    goal: "",
  });

  const [result, setResult] = useState<TdeeResult | null>(null);
  const calculateTdee = useCalculateTdee();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const setSelect = (field: string) => (val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  const isValid =
    form.weightKg && form.heightCm && form.ageYears && form.sex && form.activityLevel && form.goal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    calculateTdee.mutate(
      {
        data: {
          weightKg: parseFloat(form.weightKg),
          heightCm: parseFloat(form.heightCm),
          ageYears: parseInt(form.ageYears),
          sex: form.sex as "male" | "female",
          activityLevel: form.activityLevel,
          goal: form.goal,
        },
      },
      { onSuccess: (data) => setResult(data as TdeeResult) }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-1">TDEE Calculator</h1>
        <p className="text-muted-foreground">Find your daily calorie and macro targets based on your body stats and goal.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-4 w-4 text-primary" /> Your Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" placeholder="75" value={form.weightKg} onChange={set("weightKg")} data-testid="input-weight" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" placeholder="175" value={form.heightCm} onChange={set("heightCm")} data-testid="input-height" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="25" value={form.ageYears} onChange={set("ageYears")} data-testid="input-age" />
              </div>
              <div className="space-y-1.5">
                <Label>Sex</Label>
                <Select value={form.sex} onValueChange={setSelect("sex")}>
                  <SelectTrigger data-testid="select-sex"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Activity Level</Label>
              <Select value={form.activityLevel} onValueChange={setSelect("activityLevel")}>
                <SelectTrigger data-testid="select-activity"><SelectValue placeholder="How active are you?" /></SelectTrigger>
                <SelectContent>
                  {activityOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Goal</Label>
              <Select value={form.goal} onValueChange={setSelect("goal")}>
                <SelectTrigger data-testid="select-goal"><SelectValue placeholder="What is your goal?" /></SelectTrigger>
                <SelectContent>
                  {goalOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
              disabled={!isValid || calculateTdee.isPending}
              data-testid="button-calculate"
            >
              {calculateTdee.isPending ? "Calculating..." : "Calculate My Numbers"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Calorie Targets */}
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-4 w-4 text-orange-500" /> Your Calorie Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-muted/40 rounded-xl">
                  <div className="text-xs text-muted-foreground mb-1">BMR</div>
                  <div className="text-xl font-bold" data-testid="text-bmr">{result.bmr}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
                <div className="text-center p-3 bg-muted/40 rounded-xl">
                  <div className="text-xs text-muted-foreground mb-1">TDEE</div>
                  <div className="text-xl font-bold" data-testid="text-tdee">{result.tdee}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="text-xs text-primary mb-1 font-medium">Target</div>
                  <div className="text-xl font-bold text-primary" data-testid="text-target">{result.targetCalories}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <div className="text-xl font-bold text-blue-600" data-testid="text-protein">{result.proteinG}g</div>
                  <div className="text-xs text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                  <div className="text-xl font-bold text-yellow-600" data-testid="text-carbs">{result.carbsG}g</div>
                  <div className="text-xs text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                  <div className="text-xl font-bold text-purple-600" data-testid="text-fat">{result.fatG}g</div>
                  <div className="text-xs text-muted-foreground">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BMI */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" /> Body Mass Index
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${bmiColor(result.bmiCategory)}`} data-testid="text-bmi">{result.bmi}</div>
                <div className={`text-sm font-medium mt-1 ${bmiColor(result.bmiCategory)}`}>{result.bmiCategory}</div>
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                <p>BMI is a simple screening measure. Combined with body composition metrics, it gives a basic picture of health risk relative to weight.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
