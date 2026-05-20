import { Link } from "wouter";
import { useGetStatsSummary, useListWorkoutLogs } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Play, Plus, Activity, Calendar, Trophy, Flame,
  Dumbbell, Apple, Calculator, TrendingUp, ChevronRight,
  Sparkles, ArrowRight, CheckCircle, Target
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  { icon: Dumbbell, label: "Exercise Library", desc: "28 exercises with muscle maps", href: "/exercises", color: "bg-blue-500/10 text-blue-600" },
  { icon: Target, label: "Workout Plans", desc: "Beginner to advanced programs", href: "/plans", color: "bg-purple-500/10 text-purple-600" },
  { icon: TrendingUp, label: "Progress Charts", desc: "Visualise strength gains over time", href: "/progress", color: "bg-emerald-500/10 text-emerald-600" },
  { icon: Apple, label: "Nutrition Guides", desc: "Goal-based macro targets", href: "/nutrition", color: "bg-orange-500/10 text-orange-600" },
  { icon: Calculator, label: "TDEE Calculator", desc: "Personalised calorie & macro targets", href: "/calculator", color: "bg-rose-500/10 text-rose-600" },
];

const statConfig = [
  { key: "workoutsThisWeek", label: "Workouts This Week", icon: Activity, color: "text-primary", bg: "bg-primary/10", unit: "" },
  { key: "currentStreakDays", label: "Current Streak", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", unit: "days" },
  { key: "totalVolumeKg", label: "Total Volume", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10", unit: "kg", format: true },
  { key: "totalSets", label: "Total Sets", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", unit: "" },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStatsSummary();
  const { data: logs, isLoading: logsLoading } = useListWorkoutLogs();

  const recentLogs = logs?.slice().reverse().slice(0, 4) ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-4">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-emerald-700 p-8 md:p-10 text-white shadow-xl shadow-primary/20"
      >
        {/* decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-64 rounded-full bg-black/10 blur-2xl" />
        </div>
        <div className="relative">
          <Badge className="bg-white/20 text-white border-0 mb-4 text-xs font-semibold tracking-widest uppercase hover:bg-white/20">
            <Sparkles className="h-3 w-3 mr-1" /> Your Fitness HQ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">
            Welcome back.<br className="hidden sm:block" /> Let's get moving.
          </h1>
          <p className="text-white/80 text-lg mb-7 max-w-md">
            Track your workouts, follow structured plans, and hit your goals — all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/log">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg h-12 px-6">
                <Play className="mr-2 h-5 w-5" /> Start Workout
              </Button>
            </Link>
            <Link href="/personalize">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/15 font-semibold h-12 px-6 bg-white/10">
                <Sparkles className="mr-2 h-4 w-4" /> Get My Plan
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((cfg, idx) => {
          const Icon = cfg.icon;
          const raw = stats?.[cfg.key as keyof typeof stats] as number | undefined;
          const value = cfg.format ? (raw ?? 0).toLocaleString() : String(raw ?? 0);
          return (
            <motion.div
              key={cfg.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.07 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground">{cfg.label}</p>
                    <div className={cn("p-2 rounded-lg", cfg.bg)}>
                      <Icon className={cn("h-4 w-4", cfg.color)} />
                    </div>
                  </div>
                  {statsLoading
                    ? <Skeleton className="h-9 w-20" />
                    : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold tracking-tight">{value}</span>
                        {cfg.unit && <span className="text-sm text-muted-foreground">{cfg.unit}</span>}
                      </div>
                    )
                  }
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Personalized Plan CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/personalize">
          <div className="group relative overflow-hidden rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all p-5 cursor-pointer">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0 p-3 rounded-xl bg-primary/15">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-base">Get a Personalised Workout Plan</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Answer a few questions about your goals and experience — we'll recommend the perfect program.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Recent Activity + Features side-by-side */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Recent Activity */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <Link href="/log">
              <Button variant="ghost" size="sm" className="text-primary h-8 text-xs">View all <ChevronRight className="h-3.5 w-3.5 ml-0.5" /></Button>
            </Link>
          </div>
          {logsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed text-muted-foreground text-center">
              <Dumbbell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm font-medium">No workouts yet</p>
              <p className="text-xs mt-1">Hit "Start Workout" to log your first session.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log, i) => (
                <motion.div key={log.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/log/${log.id}`}>
                    <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
                      <CardContent className="p-3.5 flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg shrink-0", log.status === "completed" ? "bg-green-500/10" : "bg-yellow-500/10")}>
                          {log.status === "completed"
                            ? <CheckCircle className="h-4 w-4 text-green-500" />
                            : <Activity className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">
                            {new Date(log.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn("text-xs font-medium", log.status === "completed" ? "text-green-600" : "text-yellow-600")}>
                              {log.status === "completed" ? "Completed" : "In Progress"}
                            </span>
                            {log.durationMinutes && <span className="text-xs text-muted-foreground">· {log.durationMinutes} min</span>}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Shortcuts */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xl font-bold tracking-tight">Explore</h2>
          <div className="space-y-2">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.href}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06 }}
                >
                  <Link href={f.href}>
                    <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
                      <CardContent className="p-3.5 flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg shrink-0", f.color.split(" ")[0])}>
                          <Icon className={cn("h-4 w-4", f.color.split(" ")[1])} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{f.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{f.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
