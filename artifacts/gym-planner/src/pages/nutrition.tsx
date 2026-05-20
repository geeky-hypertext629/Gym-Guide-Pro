import { Link } from "wouter";
import { useListNutritionGuides } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Flame } from "lucide-react";
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

export default function Nutrition() {
  const { data: guides, isLoading } = useListNutritionGuides();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-1">Nutrition Guides</h1>
        <p className="text-muted-foreground">Diet plans tailored to your goal — from bulking to cutting to performance.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {guides?.map((guide, idx) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link href={`/nutrition/${guide.id}`}>
                <Card data-testid={`card-guide-${guide.id}`} className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className={goalColor[guide.goal] ?? ""}>{goalLabel[guide.goal] ?? guide.goal}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-xl mt-2 group-hover:text-primary transition-colors">{guide.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 bg-muted/40 rounded-lg">
                        <Flame className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                        <div className="text-sm font-bold">{guide.calories}</div>
                        <div className="text-xs text-muted-foreground">kcal</div>
                      </div>
                      <div className="text-center p-2 bg-blue-500/5 rounded-lg">
                        <div className="text-sm font-bold text-blue-600">{guide.proteinG}g</div>
                        <div className="text-xs text-muted-foreground">Protein</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-500/5 rounded-lg">
                        <div className="text-sm font-bold text-yellow-600">{guide.carbsG}g</div>
                        <div className="text-xs text-muted-foreground">Carbs</div>
                      </div>
                      <div className="text-center p-2 bg-purple-500/5 rounded-lg">
                        <div className="text-sm font-bold text-purple-600">{guide.fatG}g</div>
                        <div className="text-xs text-muted-foreground">Fat</div>
                      </div>
                    </div>
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
