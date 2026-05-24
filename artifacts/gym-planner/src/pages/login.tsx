import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, LogIn } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const redirectTo = search.get("from") ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
      navigate(redirectTo);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 rounded-xl bg-primary/10">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">GymGuide</h1>
          <p className="text-muted-foreground text-sm">Sign in to track your workouts</p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Enter your email and password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              {serverError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {serverError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LogIn className="mr-2 h-4 w-4" />
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
