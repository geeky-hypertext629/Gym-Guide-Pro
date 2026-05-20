const BASE = "https://raw.githubusercontent.com/AlimKhan76/musclewiki/main/Images/";

// Maps exercise names (from DB) to the GIF filename in the musclewiki repo
const GIF_MAP: Record<string, string> = {
  // ── Chest ──────────────────────────────────────────────────────────
  "Barbell Bench Press": "male-barbell-bench-press-front_C2G7O8r.gif",
  "Incline Bench Press": "male-barbell-incline-bench-press-front.gif",
  "Incline Dumbbell Press": "male-dumbbell-incline-bench-press-front.gif",
  "Cable Fly": "male-dumbbell-incline-chest-flys-front.gif",
  "Chest Fly": "male-dumbbell-incline-chest-flys-front.gif",
  "Dips": "male-bodyweight-dips-front.gif",
  "Push-ups": "male-bodyweight-pushup-front.gif",
  "Push Ups": "male-bodyweight-pushup-front.gif",
  "Diamond Push-up": "male-bodyweight-diamond-pushup-front.gif",
  "Incline Push-up": "male-bodyweight-incline-pushup-front.gif",

  // ── Shoulders ──────────────────────────────────────────────────────
  "Barbell Overhead Press": "male-barbell-overhead-press-front_OJMNLxU.gif",
  "Overhead Press": "male-barbell-overhead-press-front_OJMNLxU.gif",
  "Dumbbell Overhead Press": "male-dumbbell-seated-overhead-press-front.gif",
  "Seated Overhead Press": "male-dumbbell-seated-overhead-press-front.gif",
  "Dumbbell Lateral Raise": "male-dumbbell-lateral-raise-front.gif",
  "Lateral Raise": "male-dumbbell-lateral-raise-front.gif",
  "Barbell Upright Row": "male-barbell-upright-row-front_3ROsKgm.gif",
  "Upright Row": "male-barbell-upright-row-front_3ROsKgm.gif",
  "Elevated Pike Press": "Elevated Pike Press.gif",
  "Elevated Pike Shoulder Shrug": "Elevated Pike Shoulder Shrug.gif",

  // ── Biceps ─────────────────────────────────────────────────────────
  "Barbell Curl": "male-barbell-curl-front_uKPCb8P.gif",
  "Dumbbell Curl": "male-dumbbell-curl-front.gif",
  "Hammer Curl": "male-dumbbell-hammer-curl-front_JbvhNLU.gif",
  "Dumbbell Hammer Curl": "male-dumbbell-hammer-curl-front_JbvhNLU.gif",
  "Chin-ups": "male-bodyweight-chinup-front.gif",
  "Chin Ups": "male-bodyweight-chinup-front.gif",
  "Pull-ups": "male-bodyweight-pullup-front.gif",
  "Pull Ups": "male-bodyweight-pullup-front.gif",

  // ── Triceps ────────────────────────────────────────────────────────
  "Skull Crusher": "male-barbell-skullcrusher-front_qpHWUa8.gif",
  "Skullcrusher": "male-barbell-skullcrusher-front_qpHWUa8.gif",
  "Lying Tricep Extension": "male-barbell-laying-tricep-extensions-front.gif",
  "Tricep Dips": "male-bodyweight-tricep-dips-front.gif",
  "Tricep Pushdown": "male-dumbbell-overhead-tricep-extension-front.gif",
  "Overhead Tricep Extension": "male-dumbbell-overhead-tricep-extension-front.gif",
  "Dumbbell Overhead Tricep Extension": "male-dumbbell-overhead-tricep-extension-front.gif",

  // ── Back / Lats ────────────────────────────────────────────────────
  "Barbell Row": "male-barbell-bent-over-row-front.gif",
  "Bent Over Row": "male-barbell-bent-over-row-front.gif",
  "Barbell Bent Over Row": "male-barbell-bent-over-row-front.gif",
  "Dumbbell Row": "male-dumbbell-row-unilateral-front.gif",
  "Unilateral Dumbbell Row": "male-dumbbell-row-unilateral-front.gif",
  "Lat Pulldown": "male-bodyweight-pullup-front.gif",

  // ── Traps ──────────────────────────────────────────────────────────
  "Barbell Shrug": "male-dumbbell-shrug-front.gif",
  "Dumbbell Shrug": "male-dumbbell-shrug-front.gif",
  "Shrug": "male-dumbbell-shrug-front.gif",
  "Seated Shrug": "male-dumbbell-seated-shrug-front.gif",

  // ── Lower Back ─────────────────────────────────────────────────────
  "Deadlift": "male-barbell-deadlift-front.gif",
  "Barbell Deadlift": "male-barbell-deadlift-front.gif",
  "Sumo Deadlift": "male-barbell-sumo-deadlift-front_aeM2BqT.gif",
  "Romanian Deadlift": "male-barbell-sumo-deadlift-front_aeM2BqT.gif",
  "Back Extension": "male-barbell-deadlift-front.gif",

  // ── Abs ────────────────────────────────────────────────────────────
  "Crunch": "male-bodyweight-crunch-front.gif",
  "Cable Crunch": "male-bodyweight-crunch-front.gif",
  "Plank": "male-bodyweight-forearm-plank-front.gif",
  "Forearm Plank": "male-bodyweight-forearm-plank-front.gif",
  "Leg Raises": "male-bodyweight-leg-raises-front.gif",
  "Leg Raise": "male-bodyweight-leg-raises-front.gif",
  "Hanging Leg Raise": "male-bodyweight-leg-raises-front.gif",

  // ── Obliques ───────────────────────────────────────────────────────
  "Russian Twist": "male-dumbbell-russian-twist-front.gif",
  "Dumbbell Russian Twist": "male-dumbbell-russian-twist-front.gif",

  // ── Quads ──────────────────────────────────────────────────────────
  "Barbell Back Squat": "male-barbell-highbar-squat-front.gif",
  "Barbell Squat": "male-barbell-highbar-squat-front.gif",
  "Back Squat": "male-barbell-highbar-squat-front.gif",
  "Squat": "male-barbell-highbar-squat-front.gif",
  "Bodyweight Squat": "male-bodyweight-squat-front.gif",
  "Goblet Squat": "male-dumbbell-goblet-squat-front.gif",
  "Bulgarian Split Squat": "male-bodyweight-bulgarian-split-squat-front.gif",
  "Lunge": "male-bodyweight-forward-lunge-front.gif",
  "Forward Lunge": "male-bodyweight-forward-lunge-front.gif",
  "Leg Press": "male-barbell-highbar-squat-front.gif",
  "Leg Extension": "male-barbell-highbar-squat-front.gif",

  // ── Hamstrings ─────────────────────────────────────────────────────
  "Leg Curl": "male-barbell-sumo-deadlift-front_aeM2BqT.gif",
  "Hip Thrust": "male-bodyweight-glute-bridge-front.gif",

  // ── Glutes ─────────────────────────────────────────────────────────
  "Glute Bridge": "male-bodyweight-glute-bridge-front.gif",

  // ── Calves ─────────────────────────────────────────────────────────
  "Calf Raise": "male-dumbbell-calf-raise-front.gif",
  "Dumbbell Calf Raise": "male-dumbbell-calf-raise-front.gif",
  "Barbell Calf Raise": "male-barbell-calve-raise-front.gif",
  "Bodyweight Calf Raise": "male-bodyweight-calve-raise-front.gif",
  "Standing Calf Raise": "male-dumbbell-calf-raise-front.gif",

  // ── Forearms ───────────────────────────────────────────────────────
  "Barbell Wrist Curl": "barbell-wristcurl-male-front.gif",
  "Wrist Curl": "male-dumbbell-wrist-curl-front.gif",
  "Dumbbell Wrist Curl": "male-dumbbell-wrist-curl-front.gif",
  "Wrist Extension": "male-dumbbell-wrist-extension-front.gif",
  "Dumbbell Wrist Extension": "male-dumbbell-wrist-extension-front.gif",
  "Reverse Curl": "male-barbell-reverse-curl-front_ysdi82M.gif",
  "Barbell Reverse Curl": "male-barbell-reverse-curl-front_ysdi82M.gif",
  "Dumbbell Reverse Curl": "male-dumbbell-reverse-curl-front.gif",
};

export function getGifUrl(exerciseName: string): string | null {
  const filename = GIF_MAP[exerciseName];
  if (!filename) return null;
  return BASE + encodeURIComponent(filename);
}
