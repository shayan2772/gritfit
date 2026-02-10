"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TrendingUp, Activity, Calendar, Zap, Target, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";



export function Dashboard() {
    const [workouts] = useLocalStorage<any[]>("gritfit_workouts", []);
    const [dailyGoal] = useLocalStorage<any>("gritfit_daily_goal_current", null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const lastWorkout = workouts.length > 0 ? workouts[0] : null;
    const totalWorkouts = workouts.length;

    // Logic for Level System
    const getLevel = (count: number) => {
        if (count < 5) return { title: "Rookie", min: 0, max: 5 };
        if (count < 15) return { title: "Apprentice", min: 5, max: 15 };
        if (count < 30) return { title: "Athlete", min: 15, max: 30 };
        if (count < 60) return { title: "Pro", min: 30, max: 60 };
        return { title: "Legend", min: 60, max: 100 };
    };

    const level = getLevel(totalWorkouts);
    const progress = Math.min(100, ((totalWorkouts - level.min) / (level.max - level.min)) * 100);

    // Simple Streak Logic (Mocked for dashboard display)
    const currentStreak = totalWorkouts > 0 ? 3 : 0; // In a real app, this would calculate consecutive dates

    return (
        <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-foreground uppercase tracking-widest">Your Pulse</h2>
                <Link href="/history" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-500 hover:text-primary transition-colors">
                    History
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Level Card */}
                <div className="col-span-2 p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Current Rank</p>
                                <h3 className="text-4xl font-black italic tracking-tighter">{level.title}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black">{totalWorkouts}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Sessions</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50">
                                <span>{level.min}</span>
                                <span>Next: {level.max}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Goal Card */}
                <div className="col-span-2 p-5 rounded-[2rem] bg-primary/10 border border-primary/20 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Target className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Daily Goal</span>
                        </div>
                        {dailyGoal && (
                            <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">Today</div>
                        )}
                    </div>

                    {dailyGoal ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-2xl font-black text-foreground italic tracking-tight uppercase">
                                    {dailyGoal.type === 'custom' ? dailyGoal.value : `${dailyGoal.value} ${dailyGoal.type}`}
                                </h4>
                                <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">In Progress • Keep Grinding</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin-slow flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Target className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between opacity-50">
                            <div>
                                <h4 className="text-xl font-black text-foreground italic tracking-tight uppercase">No Goal Set</h4>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">Set one on next launch</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Streak Card */}
                <div className="p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 bg-orange-500/10 p-8 rounded-full">
                        <Activity className="w-12 h-12 text-orange-500/20" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-orange-500">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Streak</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-foreground">{currentStreak}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Days</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Keep the fire burning!</p>
                </div>

                {/* PR Insights Card */}
                <div className="p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm flex flex-col justify-between aspect-square">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <Zap className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Power</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-foreground">12</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">PRs</span>
                        </div>
                    </div>
                    <div>
                        {/* Simple Mini Chart Mockup */}
                        <div className="flex items-end gap-[2px] h-8 mb-2">
                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">+15% vs last week</p>
                    </div>
                </div>

                {/* Last Workout Quick View */}
                {lastWorkout && (
                    <div className="col-span-2 p-5 rounded-[2rem] bg-foreground text-background dark:bg-white dark:text-black shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Last Session</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                                {new Date(lastWorkout.date).toLocaleDateString()}
                            </span>
                        </div>
                        <h4 className="text-xl font-black uppercase italic mb-1">{lastWorkout.type}</h4>
                        <div className="flex gap-4">
                            <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-background/10 dark:bg-black/10 rounded-md">
                                {lastWorkout.value}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-background/10 dark:bg-black/10 rounded-md">
                                {Math.round(lastWorkout.duration / 60)} mins
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
