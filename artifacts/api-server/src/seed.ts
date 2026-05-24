import mongoose from "mongoose";
import { Muscle } from "./models/Muscle.js";
import { Exercise } from "./models/Exercise.js";
import { WorkoutPlan } from "./models/WorkoutPlan.js";
import { NutritionGuide } from "./models/NutritionGuide.js";

export async function seedDatabase() {
  const muscleCount = await Muscle.countDocuments();
  if (muscleCount > 0) return;

  // ── Muscles ────────────────────────────────────────────────────────────────
  const muscles = await Muscle.insertMany([
    { name: "Chest", bodyPart: "upper_body", description: "Pectoralis major and minor" },
    { name: "Front Deltoid", bodyPart: "upper_body", description: "Anterior head of the deltoid" },
    { name: "Side Deltoid", bodyPart: "upper_body", description: "Lateral head of the deltoid" },
    { name: "Rear Deltoid", bodyPart: "upper_body", description: "Posterior head of the deltoid" },
    { name: "Biceps", bodyPart: "upper_body", description: "Biceps brachii" },
    { name: "Triceps", bodyPart: "upper_body", description: "Triceps brachii" },
    { name: "Forearms", bodyPart: "upper_body", description: "Wrist flexors and extensors" },
    { name: "Upper Back", bodyPart: "upper_body", description: "Trapezius and rhomboids" },
    { name: "Lats", bodyPart: "upper_body", description: "Latissimus dorsi" },
    { name: "Lower Back", bodyPart: "core", description: "Erector spinae" },
    { name: "Abs", bodyPart: "core", description: "Rectus abdominis" },
    { name: "Obliques", bodyPart: "core", description: "Internal and external obliques" },
    { name: "Quads", bodyPart: "lower_body", description: "Quadriceps femoris" },
    { name: "Hamstrings", bodyPart: "lower_body", description: "Biceps femoris and semimembranosus" },
    { name: "Glutes", bodyPart: "lower_body", description: "Gluteus maximus, medius, and minimus" },
    { name: "Calves", bodyPart: "lower_body", description: "Gastrocnemius and soleus" },
    { name: "Hip Flexors", bodyPart: "lower_body", description: "Iliopsoas group" },
  ]);

  const m = Object.fromEntries(muscles.map((mu) => [mu.name, mu._id]));

  // ── Exercises ──────────────────────────────────────────────────────────────
  const exerciseData = [
    // Chest
    {
      name: "Barbell Bench Press",
      difficulty: "intermediate",
      equipment: "barbell",
      description: "Classic compound movement for overall chest development.",
      instructions: "Lie on a flat bench, grip the bar slightly wider than shoulder-width. Lower the bar to your chest, then press explosively back up.",
      sets: 4, repsMin: 6, repsMax: 10, restSeconds: 120,
      muscles: [{ name: "Chest", isPrimary: true }, { name: "Front Deltoid", isPrimary: false }, { name: "Triceps", isPrimary: false }],
    },
    {
      name: "Incline Dumbbell Press",
      difficulty: "intermediate",
      equipment: "dumbbell",
      description: "Targets the upper chest with a 30-45° incline.",
      instructions: "Set bench to 30-45°. Press dumbbells from shoulder level to full extension, keeping a slight arch in your lower back.",
      sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90,
      muscles: [{ name: "Chest", isPrimary: true }, { name: "Front Deltoid", isPrimary: false }, { name: "Triceps", isPrimary: false }],
    },
    {
      name: "Push-Up",
      difficulty: "beginner",
      equipment: "bodyweight",
      description: "Foundational bodyweight chest exercise.",
      instructions: "Place hands slightly wider than shoulder-width. Lower your chest to the floor, keeping your body straight, then push back up.",
      sets: 3, repsMin: 10, repsMax: 20, restSeconds: 60,
      muscles: [{ name: "Chest", isPrimary: true }, { name: "Triceps", isPrimary: false }, { name: "Front Deltoid", isPrimary: false }],
    },
    {
      name: "Cable Fly",
      difficulty: "intermediate",
      equipment: "cable",
      description: "Isolation exercise for chest with constant tension.",
      instructions: "Set cables at shoulder height. Step forward, bring handles together in front of your chest with a slight bend in elbows.",
      sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60,
      muscles: [{ name: "Chest", isPrimary: true }, { name: "Front Deltoid", isPrimary: false }],
    },
    // Back
    {
      name: "Deadlift",
      difficulty: "advanced",
      equipment: "barbell",
      description: "The king of posterior chain exercises.",
      instructions: "Stand with the bar over your mid-foot. Grip just outside your legs. Hinge at the hips, keep your back straight, then drive through your heels to stand up.",
      sets: 4, repsMin: 4, repsMax: 6, restSeconds: 180,
      muscles: [{ name: "Lower Back", isPrimary: true }, { name: "Glutes", isPrimary: true }, { name: "Hamstrings", isPrimary: false }, { name: "Upper Back", isPrimary: false }, { name: "Forearms", isPrimary: false }],
    },
    {
      name: "Pull-Up",
      difficulty: "intermediate",
      equipment: "bodyweight",
      description: "Best bodyweight exercise for lat development.",
      instructions: "Hang from a bar with an overhand grip. Pull your chest up to the bar, squeezing your lats, then lower slowly.",
      sets: 4, repsMin: 5, repsMax: 12, restSeconds: 90,
      muscles: [{ name: "Lats", isPrimary: true }, { name: "Biceps", isPrimary: false }, { name: "Upper Back", isPrimary: false }],
    },
    {
      name: "Barbell Row",
      difficulty: "intermediate",
      equipment: "barbell",
      description: "Heavy compound pull for overall back thickness.",
      instructions: "Hinge forward to ~45°. Pull the bar to your lower chest, driving elbows back. Lower with control.",
      sets: 4, repsMin: 6, repsMax: 10, restSeconds: 120,
      muscles: [{ name: "Lats", isPrimary: true }, { name: "Upper Back", isPrimary: true }, { name: "Biceps", isPrimary: false }, { name: "Rear Deltoid", isPrimary: false }],
    },
    {
      name: "Lat Pulldown",
      difficulty: "beginner",
      equipment: "cable",
      description: "Machine alternative to pull-ups for lat development.",
      instructions: "Grip bar wider than shoulder-width. Pull bar to your upper chest while leaning back slightly, then return slowly.",
      sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75,
      muscles: [{ name: "Lats", isPrimary: true }, { name: "Biceps", isPrimary: false }, { name: "Upper Back", isPrimary: false }],
    },
    // Shoulders
    {
      name: "Overhead Press",
      difficulty: "intermediate",
      equipment: "barbell",
      description: "Primary compound exercise for shoulder strength.",
      instructions: "Stand with bar at shoulder height. Press directly overhead to full lockout, keeping core braced.",
      sets: 4, repsMin: 5, repsMax: 8, restSeconds: 120,
      muscles: [{ name: "Front Deltoid", isPrimary: true }, { name: "Side Deltoid", isPrimary: false }, { name: "Triceps", isPrimary: false }, { name: "Upper Back", isPrimary: false }],
    },
    {
      name: "Lateral Raise",
      difficulty: "beginner",
      equipment: "dumbbell",
      description: "Isolation exercise to widen the shoulders.",
      instructions: "Hold dumbbells at sides, raise to shoulder height with a slight bend in elbows. Control the descent.",
      sets: 3, repsMin: 12, repsMax: 20, restSeconds: 60,
      muscles: [{ name: "Side Deltoid", isPrimary: true }, { name: "Front Deltoid", isPrimary: false }],
    },
    {
      name: "Face Pull",
      difficulty: "beginner",
      equipment: "cable",
      description: "Rear delt and rotator cuff health exercise.",
      instructions: "Set cable at face height. Pull the rope to your face, flaring elbows out and externally rotating at the end.",
      sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60,
      muscles: [{ name: "Rear Deltoid", isPrimary: true }, { name: "Upper Back", isPrimary: false }],
    },
    // Arms
    {
      name: "Barbell Curl",
      difficulty: "beginner",
      equipment: "barbell",
      description: "Classic mass-builder for the biceps.",
      instructions: "Stand with barbell in underhand grip. Curl to your chest without swinging, lower with control.",
      sets: 3, repsMin: 8, repsMax: 12, restSeconds: 75,
      muscles: [{ name: "Biceps", isPrimary: true }, { name: "Forearms", isPrimary: false }],
    },
    {
      name: "Hammer Curl",
      difficulty: "beginner",
      equipment: "dumbbell",
      description: "Targets the brachialis for arm thickness.",
      instructions: "Hold dumbbells in neutral grip. Curl with a hammer-like motion keeping elbows at your sides.",
      sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60,
      muscles: [{ name: "Biceps", isPrimary: true }, { name: "Forearms", isPrimary: false }],
    },
    {
      name: "Tricep Dip",
      difficulty: "intermediate",
      equipment: "bodyweight",
      description: "Compound tricep movement using bodyweight.",
      instructions: "Grip parallel bars, lower yourself until arms are at 90°, then press back up. Keep torso upright.",
      sets: 3, repsMin: 8, repsMax: 15, restSeconds: 90,
      muscles: [{ name: "Triceps", isPrimary: true }, { name: "Chest", isPrimary: false }, { name: "Front Deltoid", isPrimary: false }],
    },
    {
      name: "Skull Crusher",
      difficulty: "intermediate",
      equipment: "barbell",
      description: "Isolation exercise for all three tricep heads.",
      instructions: "Lie on bench, hold EZ-bar overhead. Bend elbows to lower bar toward forehead, then extend back up.",
      sets: 3, repsMin: 10, repsMax: 12, restSeconds: 75,
      muscles: [{ name: "Triceps", isPrimary: true }],
    },
    // Legs
    {
      name: "Barbell Back Squat",
      difficulty: "intermediate",
      equipment: "barbell",
      description: "The foundational lower body compound movement.",
      instructions: "Bar on upper traps, feet shoulder-width. Squat until thighs are parallel, maintaining upright torso. Drive through heels to stand.",
      sets: 4, repsMin: 5, repsMax: 8, restSeconds: 180,
      muscles: [{ name: "Quads", isPrimary: true }, { name: "Glutes", isPrimary: true }, { name: "Hamstrings", isPrimary: false }, { name: "Lower Back", isPrimary: false }],
    },
    {
      name: "Romanian Deadlift",
      difficulty: "intermediate",
      equipment: "barbell",
      description: "Hip-hinge movement targeting hamstrings and glutes.",
      instructions: "Hold bar at hip level, push hips back and lower bar along your legs until you feel a hamstring stretch. Drive hips forward to return.",
      sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120,
      muscles: [{ name: "Hamstrings", isPrimary: true }, { name: "Glutes", isPrimary: true }, { name: "Lower Back", isPrimary: false }],
    },
    {
      name: "Leg Press",
      difficulty: "beginner",
      equipment: "machine",
      description: "Machine compound for quad-dominant leg development.",
      instructions: "Set feet shoulder-width on platform. Lower until knees are at 90°, press back without locking out knees.",
      sets: 3, repsMin: 10, repsMax: 15, restSeconds: 90,
      muscles: [{ name: "Quads", isPrimary: true }, { name: "Glutes", isPrimary: false }, { name: "Hamstrings", isPrimary: false }],
    },
    {
      name: "Lunge",
      difficulty: "beginner",
      equipment: "dumbbell",
      description: "Unilateral leg exercise for balance and strength.",
      instructions: "Hold dumbbells, step forward into a lunge until back knee nearly touches floor. Return to start.",
      sets: 3, repsMin: 10, repsMax: 12, restSeconds: 75,
      muscles: [{ name: "Quads", isPrimary: true }, { name: "Glutes", isPrimary: true }, { name: "Hamstrings", isPrimary: false }],
    },
    {
      name: "Leg Curl",
      difficulty: "beginner",
      equipment: "machine",
      description: "Isolation for the hamstrings.",
      instructions: "Lie face down on machine, curl legs toward glutes against resistance, lower with control.",
      sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60,
      muscles: [{ name: "Hamstrings", isPrimary: true }],
    },
    {
      name: "Calf Raise",
      difficulty: "beginner",
      equipment: "machine",
      description: "Isolation exercise for gastrocnemius and soleus.",
      instructions: "Place balls of feet on platform edge. Rise up onto toes, hold for a second, then lower fully.",
      sets: 4, repsMin: 15, repsMax: 20, restSeconds: 45,
      muscles: [{ name: "Calves", isPrimary: true }],
    },
    {
      name: "Hip Thrust",
      difficulty: "intermediate",
      equipment: "barbell",
      description: "Best exercise for glute activation and strength.",
      instructions: "Sit with upper back on bench, bar across hips. Drive hips up to full extension, squeezing glutes at top.",
      sets: 4, repsMin: 8, repsMax: 12, restSeconds: 90,
      muscles: [{ name: "Glutes", isPrimary: true }, { name: "Hamstrings", isPrimary: false }],
    },
    // Core
    {
      name: "Plank",
      difficulty: "beginner",
      equipment: "bodyweight",
      description: "Isometric core stability exercise.",
      instructions: "Hold a push-up position on forearms. Keep body in a straight line from head to heels. Hold for time.",
      sets: 3, repsMin: 30, repsMax: 60, restSeconds: 45,
      muscles: [{ name: "Abs", isPrimary: true }, { name: "Obliques", isPrimary: false }, { name: "Lower Back", isPrimary: false }],
    },
    {
      name: "Cable Crunch",
      difficulty: "beginner",
      equipment: "cable",
      description: "Weighted ab exercise with constant tension.",
      instructions: "Kneel in front of cable with rope attachment at head height. Crunch down, bringing elbows to knees.",
      sets: 3, repsMin: 12, repsMax: 20, restSeconds: 60,
      muscles: [{ name: "Abs", isPrimary: true }, { name: "Obliques", isPrimary: false }],
    },
    {
      name: "Russian Twist",
      difficulty: "beginner",
      equipment: "dumbbell",
      description: "Rotational exercise for the obliques.",
      instructions: "Sit with knees bent, lean back 45°. Rotate side to side while holding a weight.",
      sets: 3, repsMin: 15, repsMax: 20, restSeconds: 45,
      muscles: [{ name: "Obliques", isPrimary: true }, { name: "Abs", isPrimary: false }],
    },
    {
      name: "Hanging Leg Raise",
      difficulty: "intermediate",
      equipment: "bodyweight",
      description: "Advanced lower ab exercise using bodyweight.",
      instructions: "Hang from a pull-up bar. Raise legs to 90° or higher keeping them straight. Lower with control.",
      sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75,
      muscles: [{ name: "Abs", isPrimary: true }, { name: "Hip Flexors", isPrimary: false }],
    },
    {
      name: "Dumbbell Row",
      difficulty: "beginner",
      equipment: "dumbbell",
      description: "Single-arm back exercise for lat and upper back development.",
      instructions: "Support yourself on a bench with one knee and hand. Row the dumbbell to your hip, squeezing your back at the top.",
      sets: 3, repsMin: 10, repsMax: 12, restSeconds: 75,
      muscles: [{ name: "Lats", isPrimary: true }, { name: "Upper Back", isPrimary: false }, { name: "Biceps", isPrimary: false }],
    },
    {
      name: "Arnold Press",
      difficulty: "intermediate",
      equipment: "dumbbell",
      description: "Compound shoulder press with rotation for full deltoid development.",
      instructions: "Start with palms facing you at shoulder height. Press overhead while rotating palms forward. Reverse on the way down.",
      sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90,
      muscles: [{ name: "Front Deltoid", isPrimary: true }, { name: "Side Deltoid", isPrimary: true }, { name: "Triceps", isPrimary: false }],
    },
  ];

  const insertedExercises: Array<{ _id: mongoose.Types.ObjectId; name: string }> = [];
  for (const ex of exerciseData) {
    const { muscles: muscleRefs, ...rest } = ex;
    const musclesArr = muscleRefs.map((mr) => ({
      muscleId: m[mr.name],
      isPrimary: mr.isPrimary,
    }));
    const exercise = await Exercise.create({ ...rest, muscles: musclesArr });
    insertedExercises.push({ _id: exercise._id as mongoose.Types.ObjectId, name: exercise.name });
  }

  const byName = (name: string) => insertedExercises.find((e) => e.name === name)!._id;

  // ── Workout Plans ──────────────────────────────────────────────────────────
  await WorkoutPlan.insertMany([
    {
      name: "Beginner Full Body",
      level: "beginner",
      daysPerWeek: 3,
      goal: "general_fitness",
      description: "A 3-day full body program for complete beginners. Focuses on learning movement patterns and building a strength base.",
      estimatedWeeks: 12,
      days: [
        {
          dayNumber: 1, name: "Day A", focus: "Full Body",
          exercises: [
            { exerciseId: byName("Barbell Back Squat"), orderIndex: 0 },
            { exerciseId: byName("Barbell Bench Press"), orderIndex: 1 },
            { exerciseId: byName("Barbell Row"), orderIndex: 2 },
            { exerciseId: byName("Overhead Press"), orderIndex: 3 },
            { exerciseId: byName("Plank"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 2, name: "Day B", focus: "Full Body",
          exercises: [
            { exerciseId: byName("Barbell Back Squat"), orderIndex: 0 },
            { exerciseId: byName("Deadlift"), orderIndex: 1 },
            { exerciseId: byName("Pull-Up"), orderIndex: 2 },
            { exerciseId: byName("Push-Up"), orderIndex: 3 },
            { exerciseId: byName("Calf Raise"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 3, name: "Day C", focus: "Full Body",
          exercises: [
            { exerciseId: byName("Lunge"), orderIndex: 0 },
            { exerciseId: byName("Lat Pulldown"), orderIndex: 1 },
            { exerciseId: byName("Incline Dumbbell Press"), orderIndex: 2 },
            { exerciseId: byName("Lateral Raise"), orderIndex: 3 },
            { exerciseId: byName("Cable Crunch"), orderIndex: 4 },
          ],
        },
      ],
    },
    {
      name: "Push-Pull-Legs",
      level: "intermediate",
      daysPerWeek: 6,
      goal: "hypertrophy",
      description: "Classic 6-day PPL split for muscle hypertrophy. Each muscle group is trained twice per week with optimal frequency and volume.",
      estimatedWeeks: 16,
      days: [
        {
          dayNumber: 1, name: "Push A", focus: "Chest, Shoulders & Triceps",
          exercises: [
            { exerciseId: byName("Barbell Bench Press"), orderIndex: 0 },
            { exerciseId: byName("Incline Dumbbell Press"), orderIndex: 1 },
            { exerciseId: byName("Overhead Press"), orderIndex: 2 },
            { exerciseId: byName("Lateral Raise"), orderIndex: 3 },
            { exerciseId: byName("Skull Crusher"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 2, name: "Pull A", focus: "Back & Biceps",
          exercises: [
            { exerciseId: byName("Deadlift"), orderIndex: 0 },
            { exerciseId: byName("Barbell Row"), orderIndex: 1 },
            { exerciseId: byName("Lat Pulldown"), orderIndex: 2 },
            { exerciseId: byName("Face Pull"), orderIndex: 3 },
            { exerciseId: byName("Barbell Curl"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 3, name: "Legs A", focus: "Quads, Hamstrings & Glutes",
          exercises: [
            { exerciseId: byName("Barbell Back Squat"), orderIndex: 0 },
            { exerciseId: byName("Romanian Deadlift"), orderIndex: 1 },
            { exerciseId: byName("Leg Press"), orderIndex: 2 },
            { exerciseId: byName("Leg Curl"), orderIndex: 3 },
            { exerciseId: byName("Calf Raise"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 4, name: "Push B", focus: "Chest, Shoulders & Triceps",
          exercises: [
            { exerciseId: byName("Incline Dumbbell Press"), orderIndex: 0 },
            { exerciseId: byName("Cable Fly"), orderIndex: 1 },
            { exerciseId: byName("Arnold Press"), orderIndex: 2 },
            { exerciseId: byName("Lateral Raise"), orderIndex: 3 },
            { exerciseId: byName("Tricep Dip"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 5, name: "Pull B", focus: "Back & Biceps",
          exercises: [
            { exerciseId: byName("Pull-Up"), orderIndex: 0 },
            { exerciseId: byName("Dumbbell Row"), orderIndex: 1 },
            { exerciseId: byName("Lat Pulldown"), orderIndex: 2 },
            { exerciseId: byName("Hammer Curl"), orderIndex: 3 },
            { exerciseId: byName("Face Pull"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 6, name: "Legs B", focus: "Glutes, Hamstrings & Calves",
          exercises: [
            { exerciseId: byName("Hip Thrust"), orderIndex: 0 },
            { exerciseId: byName("Romanian Deadlift"), orderIndex: 1 },
            { exerciseId: byName("Lunge"), orderIndex: 2 },
            { exerciseId: byName("Leg Curl"), orderIndex: 3 },
            { exerciseId: byName("Calf Raise"), orderIndex: 4 },
          ],
        },
      ],
    },
    {
      name: "Advanced Strength",
      level: "advanced",
      daysPerWeek: 4,
      goal: "strength",
      description: "A 4-day upper/lower strength program based on powerlifting principles. Periodised loading with heavy compound movements.",
      estimatedWeeks: 12,
      days: [
        {
          dayNumber: 1, name: "Upper A", focus: "Horizontal Push & Pull",
          exercises: [
            { exerciseId: byName("Barbell Bench Press"), orderIndex: 0 },
            { exerciseId: byName("Barbell Row"), orderIndex: 1 },
            { exerciseId: byName("Incline Dumbbell Press"), orderIndex: 2 },
            { exerciseId: byName("Dumbbell Row"), orderIndex: 3 },
            { exerciseId: byName("Skull Crusher"), orderIndex: 4 },
            { exerciseId: byName("Barbell Curl"), orderIndex: 5 },
          ],
        },
        {
          dayNumber: 2, name: "Lower A", focus: "Squat Dominant",
          exercises: [
            { exerciseId: byName("Barbell Back Squat"), orderIndex: 0 },
            { exerciseId: byName("Romanian Deadlift"), orderIndex: 1 },
            { exerciseId: byName("Lunge"), orderIndex: 2 },
            { exerciseId: byName("Leg Curl"), orderIndex: 3 },
            { exerciseId: byName("Calf Raise"), orderIndex: 4 },
          ],
        },
        {
          dayNumber: 3, name: "Upper B", focus: "Vertical Push & Pull",
          exercises: [
            { exerciseId: byName("Overhead Press"), orderIndex: 0 },
            { exerciseId: byName("Pull-Up"), orderIndex: 1 },
            { exerciseId: byName("Arnold Press"), orderIndex: 2 },
            { exerciseId: byName("Lat Pulldown"), orderIndex: 3 },
            { exerciseId: byName("Face Pull"), orderIndex: 4 },
            { exerciseId: byName("Hammer Curl"), orderIndex: 5 },
          ],
        },
        {
          dayNumber: 4, name: "Lower B", focus: "Hip Dominant",
          exercises: [
            { exerciseId: byName("Deadlift"), orderIndex: 0 },
            { exerciseId: byName("Hip Thrust"), orderIndex: 1 },
            { exerciseId: byName("Leg Press"), orderIndex: 2 },
            { exerciseId: byName("Hanging Leg Raise"), orderIndex: 3 },
            { exerciseId: byName("Plank"), orderIndex: 4 },
          ],
        },
      ],
    },
  ]);

  // ── Nutrition Guides ───────────────────────────────────────────────────────
  await NutritionGuide.insertMany([
    {
      name: "Muscle Gain Nutrition",
      goal: "muscle_gain",
      level: "intermediate",
      calories: 3000,
      proteinG: 180,
      carbsG: 350,
      fatG: 83,
      description: "A calorie surplus plan designed to support muscle hypertrophy. High protein intake to support muscle protein synthesis.",
      tips: [
        "Eat 0.8–1g of protein per lb of bodyweight",
        "Time carbs around your workouts for performance and recovery",
        "Include healthy fats from sources like avocado, nuts, and olive oil",
        "Aim for a modest calorie surplus of 200–300 kcal above TDEE",
        "Track your food with an app for the first few weeks to hit targets",
        "Prioritise whole foods over supplements",
      ],
      sampleMeals: [
        { name: "Breakfast", time: "7:00 AM", foods: ["5 whole eggs", "2 slices sourdough toast", "1 banana", "250ml low-fat milk"], calories: 700 },
        { name: "Mid-Morning", time: "10:00 AM", foods: ["200g Greek yoghurt", "50g granola", "1 handful blueberries"], calories: 400 },
        { name: "Lunch", time: "1:00 PM", foods: ["200g chicken breast", "150g brown rice", "mixed vegetables", "1 tbsp olive oil"], calories: 750 },
        { name: "Pre-Workout", time: "4:00 PM", foods: ["1 banana", "30g whey protein shake"], calories: 250 },
        { name: "Dinner", time: "7:30 PM", foods: ["200g salmon fillet", "200g sweet potato", "broccoli & spinach salad"], calories: 700 },
        { name: "Evening Snack", time: "9:30 PM", foods: ["200g cottage cheese", "1 tbsp peanut butter"], calories: 250 },
      ],
    },
    {
      name: "Fat Loss Nutrition",
      goal: "fat_loss",
      level: "beginner",
      calories: 1800,
      proteinG: 160,
      carbsG: 150,
      fatG: 60,
      description: "A moderate calorie deficit plan that preserves lean muscle while burning fat. High protein protects against muscle loss.",
      tips: [
        "Maintain high protein to preserve muscle during a deficit",
        "Prioritise fibre-rich vegetables to stay full on fewer calories",
        "Reduce liquid calories (alcohol, juice, sugary drinks)",
        "Aim for a deficit of 300–500 kcal per day",
        "Do not drop calories too aggressively — aim for 0.5–1 lb per week loss",
        "Spread protein across meals to maximise muscle protein synthesis",
      ],
      sampleMeals: [
        { name: "Breakfast", time: "7:00 AM", foods: ["3 scrambled eggs", "1 slice whole grain toast", "1 cup black coffee"], calories: 350 },
        { name: "Lunch", time: "12:30 PM", foods: ["200g grilled chicken", "large mixed salad", "1 tbsp vinaigrette"], calories: 450 },
        { name: "Afternoon Snack", time: "3:30 PM", foods: ["30g whey protein shake with water", "1 apple"], calories: 200 },
        { name: "Dinner", time: "7:00 PM", foods: ["150g white fish", "200g roasted vegetables", "100g quinoa"], calories: 500 },
        { name: "Evening", time: "9:00 PM", foods: ["200g low-fat Greek yoghurt"], calories: 130 },
      ],
    },
    {
      name: "Maintenance Nutrition",
      goal: "maintenance",
      level: "beginner",
      calories: 2400,
      proteinG: 140,
      carbsG: 270,
      fatG: 80,
      description: "Balanced macros to maintain current weight and body composition. Good foundation for general health and athletic performance.",
      tips: [
        "Focus on food quality and nutrient density",
        "Eat a wide variety of colours to ensure micronutrient coverage",
        "Hydrate well — aim for 2–3L of water daily",
        "Listen to hunger cues and eat mindfully",
        "Meal prep on weekends to maintain consistency through the week",
      ],
      sampleMeals: [
        { name: "Breakfast", time: "7:30 AM", foods: ["80g oats with milk", "1 banana", "30g protein powder"], calories: 550 },
        { name: "Lunch", time: "1:00 PM", foods: ["Turkey wrap with vegetables", "1 orange", "250ml water"], calories: 650 },
        { name: "Snack", time: "4:00 PM", foods: ["Mixed nuts 30g", "1 piece of fruit"], calories: 250 },
        { name: "Dinner", time: "7:00 PM", foods: ["Steak 180g", "baked potato", "side salad"], calories: 800 },
      ],
    },
    {
      name: "Endurance Athlete Nutrition",
      goal: "endurance",
      level: "advanced",
      calories: 3500,
      proteinG: 140,
      carbsG: 480,
      fatG: 90,
      description: "High carbohydrate plan to fuel extended endurance training. Glycogen replenishment and recovery are the primary focus.",
      tips: [
        "Carbohydrates are your primary fuel — don't restrict them",
        "Consume fast carbs during and immediately after long sessions",
        "Use sports drinks or gels for workouts exceeding 60–90 minutes",
        "Protein is still important for repair — don't neglect it",
        "Monitor electrolytes, especially sodium, on long sweat sessions",
        "Consider iron and magnesium intake as endurance athletes are prone to deficiency",
      ],
      sampleMeals: [
        { name: "Breakfast", time: "6:00 AM", foods: ["100g oats", "2 bananas", "30g honey", "250ml orange juice"], calories: 800 },
        { name: "Pre-Training", time: "9:30 AM", foods: ["Energy bar", "500ml sports drink"], calories: 400 },
        { name: "Post-Training", time: "12:00 PM", foods: ["Chocolate milk 500ml", "2 bananas", "30g protein shake"], calories: 700 },
        { name: "Lunch", time: "2:00 PM", foods: ["Pasta 250g cooked", "tomato sauce", "chicken breast 150g"], calories: 900 },
        { name: "Dinner", time: "7:00 PM", foods: ["Rice 200g cooked", "grilled salmon 180g", "roasted vegetables"], calories: 700 },
      ],
    },
  ]);

  console.log("✅ Database seeded successfully");
}
