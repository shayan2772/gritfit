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
    { id: "bench-press", name: "Barbell Bench Press", category: "chest", muscle: "Pectoralis Major", description: "The classic chest builder. Lie back on a flat bench. Using a medium-width grip, lift the bar from the rack and hold it straight over you with your arms locked. Lower the bar slowly until it touches your middle chest.", difficulty: "Intermediate" },
    { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", category: "chest", muscle: "Upper Chest", description: "Targets the clavicular head of the pecs. Set bench to 30-45 degrees. Press dumbbells up and slightly in.", difficulty: "Intermediate" },
    { id: "cable-fly", name: "Cable Fly", category: "chest", muscle: "Inner Chest", description: "Isolation movement for chest. Keep a slight bend in elbows and bring handles together like hugging a tree.", difficulty: "Beginner" },

    // Back
    { id: "deadlift", name: "Barbell Deadlift", category: "back", muscle: "Entire Back", description: "The king of compound movements. Hinge at hips, keep back straight, and drive through heels to lift.", difficulty: "Advanced" },
    { id: "pull-up", name: "Pull Up", category: "back", muscle: "Lats", description: "Bodyweight mastery. Grip bar wide, pull chest to bar, lower slowly.", difficulty: "Intermediate" },
    { id: "lat-pulldown", name: "Lat Pulldown", category: "back", muscle: "Lats", description: "Machine alternative. Sit down, grip wide, pull bar to upper chest.", difficulty: "Beginner" },

    // Legs
    { id: "squat", name: "Barbell Squat", category: "legs", muscle: "Quads/Glutes", description: "Fundamental leg builder. Feet shoulder width, break at hips, sit back and down.", difficulty: "Advanced" },
    { id: "leg-press", name: "Leg Press", category: "legs", muscle: "Quads", description: "Machine power. Feet hip width on platform, lower weight until legs are at 90 degrees.", difficulty: "Beginner" },
    { id: "lunge", name: "Walking Lunge", category: "legs", muscle: "Quads/Glutes", description: "Unilateral dynamic strength. Step forward, drop back knee to ground, drive up.", difficulty: "Intermediate" },

    // Shoulders
    { id: "overhead-press", name: "Overhead Press", category: "shoulders", muscle: "Deltoids", description: "Strict military press. Barbell from collarbone to overhead lockout.", difficulty: "Intermediate" },
    { id: "lateral-raise", name: "Lateral Raise", category: "shoulders", muscle: "Side Delts", description: "Dumbbells at sides, raise outward until arms are parallel to floor.", difficulty: "Beginner" },

    // Arms
    { id: "dumbbell-curl", name: "Dumbbell Curl", category: "arms", muscle: "Biceps", description: "Classic arm builder. Supinate palms as you curl up.", difficulty: "Beginner" },
    { id: "tricep-pushdown", name: "Cable Pushdown", category: "arms", muscle: "Triceps", description: "Use rope or bar attachment. Keep elbows pinned to sides, extend arms down.", difficulty: "Beginner" },

    // Core
    { id: "plank", name: "Plank", category: "core", muscle: "Abs", description: "Isometric hold. Forearms on ground, body in straight line. Hold.", difficulty: "Beginner" },

    // Cardio
    { id: "treadmill", name: "Treadmill Run", category: "cardio", muscle: "Heart", description: "Indoor running. Set incline to 1% to mimic outdoor resistance.", difficulty: "Beginner" },
];

export const getExercisesByCategory = (category: string) =>
    exercises.filter(ex => ex.category === category);

export const getExerciseById = (id: string) =>
    exercises.find(ex => ex.id === id);
