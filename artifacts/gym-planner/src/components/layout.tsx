import { Link, useLocation } from "wouter";
import { Dumbbell, Home, LineChart, Apple, Calculator, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/plans", label: "Plans", icon: Dumbbell },
  { href: "/log", label: "Log", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/calculator", label: "TDEE", icon: Calculator },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card h-[100dvh] sticky top-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-primary">
            <Dumbbell className="h-6 w-6" />
            GymGuide
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === item.href || (location.startsWith(item.href) && item.href !== "/")
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent/10 hover:text-accent text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Dumbbell className="h-5 w-5" />
          GymGuide
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-card absolute top-16 w-full z-10 p-4 shadow-lg space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors cursor-pointer",
                  location === item.href || (location.startsWith(item.href) && item.href !== "/")
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent/10 hover:text-accent text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
