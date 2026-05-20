import { useState } from "react";
import { Link } from "wouter";
import { useListWorkoutPlans } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, ArrowLeft, CheckCircle, Target,
  Calendar, Dumbbell, ChevronRight, User, Flame, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ── */
type Goal = "muscle_gain" | "fat_loss" | "strength" | "general_fitness";
type Level = "beginner" | "intermediate" | "advanced";
type Days = "2_3" | "4_5" | "6_plus";
type Equipment = "full_gym" | "dumbbells" | "bodyweight";

interface Answers {
  goal: Goal | "";
  level: Level | "";
  days: Days | "";
  equipment: Equipment | "";
  age: string;
}

/* ── Static step options ── */
const goalOptions: { value: Goal; label: string; desc: string; icon: string }[] = [
  { value: "muscle_gain", label: "Build Muscle", desc: "Gain size and definition", icon: "💪" },
  { value: "fat_loss", label: "Lose Fat", desc: "Burn fat, stay lean", icon: "🔥" },
  { value: "strength", label: "Get Stronger", desc: "Increase your lifts", icon: "🏋️" },
  { value: "general_fitness", label: "General Fitness", desc: "Stay healthy and active", icon: "⚡" },
];

const levelOptions: { value: Level; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "Less than 1 year of training" },
  { value: "intermediate", label: "Intermediate", desc: "1–3 years of consistent training" },
  { value: "advanced", label: "Advanced", desc: "3+ years, solid technique" },
];

const daysOptions: { value: Days; label: string; desc: string }[] = [
  { value: "2_3", label: "2–3 days", desc: "Ideal for full-body sessions" },
  { value: "4_5", label: "4–5 days", desc: "Great for split training" },
  { value: "6_plus", label: "6+ days", desc: "High-frequency programs" },
];

const equipmentOptions: { value: Equipment; label: string; desc: string; icon: string }[] = [
  { value: "full_gym", label: "Full Gym", desc: "Barbells, machines, cables", icon: "🏢" },
  { value: "dumbbells", label: "Dumbbells / Home", desc: "Limited equipment at home", icon: "🏠" },
  { value: "bodyweight", label: "Bodyweight Only", desc: "No equipment needed", icon: "🧘" },
];

/* ── Recommendation logic ── */
function recommend(answers: Answers, plans: { id: number; name: string; level: string; goal: string; daysPerWeek: number; description?: string | null; estimatedWeeks?: number | null }[]) {
  const { goal, level, days, equipment } = answers;

  // score each plan
  const scored = plans.map((plan) => {
    let score = 0;

    // Level match
    if (plan.level === level) score += 30;
    else if (
      (level === "intermediate" && plan.level === "beginner") ||
      (level === "advanced" && plan.level === "intermediate")
    ) score += 10;

    // Goal match
    const goalMatch: Record<Goal, string[]> = {
      muscle_gain: ["hypertrophy", "muscle_gain"],
      fat_loss: ["fat_loss", "endurance"],
      strength: ["strength"],
      general_fitness: ["strength", "hypertrophy", "fat_loss"],
    };
    if (goal && goalMatch[goal as Goal]?.includes(plan.goal)) score += 25;

    // Days match
    const daysMap: Record<Days, [number, number]> = { "2_3": [2, 3], "4_5": [4, 5], "6_plus": [6, 7] };
    if (days) {
      const [min, max] = daysMap[days as Days];
      if (plan.daysPerWeek >= min && plan.daysPerWeek <= max) score += 20;
    }

    // Equipment penalty for bodyweight-only people
    if (equipment === "bodyweight" && plan.name.toLowerCase().includes("strength")) score -= 15;
    if (equipment === "bodyweight" && plan.name.toLowerCase().includes("ppl")) score -= 10;

    return { plan, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/* ── Step Indicator ── */
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all",
            i === current ? "w-6 h-2 bg-primary" : i < current ? "w-2 h-2 bg-primary/40" : "w-2 h-2 bg-muted"
          )}
        />
      ))}
    </div>
  );
}

/* ── Option Card ── */
function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border-2 transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border hover:border-primary/40 hover:bg-muted/30"
      )}
    >
      {children}
      {selected && (
        <CheckCircle className="absolute top-3 right-3 h-4 w-4 text-primary" />
      )}
    </button>
  );
}

