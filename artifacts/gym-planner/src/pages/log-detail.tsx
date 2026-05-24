import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import {
  useGetWorkoutLog,
  useUpdateWorkoutLog,
  useDeleteWorkoutLog,
  useAddSet,
  useDeleteSet,
  useListExercises,
  getGetWorkoutLogQueryKey,
  getListWorkoutLogsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function LogDetail() {
  const [, params] = useRoute("/log/:id");
  const [, setLocation] = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logId = (params?.id ?? "") as any;
  const queryClient = useQueryClient();

  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: log, isLoading } = useGetWorkoutLog(logId, { query: { enabled: !!logId, queryKey: getGetWorkoutLogQueryKey(logId as any) } });
  const { data: exercises } = useListExercises({});

  const updateLog = useUpdateWorkoutLog();
  const deleteLog = useDeleteWorkoutLog();
  const addSet = useAddSet();
  const deleteSet = useDeleteSet();

  const invalidate = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryClient.invalidateQueries({ queryKey: getGetWorkoutLogQueryKey(logId as any) });
    queryClient.invalidateQueries({ queryKey: getListWorkoutLogsQueryKey() });
  };

  const handleMarkComplete = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateLog.mutate(
      { id: logId, data: { status: "completed" } },
      { onSuccess: invalidate }
    );
  };

  const handleDelete = () => {
    if (!confirm("Delete this workout session?")) return;
    deleteLog.mutate(
      { id: logId },
      { onSuccess: () => setLocation("/log") }
    );
  };

  const handleAddSet = () => {
    if (!selectedExerciseId || !reps) return;
    const setNumber = (log?.sets?.filter((s) => s.exerciseId === (selectedExerciseId as any)).length ?? 0) + 1;

    addSet.mutate(
      {
        id: logId,
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exerciseId: selectedExerciseId as any,
          setNumber,
          reps: parseInt(reps),
          ...(weight ? { weightKg: parseFloat(weight) } : {}),
        },
      },
      {
        onSuccess: () => {
          invalidate();
          setReps("");
          setWeight("");
        },
      }
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteSet = (setId: any) => {
    deleteSet.mutate(
      { logId, setId },
      { onSuccess: invalidate }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Session not found.</p>
        <Link href="/log"><Button variant="outline" className="mt-4">Back to Log</Button></Link>
      </div>
    );
  }

  // Group sets by exercise
  const setsByExercise: Record<string, { name: string; sets: typeof log.sets }> = {};
  for (const s of log.sets ?? []) {
    const exId = String(s.exerciseId);
    if (!setsByExercise[exId]) setsByExercise[exId] = { name: s.exerciseName, sets: [] };
    setsByExercise[exId].sets.push(s);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/log">
          <Button variant="ghost" size="sm" data-testid="button-back"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {new Date(log.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={log.status === "completed" ? "border-green-500/30 text-green-600" : "border-yellow-500/30 text-yellow-600"}>
              {log.status === "completed" ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
              {log.status === "completed" ? "Completed" : "In Progress"}
            </Badge>
            {log.durationMinutes && <span className="text-sm text-muted-foreground">{log.durationMinutes} min</span>}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {log.status !== "completed" && (
            <Button size="sm" onClick={handleMarkComplete} disabled={updateLog.isPending} data-testid="button-complete">
              <CheckCircle className="h-4 w-4 mr-1" /> Complete
            </Button>
          )}
          <Button size="sm" variant="destructive" onClick={handleDelete} data-testid="button-delete-log">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Set */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Log a Set</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger data-testid="select-exercise">
              <SelectValue placeholder="Select exercise..." />
            </SelectTrigger>
            <SelectContent>
              {exercises?.map((ex) => (
                <SelectItem key={ex.id} value={String(ex.id)}>{ex.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              placeholder="Reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-24"
              data-testid="input-reps"
            />
            <Input
              placeholder="Weight (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1"
              data-testid="input-weight"
            />
            <Button
              onClick={handleAddSet}
              disabled={!selectedExerciseId || !reps || addSet.isPending}
              data-testid="button-add-set"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sets by exercise */}
      {Object.keys(setsByExercise).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
          <p className="text-sm">No sets logged yet. Add your first set above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(setsByExercise).map(([exId, group]) => (
            <Card key={exId} data-testid={`card-exercise-sets-${exId}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground border-b">
                      <th className="text-left pb-2 font-medium w-12">Set</th>
                      <th className="text-left pb-2 font-medium">Reps</th>
                      <th className="text-left pb-2 font-medium">Weight</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sets.map((s) => (
                      <tr key={s.id} className="border-b last:border-0" data-testid={`row-set-${s.id}`}>
                        <td className="py-2 text-muted-foreground">{s.setNumber}</td>
                        <td className="py-2 font-medium">{s.reps}</td>
                        <td className="py-2">{s.weightKg != null ? `${s.weightKg} kg` : <span className="text-muted-foreground">bodyweight</span>}</td>
                        <td className="py-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteSet(s.id)}
                            data-testid={`button-delete-set-${s.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
