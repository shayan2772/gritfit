"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TrendingUp, Activity, Calendar, Zap, Target, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";



export function Dashboard() {
    const [workouts] = useLocalStorage<any[]>("gritfit_workouts", []);
    const [dailyGoal] = useLocalStorage<any>("gritfit_daily_goal_current", null);
    const [activePlan] = useLocalStorage<any>("gritfit_active_plan", null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const lastWorkout = workouts.length > 0 ? workouts[0] : null;
    const totalWorkouts = workouts.length;

    // Plan Progress Logic
    const getScheduledWorkout = () => {
        if (!activePlan) return null;
        const startDate = new Date(activePlan.enrolledAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(diffDays / 7) + 1;
        const currentDayIndex = today.getDay();

        const dayPlan = activePlan.schedule.find((d: any) => d.day === currentDayIndex);
        return {
            dayPlan,
            currentWeek,
            dayNumber: diffDays + 1
        };
    };

    const schedule = getScheduledWorkout();

    // Level System
    const getLevel = (count: number) => {
        if (count < 5) return { title: "Rookie", min: 0, max: 5 };
        if (count < 15) return { title: "Apprentice", min: 5, max: 15 };
        if (count < 30) return { title: "Athlete", min: 15, max: 30 };
        if (count < 60) return { title: "Pro", min: 30, max: 60 };
        return { title: "Legend", min: 60, max: 100 };
    };

    const level = getLevel(totalWorkouts);
    const progress = Math.min(100, ((totalWorkouts - level.min) / (level.max - level.min)) * 100);
    const currentStreak = totalWorkouts > 0 ? 3 : 0;

    return (
        <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">Your Pulse</h2>
                <Link href="/history" className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-[#1A1A1A] border border-white/5 rounded-full text-muted hover:text-primary hover:border-primary/30 transition-all duration-300">
                    History
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* ─── Active Rank Card ─── */}
                <div className="col-span-2 p-7 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                        <TrendingUp className="w-36 h-36 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-5">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Active Rank</p>
                                <h3 className="text-5xl font-display font-bold tracking-tight text-white uppercase leading-none">
                                    {level.title}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-display font-bold text-primary">{totalWorkouts}</p>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted">Drills</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(198,255,0,0.5)]"
                                />
                            </div>
                            <div className="flex justify-between text-xs font-bold text-muted">
                                <span className="text-primary/60">{level.min}</span>
                                <span>Target: {level.max}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Plan Card */}
                {activePlan && (
                    <div className="col-span-2 p-6 rounded-3xl bg-[#1A1A1A] border border-white/5 relative overflow-hidden group shadow-card">
                        <div className="absolute -right-4 -top-4 opacity-[0.04] group-hover:scale-110 transition-all duration-700">
                            <Calendar className="w-36 h-36 text-primary" />
                        </div>
                        <div className="relative z-10 flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Active Plan</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">W{schedule?.currentWeek} • D{schedule?.dayNumber}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight leading-none">{activePlan.name}</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{schedule?.dayPlan?.title || "Rest"}</div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Today's Split</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scheduled Workout CTA */}
                {schedule?.dayPlan?.type === "Workout" && (
                    <div className="col-span-2 p-7 rounded-3xl bg-primary text-black shadow-[0_10px_40px_-10px_rgba(198,255,0,0.35)] group cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                            <Activity className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 fill-current" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Next Session</span>
                                </div>
                                <h4 className="text-3xl font-bold uppercase leading-none tracking-tight">{schedule.dayPlan.title}</h4>
                                <p className="text-sm font-bold uppercase tracking-wider mt-2 opacity-70">
                                    {schedule.dayPlan.exercises?.length || 0} Drills • High Intensity
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                <Activity className="w-7 h-7" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Execution Matrix ─── */}
                <div className="col-span-2 p-6 rounded-3xl bg-[#1A1A1A] border border-white/5 relative overflow-hidden group shadow-card">
                    <div className="flex justify-between items-start mb-5 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Target className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Daily Goals</span>
                        </div>
                        <div className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">TODAY</div>
                    </div>

                    {dailyGoal && Array.isArray(dailyGoal) && dailyGoal.length > 0 ? (
                        <div className="space-y-3">
                            {dailyGoal.map((goal: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors group/goal">
                                    <div>
                                        <h4 className="text-lg font-bold text-white uppercase tracking-tight group-hover/goal:text-primary transition-colors">
                                            {goal.type === 'custom' ? goal.value : `${goal.value} ${goal.type}`}
                                        </h4>
                                        <p className="text-xs text-muted font-medium capitalize">{goal.type === 'custom' ? 'Custom Goal' : goal.type}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover/goal:scale-110 transition-transform">
                                        <Target className="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-10 flex-col gap-3 opacity-40">
                            <AlertCircle className="w-12 h-12 text-muted" />
                            <div className="text-center">
                                <h4 className="text-base font-bold text-muted uppercase">No Goals Set</h4>
                                <p className="text-xs text-muted mt-1">Set your daily target to stay focused</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Streak Card ─── */}
                <div className="p-6 rounded-3xl bg-[#1A1A1A] border border-white/5 flex flex-col justify-between aspect-square relative overflow-hidden group shadow-card">
                    <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700">
                        <Activity className="w-28 h-28 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                                <Activity className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">Streak</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-display font-bold text-white">{currentStreak}</span>
                            <span className="text-xs font-bold text-muted uppercase">Days</span>
                        </div>
                    </div>
                    <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Keep Going</p>
                </div>

                {/* ─── PR Insights Card ─── */}
                <div className="p-6 rounded-3xl bg-[#1A1A1A] border border-white/5 flex flex-col justify-between aspect-square group shadow-card">
                    <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-glow">
                                <Zap className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">Power</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-display font-bold text-white">12</span>
                            <span className="text-xs font-bold text-muted uppercase">Records</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-end gap-[3px] h-10 mb-3 px-1">
                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/10 rounded-t-sm group-hover:bg-primary/25 transition-colors duration-500" style={{ height: `${h}%` }}>
                                    <div className="w-full h-1 bg-primary/40 rounded-t-full" />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider">+15% Power</p>
                    </div>
                </div>

                {/* ─── Last Workout ─── */}
                {lastWorkout && (
                    <div className="col-span-2 p-7 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:scale-110 transition-transform duration-700">
                            <Calendar className="w-32 h-32 text-white" />
                        </div>
                        <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted">Last Session</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">
                                {new Date(lastWorkout.date).toLocaleDateString()}
                            </span>
                        </div>
                        <h4 className="text-3xl font-bold text-white uppercase tracking-tight mb-4">{lastWorkout.type}</h4>
                        <div className="flex gap-3">
                            <div className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-muted">
                                {lastWorkout.value}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-muted">
                                {Math.round(lastWorkout.duration / 60)} Mins
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
