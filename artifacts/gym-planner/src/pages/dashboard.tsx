import { Link } from "wouter";
import { useGetStatsSummary, useListWorkoutLogs } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Plus, Activity, Calendar, Trophy, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStatsSummary();
  const { data: logs, isLoading: logsLoading } = useListWorkoutLogs();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back.</h1>
        <p className="text-muted-foreground text-lg">Ready to crush your goals today?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workouts This Week</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.workoutsThisWeek ?? 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.currentStreakDays ?? 0} <span className="text-sm font-normal text-muted-foreground">days</span></div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.totalVolumeKg?.toLocaleString() ?? 0} <span className="text-sm font-normal text-muted-foreground">kg</span></div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sets</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold">{stats?.totalSets ?? 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <Link href="/log" className="flex-1">
          <Button size="lg" className="w-full text-lg h-16 font-semibold shadow-lg shadow-primary/20">
            <Play className="mr-2 h-6 w-6" /> Start Workout
          </Button>
        </Link>
        <Link href="/plans" className="flex-1">
          <Button size="lg" variant="outline" className="w-full text-lg h-16 font-semibold">
            <Plus className="mr-2 h-6 w-6" /> Browse Plans
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
        {logsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {logs?.slice(0, 5).map((log) => (
              <Link key={log.id} href={`/log/${log.id}`}>
                <Card className="hover:bg-accent/5 transition-colors cursor-pointer border-l-4 border-l-primary">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", 
                          log.status === "completed" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {log.status === "completed" ? "Completed" : "In Progress"}
                        </span>
                        {log.durationMinutes && <span>• {log.durationMinutes} min</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {logs?.length === 0 && (
              <div className="text-center p-8 bg-muted/20 rounded-lg text-muted-foreground">
                No recent workouts found. Time to hit the gym!
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Simple cn utility local
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
