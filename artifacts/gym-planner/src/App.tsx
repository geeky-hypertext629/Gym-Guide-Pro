import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "./components/layout";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import MuscleMap from "./pages/muscle-map";
import MuscleExercises from "./pages/muscle-exercises";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
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
    <AuthProvider onLogout={() => queryClient.clear()}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route>
            <Layout>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/exercises" component={Exercises} />
                <Route path="/exercises/:id" component={ExerciseDetail} />
                <Route path="/plans" component={Plans} />
                <Route path="/plans/:id" component={PlanDetail} />
                <Route path="/log" component={() => <ProtectedRoute><Log /></ProtectedRoute>} />
                <Route path="/log/:id" component={() => <ProtectedRoute><LogDetail /></ProtectedRoute>} />
                <Route path="/progress" component={() => <ProtectedRoute><Progress /></ProtectedRoute>} />
                <Route path="/nutrition" component={Nutrition} />
                <Route path="/nutrition/:id" component={NutritionDetail} />
                <Route path="/calculator" component={CalcPage} />
                <Route path="/personalize" component={Personalize} />
                <Route path="/muscle-map" component={MuscleMap} />
                <Route path="/muscle-map/:slug" component={MuscleExercises} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          </Route>
        </Switch>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
