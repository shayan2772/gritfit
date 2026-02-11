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
        <div className="w-full max-w-md mx-auto space-y-10 pb-12">
            <div className="space-y-8">
                {/* Basic Inputs */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl group">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-3 italic">Gender Sector</label>
                        <div className="flex bg-black rounded-2xl p-1 gap-1 border border-white/5">
                            {["male", "female"].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 italic",
                                        gender === g
                                            ? "bg-primary text-black shadow-glow"
                                            : "text-zinc-600 hover:bg-white/5"
                                    )}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl focus-within:border-primary/40 transition-all duration-500">
                        <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3 italic">
                            <Calendar className="w-4 h-4 text-primary" /> Service Age
                        </label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-transparent border-none text-2xl font-display font-bold text-white placeholder-zinc-800 focus:ring-0 p-0 italic"
                            placeholder="25"
                        />
                    </div>
                    <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl focus-within:border-primary/40 transition-all duration-500">
                        <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3 italic">
                            <Ruler className="w-4 h-4 text-primary" /> Elevation (cm)
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full bg-transparent border-none text-2xl font-display font-bold text-white placeholder-zinc-800 focus:ring-0 p-0 italic"
                            placeholder="175"
                        />
                    </div>
                    <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl focus-within:border-primary/40 transition-all duration-500">
                        <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3 italic">
                            <Weight className="w-4 h-4 text-primary" /> Mass (kg)
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full bg-transparent border-none text-2xl font-display font-bold text-white placeholder-zinc-800 focus:ring-0 p-0 italic"
                            placeholder="75"
                        />
                    </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-1 h-3 bg-zinc-800 rounded-full" />
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Operational Frequency</label>
                    </div>
                    <div className="grid gap-3">
                        {ACTIVITY_LEVELS.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setActivity(level.id)}
                                className={cn(
                                    "p-6 rounded-[2.5rem] border transition-all duration-500 flex items-center justify-between group",
                                    activity === level.id
                                        ? "bg-primary/5 border-primary/40 shadow-glow"
                                        : "bg-surface-highlight border-white/5 hover:border-primary/30"
                                )}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl bg-black border flex items-center justify-center transition-all duration-500",
                                        activity === level.id ? "border-primary/40 text-primary" : "border-white/5 text-zinc-700"
                                    )}>
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className={cn("text-lg font-display font-bold uppercase italic leading-none mb-1 transition-colors", activity === level.id ? "text-primary" : "text-white")}>
                                            {level.label}
                                        </div>
                                        <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{level.desc}</div>
                                    </div>
                                </div>
                                {activity === level.id && (
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-glow">
                                        <CheckCircle2 className="w-5 h-5 text-black" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={calculateTDEE}
                    disabled={!isFormValid || isCalculating}
                    className={cn(
                        "w-full h-18 rounded-[2.5rem] font-black text-black uppercase tracking-[0.5em] text-sm shadow-glow transition-all duration-500 flex items-center justify-center gap-4 italic",
                        isFormValid
                            ? "bg-primary active:scale-95 hover:scale-[1.02]"
                            : "bg-zinc-900 text-zinc-700 opacity-50 cursor-not-allowed"
                    )}
                >
                    {isCalculating ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Processing Intel...</span>
                        </>
                    ) : (
                        <>
                            <span>Run Energy Scan</span>
                            <Activity className="w-6 h-6" />
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {tdeeResults && !isCalculating && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Target Parameters</h2>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { id: 'maint', label: 'Baseline', value: tdeeResults.maintenance, sub: 'Daily Maintenance', color: 'text-zinc-400', icon: Activity, badge: 'STABLE' },
                                { id: 'loss', label: 'Aggressive', value: tdeeResults.fatLoss, sub: 'Fat Loss Protocol', color: 'text-primary', icon: ArrowDown, badge: '-500 KCAL' },
                                { id: 'gain', label: 'Hypertrophy', value: tdeeResults.muscleGain, sub: 'Muscle Gain Protocol', color: 'text-emerald-500', icon: ArrowUp, badge: '+500 KCAL' }
                            ].map((res) => (
                                <div key={res.id} className="p-8 rounded-[3rem] bg-surface-highlight border border-white/5 shadow-2xl flex items-center justify-between relative overflow-hidden group">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={cn("w-16 h-16 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500 shadow-xl", res.color)}>
                                            <res.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2 italic">{res.label}</div>
                                            <div className="text-4xl font-display font-bold text-white tracking-tighter italic leading-none">
                                                {res.value} <span className="text-xs text-zinc-700 uppercase ml-1">KCAL / DAY</span>
                                            </div>
                                            <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] mt-3 italic">{res.sub}</div>
                                        </div>
                                    </div>
                                    <div className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/5 relative z-10 italic transition-all duration-500 group-hover:scale-110", res.color === 'text-primary' ? 'bg-primary/10 border-primary/20' : 'bg-white/5')}>
                                        {res.badge}
                                    </div>
                                    <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-1000">
                                        <res.icon className="w-40 h-40 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 rounded-[3rem] bg-zinc-950/50 border border-white/5 flex items-start gap-4 shadow-xl">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                                <Info className="w-5 h-5 text-zinc-600" />
                            </div>
                            <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.1em] leading-relaxed italic">
                                Results based on Mifflin-St Jeor protocols. Track biometric response for 14-21 combat rotations and adjust accordingly.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setGender(""); setAge(""); setHeight(""); setWeight(""); setActivity(""); setTdeeResults(null); setSavedTDEE(null);
                            }}
                            className="w-full h-14 rounded-2xl bg-black border border-white/5 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white/5 hover:text-white active:scale-95 transition-all duration-500 italic"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Wipe Session Intel</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