/* ── Main Component ── */
const TOTAL_STEPS = 5; // goal, level, days, equipment, age(optional)

export default function Personalize() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ goal: "", level: "", days: "", equipment: "", age: "" });
  const [showResult, setShowResult] = useState(false);

  const { data: plans } = useListWorkoutPlans({});

  const set = <K extends keyof Answers>(key: K, val: Answers[K]) =>
    setAnswers((a) => ({ ...a, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!answers.goal;
    if (step === 1) return !!answers.level;
    if (step === 2) return !!answers.days;
    if (step === 3) return !!answers.equipment;
    return true; // age is optional
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else setShowResult(true);
  };
  const back = () => {
    if (showResult) { setShowResult(false); return; }
    setStep((s) => Math.max(0, s - 1));
  };

  const scored = plans ? recommend(answers, plans) : [];
  const top = scored[0]?.plan;
  const alternatives = scored.slice(1);

  const levelColor: Record<string, string> = {
    beginner: "bg-green-500/10 text-green-600 border-green-500/20",
    intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    advanced: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const stepContent = [
    /* Step 0 – Goal */
    {
      title: "What's your primary goal?",
      subtitle: "We'll tailor your program around this.",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((o) => (
            <div key={o.value} className="relative">
              <OptionCard selected={answers.goal === o.value} onClick={() => set("goal", o.value)}>
                <div className="text-2xl mb-2">{o.icon}</div>
                <p className="font-semibold text-sm">{o.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
              </OptionCard>
            </div>
          ))}
        </div>
      ),
    },
    /* Step 1 – Level */
    {
      title: "What's your experience level?",
      subtitle: "Be honest — it helps us match you better.",
      content: (
        <div className="space-y-3">
          {levelOptions.map((o) => (
            <div key={o.value} className="relative">
              <OptionCard selected={answers.level === o.value} onClick={() => set("level", o.value)}>
                <p className="font-semibold text-sm">{o.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
              </OptionCard>
            </div>
          ))}
        </div>
      ),
    },
    /* Step 2 – Days */
    {
      title: "How many days per week can you train?",
      subtitle: "Pick what's realistic and sustainable for you.",
      content: (
        <div className="space-y-3">
          {daysOptions.map((o) => (
            <div key={o.value} className="relative">
              <OptionCard selected={answers.days === o.value} onClick={() => set("days", o.value)}>
                <p className="font-semibold text-sm">{o.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
              </OptionCard>
            </div>
          ))}
        </div>
      ),
    },
    /* Step 3 – Equipment */
    {
      title: "What equipment do you have access to?",
      subtitle: "This helps us recommend the right exercises.",
      content: (
        <div className="grid grid-cols-1 gap-3">
          {equipmentOptions.map((o) => (
            <div key={o.value} className="relative">
              <OptionCard selected={answers.equipment === o.value} onClick={() => set("equipment", o.value)}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{o.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{o.label}</p>
                    <p className="text-xs text-muted-foreground">{o.desc}</p>
                  </div>
                </div>
              </OptionCard>
            </div>
          ))}
        </div>
      ),
    },
    /* Step 4 – Age (optional) */
    {
      title: "How old are you? (Optional)",
      subtitle: "Age helps us fine-tune recovery and intensity recommendations.",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border-2 border-border focus-within:border-primary transition-colors overflow-hidden">
            <span className="pl-4 text-muted-foreground">
              <User className="h-4 w-4" />
            </span>
            <input
              type="number"
              min={13}
              max={99}
              placeholder="Enter your age..."
              value={answers.age}
              onChange={(e) => set("age", e.target.value)}
              className="flex-1 py-4 pr-4 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              data-testid="input-age"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">You can skip this — just click "Get My Plan"</p>
        </div>
      ),
    },
  ];

  if (showResult && top) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={back} data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>

        {/* Result header */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Your Perfect Plan</h1>
          <p className="text-muted-foreground">Based on your answers, here's what we recommend.</p>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {answers.goal && (
            <Badge variant="secondary" className="capitalize px-3 py-1 text-xs font-medium">
              <Target className="h-3 w-3 mr-1" />
              {goalOptions.find((g) => g.value === answers.goal)?.label}
            </Badge>
          )}
          {answers.level && (
            <Badge variant="secondary" className="capitalize px-3 py-1 text-xs font-medium">
              <User className="h-3 w-3 mr-1" />
              {answers.level}
            </Badge>
          )}
          {answers.days && (
            <Badge variant="secondary" className="capitalize px-3 py-1 text-xs font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              {daysOptions.find((d) => d.value === answers.days)?.label}
            </Badge>
          )}
          {answers.equipment && (
            <Badge variant="secondary" className="capitalize px-3 py-1 text-xs font-medium">
              <Dumbbell className="h-3 w-3 mr-1" />
              {equipmentOptions.find((e) => e.value === answers.equipment)?.label}
            </Badge>
          )}
        </div>

        {/* Top pick */}
        <Card className="border-primary/30 shadow-lg shadow-primary/5 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/90 to-emerald-600 px-6 py-3">
            <p className="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Top Recommendation
            </p>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="outline" className={`mb-2 ${levelColor[top.level] ?? ""}`}>{top.level}</Badge>
                <h2 className="text-2xl font-bold">{top.name}</h2>
                {top.description && <p className="text-sm text-muted-foreground mt-1">{top.description}</p>}
              </div>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {top.daysPerWeek} training days/week
              </span>
              {top.estimatedWeeks && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {top.estimatedWeeks} weeks
                </span>
              )}
            </div>
            <Link href={`/plans/${top.id}`} className="block">
              <Button className="w-full h-12 font-bold shadow-lg shadow-primary/20" data-testid="button-view-plan">
                View Full Plan <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Personalised tips */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" /> Personalised Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {[
                answers.level === "beginner" && "Focus on learning the movement patterns — technique matters more than weight right now.",
                answers.goal === "fat_loss" && "Pair your training with a calorie deficit. Check the Nutrition Guides for a fat-loss meal plan.",
                answers.goal === "muscle_gain" && "Eat in a slight calorie surplus with high protein. Use the TDEE Calculator to find your exact targets.",
                answers.goal === "strength" && "Prioritise compound lifts (squat, deadlift, bench, row) and progressive overload each week.",
                answers.days === "2_3" && "With fewer sessions, full-body workouts maximise your training frequency per muscle group.",
                answers.days === "6_plus" && "At high frequency, recovery is key — sleep 7–9 hours and manage stress.",
                answers.equipment === "bodyweight" && "Bodyweight training builds serious strength. Master push variations, pull-ups, dips, and single-leg work.",
                answers.level === "advanced" && "Track your sets, reps, and weights every session to spot weak points and drive continued progress.",
              ]
                .filter(Boolean)
                .slice(0, 4)
                .map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        {/* Alternative plans */}
        {alternatives.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Other Plans to Consider</p>
            {alternatives.map(({ plan }) => (
              <Link key={plan.id} href={`/plans/${plan.id}`}>
                <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <Badge variant="outline" className={`text-xs mb-1 ${levelColor[plan.level] ?? ""}`}>{plan.level}</Badge>
                      <p className="font-semibold text-sm">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.daysPerWeek} days/week</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Restart */}
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStep(0); setAnswers({ goal: "", level: "", days: "", equipment: "", age: "" }); setShowResult(false); }}
            data-testid="button-restart"
          >
            Start over
          </Button>
        </div>
      </motion.div>
    );
  }

  const current = stepContent[step];

  return (
    <div className="max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <Button variant="ghost" size="sm" onClick={back} data-testid="button-back-step">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        ) : (
          <Link href="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Button>
          </Link>
        )}
        <div className="flex-1" />
        <StepDots total={TOTAL_STEPS} current={step} />
        <span className="text-xs text-muted-foreground">{step + 1} / {TOTAL_STEPS}</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Plan Finder</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{current.title}</h1>
        <p className="text-muted-foreground mt-1">{current.subtitle}</p>
      </div>

      {/* Step content with slide animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
        >
          {current.content}
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <Button
        size="lg"
        className="w-full h-12 font-bold shadow-lg shadow-primary/20"
        onClick={next}
        disabled={!canNext()}
        data-testid={step === TOTAL_STEPS - 1 ? "button-get-plan" : "button-next"}
      >
        {step === TOTAL_STEPS - 1 ? (
          <><Sparkles className="mr-2 h-5 w-5" /> Get My Plan</>
        ) : (
          <>Continue <ArrowRight className="ml-2 h-5 w-5" /></>
        )}
      </Button>
    </div>
  );
}
