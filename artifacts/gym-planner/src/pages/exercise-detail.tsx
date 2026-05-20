import { useRoute, Link } from "wouter";
import { useGetExercise, getGetExerciseQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Clock, Repeat, Layers } from "lucide-react";
import { motion } from "framer-motion";

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ExerciseDetail() {
  const [, params] = useRoute("/exercises/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: ex, isLoading } = useGetExercise(id, { query: { enabled: !!id, queryKey: getGetExerciseQueryKey(id) } });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!ex) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Exercise not found.</p>
        <Link href="/exercises"><Button variant="outline" className="mt-4">Back to Library</Button></Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/exercises">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className={difficultyColor[ex.difficulty] ?? ""}>{ex.difficulty}</Badge>
          <Badge variant="outline">{ex.equipment}</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight" data-testid="text-exercise-name">{ex.name}</h1>
        {ex.description && <p className="text-muted-foreground mt-2 text-lg">{ex.description}</p>}
      </div>

      {/* Prescription */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center gap-1">
            <Layers className="h-5 w-5 text-primary mb-1" />
            <div className="text-2xl font-bold">{ex.sets ?? "—"}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Sets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center gap-1">
            <Repeat className="h-5 w-5 text-primary mb-1" />
            <div className="text-2xl font-bold">
              {ex.repsMin
                ? `${ex.repsMin}${ex.repsMax && ex.repsMax !== ex.repsMin ? `–${ex.repsMax}` : ""}`
                : "—"}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Reps</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center gap-1">
            <Clock className="h-5 w-5 text-primary mb-1" />
            <div className="text-2xl font-bold">{ex.restSeconds ? `${ex.restSeconds}s` : "—"}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Rest</div>
          </CardContent>
        </Card>
      </div>

      {/* Muscles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-primary" /> Muscles Worked</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ex.primaryMuscles?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Primary</p>
              <div className="flex flex-wrap gap-2">
                {ex.primaryMuscles.map((m) => (
                  <span key={m.id} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium" data-testid={`badge-primary-muscle-${m.id}`}>
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(ex.secondaryMuscles?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Secondary</p>
              <div className="flex flex-wrap gap-2">
                {ex.secondaryMuscles?.map((m) => (
                  <span key={m.id} className="bg-muted text-muted-foreground border px-3 py-1 rounded-full text-sm" data-testid={`badge-secondary-muscle-${m.id}`}>
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      {ex.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How to Perform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-instructions">{ex.instructions}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
