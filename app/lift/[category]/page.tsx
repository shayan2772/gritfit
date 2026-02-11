"use client";

import { getExercisesByCategory } from "@/lib/data";
import { ChevronLeft, Target, Timer, Zap } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function CategoryPage() {
    const params = useParams();
    const category = params.category as string;
    const exercises = getExercisesByCategory(category);
    const [activePlan] = useLocalStorage<any>("gritfit_active_plan", null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (!exercises.length) return notFound();

    const getPlanTarget = (exerciseId: string) => {
        if (!activePlan) return null;
        const today = new Date();
        const currentDayIndex = today.getDay();
        const dayPlan = activePlan.schedule.find((d: any) => d.day === currentDayIndex);
        if (dayPlan?.type === "Workout") {
            return dayPlan.exercises.find((ex: any) => ex.exerciseId === exerciseId);
        }
        return null;
    };

    return (
        <div className="min-h-screen px-6 pt-16 pb-32 max-w-lg mx-auto">
            <header className="mb-12 flex items-center gap-6 relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-[80px] -z-10" />
                <Link
                    href="/"
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-3 bg-primary rounded-full shadow-glow" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary drop-shadow-md">Training Protocol</p>
                    </div>
                    <h1 className="text-5xl font-display font-bold capitalize tracking-tighter text-white italic uppercase leading-none drop-shadow-2xl">
                        {category}
                    </h1>
                </div>
            </header>

            <div className="space-y-6">
                {exercises.map((ex, i) => {
                    const target = getPlanTarget(ex.id);
                    return (
                        <motion.div
                            key={ex.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/lift/${category}/${ex.id}`}
                                className="block group"
                            >
                                <div className="relative overflow-hidden p-5 rounded-[3rem] bg-surface-highlight border border-white/5 group-hover:border-primary/40 transition-all duration-500 shadow-2xl">
                                    <div className="flex gap-5">
                                        {/* Small Square Thumbnail */}
                                        <div className="relative shrink-0">
                                            <ExerciseThumbnail
                                                exerciseId={ex.id}
                                                name={ex.name}
                                                className="w-28 h-28 rounded-[2rem] border border-white/10 group-hover:border-primary/30 transition-all duration-500"
                                            />
                                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                        </div>

                                        <div className="flex flex-col justify-between py-1 flex-1">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    {target ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                                            <Target className="w-3 h-3 text-primary animate-pulse" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary italic">Deployed Today</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border italic transition-all duration-500",
                                                                ex.difficulty === "Advanced" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                                    ex.difficulty === "Intermediate" ? "bg-primary/10 text-primary border-primary/20" :
                                                                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                            )}>
                                                                {ex.difficulty}
                                                            </span>
                                                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">
                                                                {ex.muscle} Target
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-display font-bold text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors duration-500 leading-none drop-shadow-2xl">
                                                    {ex.name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2">
                                                {target ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                                                            <Zap className="w-3 h-3 text-primary" />
                                                            <span className="text-[9px] font-black text-primary uppercase italic">{target.sets} Sets</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                                            <Timer className="w-3 h-3 text-zinc-500" />
                                                            <span className="text-[9px] font-black text-zinc-500 uppercase italic">{target.restSeconds}s Rest</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 border border-white/5 group-hover:border-primary/20 transition-all duration-500">
                                                        <div className="w-2 h-2 rounded-full bg-primary/40 shadow-glow" />
                                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic group-hover:text-white transition-colors">Combat Intel</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
