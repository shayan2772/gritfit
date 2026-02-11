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
        <div className="fixed inset-0 z-[200] bg-[#0E0E0E] flex items-center justify-center p-6">
            {/* Ambient glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md space-y-8 relative">
                {/* Skip */}
                <button
                    onClick={skip}
                    className="absolute -top-12 right-0 text-muted text-sm font-medium hover:text-white transition-colors"
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
                                <h1 className="text-4xl font-bold text-white">What's your goal?</h1>
                                <p className="text-muted">We'll tailor your training experience.</p>
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
                                        className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${localPrefs.goal === item.id
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-[#1A1A1A] border-white/5 text-white hover:border-white/20"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${localPrefs.goal === item.id ? "bg-primary text-black" : "bg-white/5"}`}>
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold">{item.label}</p>
                                            <p className="text-xs text-muted">{item.desc}</p>
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
                                <h1 className="text-4xl font-bold text-white">Your Level</h1>
                                <p className="text-muted">How would you describe your experience?</p>
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
                                        className={`p-5 rounded-2xl border text-left transition-all duration-300 ${localPrefs.experience === item.id
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-[#1A1A1A] border-white/5 text-white hover:border-white/20"
                                            }`}
                                    >
                                        <p className="font-bold text-lg">{item.label}</p>
                                        <p className="text-sm text-muted">{item.desc}</p>
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
                                <h1 className="text-4xl font-bold text-white">Workout Frequency</h1>
                                <p className="text-muted">How many days per week can you train?</p>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {["2", "3", "4", "5", "6"].map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => setLocalPrefs({ ...localPrefs, weeklyDays: day })}
                                        className={`h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 ${localPrefs.weeklyDays === day
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-[#1A1A1A] border-white/5 text-white hover:border-white/20"
                                            }`}
                                    >
                                        <p className="text-2xl font-bold">{day}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Days</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={nextStep}
                        className="w-full py-5 rounded-full bg-primary text-black font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(198,255,0,0.25)] hover:shadow-[0_0_35px_rgba(198,255,0,0.4)] transition-shadow duration-500"
                    >
                        {step === 3 ? "Finish Setup" : "Continue"} <ChevronRight className="w-5 h-5" />
                    </motion.button>

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
