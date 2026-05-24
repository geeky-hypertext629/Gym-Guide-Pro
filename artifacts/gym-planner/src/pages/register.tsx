import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, UserPlus } from "lucide-react";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [, navigate] = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      await registerUser(data.name, data.email, data.password);
      navigate("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed");
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
          <p className="text-muted-foreground text-sm">Create your free account</p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Create account</CardTitle>
            <CardDescription>Start tracking your fitness journey today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

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
                  placeholder="At least 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              {serverError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {serverError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
