"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Target, Clock, Zap,
    Footprints, Droplets, Check,
    Plus, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalOption {
    id: string;
    label: string;
    value: string;
    icon: any;
    color: string;
}

const PRESET_GOALS: Record<string, GoalOption[]> = {
    duration: [
        { id: "d1", label: "20 min", value: "20", icon: Clock, color: "text-blue-400" },
        { id: "d2", label: "30 min", value: "30", icon: Clock, color: "text-blue-400" },
        { id: "d3", label: "45 min", value: "45", icon: Clock, color: "text-blue-400" },
    ],
    calories: [
        { id: "c1", label: "200 kcal", value: "200", icon: Zap, color: "text-orange-400" },
        { id: "c2", label: "300 kcal", value: "300", icon: Zap, color: "text-orange-400" },
        { id: "c3", label: "400 kcal", value: "400", icon: Zap, color: "text-orange-400" },
    ],
    steps: [
        { id: "s1", label: "5k", value: "5000", icon: Footprints, color: "text-emerald-400" },
        { id: "s2", label: "8k", value: "8000", icon: Footprints, color: "text-emerald-400" },
        { id: "s3", label: "10k", value: "10000", icon: Footprints, color: "text-emerald-400" },
    ],
    water: [
        { id: "w1", label: "2L", value: "2", icon: Droplets, color: "text-cyan-400" },
        { id: "w2", label: "3L", value: "3", icon: Droplets, color: "text-cyan-400" },
        { id: "w3", label: "4L", value: "4", icon: Droplets, color: "text-cyan-400" },
    ],
};

interface DailyGoalModalProps {
    isOpen: boolean;
    onClose: (goal?: any) => void;
}

export function DailyGoalModal({ isOpen, onClose }: DailyGoalModalProps) {
    const [selectedGoals, setSelectedGoals] = useState<Record<string, string>>({});
    const [customGoal, setCustomGoal] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSelect = (category: string, value: string) => {
        setSelectedGoals(prev => {
            const next = { ...prev };
            if (next[category] === value) {
                delete next[category];
            } else {
                next[category] = value;
            }
            return next;
        });
        setCustomGoal("");
    };

    const handleSubmit = () => {
        const goals = Object.entries(selectedGoals).map(([type, value]) => ({
            type,
            value: PRESET_GOALS[type].find(o => o.value === value)?.label || value
        }));

        if (customGoal.trim()) {
            goals.push({ type: "custom", value: customGoal.trim() });
        }

        setIsSuccess(true);
        setTimeout(() => {
            onClose(goals);
            setIsSuccess(false);
            setSelectedGoals({});
            setCustomGoal("");
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => onClose()}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-sm bg-[#1A1A1A] border border-white/5 rounded-3xl shadow-card relative overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted">Focus of the Day</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
                                    Set Your <br />Daily Goal
                                </h2>
                            </div>
                            <button
                                onClick={() => onClose()}
                                className="p-2 rounded-full hover:bg-white/5 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-8 pb-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                            {Object.entries(PRESET_GOALS).map(([category, options]) => (
                                <div key={category} className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted/60 px-1 capitalize">
                                        {category}
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {options.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleSelect(category, opt.value)}
                                                className={cn(
                                                    "py-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 flex flex-col items-center gap-1",
                                                    selectedGoals[category] === opt.value
                                                        ? "bg-primary text-black border-primary scale-95 shadow-lg"
                                                        : "bg-[#111111] border-white/5 text-muted hover:border-primary/30"
                                                )}
                                            >
                                                <opt.icon className={cn("w-4 h-4", selectedGoals[category] === opt.value ? "text-black" : opt.color)} />
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-white/5">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted/60 px-1 block mb-3">
                                    Or set a custom target
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. 100 Pushups"
                                        value={customGoal}
                                        onChange={(e) => {
                                            setCustomGoal(e.target.value);
                                            setSelectedGoals({});
                                        }}
                                        className="w-full bg-[#111111] border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold text-white placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-300"
                                    />
                                    <Plus className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-30" />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 pt-4 border-t border-white/5 bg-[#151515]">
                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full py-4 rounded-full bg-primary text-black flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(198,255,0,0.3)]"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Goal Set! 🚀
                                    </motion.div>
                                ) : (
                                    <motion.div key="actions" className="flex gap-3">
                                        <button
                                            onClick={() => onClose()}
                                            className="flex-1 py-4 px-4 rounded-full text-xs font-bold uppercase tracking-widest text-muted hover:text-white hover:bg-white/5 transition-all duration-300"
                                        >
                                            Skip for now
                                        </button>
                                        <button
                                            disabled={Object.keys(selectedGoals).length === 0 && !customGoal.trim()}
                                            onClick={handleSubmit}
                                            className={cn(
                                                "flex-[1.5] py-4 px-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-all duration-300 flex items-center justify-center gap-2",
                                                (Object.keys(selectedGoals).length > 0 || customGoal.trim())
                                                    ? "bg-primary text-black shadow-[0_0_20px_rgba(198,255,0,0.2)] hover:scale-[1.02] active:scale-95"
                                                    : "bg-white/5 text-muted opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            Commit Goals
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
