import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useListExercises, useListMuscles, type Exercise } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Dumbbell, Layers, Repeat, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { getGifUrl } from "@/lib/exercise-gifs";
import { cn } from "@/lib/utils";

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-600 border-red-500/20",
};

const muscleDisplayNames: Record<string, string> = {
  "abs": "Abs",
  "biceps": "Biceps",
  "calves": "Calves",
  "chest": "Chest",
  "forearms": "Forearms",
  "glutes": "Glutes",
  "hamstrings": "Hamstrings",
  "lats": "Lats",
  "lower-back": "Lower Back",
  "mid-back": "Mid Back",
  "obliques": "Obliques",
  "quads": "Quads",
  "shoulders": "Shoulders",
  "traps": "Traps",
  "triceps": "Triceps",
};

// Map slugs to possible muscle DB names (fuzzy match)
const slugToMuscleNames: Record<string, string[]> = {
  "abs": ["Abs", "Rectus Abdominis"],
  "biceps": ["Biceps"],
  "calves": ["Calves", "Gastrocnemius"],
  "chest": ["Chest", "Pectorals"],
  "forearms": ["Forearms"],
  "glutes": ["Glutes", "Gluteus Maximus"],
  "hamstrings": ["Hamstrings"],
  "lats": ["Lats", "Latissimus Dorsi"],
  "lower-back": ["Lower Back", "Erector Spinae"],
  "mid-back": ["Mid Back", "Rhomboids", "Middle Back", "Upper Back"],
  "obliques": ["Obliques"],
  "quads": ["Quads", "Quadriceps"],
  "shoulders": ["Front Deltoid", "Side Deltoid", "Rear Deltoid", "Shoulders", "Deltoids"],
  "traps": ["Traps", "Trapezius"],
  "triceps": ["Triceps"],
};

/* ── GIF Card ─────────────────────────────────────────────────────────── */
function ExerciseGifCard({ ex }: { ex: Exercise }) {
  const gifUrl = getGifUrl(ex.name);
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/exercises/${ex.id}`}>
      <Card
        data-testid={`card-exercise-${ex.id}`}
        className="overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
      >
        {/* GIF area */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 h-52 flex items-center justify-center overflow-hidden">
          {gifUrl && !imgError ? (
            <img
              src={gifUrl}
              alt={`${ex.name} form`}
              className="h-full w-full object-contain"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Dumbbell className="h-10 w-10 opacity-30" />
              <span className="text-xs">No demo available</span>
            </div>
          )}

          {/* Difficulty badge */}
          <div className="absolute top-2 left-2">
            <Badge
              variant="outline"
              className={cn("text-[10px] font-semibold bg-white/90 dark:bg-black/70", difficultyColor[ex.difficulty])}
            >
              {ex.difficulty}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <CardContent className="p-4">
          <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-tight mb-1">
            {ex.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ex.description}</p>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs font-normal">{ex.equipment}</Badge>
            {ex.sets && (
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />{ex.sets} sets
              </span>
            )}
            {ex.repsMin && (
              <span className="flex items-center gap-1">
                <Repeat className="h-3 w-3" />
                {ex.repsMin}{ex.repsMax && ex.repsMax !== ex.repsMin ? `–${ex.repsMax}` : ""} reps
              </span>
            )}
            {ex.restSeconds && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />{ex.restSeconds}s rest
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ── Main page ────────────────────────────────────────────────────────── */
export default function MuscleExercises() {
  const [, params] = useRoute("/muscle-map/:slug");
  const slug = params?.slug ?? "";

  const displayName = muscleDisplayNames[slug] ?? slug;
  const possibleNames = slugToMuscleNames[slug] ?? [displayName];

  const { data: muscles } = useListMuscles();
  const { data: allExercises, isLoading } = useListExercises({});

  // Find all muscle IDs that match this slug (e.g. shoulders → 3 deltoid muscles)
  const matchedMuscles = muscles?.filter((m) =>
    possibleNames.some((n) => m.name.toLowerCase() === n.toLowerCase())
  ) ?? [];

  const matchedMuscleIds = new Set(matchedMuscles.map((m) => m.id));

  // Filter exercises: primary or secondary muscle matches any of the matched IDs
  const exercises = allExercises?.filter((ex) => {
    if (matchedMuscleIds.size > 0) {
      return (
        ex.primaryMuscles?.some((m) => matchedMuscleIds.has(m.id)) ||
        ex.secondaryMuscles?.some((m) => matchedMuscleIds.has(m.id))
      );
    }
    // Fallback: filter by primary muscle name
    return ex.primaryMuscles?.some((m) =>
      possibleNames.some((n) => m.name.toLowerCase() === n.toLowerCase())
    );
  }) ?? [];

  // Sort: exercises with GIFs first
  const sorted = [...exercises].sort((a, b) => {
    const aHas = !!getGifUrl(a.name);
    const bHas = !!getGifUrl(b.name);
    return aHas === bHas ? 0 : aHas ? -1 : 1;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/muscle-map">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-1" /> Muscle Map
          </Button>
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-4xl font-bold tracking-tight">{displayName}</h1>
          {matchedMuscles.length > 0 && (
            <Badge variant="outline" className="text-sm px-3">
              {sorted.length} exercise{sorted.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Click any exercise card for full details. GIFs show the correct movement form.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-52 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No exercises found for {displayName}</p>
          <Link href="/muscle-map">
            <Button variant="outline" className="mt-4">Back to Muscle Map</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((ex, idx) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <ExerciseGifCard ex={ex} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
