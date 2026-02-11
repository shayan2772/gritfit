"use client";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "";

interface ImageMapping {
    [key: string]: string;
}

const CATEGORY_QUERIES: ImageMapping = {
    chest: "professional bodybuilder barbell bench press gym",
    back: "muscular man deadlift gym professional",
    shoulders: "athlete overhead shoulder press dumbbells gym",
    arms: "biceps dumbbell curl arm day gym",
    legs: "heavy barbell back squat gym athlete",
    core: "man plank exercise workout core",
    cardio: "running on treadmill high intensity gym",
    "full-body": "functional training crossfit athlete",
    biceps: "biceps curl arm exercise gym",
    triceps: "triceps pushdown exercise machine gym",
    abs: "hanging leg raises abs workout gym"
};

const EXERCISE_QUERIES: ImageMapping = {
    // Chest
    "bench-press": "barbell bench press chest gym",
    "incline-dumbbell-press": "incline dumbbell press gym",
    "chest-fly-machine": "chest fly machine gym",
    "push-ups": "push ups exercise gym",
    "cable-crossover": "cable crossover chest gym",

    // Back
    "lat-pulldown": "lat pulldown back gym",
    "seated-cable-row": "seated cable row back",
    "deadlift": "barbell deadlift gym",
    "pull-up": "pull up back exercise",
    "t-bar-row": "t-bar row back gym",

    // Biceps
    "barbell-curl": "barbell biceps curl",
    "dumbbell-curl": "dumbbell biceps curl",
    "hammer-curl": "hammer curl biceps",
    "preacher-curl": "preacher curl gym",
    "cable-curl": "cable biceps curl",

    // Triceps
    "tricep-pushdown": "tricep pushdown rope",
    "dumbbell-overhead-extension": "overhead tricep extension",
    "skull-crusher": "skull crusher tricep",
    "bench-dips": "bench dip tricep",
    "close-grip-bench": "close grip bench press",

    // Legs
    "squat": "barbell squat legs gym",
    "leg-press": "leg press machine gym",
    "lunge": "lunges exercise gym",
    "romanian-deadlift": "romanian deadlift gym",
    "leg-curl-machine": "leg curl machine gym",

    // Shoulders
    "overhead-press": "overhead press shoulders",
    "lateral-raise": "lateral raise dumbbells",
    "front-raise": "front raise dumbbells",
    "arnold-press": "arnold press shoulders",
    "rear-delt-fly": "rear delt fly shoulders",

    // Abs
    "crunches": "abdominal crunches",
    "hanging-leg-raise": "hanging leg raise abs",
    "plank": "plank core exercise",
    "cable-crunch": "cable crunch abs",
    "russian-twist": "russian twist core",

    // Cardio
    "treadmill": "treadmill run cardio",
    "cycling": "cycling exercise bike",

    // Full Body
    "burpees": "burpee exercise",
    "kettlebell-swing": "kettlebell swing gym"
};

const SECTION_QUERIES: ImageMapping = {
    plans: "professional athlete training gym floor cinematic",
    diet: "healthy meal prep fitness food nutrition",
    profile: "portrait of muscular athlete gym lighting",
    history: "weights on gym floor cinematic lighting",
    premium: "premium luxury gym specialized equipment",
    tools: "fitness tracking app on phone gym context",
    banner: "dark aesthetic gym atmosphere weightlifting"
};

const FALLBACK_ASSETS: ImageMapping = {
    placeholder: "photo-1534438327276-14e5300c3a48",
    chest: "photo-1571019614242-c5c5dee9f50b",
    back: "photo-1526506118085-60ce8714f8c5",
    shoulders: "photo-1532384741394-fb4d3c4573f0",
    arms: "photo-1581009146145-b5ef050c2e1e",
    legs: "photo-1434596922112-19c563067271",
    core: "photo-1571019613454-1cb2f99b2d8b",
    cardio: "photo-1534438327276-14e5300c3a48",
    "full-body": "photo-1541534741688-6078c64b595d",
    biceps: "photo-1581009146145-b5ef050c2e1e",
    triceps: "photo-1530822847156-5df68d60ef6b",
    abs: "photo-1571019613454-1cb2f99b2d8b",
    banner: "photo-1540497077202-7c8a3999166f"
};

const getUnsplashUrl = (idOrQuery: string, isId: boolean = false) => {
    if (isId) return `https://images.unsplash.com/${idOrQuery}?auto=format&fit=crop&q=80&w=1000`;
    return `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000`; // Default fallback
};

export async function getFitnessImage(id: string, type: "category" | "exercise" | "section" = "exercise"): Promise<string> {
    const queryMap = type === "category" ? CATEGORY_QUERIES : type === "section" ? SECTION_QUERIES : EXERCISE_QUERIES;
    const query = (queryMap as any)[id] || `${id} gym exercise`;

    const cacheKey = `gritfit_img_v2_${id}`;
    if (typeof window !== "undefined") {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return cached;
    }

    try {
        if (!UNSPLASH_ACCESS_KEY) {
            const fallbackId = FALLBACK_ASSETS[id] || FALLBACK_ASSETS.placeholder;
            // For exercises without direct fallbacks, we use a more descriptive gym search URL format 
            // but since source.unsplash is unreliable, we'll map them to the closest category if possible
            return getUnsplashUrl(fallbackId, true);
        }

        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=portrait`);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            if (typeof window !== "undefined") {
                localStorage.setItem(cacheKey, imageUrl);
            }
            return imageUrl;
        }

        const fallbackId = FALLBACK_ASSETS[id] || FALLBACK_ASSETS.placeholder;
        return getUnsplashUrl(fallbackId, true);
    } catch (error) {
        console.error("Image Service Error:", error);
        const fallbackId = FALLBACK_ASSETS[id] || FALLBACK_ASSETS.placeholder;
        return getUnsplashUrl(fallbackId, true);
    }
}

export async function searchUnsplashImages(query: string, count: number = 10): Promise<string[]> {
    try {
        if (!UNSPLASH_ACCESS_KEY) {
            return Array(count).fill(getUnsplashUrl(FALLBACK_ASSETS.placeholder, true));
        }

        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${count}`);
        const data = await res.json();

        if (data.results && Array.isArray(data.results)) {
            return data.results.map((img: any) => img.urls.regular);
        }

        return [];
    } catch (error) {
        console.error("Search Unsplash Images Error:", error);
        return [];
    }
}
