import { useState } from "react";
import { useListWorkoutLogs, useGetExerciseProgress, useListExercises, getGetExerciseProgressQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Progress() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  const { data: logs, isLoading: logsLoading } = useListWorkoutLogs();
  const { data: exercises } = useListExercises({});
  const exerciseIdNum = selectedExerciseId ? parseInt(selectedExerciseId) : 0;
  const { data: progressData, isLoading: progressLoading } = useGetExerciseProgress(exerciseIdNum, {
    query: { enabled: !!exerciseIdNum, queryKey: getGetExerciseProgressQueryKey(exerciseIdNum) },
  });

  const completedLogs = logs?.filter((l) => l.status === "completed") ?? [];

  const chartData = progressData?.map((p) => ({
    date: new Date(p.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: p.bestWeightKg ?? 0,
    reps: p.totalReps,
  })) ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-1">Progress</h1>
        <p className="text-muted-foreground">Track how you improve over time.</p>
      </div>

      {/* Exercise Progress Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Exercise Progress
            </CardTitle>
            <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
              <SelectTrigger className="w-52" data-testid="select-exercise-progress">
                <SelectValue placeholder="Choose an exercise..." />
              </SelectTrigger>
              <SelectContent>
                {exercises?.map((ex) => (
                  <SelectItem key={ex.id} value={String(ex.id)}>{ex.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedExerciseId ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              Select an exercise to see your progression chart.
            </div>
          ) : progressLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No data yet for this exercise. Start logging to track progress.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="kg" />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`${value} kg`, "Best Weight"]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 71%, 45%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <div>
        <h2 className="text-xl font-bold mb-3">Completed Sessions</h2>
        {logsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : completedLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
            <p>No completed sessions yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {completedLogs.slice().reverse().map((log) => (
              <Card key={log.id} data-testid={`card-session-${log.id}`} className="border-l-4 border-l-green-500">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <div className="font-medium">
                        {new Date(log.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                      </div>
                      {log.durationMinutes && (
                        <div className="text-sm text-muted-foreground">{log.durationMinutes} min</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
