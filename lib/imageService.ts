"use client";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ""; // Would be set in .env

interface ImageMapping {
    [key: string]: string;
}

const CATEGORY_QUERIES: ImageMapping = {
    chest: "man doing barbell bench press heavy gym",
    back: "professional bodybuilder deadlift gym session",
    shoulders: "man doing overhead shoulder press dumbbells gym",
    arms: "biceps dumbbell curl arm day gym",
    legs: "man doing heavy barbell back squat gym",
    core: "man doing plank exercise fitness studio",
    cardio: "man running on treadmill modern gym",
    "full-body": "crossfit functional training group gym",
    biceps: "man doing biceps curl exercise gym",
    triceps: "man doing triceps extension pushdown gym",
    abs: "athlete doing hanging leg raises abs gym"
};

const EXERCISE_QUERIES: ImageMapping = {
    // Chest
    "bench-press": "barbell bench press proper form gym",
    "incline-dumbbell-press": "incline dumbbell chest press workout gym",
    "chest-fly-machine": "chest fly machine exercise gym",
    "push-ups": "man doing push ups gym floor",
    "cable-crossover": "cable crossover chest exercise gym",

    // Back
    "lat-pulldown": "lat pulldown machine gym professional",
    "seated-cable-row": "seated cable row back exercise gym",
    "deadlift": "barbell deadlift proper form heavy gym",
    "pull-up": "man doing wide grip pull ups gym",
    "t-bar-row": "t-bar row back exercise gym",

    // Biceps
    "barbell-curl": "barbell biceps curl proper form gym",
    "dumbbell-curl": "hammer curl dumbbell gym alternating",
    "hammer-curl": "hammer curl dumbbell gym",
    "preacher-curl": "preacher curl biceps exercise gym",
    "cable-curl": "cable biceps curl exercise gym",

    // Triceps
    "tricep-pushdown": "rope tricep pushdown gym extension",
    "dumbbell-overhead-extension": "dumbbell overhead triceps extension gym",
    "skull-crusher": "skull crushers triceps exercise gym",
    "bench-dips": "man doing tricep bench dips gym",
    "close-grip-bench": "close grip bench press triceps gym",

    // Legs
    "squat": "barbell squat proper form gym",
    "leg-press": "leg press machine gym workout",
    "lunge": "walking lunges dumbbells gym form",
    "romanian-deadlift": "romanian deadlift hamstrings gym",
    "leg-curl-machine": "leg curl machine exercise gym",

    // Shoulders
    "overhead-press": "overhead shoulder press barbell gym",
    "lateral-raise": "lateral raises dumbbells shoulders gym",
    "front-raise": "front raises dumbbells exercise gym",
    "arnold-press": "arnold press dumbbells shoulders gym",
    "rear-delt-fly": "rear delt fly dumbbells exercise gym",

    // Abs
    "crunches": "man doing crunches abs gym mats",
    "hanging-leg-raise": "hanging leg raises abs gym",
    "plank": "plank exercise core gym",
    "cable-crunch": "cable crunch abs exercise gym",
    "russian-twist": "russian twists core exercise gym",

    // Cardio
    "treadmill": "man running on treadmill gym",
    "cycling": "stationary bike cycling gym",

    // Full Body
    "burpees": "man doing burpees exercise gym",
    "kettlebell-swing": "kettlebell swing exercise gym form"
};

const SECTION_QUERIES: ImageMapping = {
    plans: "professional athlete training gym floor cinematic",
    diet: "healthy meal prep fitness food nutrition",
    profile: "portrait of muscular athlete gym lighting",
    history: "weights on gym floor cinematic lighting",
    premium: "premium luxury gym specialized equipment",
    tools: "fitness tracking app on phone gym context",
};

const FALLBACK_IMAGES: ImageMapping = {
    placeholder: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000", // Weights shelf
    chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000",
    legs: "https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&q=80&w=1000",
};

export async function getFitnessImage(id: string, type: "category" | "exercise" | "section" = "exercise"): Promise<string> {
    const queryMap = type === "category" ? CATEGORY_QUERIES : type === "section" ? SECTION_QUERIES : EXERCISE_QUERIES;
    const query = (queryMap as any)[id] || `${id} gym exercise`;

    // Check local storage cache first
    const cacheKey = `gritfit_img_cache_${id}`;
    if (typeof window !== "undefined") {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return cached;
    }

    try {
        // We'll use a public search API or a mock service if key is missing
        // For demonstration purposes, we use Unsplash Source (deprecated but still works for many queries) 
        // or a reliable developer proxy in a real production app.
        // Falling back to a structured Unsplash search URL which works as a dynamic source.
        const encodedQuery = encodeURIComponent(query);
        const imageUrl = `https://source.unsplash.com/featured/800x1000/?${encodedQuery}`;

        // In a real implementation with Access Key:
        // const res = await fetch(`https://api.unsplash.com/photos/random?query=${encodedQuery}&client_id=${UNSPLASH_ACCESS_KEY}`);
        // const data = await res.json();
        // const imageUrl = data.urls.regular;

        if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, imageUrl);
        }

        return imageUrl;
    } catch (error) {
        console.error("Image Service Error:", error);
        return FALLBACK_IMAGES[id] || FALLBACK_IMAGES.placeholder;
    }
}
