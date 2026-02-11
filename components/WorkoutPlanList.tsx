"use client";

import { motion } from "framer-motion";
import { WORKOUT_PLANS, WorkoutPlan } from "@/lib/plans";
import { Trophy, Flame, Zap, Target, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutPlanListProps {
    onSelectPlan: (plan: WorkoutPlan) => void;
}

export function WorkoutPlanList({ onSelectPlan }: WorkoutPlanListProps) {
    const getLevelIcon = (level: string) => {
        switch (level) {
            case "Beginner": return <Star className="w-4 h-4 text-emerald-500" />;
            case "Intermediate": return <Zap className="w-4 h-4 text-primary" />;
            case "Advanced": return <Flame className="w-4 h-4 text-orange-500" />;
            default: return <Target className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight italic">Elite Protocols</h2>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">Tactical Programming</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow">
                    <Trophy className="w-6 h-6" />
                </div>
            </div>

            <div className="grid gap-6">
                {WORKOUT_PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        onClick={() => onSelectPlan(plan)}
                        className="group relative overflow-hidden p-8 rounded-[3rem] bg-surface-highlight border border-white/5 hover:border-primary/40 transition-all duration-500 cursor-pointer shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000 text-primary">
                            {getLevelIcon(plan.level)}
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                                            {plan.focus}
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                            {plan.level} Phase
                                        </div>
                                    </div>
                                    <h3 className="text-4xl font-display font-bold text-white italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-500">
                                        {plan.name}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-display font-bold text-white italic leading-none">{plan.durationWeeks}</p>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1">Weeks</p>
                                </div>
                            </div>

                            <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-[90%] italic">
                                "{plan.description}"
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((_, idx) => (
                                        <div key={idx} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-black text-zinc-500 uppercase">
                                        +12K
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-4 transition-all duration-500">
                                    Access Protocol <ArrowRight className="w-4 h-4 translate-y-[1px]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
