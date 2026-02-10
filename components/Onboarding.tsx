"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, Target, Zap, Waves, User } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface UserPrefs {
    goal: string;
    experience: string;
    weeklyDays: string;
    skipped?: boolean;
}

export function Onboarding() {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(1);
    const [prefs, setPrefs] = useLocalStorage<UserPrefs | null>("gritfit_user_prefs", null);

    useEffect(() => {
        if (!prefs) {
            setShow(true);
        }
    }, [prefs]);

    const [localPrefs, setLocalPrefs] = useState({
        goal: "strength",
        experience: "beginner",
        weeklyDays: "3",
    });

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            finish();
        }
    };

    const finish = () => {
        setPrefs(localPrefs);
        setShow(false);
    };

    const skip = () => {
        setPrefs({ goal: "general", experience: "beginner", weeklyDays: "3", skipped: true });
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="w-full max-w-md space-y-8 relative">
                {/* Skip Button */}
                <button
                    onClick={skip}
                    className="absolute -top-12 right-0 text-gray-500 text-sm font-medium hover:text-white"
                >
                    Skip
                </button>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h1 className="text-4xl font-extrabold text-white">What's your goal?</h1>
                                <p className="text-gray-400">We'll tailor your training experience.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: "muscle", label: "Muscle Gain", icon: <Target className="w-5 h-5" />, desc: "Build mass and definition" },
                                    { id: "fat-loss", label: "Fat Loss", icon: <Waves className="w-5 h-5" />, desc: "Burn calories and get lean" },
                                    { id: "strength", label: "Strength", icon: <Zap className="w-5 h-5" />, desc: "Heavier lifts and power" },
                                    { id: "beginner", label: "Beginner", icon: <User className="w-5 h-5" />, desc: "Just starting my journey" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setLocalPrefs({ ...localPrefs, goal: item.id })}
                                        className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${localPrefs.goal === item.id
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/10 text-white"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${localPrefs.goal === item.id ? "bg-primary text-black" : "bg-white/10"}`}>
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold">{item.label}</p>
                                            <p className="text-xs opacity-60">{item.desc}</p>
                                        </div>
                                        {localPrefs.goal === item.id && <Check className="w-5 h-5 ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h1 className="text-4xl font-extrabold text-white">Your Level</h1>
                                <p className="text-gray-400">How would you describe your experience?</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: "beginner", label: "Newbie", desc: "0-6 months experience" },
                                    { id: "intermediate", label: "Intermediate", desc: "1-2 years regular training" },
                                    { id: "advanced", label: "Advanced", desc: "3+ years focused training" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setLocalPrefs({ ...localPrefs, experience: item.id })}
                                        className={`p-5 rounded-2xl border text-left transition-all ${localPrefs.experience === item.id
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/10 text-white"
                                            }`}
                                    >
                                        <p className="font-bold text-lg">{item.label}</p>
                                        <p className="text-sm opacity-60">{item.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <h1 className="text-4xl font-extrabold text-white">Workout Frequency</h1>
                                <p className="text-gray-400">How many days per week can you train?</p>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {["2", "3", "4", "5", "6"].map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => setLocalPrefs({ ...localPrefs, weeklyDays: day })}
                                        className={`h-20 rounded-2xl border flex flex-col items-center justify-center transition-all ${localPrefs.weeklyDays === day
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/10 text-white"
                                            }`}
                                    >
                                        <p className="text-2xl font-bold">{day}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Days</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-8">
                    <button
                        onClick={nextStep}
                        className="w-full py-5 rounded-2xl bg-primary text-black font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        {step === 3 ? "Finish Setup" : "Continue"} <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="flex justify-center gap-2 mt-6">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? "w-8 bg-primary" : "w-2 bg-white/10"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
