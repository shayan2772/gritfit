export interface Exercise {
    id: string;
    name: string;
    category: string;
    muscle: string;
    description: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export const exercises: Exercise[] = [
    // Chest
    { id: "bench-press", name: "Barbell Bench Press", category: "chest", muscle: "Pectoralis Major", description: "The classic chest builder. Lie back on a flat bench. Lower the bar slowly until it touches your middle chest, then press back up.", difficulty: "Intermediate" },
    { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", category: "chest", muscle: "Upper Chest", description: "Set bench to 30-45 degrees. Targets the upper pec fibers and anterior delts.", difficulty: "Intermediate" },
    { id: "chest-fly-machine", name: "Chest Fly Machine", category: "chest", muscle: "Inner Chest", description: "Isolation movement. Keep a slight bend in elbows and bring handles together in a wide arc.", difficulty: "Beginner" },
    { id: "push-ups", name: "Push-Ups", category: "chest", muscle: "Pectorals", description: "The gold standard bodyweight exercise. Keep your core tight and lower your chest to the floor.", difficulty: "Beginner" },
    { id: "cable-crossover", name: "Cable Crossover", category: "chest", muscle: "Lower Chest", description: "Use high pulleys. Standard pectoralis isolation that targets the lower fibers.", difficulty: "Intermediate" },

    // Back
    { id: "lat-pulldown", name: "Lat Pulldown", category: "back", muscle: "Lats", description: "Sit down and grip the bar wide. Pull the bar down to your upper chest while driving your elbows down.", difficulty: "Beginner" },
    { id: "seated-cable-row", name: "Seated Cable Row", category: "back", muscle: "Mid-Back", description: "Sit with feet on platforms and pull the handle toward your waist while keeping your back straight.", difficulty: "Beginner" },
    { id: "deadlift", name: "Barbell Deadlift", category: "back", muscle: "Entire Back", description: "King of compound lifts. Hinge at hips, keep back flat, and drive through heels to stand up.", difficulty: "Advanced" },
    { id: "pull-up", name: "Pull-Ups", category: "back", muscle: "Lats", description: "Hang from a bar and pull yourself up until your chin is over the bar. Master of bodyweight.", difficulty: "Intermediate" },
    { id: "t-bar-row", name: "T-Bar Row", category: "back", muscle: "Bridges/Lats", description: "Straddle the bar and pull it towards your chest while maintaining a neutral spine.", difficulty: "Intermediate" },

    // Biceps
    { id: "barbell-curl", name: "Barbell Curl", category: "biceps", muscle: "Biceps", description: "Stand upright and curl the barbell toward your shoulders while keeping your elbows tucked.", difficulty: "Beginner" },
    { id: "dumbbell-curl", name: "Dumbbell Alternating Curl", category: "biceps", muscle: "Biceps", description: "Curl dumbbells one arm at a time, supinating your wrist as you lift for maximum contraction.", difficulty: "Beginner" },
    { id: "hammer-curl", name: "Hammer Curl", category: "biceps", muscle: "Brachialis", description: "Neutral grip curl (palms facing each other) to target the brachialis and forearm.", difficulty: "Beginner" },
    { id: "preacher-curl", name: "Preacher Curl", category: "biceps", muscle: "Short Head Biceps", description: "Use a preacher bench to isolate the biceps and prevent momentum or swinging.", difficulty: "Intermediate" },
    { id: "cable-curl", name: "Cable Curl", category: "biceps", muscle: "Biceps", description: "Use the bottom pulley of a cable machine for constant tension throughout the movement.", difficulty: "Beginner" },

    // Triceps
    { id: "tricep-pushdown", name: "Rope Pushdown", category: "triceps", muscle: "Triceps Lateral Head", description: "Use a rope attachment. Keep elbows pinned to sides and extend arms fully downward.", difficulty: "Beginner" },
    { id: "dumbbell-overhead-extension", name: "Dumbbell Overhead Extension", category: "triceps", muscle: "Triceps Long Head", description: "Hold a dumbbell with both hands overhead and lower it behind your head by bending your elbows.", difficulty: "Intermediate" },
    { id: "skull-crusher", name: "Skull Crushers", category: "triceps", muscle: "Triceps", description: "Lie on a bench and lower an EZ bar toward your forehead, then extend your elbows back up.", difficulty: "Intermediate" },
    { id: "bench-dips", name: "Bench Dips", category: "triceps", muscle: "Triceps/Chest", description: "Use two benches or one. Lower your body until arms are at 90 degrees, then push back up.", difficulty: "Beginner" },
    { id: "close-grip-bench", name: "Close Grip Bench Press", category: "triceps", muscle: "Triceps", description: "Bench press with hands closer together to shift focus from chest to triceps.", difficulty: "Intermediate" },

    // Legs
    { id: "squat", name: "Barbell Squats", category: "legs", muscle: "Quads/Glutes", description: "Rest barbell on traps, squat down until thighs are parallel to floor, then drive up.", difficulty: "Advanced" },
    { id: "leg-press", name: "Leg Press", category: "legs", muscle: "Quads", description: "Push the platform away using your legs, but avoid locking your knees at the top.", difficulty: "Beginner" },
    { id: "lunge", name: "Walking Lunges", category: "legs", muscle: "Quads/Glutes", description: "Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle.", difficulty: "Intermediate" },
    { id: "romanian-deadlift", name: "Romanian Deadlift", category: "legs", muscle: "Hamstrings", description: "Hinge at the hips while keeping legs relatively straight to target the hamstrings.", difficulty: "Intermediate" },
    { id: "leg-curl-machine", name: "Leg Curl Machine", category: "legs", muscle: "Hamstrings", description: "Lie face down or sit and curl the weight toward your glutes to isolate the hamstrings.", difficulty: "Beginner" },

    // Shoulders
    { id: "overhead-press", name: "Overhead Shoulder Press", category: "shoulders", muscle: "Front/Side Delts", description: "Press a barbell or dumbbells from shoulder height to a full lockout overhead.", difficulty: "Intermediate" },
    { id: "lateral-raise", name: "Lateral Raises", category: "shoulders", muscle: "Side Delts", description: "Raise dumbbells out to your sides until they reach shoulder height to build capped shoulders.", difficulty: "Beginner" },
    { id: "front-raise", name: "Front Raises", category: "shoulders", muscle: "Front Delts", description: "Lift dumbbells or a plate straight in front of you to shoulder height.", difficulty: "Beginner" },
    { id: "arnold-press", name: "Arnold Press", category: "shoulders", muscle: "Full Delts", description: "Start with palms facing you, rotate them away as you press the dumbbells overhead.", difficulty: "Intermediate" },
    { id: "rear-delt-fly", name: "Rear Delt Fly", category: "shoulders", muscle: "Rear Delts", description: "Bend forward at the hips and raise weights out to the sides to target the back of the shoulder.", difficulty: "Intermediate" },

    // Abs
    { id: "crunches", name: "Crunches", category: "abs", muscle: "Upper Abs", description: "Lie on your back, lift your shoulders off the floor while contracting your core.", difficulty: "Beginner" },
    { id: "hanging-leg-raise", name: "Hanging Leg Raises", category: "abs", muscle: "Lower Abs", description: "Hang from a pull-up bar and lift your legs to at least waist height while keeping them straight.", difficulty: "Intermediate" },
    { id: "plank", name: "Plank", category: "abs", muscle: "Core Stability", description: "Hold a push-up position on your forearms, keeping your body in a perfectly straight line.", difficulty: "Beginner" },
    { id: "cable-crunch", name: "Cable Crunch", category: "abs", muscle: "Abs", description: "Kneel beneath a high pulley and crunch downward, bringing your elbows towards your knees.", difficulty: "Intermediate" },
    { id: "russian-twist", name: "Russian Twists", category: "abs", muscle: "Obliques", description: "Sit on the floor, lean back slightly, and rotate your torso from side to side.", difficulty: "Beginner" },

    // Cardio
    { id: "treadmill", name: "Treadmill Run", category: "cardio", muscle: "Heart/Lower Body", description: "Indoor running. Set incline to at least 1% for more realistic resistance.", difficulty: "Beginner" },
    { id: "cycling", name: "Stationary Bike", category: "cardio", muscle: "Heart/Legs", description: "Low-impact endurance training. Maintain a steady RPM for heart health.", difficulty: "Beginner" },

    // Full Body
    { id: "burpees", name: "Burpees", category: "full-body", muscle: "Full Body", description: "A multi-step exercise: squat, kick feet back, push-up, jump back, and jump up.", difficulty: "Intermediate" },
    { id: "kettlebell-swing", name: "Kettlebell Swing", category: "full-body", muscle: "Posterior Chain", description: "Swing the kettlebell between your legs and up to eye level using explosive hip power.", difficulty: "Intermediate" },
];

export const getExercisesByCategory = (category: string) =>
    exercises.filter(ex => ex.category === category);

export const getExerciseById = (id: string) =>
    exercises.find(ex => ex.id === id);
