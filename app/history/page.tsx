"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
    Calendar, Trophy, Zap, Activity, Apple,
    ChevronRight, ChevronDown, ChevronUp, Clock,
    BarChart3, Ruler, ListFilter
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type HistoryTab = 'Workouts' | 'Metrics' | 'Diet';

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState<HistoryTab>('Workouts');
    const [expandedItem, setExpandedItem] = useState<number | null>(null);

    const [workouts] = useLocalStorage<any[]>("gritfit_workouts", []);
    const [bmiHistory] = useLocalStorage<any[]>("gritfit_bmi_history", []);
    const [tdeeHistory] = useLocalStorage<any[]>("gritfit_tdee_history", []);
    const [dietHistory] = useLocalStorage<any[]>("gritfit_diet_history", []);

    const stats = useMemo(() => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekWorkouts = workouts.filter(w => new Date(w.date) >= startOfWeek);
        const totalCalories = weekWorkouts.reduce((acc, w) => acc + (w.calories || 0), 0);

        const dayCounts: Record<string, number> = {};
        workouts.forEach(w => {
            const day = new Date(w.date).toLocaleDateString([], { weekday: 'long' });
            dayCounts[day] = (dayCounts[day] || 0) + (w.calories || 0);
        });
        const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

        return {
            weekCount: weekWorkouts.length,
            calories: totalCalories,
            streak: weekWorkouts.length > 0 ? 3 : 0,
            bestDay
        };
    }, [workouts]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins}m`;
    };

    const renderSummary = () => (
        <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-5 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Workouts / Week</div>
                    <div className="text-3xl font-bold text-white">{stats.weekCount}</div>
                </div>
                <Trophy className="absolute -bottom-2 -right-2 w-16 h-16 text-primary/10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-5 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">Calories Burned</div>
                    <div className="text-3xl font-bold text-white">{stats.calories}</div>
                </div>
                <Zap className="absolute -bottom-2 -right-2 w-16 h-16 text-orange-400/10 group-hover:scale-110 transition-transform" />
            </div>
        </div>
    );

    const renderWorkouts = () => (
        <div className="space-y-4">
            {workouts.length === 0 ? (
                <EmptyState icon={Activity} label="No workouts logged" />
            ) : (
                workouts.map((workout) => (
                    <motion.div
                        key={workout.id}
                        layout
                        className="p-5 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card overflow-hidden"
                    >
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => setExpandedItem(expandedItem === workout.id ? null : workout.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">{workout.type}</div>
                                    <div className="text-xs text-muted font-medium">
                                        {new Date(workout.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {formatDuration(workout.duration)} • {workout.calories || 0} kcal
                                    </div>
                                </div>
                            </div>
                            {expandedItem === workout.id ? <ChevronUp className="text-muted w-5 h-5" /> : <ChevronDown className="text-muted w-5 h-5" />}
                        </div>

                        <AnimatePresence>
                            {expandedItem === workout.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-6 mt-4 border-t border-white/5 space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <div className="text-xs font-bold text-muted uppercase mb-1">Total Reps</div>
                                            <div className="text-xl font-bold text-white">{workout.totalReps || 0}</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <div className="text-xs font-bold text-muted uppercase mb-1">Avg Weight</div>
                                            <div className="text-xl font-bold text-white">
                                                {workout.sets ? Math.round(workout.sets.reduce((acc: any, s: any) => acc + (parseFloat(s.weight) || 0), 0) / workout.sets.length) : 0}kg
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-xs font-bold text-muted uppercase px-2 mb-2">Set Breakdown</div>
                                        {workout.sets?.map((set: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center px-4 py-2 rounded-xl bg-white/[0.03]">
                                                <div className="text-xs font-bold text-white">Set {idx + 1}</div>
                                                <div className="flex gap-6">
                                                    <div className="text-xs text-muted">
                                                        <span className="text-white font-bold">{set.weight}kg</span> Weight
                                                    </div>
                                                    <div className="text-xs text-muted">
                                                        <span className="text-white font-bold">{set.reps}</span> Reps
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))
            )}
        </div>
    );

    const renderMetrics = () => (
        <div className="space-y-6">
            {bmiHistory.length > 1 && (
                <div className="p-6 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted">BMI Trend</span>
                        </div>
                        <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Last {bmiHistory.length} logs</div>
                    </div>
                    <div className="h-24 w-full flex items-end gap-2 px-1">
                        {bmiHistory.slice().reverse().slice(-7).map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(h.value / 40) * 100}%` }}
                                    className="w-full bg-gradient-to-t from-primary/40 to-primary rounded-t-lg min-h-[4px]"
                                />
                                <span className="text-[8px] font-bold text-muted">{h.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted px-1">Recent Logs</h3>
                {bmiHistory.length === 0 && tdeeHistory.length === 0 ? (
                    <EmptyState icon={Ruler} label="No metrics tracked" />
                ) : (
                    <>
                        {bmiHistory.map(h => (
                            <div key={h.id} className="p-5 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Ruler className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">BMI: {h.value}</div>
                                        <div className="text-xs text-muted font-medium">{new Date(h.date).toLocaleDateString()} • {h.weight}kg</div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">{h.category}</div>
                            </div>
                        ))}
                        {tdeeHistory.map(h => (
                            <div key={h.id} className="p-5 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">TDEE: {h.maintenance} kcal</div>
                                            <div className="text-xs text-muted font-medium">{new Date(h.date).toLocaleDateString()} • {h.activity}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full">Daily Goal</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-xs bg-white/[0.03] border border-white/5 p-2 rounded-xl text-center">
                                        <span className="text-primary font-bold block">{h.fatLoss}</span> Fat Loss
                                    </div>
                                    <div className="text-xs bg-white/[0.03] border border-white/5 p-2 rounded-xl text-center">
                                        <span className="text-white font-bold block">{h.muscleGain}</span> Muscle Gain
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );

    const renderDietHistory = () => (
        <div className="space-y-4">
            {dietHistory.length === 0 ? (
                <EmptyState icon={Apple} label="No diets generated" />
            ) : (
                dietHistory.map((diet) => (
                    <div key={diet.id} className="p-6 rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-white">{diet.type}</h4>
                                <p className="text-xs text-muted font-medium">{new Date(diet.date).toLocaleDateString()}</p>
                            </div>
                            <Apple className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-white/80 leading-relaxed mb-4">
                            {diet.title}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {diet.meals.slice(0, 3).map((m: string, i: number) => (
                                <span key={i} className="text-xs font-bold bg-white/[0.03] border border-white/5 px-3 py-1 rounded-full text-muted">
                                    {m.split(' ')[0]}...
                                </span>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="min-h-screen px-6 pt-12 pb-32 bg-background transition-colors duration-300">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">History</h1>
                <p className="text-muted font-medium text-sm">Review your progress & past efforts</p>
            </header>

            {renderSummary()}

            {/* Tab Navigation */}
            <div className="flex bg-[#1A1A1A] border border-white/5 rounded-2xl p-1.5 mb-8">
                {(['Workouts', 'Metrics', 'Diet'] as HistoryTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300",
                            activeTab === tab
                                ? "bg-primary text-black shadow-[0_0_15px_rgba(198,255,0,0.2)]"
                                : "text-muted hover:text-white"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'Workouts' && renderWorkouts()}
                    {activeTab === 'Metrics' && renderMetrics()}
                    {activeTab === 'Diet' && renderDietHistory()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function EmptyState({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Icon className="w-16 h-16 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">{label}</p>
        </div>
    );
}
