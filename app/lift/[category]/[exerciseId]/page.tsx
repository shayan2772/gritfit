import { getExerciseById } from "@/lib/data";
import { ChevronLeft, Info, Layers, Eye, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ActiveWorkout } from "@/components/ActiveWorkout";

interface PageProps {
    params: Promise<{ category: string; exerciseId: string }>;
}

export default async function ExercisePage({ params }: PageProps) {
    const { category, exerciseId } = await params;
    const exercise = getExerciseById(exerciseId);

    if (!exercise) return notFound();

    // List of exercises with generated assets
    const availableAssets = [
        "bench-press", "cable-fly", "deadlift", "incline-dumbbell-press", "pull-up",
        "lat-pulldown", "squat", "leg-press", "lunge", "overhead-press",
        "lateral-raise", "dumbbell-curl", "tricep-pushdown", "plank", "treadmill"
    ];
    const hasAsset = availableAssets.includes(exerciseId);

    return (
        <div className="min-h-screen pb-24 bg-background">
            {/* Immersive Header Image */}
            <div className="relative w-full h-[60vh] bg-surface overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-20" />
                <Link
                    href={`/lift/${category}`}
                    className="absolute top-12 left-6 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>

                {hasAsset ? (
                    <Image
                        src={`/exercises/${exerciseId}.png`}
                        alt={exercise.name}
                        fill
                        className="object-cover z-0"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 z-0">
                        <Zap className="w-12 h-12 text-gray-700 mb-4" />
                        <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">AI Visualization Pending</span>
                    </div>
                )}

                {/* Floating Visualizer Controls */}
                <div className="absolute bottom-4 right-6 left-6 z-30 flex gap-3 overflow-x-auto py-2 no-scrollbar">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                        <Eye className="w-3 h-3" /> Side View
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                        <Layers className="w-3 h-3" /> X-Ray Mode
                    </button>
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-40">
                <h1 className="text-4xl font-extrabold text-white mb-2 leading-tight drop-shadow-lg">
                    {exercise.name}
                </h1>
                <div className="flex items-center gap-2 mb-6 text-primary">
                    <Info className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wide">
                        {exercise.muscle} • {exercise.difficulty}
                    </span>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-white/80 border border-white/40 backdrop-blur-sm shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {exercise.description}
                        </p>
                    </div>

                    <ActiveWorkout exercise={exercise} />
                </div>
            </div>
        </div>
    );
}
