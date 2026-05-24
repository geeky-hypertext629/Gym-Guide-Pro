import { useRoute, Link } from "wouter";
import { useGetWorkoutPlan, getGetWorkoutPlanQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Target, Layers, Repeat } from "lucide-react";
import { motion } from "framer-motion";

const levelColor: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function PlanDetail() {
  const [, params] = useRoute("/plans/:id");
  const id = params?.id ?? "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: plan, isLoading } = useGetWorkoutPlan(id as any, { query: { enabled: !!id, queryKey: getGetWorkoutPlanQueryKey(id as any) } });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Plan not found.</p>
        <Link href="/plans"><Button variant="outline" className="mt-4">Back to Plans</Button></Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <Link href="/plans">
        <Button variant="ghost" size="sm" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className={levelColor[plan.level] ?? ""}>{plan.level}</Badge>
          <Badge variant="secondary"><Target className="h-3 w-3 mr-1" />{plan.goal}</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight" data-testid="text-plan-name">{plan.name}</h1>
        {plan.description && <p className="text-muted-foreground mt-2">{plan.description}</p>}
        <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{plan.daysPerWeek} training days/week</span>
          {plan.estimatedWeeks && <span>{plan.estimatedWeeks} weeks</span>}
        </div>
      </div>

      {/* Workout Days */}
      <div className="space-y-4">
        {plan.days?.map((day, dayIdx) => (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: dayIdx * 0.08 }}
          >
            <Card data-testid={`card-day-${day.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{day.name}</CardTitle>
                    {day.focus && <p className="text-sm text-muted-foreground mt-0.5">{day.focus}</p>}
                  </div>
                  <Badge variant="outline" className="text-xs">Day {day.dayNumber}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {day.exercises?.map((ex, exIdx) => (
                    <div key={ex.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3" data-testid={`row-exercise-${ex.id}`}>
                      <Link href={`/exercises/${ex.id}`} className="flex-1 min-w-0">
                        <span className="text-sm font-medium hover:text-primary transition-colors">{ex.name}</span>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                        {ex.sets && (
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" />{ex.sets} sets
                          </span>
                        )}
                        {ex.repsMin && (
                          <span className="flex items-center gap-1">
                            <Repeat className="h-3 w-3" />{ex.repsMin}{ex.repsMax && ex.repsMax !== ex.repsMin ? `–${ex.repsMax}` : ""} reps
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
