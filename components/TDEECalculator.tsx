"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Activity, User, Ruler, Weight, Calendar,
    Flame, ArrowDown, ArrowUp, Info,
    CheckCircle2, Loader2, RefreshCw
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const ACTIVITY_LEVELS = [
    { id: "sedentary", label: "Sedentary", desc: "Little/no exercise", multiplier: 1.2 },
    { id: "light", label: "Lightly Active", desc: "1–3 days/week", multiplier: 1.375 },
    { id: "moderate", label: "Moderately Active", desc: "3–5 days/week", multiplier: 1.55 },
    { id: "very", label: "Very Active", desc: "6–7 days/week", multiplier: 1.725 },
    { id: "super", label: "Super Active", desc: "Physical job + training", multiplier: 1.9 }
];

export function TDEECalculator() {
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [activity, setActivity] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);
    const [tdeeResults, setTdeeResults] = useState<{
        maintenance: number;
        fatLoss: number;
        muscleGain: number;
    } | null>(null);

    const [savedTDEE, setSavedTDEE] = useLocalStorage<any>("gritfit_last_tdee", null);
    const [tdeeHistory, setTdeeHistory] = useLocalStorage<any[]>("gritfit_tdee_history", []);

    useEffect(() => {
        if (savedTDEE) {
            setGender(savedTDEE.gender);
            setAge(savedTDEE.age);
            setHeight(savedTDEE.height);
            setWeight(savedTDEE.weight);
            setActivity(savedTDEE.activity);
            setTdeeResults(savedTDEE.results);
        }
    }, []);

    const calculateTDEE = () => {
        if (!gender || !age || !height || !weight || !activity) return;

        setIsCalculating(true);

        // Simulate calculation time for UX
        setTimeout(() => {
            const w = parseFloat(weight);
            const h = parseFloat(height);
            const a = parseFloat(age);
            const activityLevel = ACTIVITY_LEVELS.find(l => l.id === activity);
            const multiplier = activityLevel?.multiplier || 1.2;

            let bmr;
            if (gender === "male") {
                bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
            } else {
                bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
            }

            const maintenance = Math.round(bmr * multiplier);
            const results = {
                maintenance,
                fatLoss: maintenance - 500,
                muscleGain: maintenance + 500
            };

            const date = new Date().toISOString();
            setTdeeResults(results);
            setSavedTDEE({ gender, age, height, weight, activity, results, date });

            setTdeeHistory(prev => [{
                id: Date.now(),
                date,
                activity: activityLevel?.label,
                maintenance,
                fatLoss: results.fatLoss,
                muscleGain: results.muscleGain
            }, ...prev]);

            setIsCalculating(false);
        }, 800);
    };

    const isFormValid = gender && age && height && weight && activity;

    return (
        <div className="w-full max-w-md mx-auto space-y-8 pb-12">
            <div className="space-y-6">
                {/* Basic Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Gender</label>
                        <div className="flex bg-surface-highlight rounded-2xl p-1 gap-1">
                            {["male", "female"].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl text-xs font-bold transition-all capitalize",
                                        gender === g
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-muted-foreground hover:bg-surface"
                                    )}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            <Calendar className="w-3 h-3 text-accent" /> Age
                        </label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-transparent border-none text-2xl font-black text-foreground placeholder-muted-foreground/20 focus:ring-0 p-0"
                            placeholder="25"
                        />
                    </div>
                    <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            <Ruler className="w-3 h-3 text-primary" /> Height (cm)
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full bg-transparent border-none text-2xl font-black text-foreground placeholder-muted-foreground/20 focus:ring-0 p-0"
                            placeholder="175"
                        />
                    </div>
                    <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            <Weight className="w-3 h-3 text-secondary" /> Weight (kg)
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full bg-transparent border-none text-2xl font-black text-foreground placeholder-muted-foreground/20 focus:ring-0 p-0"
                            placeholder="75"
                        />
                    </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Activity Level</label>
                    <div className="grid gap-2">
                        {ACTIVITY_LEVELS.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setActivity(level.id)}
                                className={cn(
                                    "p-4 rounded-3xl border text-left transition-all flex items-center justify-between",
                                    activity === level.id
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-surface border-glass-border hover:border-primary/30"
                                )}
                            >
                                <div>
                                    <div className={cn("text-sm font-black", activity === level.id ? "text-primary" : "text-foreground")}>
                                        {level.label}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-medium">{level.desc}</div>
                                </div>
                                {activity === level.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={calculateTDEE}
                    disabled={!isFormValid || isCalculating}
                    className={cn(
                        "w-full py-5 rounded-2xl font-black text-white uppercase tracking-tighter text-xl shadow-xl transition-all flex items-center justify-center gap-3",
                        isFormValid
                            ? "bg-gradient-to-r from-primary via-accent to-secondary shadow-primary/20 hover:shadow-primary/40 active:scale-95"
                            : "bg-surface-highlight text-muted-foreground opacity-50 cursor-not-allowed"
                    )}
                >
                    {isCalculating ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Calculating...</span>
                        </>
                    ) : (
                        <>
                            <span>Calculate Energy</span>
                            <Activity className="w-6 h-6" />
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {tdeeResults && !isCalculating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Your Daily Calorie Targets</h2>

                        <div className="grid gap-4">
                            {/* Maintenance */}
                            <div className="p-6 rounded-[2rem] bg-surface border border-glass-border shadow-sm flex items-center justify-between relative overflow-hidden group">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                        <Activity className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Maintenance</div>
                                        <div className="text-3xl font-black text-foreground tracking-tighter">
                                            {tdeeResults.maintenance} <span className="text-sm text-muted-foreground font-bold">kcal</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full relative z-10">Stable</div>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Activity className="w-24 h-24" />
                                </div>
                            </div>

                            {/* Fat Loss */}
                            <div className="p-6 rounded-[2rem] bg-surface border border-glass-border shadow-sm flex items-center justify-between relative overflow-hidden group">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <ArrowDown className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Fat Loss</div>
                                        <div className="text-3xl font-black text-foreground tracking-tighter">
                                            {tdeeResults.fatLoss} <span className="text-sm text-muted-foreground font-bold">kcal</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-full relative z-10">-500 kcal</div>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <ArrowDown className="w-24 h-24" />
                                </div>
                            </div>

                            {/* Muscle Gain */}
                            <div className="p-6 rounded-[2rem] bg-surface border border-glass-border shadow-sm flex items-center justify-between relative overflow-hidden group">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                        <ArrowUp className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Muscle Gain</div>
                                        <div className="text-3xl font-black text-foreground tracking-tighter">
                                            {tdeeResults.muscleGain} <span className="text-sm text-muted-foreground font-bold">kcal</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full relative z-10">+500 kcal</div>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <ArrowUp className="w-24 h-24" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-3xl bg-surface-highlight border border-glass-border flex items-start gap-3">
                            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                These results are estimates based on the Mifflin-St Jeor equation. For the best results, track your intake and adjust based on your body's response over 2-3 weeks.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setGender(""); setAge(""); setHeight(""); setWeight(""); setActivity(""); setTdeeResults(null); setSavedTDEE(null);
                            }}
                            className="w-full py-4 rounded-2xl bg-surface border border-glass-border text-xs font-bold text-muted-foreground flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reset Calculator</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
