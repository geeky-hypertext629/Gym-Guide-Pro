import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────── */
type View = "front" | "back";

interface MuscleGroup {
  id: string;
  label: string;
  view: View;
  // SVG path data strings (can be multiple e.g. left + right)
  paths: string[];
  labelPos: { x: number; y: number };
}

/* ─── Muscle data ────────────────────────────────────────────────────── */
// ViewBox: "0 0 220 540" — body centered at x=110

const FRONT_MUSCLES: MuscleGroup[] = [
  {
    id: "chest",
    label: "Chest",
    view: "front",
    labelPos: { x: 110, y: 122 },
    paths: [
      "M70,94 L110,90 L108,150 Q88,160 70,144 Z",
      "M150,94 L110,90 L112,150 Q132,160 150,144 Z",
    ],
  },
  {
    id: "shoulders",
    label: "Shoulders",
    view: "front",
    labelPos: { x: 110, y: 100 },
    paths: [
      "M54,98 Q42,102 40,120 Q42,140 56,138 L64,118 Q62,106 54,98 Z",
      "M166,98 Q178,102 180,120 Q178,140 164,138 L156,118 Q158,106 166,98 Z",
    ],
  },
  {
    id: "biceps",
    label: "Biceps",
    view: "front",
    labelPos: { x: 110, y: 165 },
    paths: [
      "M56,138 L46,192 L57,196 L65,140 Z",
      "M164,138 L174,192 L163,196 L155,140 Z",
    ],
  },
  {
    id: "forearms",
    label: "Forearms",
    view: "front",
    labelPos: { x: 110, y: 232 },
    paths: [
      "M46,192 L37,270 L47,274 L57,196 Z",
      "M174,192 L183,270 L173,274 L163,196 Z",
    ],
  },
  {
    id: "abs",
    label: "Abs",
    view: "front",
    labelPos: { x: 110, y: 186 },
    paths: [
      // 6 cells — left column
      "M90,153 L106,153 L106,169 L90,169 Z",
      "M90,173 L106,173 L106,189 L90,189 Z",
      "M90,193 L106,193 L106,209 L90,209 Z",
      // right column
      "M108,153 L124,153 L124,169 L108,169 Z",
      "M108,173 L124,173 L124,189 L108,189 Z",
      "M108,193 L124,193 L124,209 L108,209 Z",
    ],
  },
  {
    id: "obliques",
    label: "Obliques",
    view: "front",
    labelPos: { x: 110, y: 195 },
    paths: [
      "M62,154 L73,152 L70,242 L57,244 Z",
      "M158,154 L147,152 L150,242 L163,244 Z",
    ],
  },
  {
    id: "quads",
    label: "Quads",
    view: "front",
    labelPos: { x: 110, y: 344 },
    paths: [
      "M76,280 L92,280 L89,406 L72,406 Z",
      "M128,280 L144,280 L148,406 L132,406 Z",
    ],
  },
  {
    id: "calves",
    label: "Calves",
    view: "front",
    labelPos: { x: 110, y: 452 },
    paths: [
      "M72,414 L84,414 L81,490 L68,490 Z",
      "M136,414 L148,414 L152,490 L139,490 Z",
    ],
  },
];

const BACK_MUSCLES: MuscleGroup[] = [
  {
    id: "traps",
    label: "Traps",
    view: "back",
    labelPos: { x: 110, y: 105 },
    paths: [
      "M68,92 Q110,84 152,92 L148,120 Q110,128 72,120 Z",
    ],
  },
  {
    id: "lats",
    label: "Lats",
    view: "back",
    labelPos: { x: 110, y: 186 },
    paths: [
      "M52,116 L53,234 Q74,250 90,240 L84,128 Z",
      "M168,116 L167,234 Q146,250 130,240 L136,128 Z",
    ],
  },
  {
    id: "mid-back",
    label: "Mid Back",
    view: "back",
    labelPos: { x: 110, y: 152 },
    paths: [
      "M82,132 L138,132 L134,178 L86,178 Z",
    ],
  },
  {
    id: "lower-back",
    label: "Lower Back",
    view: "back",
    labelPos: { x: 110, y: 210 },
    paths: [
      "M84,182 L136,182 L134,242 L86,242 Z",
    ],
  },
  {
    id: "triceps",
    label: "Triceps",
    view: "back",
    labelPos: { x: 110, y: 165 },
    paths: [
      "M54,114 L40,192 L52,196 L65,118 Z",
      "M166,114 L180,192 L168,196 L155,118 Z",
    ],
  },
  {
    id: "glutes",
    label: "Glutes",
    view: "back",
    labelPos: { x: 110, y: 314 },
    paths: [
      "M78,280 L96,280 L92,352 L72,352 Z",
      "M124,280 L142,280 L148,352 L128,352 Z",
    ],
  },
  {
    id: "hamstrings",
    label: "Hamstrings",
    view: "back",
    labelPos: { x: 110, y: 376 },
    paths: [
      "M72,356 L90,356 L86,406 L68,406 Z",
      "M130,356 L148,356 L152,406 L134,406 Z",
    ],
  },
  {
    id: "calves",
    label: "Calves",
    view: "back",
    labelPos: { x: 110, y: 452 },
    paths: [
      "M68,412 L82,412 L79,490 L65,490 Z",
      "M138,412 L152,412 L155,490 L142,490 Z",
    ],
  },
];

