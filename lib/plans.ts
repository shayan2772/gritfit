import { Exercise } from "./data";

export interface PlanExercise {
    exerciseId: string;
    sets: number;
    reps: string;
    restSeconds: number;
}

export interface DayPlan {
    day: number;
    title: string;
    type: "Workout" | "Rest";
    exercises?: PlanExercise[];
}

export interface WorkoutPlan {
    id: string;
    name: string;
    description: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    durationWeeks: number;
    focus: "Muscle Gain" | "Fat Loss" | "Strength" | "Foundation";
    schedule: DayPlan[];
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
    {
        id: "foundation-4",
        name: "Foundation 4",
        description: "Perfect for beginners. Build a solid base with full-body movements.",
        level: "Beginner",
        durationWeeks: 4,
        focus: "Foundation",
        schedule: [
            {
                day: 1, title: "Full Body A", type: "Workout", exercises: [
                    { exerciseId: "squat", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "bench-press", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "lat-pulldown", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "plank", sets: 3, reps: "Hold 30s", restSeconds: 45 }
                ]
            },
            { day: 2, title: "Rest & Recovery", type: "Rest" },
            {
                day: 3, title: "Full Body B", type: "Workout", exercises: [
                    { exerciseId: "deadlift", sets: 3, reps: "10-12", restSeconds: 90 },
                    { exerciseId: "overhead-press", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "pull-up", sets: 3, reps: "AMRAP", restSeconds: 60 },
                    { exerciseId: "treadmill", sets: 1, reps: "15 min", restSeconds: 0 }
                ]
            },
            { day: 4, title: "Rest & Recovery", type: "Rest" },
            {
                day: 5, title: "Full Body A", type: "Workout", exercises: [
                    { exerciseId: "squat", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "bench-press", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "lat-pulldown", sets: 3, reps: "10-12", restSeconds: 60 }
                ]
            },
            {
                day: 6, title: "Active Recovery", type: "Workout", exercises: [
                    { exerciseId: "treadmill", sets: 1, reps: "20 min", restSeconds: 0 }
                ]
            },
            { day: 0, title: "Rest & Recovery", type: "Rest" }
        ]
    },
    {
        id: "hypertrophy-peak",
        name: "Hypertrophy Peak",
        description: "Intense 4-week split designed to maximize muscle growth.",
        level: "Intermediate",
        durationWeeks: 4,
        focus: "Muscle Gain",
        schedule: [
            {
                day: 1, title: "Push Day", type: "Workout", exercises: [
                    { exerciseId: "bench-press", sets: 4, reps: "8-10", restSeconds: 90 },
                    { exerciseId: "overhead-press", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "incline-dumbbell-press", sets: 3, reps: "10-12", restSeconds: 60 },
                    { exerciseId: "lateral-raise", sets: 3, reps: "15", restSeconds: 45 }
                ]
            },
            {
                day: 2, title: "Pull Day", type: "Workout", exercises: [
                    { exerciseId: "deadlift", sets: 3, reps: "5-8", restSeconds: 120 },
                    { exerciseId: "pull-up", sets: 4, reps: "AMRAP", restSeconds: 60 },
                    { exerciseId: "dumbbell-curl", sets: 3, reps: "12", restSeconds: 45 }
                ]
            },
            {
                day: 3, title: "Leg Day", type: "Workout", exercises: [
                    { exerciseId: "squat", sets: 4, reps: "8-10", restSeconds: 90 },
                    { exerciseId: "leg-press", sets: 3, reps: "12-15", restSeconds: 60 },
                    { exerciseId: "lunge", sets: 3, reps: "12 per leg", restSeconds: 60 }
                ]
            },
            { day: 4, title: "Rest Day", type: "Rest" },
            {
                day: 5, title: "Upper Body Power", type: "Workout", exercises: [
                    { exerciseId: "bench-press", sets: 3, reps: "5", restSeconds: 120 },
                    { exerciseId: "pull-up", sets: 3, reps: "Weighted", restSeconds: 90 }
                ]
            },
            {
                day: 6, title: "Lower Body Focus", type: "Workout", exercises: [
                    { exerciseId: "squat", sets: 3, reps: "5", restSeconds: 120 }
                ]
            },
            { day: 0, title: "Rest & Recovery", type: "Rest" }
        ]
    }
];
