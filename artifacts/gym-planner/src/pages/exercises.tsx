import { useState } from "react";
import { Link } from "wouter";
import { useListExercises, useListMuscles } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Dumbbell, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";

const EQUIPMENT_OPTIONS = ["barbell", "dumbbell", "cable", "machine", "bodyweight", "kettlebell"];
const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"];

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function Exercises() {
  const [search, setSearch] = useState("");
  const [muscleId, setMuscleId] = useState<string>("");
  const [equipment, setEquipment] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");

  const params = {
    ...(search ? { search } : {}),
    ...(muscleId ? { muscleId: parseInt(muscleId) } : {}),
    ...(equipment ? { equipment } : {}),
    ...(difficulty ? { difficulty } : {}),
  };

  const { data: exercises, isLoading } = useListExercises(params);
  const { data: muscles } = useListMuscles();

  const hasFilters = !!(search || muscleId || equipment || difficulty);

  const clearFilters = () => {
    setSearch("");
    setMuscleId("");
    setEquipment("");
    setDifficulty("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-1">Exercise Library</h1>
        <p className="text-muted-foreground">Browse {exercises?.length ?? "..."} exercises by muscle, equipment, and difficulty.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="input-search"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={muscleId} onValueChange={setMuscleId}>
          <SelectTrigger className="w-full md:w-44" data-testid="select-muscle">
            <SelectValue placeholder="Muscle group" />
          </SelectTrigger>
          <SelectContent>
            {muscles?.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={equipment} onValueChange={setEquipment}>
          <SelectTrigger className="w-full md:w-40" data-testid="select-equipment">
            <SelectValue placeholder="Equipment" />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_OPTIONS.map((e) => (
              <SelectItem key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full md:w-40" data-testid="select-difficulty">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Exercise Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)}
        </div>
      ) : exercises?.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No exercises found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises?.map((ex, idx) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Link href={`/exercises/${ex.id}`}>
                <Card data-testid={`card-exercise-${ex.id}`} className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">{ex.name}</CardTitle>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors mt-0.5" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className={difficultyColor[ex.difficulty] ?? ""}>
                        {ex.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {ex.equipment}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{ex.description}</p>
                    {ex.primaryMuscles?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {ex.primaryMuscles.map((m) => (
                          <span key={m.id} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {m.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {ex.sets && ex.repsMin && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {ex.sets} sets × {ex.repsMin}{ex.repsMax && ex.repsMax !== ex.repsMin ? `–${ex.repsMax}` : ""} reps
                      </p>
                    )}
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
