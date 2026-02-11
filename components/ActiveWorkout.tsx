"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Plus, Save, Clock, Zap, Check, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Exercise } from "@/lib/data";

interface ActiveWorkoutProps {
    exercise: Exercise;
    planTargets?: {
        sets: number;
        reps: string;
        restSeconds: number;
    };
}

interface Set {
    weight: string;
    reps: string;
    completed: boolean;
}

export function ActiveWorkout({ exercise, planTargets }: ActiveWorkoutProps) {
    const [isActive, setIsActive] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Initialize sets based on plan targets or default 1 set
    const initialSets = planTargets
        ? Array(planTargets.sets).fill({ weight: "", reps: "", completed: false })
        : [{ weight: "", reps: "", completed: false }];

    const [sets, setSets] = useState<Set[]>(initialSets);
    const [workouts, setWorkouts] = useLocalStorage<any[]>("gritfit_workouts", []);

    // New states for Phase 2
    const [isResting, setIsResting] = useState(false);
    const [restTime, setRestTime] = useState(planTargets?.restSeconds || 60);
    const [showFocusMode, setShowFocusMode] = useState(false);
    const [progressionMessage, setProgressionMessage] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && !isPaused && !isResting) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else if (isResting && restTime > 0 && !isPaused) {
            interval = setInterval(() => {
                setRestTime((prev) => prev - 1);
            }, 1000);
        } else if (isResting && restTime === 0) {
            setIsResting(false);
            setRestTime(planTargets?.restSeconds || 60);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused, isResting, restTime, planTargets]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const calculateCalories = () => {
        // Basic estimation: 0.1 calories per second of lifting
        return Math.round(elapsedTime * 0.08);
    };

    const startWorkout = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const pauseWorkout = () => {
        setIsPaused(true);
    };

    const resumeWorkout = () => {
        setIsPaused(false);
    };

    const endWorkout = () => {
        if (window.confirm("Finish this workout?")) {
            const completedSets = sets.filter(s => s.completed && s.weight && s.reps);
            if (completedSets.length > 0) {
                const calories = calculateCalories();
                const totalReps = completedSets.reduce((acc, s) => acc + (parseInt(s.reps) || 0), 0);

                // Progression Logic: If user matched/exceeded target reps in all sets
                let achievedProgression = false;
                if (planTargets) {
                    const targetRepsMatch = planTargets.reps.match(/\d+/);
                    const targetMinReps = targetRepsMatch ? parseInt(targetRepsMatch[0]) : 10;
                    achievedProgression = completedSets.length >= planTargets.sets &&
                        completedSets.every(s => parseInt(s.reps) >= targetMinReps);
                }

                const newWorkout = {
                    id: Date.now(),
                    type: exercise.name,
                    date: new Date().toISOString(),
                    duration: elapsedTime,
                    sets: completedSets,
                    totalReps,
                    calories,
                    status: "Completed",
                    value: `${completedSets.length} sets • ${totalReps} reps`,
                    category: exercise.category,
                    progression: achievedProgression
                };
                setWorkouts([newWorkout, ...workouts]);

                if (achievedProgression) {
                    alert("PROGRESSED! 🚀 You hit all targets. Increase the weight next time!");
                }
            }
            setIsActive(false);
            setElapsedTime(0);
            setSets(initialSets);
        }
    };

    const addSet = () => {
        setSets([...sets, { weight: "", reps: "", completed: false }]);
    };

    const updateSet = (index: number, field: keyof Set, value: any) => {
        const newSets = [...sets];
        // @ts-ignore
        newSets[index][field] = value;
        setSets(newSets);

        // Trigger rest timer when a set is marked as completed
        if (field === "completed" && value === true) {
            setIsResting(true);
            setRestTime(planTargets?.restSeconds || 60);
        }
    };

    if (!isActive) {
        return (
            <button
                onClick={startWorkout}
                className="w-full h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-glow flex items-center justify-center gap-3 italic"
            >
                <Play className="w-5 h-5 fill-current" /> Initialize Set
            </button>
        );
    }

    const MainContent = () => (
        <div className="space-y-8">
            {/* Timer Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isResting ? "bg-primary text-black shadow-glow" : isPaused ? "bg-zinc-800 text-zinc-500" : "bg-primary/10 text-primary border border-primary/20"}`}>
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-3xl font-display font-bold text-white leading-none italic block tracking-tighter">
                            {isResting ? formatTime(restTime) : formatTime(elapsedTime)}
                        </span>
                        <span className="text-[9px] uppercase font-black tracking-[0.4em] text-zinc-600 mt-1 block italic leading-none">
                            {isResting ? "Recovery Phase" : isPaused ? "System Halted" : "Active Engagement"}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFocusMode(true)}
                        className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400 hover:text-primary hover:bg-primary/10 border border-white/5 transition-all flex items-center justify-center"
                        title="Focus Mode"
                    >
                        <Zap className="w-5 h-5" />
                    </button>
                    {isPaused ? (
                        <button onClick={resumeWorkout} className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center shadow-glow">
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                    ) : (
                        <button onClick={pauseWorkout} className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center border border-white/5">
                            <Pause className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={endWorkout} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-black transition-all">
                        <Square className="w-4 h-4 fill-current" />
                    </button>
                </div>
            </div>

            {/* Plan Targets Info */}
            {planTargets && !isResting && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
                        Elite Target: {planTargets.sets} <span className="text-white">×</span> {planTargets.reps}
                    </span>
                </div>
            )}

            {/* Calories Estimate */}
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">Energy Expenditure</span>
                </div>
                <span className="text-sm font-display font-bold text-white italic">{calculateCalories()} <span className="text-[10px] text-zinc-600">KCAL</span></span>
            </div>

            {/* Sets List */}
            <div className="space-y-4">
                <div className="grid grid-cols-[1fr_1fr_48px] gap-4 text-[9px] uppercase text-zinc-600 font-black tracking-[0.3em] px-4 italic">
                    <span>Tactical Load (kg)</span>
                    <span>Units (reps)</span>
                    <span className="text-center">Status</span>
                </div>

                {sets.map((set, i) => (
                    <div key={i} className={`grid grid-cols-[1fr_1fr_48px] gap-4 items-center transition-all duration-500 ${set.completed ? "opacity-20 grayscale" : "opacity-100"}`}>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0"
                                value={set.weight}
                                onChange={(e) => updateSet(i, "weight", e.target.value)}
                                className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-white placeholder-zinc-800 focus:outline-none focus:border-primary/40 text-center font-display font-bold text-xl italic"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0"
                                value={set.reps}
                                onChange={(e) => updateSet(i, "reps", e.target.value)}
                                className="w-full bg-black/60 border border-white/5 rounded-2xl py-3 px-4 text-white placeholder-zinc-800 focus:outline-none focus:border-primary/40 text-center font-display font-bold text-xl italic"
                            />
                        </div>
                        <button
                            onClick={() => updateSet(i, "completed", !set.completed)}
                            className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${set.completed ? "bg-primary text-black border-primary shadow-glow" : "bg-white/5 border-white/10 text-zinc-600 hover:border-primary/40"}`}
                        >
                            {set.completed ? <Check className="w-6 h-6" /> : <Save className="w-5 h-5 opacity-40" />}
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addSet}
                className="w-full py-4 rounded-[2rem] border border-dashed border-white/10 text-zinc-600 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-500 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] italic"
            >
                <Plus className="w-4 h-4" /> Add Tactical Set
            </button>
        </div>
    );

    return (
        <>
            <div className="p-8 rounded-[3.5rem] bg-surface-highlight border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                    <Zap className="w-32 h-32 text-primary" />
                </div>
                <MainContent />
            </div>

            {/* Focus Mode Overlay */}
            <AnimatePresence>
                {showFocusMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black p-8 flex flex-col items-center justify-between overflow-hidden"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(217,255,91,0.05)_0%,transparent_70%)] pointer-events-none" />

                        <header className="w-full flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Elite Focus Mode</span>
                            </div>
                            <button
                                onClick={() => setShowFocusMode(false)}
                                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </header>

                        <div className="text-center space-y-6 relative z-10 w-full px-4">
                            <h2 className="text-3xl font-display font-bold text-zinc-700 uppercase tracking-tighter italic leading-none">{exercise.name}</h2>
                            <div className={`text-[160px] font-display font-bold tabular-nums leading-none tracking-tighter ${isResting ? "text-primary drop-shadow-glow" : "text-white italic"}`}>
                                {isResting ? formatTime(restTime) : formatTime(elapsedTime)}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-2xl font-display font-bold text-zinc-500 uppercase tracking-tight italic">
                                    {isResting ? "Strategic Recovery" : `In Combat • ${calculateCalories()} kcal`}
                                </p>
                                <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden mt-4">
                                    <motion.div
                                        className="h-full bg-primary shadow-glow"
                                        animate={{ width: isResting ? `${(restTime / (planTargets?.restSeconds || 60)) * 100}%` : "100%" }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-sm space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-center shadow-2xl">
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-2 italic">Active Sets</p>
                                    <p className="text-5xl font-display font-bold text-white italic">{sets.filter(s => s.completed).length}<span className="text-xl text-zinc-800 mx-2">/</span>{sets.length}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const lastIdx = sets.findIndex(s => !s.completed);
                                        if (lastIdx !== -1) updateSet(lastIdx, "completed", true);
                                    }}
                                    disabled={sets.every(s => s.completed)}
                                    className="p-8 rounded-[2.5rem] bg-primary text-black flex flex-col items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 shadow-glow transition-all active:scale-95"
                                >
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">Complete Set</p>
                                    <Check className="w-10 h-10 font-black" />
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={isPaused ? resumeWorkout : pauseWorkout}
                                    className="flex-1 h-20 rounded-[2.5rem] bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-white/5 transition-all active:scale-95"
                                >
                                    {isPaused ? <Play className="w-8 h-8 fill-current text-primary" /> : <Pause className="w-8 h-8" />}
                                </button>
                                <button
                                    onClick={endWorkout}
                                    className="flex-1 h-20 rounded-[2.5rem] bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 hover:bg-red-500 hover:text-black transition-all active:scale-95 shadow-lg"
                                >
                                    <Square className="w-8 h-8 fill-current" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

