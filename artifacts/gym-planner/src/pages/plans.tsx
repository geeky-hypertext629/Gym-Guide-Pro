import { useState } from "react";
import { Link } from "wouter";
import { useListWorkoutPlans } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Target } from "lucide-react";
import { motion } from "framer-motion";

const LEVELS = ["all", "beginner", "intermediate", "advanced"];

const levelColor: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

const goalLabel: Record<string, string> = {
  strength: "Strength",
  hypertrophy: "Muscle Gain",
  fat_loss: "Fat Loss",
  endurance: "Endurance",
};

export default function Plans() {
  const [level, setLevel] = useState("all");
  const params = level !== "all" ? { level } : {};
  const { data: plans, isLoading } = useListWorkoutPlans(params);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-1">Workout Plans</h1>
        <p className="text-muted-foreground">Structured programs designed for every experience level.</p>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((l) => (
          <Button
            key={l}
            variant={level === l ? "default" : "outline"}
            size="sm"
            onClick={() => setLevel(l)}
            data-testid={`button-level-${l}`}
            className="capitalize"
          >
            {l === "all" ? "All Levels" : l}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <Link href={`/plans/${plan.id}`}>
                <Card data-testid={`card-plan-${plan.id}`} className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className={levelColor[plan.level] ?? ""}>{plan.level}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">{plan.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {plan.daysPerWeek} days/week
                      </span>
                      {plan.estimatedWeeks && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {plan.estimatedWeeks} weeks
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <Target className="h-3 w-3" />
                      {goalLabel[plan.goal] ?? plan.goal}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