/* ─── Body silhouette shapes ──────────────────────────────────────────── */
// Light gray base body for both front and back views
function BodySilhouette() {
  return (
    <g fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.5">
      {/* Head */}
      <ellipse cx="110" cy="42" rx="30" ry="34" />
      {/* Neck */}
      <path d="M100,74 L120,74 L118,92 L102,92 Z" />
      {/* Torso */}
      <path d="M68,90 Q56,94 52,112 L50,234 Q56,260 78,272 L142,272 Q164,260 170,234 L168,112 Q164,94 152,90 Z" />
      {/* Left upper arm */}
      <path d="M52,112 L40,194 L56,198 L66,116 Z" />
      {/* Right upper arm */}
      <path d="M168,112 L180,194 L164,198 L154,116 Z" />
      {/* Left forearm */}
      <path d="M40,194 L32,272 L48,276 L56,198 Z" />
      {/* Right forearm */}
      <path d="M180,194 L188,272 L172,276 L164,198 Z" />
      {/* Left hand */}
      <path d="M32,272 L28,294 Q36,300 44,294 L48,276 Z" />
      {/* Right hand */}
      <path d="M188,272 L192,294 Q184,300 176,294 L172,276 Z" />
      {/* Left thigh */}
      <path d="M78,272 L70,410 L90,410 L96,272 Z" />
      {/* Right thigh */}
      <path d="M142,272 L150,410 L130,410 L124,272 Z" />
      {/* Left lower leg */}
      <path d="M70,414 L66,494 L86,494 L90,414 Z" />
      {/* Right lower leg */}
      <path d="M150,414 L154,494 L134,494 L130,414 Z" />
      {/* Left foot */}
      <path d="M62,494 L88,494 L88,506 L62,506 Z" rx="3" />
      {/* Right foot */}
      <path d="M132,494 L158,494 L158,506 L132,506 Z" rx="3" />
    </g>
  );
}

/* ─── Muscle highlight colors ─────────────────────────────────────────── */
const MUSCLE_COLORS: Record<string, { base: string; hover: string }> = {
  chest: { base: "#86efac", hover: "#16a34a" },
  shoulders: { base: "#67e8f9", hover: "#0891b2" },
  biceps: { base: "#a5b4fc", hover: "#4f46e5" },
  forearms: { base: "#fca5a5", hover: "#dc2626" },
  abs: { base: "#6ee7b7", hover: "#059669" },
  obliques: { base: "#fcd34d", hover: "#d97706" },
  quads: { base: "#f9a8d4", hover: "#db2777" },
  calves: { base: "#c4b5fd", hover: "#7c3aed" },
  traps: { base: "#67e8f9", hover: "#0891b2" },
  lats: { base: "#86efac", hover: "#16a34a" },
  "mid-back": { base: "#fca5a5", hover: "#dc2626" },
  "lower-back": { base: "#fcd34d", hover: "#d97706" },
  triceps: { base: "#a5b4fc", hover: "#4f46e5" },
  glutes: { base: "#f9a8d4", hover: "#db2777" },
  hamstrings: { base: "#6ee7b7", hover: "#059669" },
};

