import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Dumbbell, ClipboardList, BookOpen,
  LineChart, Apple, Calculator, Sparkles, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/personalize", label: "My Plan", icon: Sparkles },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/plans", label: "Plans", icon: ClipboardList },
  { href: "/log", label: "Log", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/calculator", label: "TDEE", icon: Calculator },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? location === "/"
      : location === href || location.startsWith(href + "/");

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-card h-[100dvh] sticky top-0 shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-primary">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            GymGuide
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const highlight = item.href === "/personalize";
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : highlight
                      ? "text-primary hover:bg-primary/10"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {highlight && !active && (
                    <span className="ml-auto text-[10px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">NEW</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">GymGuide &copy; {new Date().getFullYear()}</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-card sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-primary">
          <div className="p-1 rounded-md bg-primary/10">
            <Dumbbell className="h-4 w-4 text-primary" />
          </div>
          GymGuide
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="h-9 w-9">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 top-14">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-card border-b shadow-xl p-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const highlight = item.href === "/personalize";
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium cursor-pointer",
                      active
                        ? "bg-primary text-primary-foreground"
                        : highlight
                        ? "text-primary hover:bg-primary/10"
                        : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {highlight && !active && (
                      <span className="ml-auto text-[10px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
