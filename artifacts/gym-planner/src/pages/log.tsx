import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListWorkoutLogs, useCreateWorkoutLog, getListWorkoutLogsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Log() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: logs, isLoading } = useListWorkoutLogs();
  const createLog = useCreateWorkoutLog();

  const handleStart = async () => {
    const today = new Date().toISOString().split("T")[0];
    createLog.mutate(
      { data: { date: today } },
      {
        onSuccess: (log) => {
          queryClient.invalidateQueries({ queryKey: getListWorkoutLogsQueryKey() });
          setLocation(`/log/${log.id}`);
        },
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">Workout Log</h1>
          <p className="text-muted-foreground">Track every session. Every set. Every rep.</p>
        </div>
        <Button
          size="lg"
          onClick={handleStart}
          disabled={createLog.isPending}
          data-testid="button-start-workout"
          className="shrink-0 shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          {createLog.isPending ? "Starting..." : "New Session"}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : logs?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No sessions yet</p>
          <p className="text-sm mb-4">Hit the button above to log your first workout.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs?.slice().reverse().map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link href={`/log/${log.id}`}>
                <Card data-testid={`card-log-${log.id}`} className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${log.status === "completed" ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                        {log.status === "completed"
                          ? <CheckCircle className="h-5 w-5 text-green-500" />
                          : <Clock className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {new Date(log.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${log.status === "completed" ? "border-green-500/30 text-green-600" : "border-yellow-500/30 text-yellow-600"}`}>
                            {log.status === "completed" ? "Completed" : "In Progress"}
                          </Badge>
                          {log.durationMinutes && <span>{log.durationMinutes} min</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
