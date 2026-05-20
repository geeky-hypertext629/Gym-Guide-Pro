import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "./components/layout";
import Dashboard from "./pages/dashboard";
import Exercises from "./pages/exercises";
import ExerciseDetail from "./pages/exercise-detail";
import Plans from "./pages/plans";
import PlanDetail from "./pages/plan-detail";
import Log from "./pages/log";
import LogDetail from "./pages/log-detail";
import Progress from "./pages/progress";
import Nutrition from "./pages/nutrition";
import NutritionDetail from "./pages/nutrition-detail";
import CalcPage from "./pages/calculator";
import Personalize from "./pages/personalize";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/exercises" component={Exercises} />
          <Route path="/exercises/:id" component={ExerciseDetail} />
          <Route path="/plans" component={Plans} />
          <Route path="/plans/:id" component={PlanDetail} />
          <Route path="/log" component={Log} />
          <Route path="/log/:id" component={LogDetail} />
          <Route path="/progress" component={Progress} />
          <Route path="/nutrition" component={Nutrition} />
          <Route path="/nutrition/:id" component={NutritionDetail} />
          <Route path="/calculator" component={CalcPage} />
          <Route path="/personalize" component={Personalize} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}