/* ─── Interactive muscle path ─────────────────────────────────────────── */
function MusclePath({
  muscle,
  hovered,
  onHover,
  onClick,
}: {
  muscle: MuscleGroup;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const colors = MUSCLE_COLORS[muscle.id] ?? { base: "#86efac", hover: "#16a34a" };
  const fill = hovered ? colors.hover : colors.base;
  const opacity = hovered ? 0.95 : 0.72;

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={() => onHover(muscle.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(muscle.id)}
    >
      {muscle.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={fill}
          fillOpacity={opacity}
          stroke={colors.hover}
          strokeWidth={hovered ? 1.5 : 0.8}
          strokeOpacity={0.9}
          rx="3"
          style={{ transition: "fill 0.15s, stroke-width 0.15s, fill-opacity 0.15s" }}
        />
      ))}
      {/* Hover label in SVG */}
      {hovered && (
        <g>
          <rect
            x={muscle.labelPos.x - 28}
            y={muscle.labelPos.y - 12}
            width={56}
            height={22}
            rx={6}
            fill={colors.hover}
            opacity={0.95}
          />
          <text
            x={muscle.labelPos.x}
            y={muscle.labelPos.y + 4}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {muscle.label}
          </text>
        </g>
      )}
    </g>
  );
}

/* ─── Muscle pill legend ───────────────────────────────────────────────── */
function MusclePill({
  muscle,
  hovered,
  onHover,
  onClick,
}: {
  muscle: MuscleGroup;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const colors = MUSCLE_COLORS[muscle.id] ?? { base: "#86efac", hover: "#16a34a" };
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
        hovered
          ? "border-transparent text-white shadow-md scale-105"
          : "border-border/60 text-muted-foreground hover:scale-105"
      )}
      style={{
        background: hovered ? colors.hover : colors.base + "40",
        borderColor: hovered ? colors.hover : undefined,
        color: hovered ? "white" : colors.hover,
      }}
      onMouseEnter={() => onHover(muscle.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(muscle.id)}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: colors.hover }}
      />
      {muscle.label}
      <ChevronRight className="h-3 w-3 opacity-60" />
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function MuscleMap() {
  const [view, setView] = useState<View>("front");
  const [hovered, setHovered] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const muscles = view === "front" ? FRONT_MUSCLES : BACK_MUSCLES;

  const handleClick = (muscleId: string) => {
    setLocation(`/muscle-map/${muscleId}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-1">Muscle Map</h1>
        <p className="text-muted-foreground">
          Hover to highlight — click a muscle to explore exercises that target it.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <Button
          variant={view === "front" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("front")}
          data-testid="button-front"
        >
          Front View
        </Button>
        <Button
          variant={view === "back" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("back")}
          data-testid="button-back-view"
        >
          Back View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView(view === "front" ? "back" : "front")}
          className="text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" /> Flip
        </Button>
        {hovered && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
              {muscles.find((m) => m.id === hovered)?.label ?? hovered}
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SVG body */}
        <div className="flex-shrink-0 mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-2xl border bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-inner p-4"
            >
              <svg
                viewBox="0 0 220 540"
                width="280"
                height="680"
                className="select-none"
                aria-label={`${view} body muscle map`}
              >
                {/* Body silhouette */}
                <BodySilhouette />

                {/* Interactive muscle regions */}
                {muscles.map((muscle) => (
                  <MusclePath
                    key={muscle.id}
                    muscle={muscle}
                    hovered={hovered === muscle.id}
                    onHover={setHovered}
                    onClick={handleClick}
                  />
                ))}

                {/* Subtle centerline */}
                <line x1="110" y1="90" x2="110" y2="274" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.4" />

                {/* View label */}
                <text x="110" y="530" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">
                  {view === "front" ? "Front View" : "Back View"}
                </text>
              </svg>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Muscle pills legend */}
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {view === "front" ? "Front Muscles" : "Back Muscles"}
          </p>
          <div className="flex flex-wrap gap-2">
            {muscles.map((muscle) => (
              <MusclePill
                key={muscle.id}
                muscle={muscle}
                hovered={hovered === muscle.id}
                onHover={setHovered}
                onClick={handleClick}
              />
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-dashed text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">How to use</p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Hover over a coloured region to see the muscle name</li>
              <li>Click any muscle to see exercises that target it with form GIFs</li>
              <li>Toggle between front and back view using the buttons above</li>
            </ul>
          </div>

          {/* Quick click shortcuts */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {muscles.map((muscle) => {
              const colors = MUSCLE_COLORS[muscle.id] ?? { base: "#86efac", hover: "#16a34a" };
              return (
                <button
                  key={muscle.id}
                  onClick={() => handleClick(muscle.id)}
                  className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                  data-testid={`button-muscle-${muscle.id}`}
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: colors.hover }} />
                  <span className="text-sm font-medium">{muscle.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
