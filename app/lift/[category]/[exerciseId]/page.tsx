"use client";

import { getExerciseById } from "@/lib/data";
import { ChevronLeft, Info, Layers, Eye, Zap, Target, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ActiveWorkout } from "@/components/ActiveWorkout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { getFitnessImage } from "@/lib/imageService";
import { OptimizedImage } from "@/components/OptimizedImage";

export default function ExercisePage() {
    const params = useParams();
    const category = params.category as string;
    const exerciseId = params.exerciseId as string;

    const exercise = getExerciseById(exerciseId);
    const [activePlan] = useLocalStorage<any>("gritfit_active_plan", null);
    const [mounted, setMounted] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        setMounted(true);
        const fetchImg = async () => {
            const url = await getFitnessImage(exerciseId, "exercise");
            setImageUrl(url);
        };
        fetchImg();
    }, [exerciseId]);

    if (!mounted) return null;
    if (!exercise) return notFound();

    // Progression targets from active plan
    const getPlanTarget = () => {
        if (!activePlan) return null;
        const today = new Date();
        const currentDayIndex = today.getDay();
        const dayPlan = activePlan.schedule.find((d: any) => d.day === currentDayIndex);
        if (dayPlan?.type === "Workout") {
            return dayPlan.exercises.find((ex: any) => ex.exerciseId === exerciseId);
        }
        return null;
    };

    const target = getPlanTarget();

    return (
        <div className="min-h-screen pb-32 bg-background text-foreground max-w-lg mx-auto overflow-x-hidden">
            {/* Immersive Header Image */}
            <div className="relative w-full h-[65vh] bg-black overflow-hidden">
                {imageUrl && (
                    <OptimizedImage
                        src={imageUrl}
                        alt={exercise.name}
                        priority
                        containerClassName="absolute inset-0 z-0"
                        className="brightness-50 grayscale-[0.2] scale-105"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/20 z-10" />

                <Link
                    href={`/lift/${category}`}
                    className="absolute top-14 left-6 z-50 w-14 h-14 rounded-2xl bg-black/60 backdrop-blur-3xl flex items-center justify-center text-white border border-white/10 hover:bg-primary hover:text-black hover:scale-110 active:scale-95 transition-all duration-500 shadow-2xl"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>

                {/* Floating Visualizer Controls */}
                <div className="absolute bottom-20 right-6 left-6 z-30 flex gap-4 overflow-x-auto py-4 no-scrollbar">
                    <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-glow active:scale-95 transition-all">
                        <Eye className="w-4 h-4" /> Tactical Vision
                    </button>
                    <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap active:scale-95 transition-all">
                        <Layers className="w-4 h-4 text-primary" /> Muscle Map
                    </button>
                </div>
            </div>

            <div className="px-6 -mt-16 relative z-40 space-y-10">
                <header>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">
                            {exercise.muscle} Target
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">
                            {exercise.difficulty} Level
                        </div>
                    </div>
                    <h1 className="text-6xl font-display font-bold text-white leading-[0.85] uppercase italic tracking-tighter drop-shadow-2xl">
                        {exercise.name}
                    </h1>
                </header>

                {target ? (
                    <div className="p-8 rounded-[3.5rem] bg-surface-highlight border border-white/10 backdrop-blur-3xl flex items-center justify-between shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 rounded-[2rem] bg-primary flex items-center justify-center shadow-glow">
                                <Target className="w-8 h-8 text-black" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1">Combat Load</p>
                                <h4 className="text-3xl font-display font-bold text-white italic uppercase tracking-tight leading-none">
                                    {target.sets} <span className="text-zinc-600">Sets</span> <span className="text-primary">×</span> {target.reps}
                                </h4>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Rest Interval</p>
                            <p className="text-2xl font-display font-bold text-white uppercase italic leading-none">{target.restSeconds}<span className="text-xs text-primary ml-1">SEC</span></p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 flex flex-col justify-between h-32 shadow-xl">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 italic">Focus Zone</p>
                                <h4 className="text-xl font-display font-bold text-white uppercase italic leading-none">Hypertrophy</h4>
                            </div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">8-12 Units / Set</p>
                        </div>
                        <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 flex flex-col justify-between h-32 shadow-xl">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2 italic">Safety Lock</p>
                                <h4 className="text-xl font-display font-bold text-white uppercase italic leading-none">Full ROM</h4>
                            </div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">Controlled Phase</p>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    <section className="p-8 rounded-[3.5rem] bg-surface-highlight border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-1000 text-primary">
                            <ShieldCheck className="w-16 h-16" />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Technical Briefing</h3>
                        </div>
                        <p className="text-xl text-zinc-300 font-medium leading-[1.4] italic tracking-tight">
                            "{exercise.description} Maintain maximum tension throughout the eccentric phase for optimal muscle fiber recruitment."
                        </p>
                    </section>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <ActiveWorkout
                                exercise={exercise}
                                planTargets={target ? {
                                    sets: target.sets,
                                    reps: target.reps,
                                    restSeconds: target.restSeconds
                                } : undefined}
                            />
                        </div>
                        <button className="w-24 rounded-[2.5rem] bg-surface-highlight border border-white/5 flex flex-col items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-500 active:scale-95 shadow-2xl group gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow">
                                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter italic">Add Unit</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
