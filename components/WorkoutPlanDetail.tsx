"use client";

import { motion } from "framer-motion";
import { WorkoutPlan, DayPlan } from "@/lib/plans";
import {
    ChevronLeft, Calendar, Clock,
    ChevronRight, Dumbbell, Shield,
    Sparkles, CheckCircle2, Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exercises } from "@/lib/data";

interface WorkoutPlanDetailProps {
    plan: WorkoutPlan;
    onBack: () => void;
    onEnroll: (plan: WorkoutPlan) => void;
    isEnrolled?: boolean;
}

export function WorkoutPlanDetail({ plan, onBack, onEnroll, isEnrolled }: WorkoutPlanDetailProps) {
    const getExerciseName = (id: string) => exercises.find(e => e.id === id)?.name || id;

    return (
        <div className="relative min-h-[80vh] pb-32">
            {/* Header */}
            {/* Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between p-6 bg-black/60 backdrop-blur-3xl border-b border-white/5">
                <button
                    onClick={onBack}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary drop-shadow-md">{plan.focus}</span>
                    <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tighter italic leading-none">{plan.name}</h2>
                </div>
                <div className="w-12" /> {/* Spacer */}
            </header>

            <div className="px-6 space-y-10 py-8">
                {/* Hero Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Duration", value: `${plan.durationWeeks} Wks`, icon: Calendar },
                        { label: "Elite Lvl", value: plan.level, icon: Shield },
                        { label: "Impact", value: "High", icon: Sparkles }
                    ].map((stat, i) => (
                        <div key={i} className="p-5 rounded-[2.5rem] bg-surface-highlight border border-white/5 flex flex-col items-center gap-2 text-center shadow-xl">
                            <stat.icon className="w-5 h-5 text-primary drop-shadow-glow" />
                            <span className="text-sm font-display font-bold text-white uppercase italic">{stat.value}</span>
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* About */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Intelligence Brief</h3>
                    </div>
                    <p className="text-lg text-zinc-300 leading-relaxed font-medium italic tracking-tight">
                        "{plan.description} High-intensity protocol focused on maximum output and strategic recovery."
                    </p>
                </section>

                {/* Weekly Schedule */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Deployment Phase</h3>
                    </div>
                    <div className="space-y-4">
                        {plan.schedule.map((day, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={cn(
                                    "p-6 rounded-[2.5rem] border transition-all duration-500",
                                    day.type === "Workout"
                                        ? "bg-surface-highlight border-white/10 shadow-2xl"
                                        : "bg-black/20 border-white/5 opacity-40 grayscale"
                                )}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black",
                                            day.type === "Workout" ? "bg-primary text-black shadow-glow" : "bg-zinc-800 text-zinc-500"
                                        )}>
                                            0{idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-display font-bold text-white uppercase tracking-tight italic">{day.title}</h4>
                                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">
                                                {day.type === "Workout" ? `${day.exercises?.length || 0} Drills` : "Recovery System"}
                                            </p>
                                        </div>
                                    </div>
                                    {day.type === "Workout" && (
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                            <Dumbbell className="w-5 h-5 text-primary/40" />
                                        </div>
                                    )}
                                </div>

                                {day.type === "Workout" && day.exercises && (
                                    <div className="flex gap-2 flex-wrap">
                                        {day.exercises.slice(0, 3).map((ex, i) => (
                                            <span key={i} className="text-[9px] font-black text-zinc-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 uppercase tracking-widest italic">
                                                {getExerciseName(ex.exerciseId)}
                                            </span>
                                        ))}
                                        {day.exercises.length > 3 && (
                                            <span className="text-[9px] font-black text-primary px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 uppercase tracking-widest italic">
                                                +{day.exercises.length - 3} Units
                                            </span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-8 pb-10 bg-gradient-to-t from-black via-black/95 to-transparent z-40">
                <button
                    onClick={() => onEnroll(plan)}
                    disabled={isEnrolled}
                    className={cn(
                        "w-full h-18 rounded-[2rem] flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.3em] shadow-2xl transition-all duration-500",
                        isEnrolled
                            ? "bg-zinc-800 text-primary border border-primary/20 cursor-default"
                            : "bg-primary text-black hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-10px_rgba(217,255,91,0.4)]"
                    )}
                >
                    {isEnrolled ? (
                        <>
                            <CheckCircle2 className="w-6 h-6 drop-shadow-glow" />
                            Active Duty
                        </>
                    ) : (
                        <>
                            Initiate Protocol
                            <ArrowRight className="w-6 h-6 translate-y-[1px]" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function ArrowRight(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    );
}
