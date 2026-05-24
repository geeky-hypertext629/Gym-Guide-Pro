import { useAuth } from "@/context/AuthContext";
import { useLocation, Redirect } from "wouter";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Redirect to={`/login?from=${encodeURIComponent(location)}`} />;
  }

  return <>{children}</>;
}
