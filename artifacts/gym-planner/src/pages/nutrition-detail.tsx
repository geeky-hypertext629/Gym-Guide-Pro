import { useRoute, Link } from "wouter";
import { useGetNutritionGuide, getGetNutritionGuideQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, CheckCircle, UtensilsCrossed, Clock } from "lucide-react";
import { motion } from "framer-motion";

const goalColor: Record<string, string> = {
  muscle_gain: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  fat_loss: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  maintenance: "bg-green-500/10 text-green-600 border-green-500/20",
  endurance: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const goalLabel: Record<string, string> = {
  muscle_gain: "Muscle Gain",
  fat_loss: "Fat Loss",
  maintenance: "Maintenance",
  endurance: "Endurance",
};

export default function NutritionDetail() {
  const [, params] = useRoute("/nutrition/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: guide, isLoading } = useGetNutritionGuide(id, { query: { enabled: !!id, queryKey: getGetNutritionGuideQueryKey(id) } });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Guide not found.</p>
        <Link href="/nutrition"><Button variant="outline" className="mt-4">Back to Nutrition</Button></Link>
      </div>
    );
  }

  const sampleMeals = (guide.sampleMeals as Array<{ name: string; time: string; foods: string[]; calories?: number }>) ?? [];
  const tips = (guide.tips as string[]) ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <Link href="/nutrition">
        <Button variant="ghost" size="sm" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </Link>

      <div>
        <Badge variant="outline" className={`mb-2 ${goalColor[guide.goal] ?? ""}`}>{goalLabel[guide.goal] ?? guide.goal}</Badge>
        <h1 className="text-4xl font-bold tracking-tight" data-testid="text-guide-name">{guide.name}</h1>
        {guide.description && <p className="text-muted-foreground mt-2">{guide.description}</p>}
      </div>

      {/* Macros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="h-4 w-4 text-orange-500" /> Daily Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-muted/40 rounded-xl">
              <div className="text-2xl font-bold">{guide.calories}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Calories</div>
            </div>
            <div className="text-center p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <div className="text-2xl font-bold text-blue-600">{guide.proteinG}g</div>
              <div className="text-xs text-muted-foreground mt-0.5">Protein</div>
            </div>
            <div className="text-center p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
              <div className="text-2xl font-bold text-yellow-600">{guide.carbsG}g</div>
              <div className="text-xs text-muted-foreground mt-0.5">Carbs</div>
            </div>
            <div className="text-center p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
              <div className="text-2xl font-bold text-purple-600">{guide.fatG}g</div>
              <div className="text-xs text-muted-foreground mt-0.5">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Meal Plan */}
      {sampleMeals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" /> Sample Day of Eating
          </h2>
          <div className="space-y-3">
            {sampleMeals.map((meal, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <Card data-testid={`card-meal-${idx}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{meal.name}</div>
                      <div className="flex items-center gap-2">
                        {meal.calories && <span className="text-xs font-medium text-orange-500">{meal.calories} kcal</span>}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />{meal.time}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {meal.foods.map((food, fi) => (
                        <li key={fi} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Key Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm" data-testid={`tip-${idx}`}>
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
