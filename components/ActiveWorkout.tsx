"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Plus, Save, Clock, Zap, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Exercise } from "@/lib/data";

interface ActiveWorkoutProps {
    exercise: Exercise;
}

interface Set {
    weight: string;
    reps: string;
    completed: boolean;
}

export function ActiveWorkout({ exercise }: ActiveWorkoutProps) {
    const [isActive, setIsActive] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [sets, setSets] = useState<Set[]>([{ weight: "", reps: "", completed: false }]);
    const [workouts, setWorkouts] = useLocalStorage<any[]>("gritfit_workouts", []);

    // New states for Phase 2
    const [isResting, setIsResting] = useState(false);
    const [restTime, setRestTime] = useState(60);
    const [showFocusMode, setShowFocusMode] = useState(false);

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
            setRestTime(60);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused, isResting, restTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const calculateCalories = () => {
        // Very basic estimation: 0.1 calories per second of lifting
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
                const newWorkout = {
                    id: Date.now(),
                    type: exercise.name,
                    date: new Date().toISOString(),
                    duration: elapsedTime,
                    sets: completedSets,
                    totalReps,
                    calories,
                    status: "Completed",
                    value: `${completedSets.length} sets • ${totalReps} reps`, // Summary for history
                    category: exercise.category
                };
                setWorkouts([newWorkout, ...workouts]);
            }
            setIsActive(false);
            setElapsedTime(0);
            setSets([{ weight: "", reps: "", completed: false }]);
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
            setRestTime(60);
        }
    };

    if (!isActive) {
        return (
            <button
                onClick={startWorkout}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent font-bold text-black uppercase tracking-widest hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
            >
                <Play className="w-5 h-5" /> Start Set
            </button>
        );
    }

    const MainContent = () => (
        <div className="space-y-6">
            {/* Timer Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isResting ? "bg-primary/20 text-primary animate-pulse" : isPaused ? "bg-amber-500/20 text-amber-500" : "bg-green-500/20 text-green-500"}`}>
                        <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-mono font-bold text-white leading-none">
                            {isResting ? formatTime(restTime) : formatTime(elapsedTime)}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                            {isResting ? "Resting" : "Working"}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFocusMode(true)}
                        className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                        title="Focus Mode"
                    >
                        <Zap className="w-5 h-5" />
                    </button>
                    {isPaused ? (
                        <button onClick={resumeWorkout} className="p-2 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            <Play className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={pauseWorkout} className="p-2 rounded-full bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">
                            <Pause className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={endWorkout} className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30">
                        <Square className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Calories Estimate */}
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                    ~{calculateCalories()} kcal burned
                </span>
            </div>

            {/* Sets List */}
            <div className="space-y-3">
                <div className="grid grid-cols-[1fr_1fr_40px] gap-2 text-xs uppercase text-gray-400 font-bold tracking-wider px-2">
                    <span>Weight (kg)</span>
                    <span>Reps</span>
                    <span className="text-center">Done</span>
                </div>

                {sets.map((set, i) => (
                    <div key={i} className={`grid grid-cols-[1fr_1fr_40px] gap-2 items-center transition-all ${set.completed ? "opacity-30 scale-95" : "opacity-100"}`}>
                        <input
                            type="number"
                            placeholder="0"
                            value={set.weight}
                            onChange={(e) => updateSet(i, "weight", e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-center font-bold"
                        />
                        <input
                            type="number"
                            placeholder="0"
                            value={set.reps}
                            onChange={(e) => updateSet(i, "reps", e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-center font-bold"
                        />
                        <button
                            onClick={() => updateSet(i, "completed", !set.completed)}
                            className={`h-10 w-10 rounded-lg flex items-center justify-center border transition-all ${set.completed ? "bg-primary text-black border-primary" : "bg-transparent border-white/10 text-gray-500 hover:border-primary/50"}`}
                        >
                            {set.completed ? <Check className="w-5 h-5" /> : <Save className="w-4 h-4" />}
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addSet}
                className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" /> Add Set
            </button>
        </div>
    );

    return (
        <>
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Zap className="w-24 h-24" />
                </div>
                <MainContent />
            </div>

            {/* Focus Mode Overlay */}
            <AnimatePresence>
                {showFocusMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[150] bg-black p-8 flex flex-col items-center justify-between"
                    >
                        <header className="w-full flex justify-between items-center text-white/50">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                <span className="text-sm font-bold uppercase tracking-widest">Focus Mode</span>
                            </div>
                            <button onClick={() => setShowFocusMode(false)} className="p-2">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </header>

                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold text-white/40 uppercase tracking-[0.2em]">{exercise.name}</h2>
                            <div className={`text-[120px] font-mono font-black tabular-nums leading-none ${isResting ? "text-primary" : "text-white"}`}>
                                {isResting ? formatTime(restTime) : formatTime(elapsedTime)}
                            </div>
                            <p className="text-xl font-bold text-gray-500 uppercase tracking-widest">
                                {isResting ? "Recovering" : `Working • ${calculateCalories()} kcal`}
                            </p>
                        </div>

                        <div className="w-full max-w-sm space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">Current Set</p>
                                    <p className="text-4xl font-black text-white">{sets.length}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const lastIdx = sets.length - 1;
                                        updateSet(lastIdx, "completed", true);
                                    }}
                                    disabled={sets[sets.length - 1].completed}
                                    className="p-6 rounded-3xl bg-primary text-black flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                                >
                                    <p className="text-xs font-bold uppercase">End Set</p>
                                    <Check className="w-8 h-8 font-black" />
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={isPaused ? resumeWorkout : pauseWorkout} className="flex-1 py-6 rounded-3xl bg-white/10 text-white flex items-center justify-center">
                                    {isPaused ? <Play className="w-8 h-8" /> : <Pause className="w-8 h-8" />}
                                </button>
                                <button onClick={endWorkout} className="flex-1 py-6 rounded-3xl bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/20">
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

