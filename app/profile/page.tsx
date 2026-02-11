"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
    User, Ruler, Weight, Phone, Mail, Calendar,
    Target, Award, Camera, CheckCircle2, ChevronRight,
    Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface Profile {
    image: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    gender: string;
    dob: string;
    height: string;
    weight: string;
    fitnessGoal: 'Muscle Gain' | 'Fat Loss' | 'Strength' | '';
    experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | '';
}

export default function ProfilePage() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useLocalStorage<Profile>("gritfit_profile_v2", {
        image: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        gender: "",
        dob: "",
        height: "",
        weight: "",
        fitnessGoal: "",
        experienceLevel: ""
    });

    const [workouts] = useLocalStorage<any[]>("gritfit_workouts", []);

    useEffect(() => {
        // Simulate loading for skeleton effect
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    const isFormValid = profile.fullName && profile.phoneNumber && profile.gender && profile.dob && profile.height && profile.weight && profile.fitnessGoal && profile.experienceLevel;

    if (isLoading) {
        return (
            <div className="min-h-screen px-6 pt-12 pb-24 bg-background">
                <div className="animate-pulse space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-surface" />
                        <div className="space-y-2">
                            <div className="h-6 w-32 bg-surface rounded" />
                            <div className="h-4 w-48 bg-surface rounded" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 w-full bg-surface rounded-3xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 pt-16 pb-40 bg-background transition-colors duration-500 max-w-lg mx-auto overflow-x-hidden">
            <header className="mb-12 flex items-center justify-between relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[100px] -z-10" />
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/50 to-zinc-900 p-[2px] shadow-2xl group-active:scale-95 transition-all duration-300">
                            <div className="w-full h-full rounded-[2.5rem] bg-black flex items-center justify-center overflow-hidden relative">
                                {profile.image ? (
                                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500" />
                                ) : (
                                    <User className="w-10 h-10 text-zinc-800" />
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-sm"
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-3 bg-primary rounded-full shadow-glow" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary drop-shadow-md">Active Operative</p>
                        </div>
                        <h1 className="text-4xl font-display font-bold tracking-tight text-white uppercase italic leading-none">
                            {profile.fullName || "Unidentified"}
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">
                            {workouts.length} Missions Accomplished
                        </p>
                    </div>
                </div>
            </header>

            <div className="space-y-10">
                {/* Personal Information */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-1.5 h-6 bg-zinc-800 rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Personal Intel</h2>
                    </div>
                    <div className="grid gap-6">
                        <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl focus-within:border-primary/40 transition-all duration-500 group">
                            <div className="flex items-center gap-3 mb-3">
                                <User className="w-4 h-4 text-primary" />
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Codename / Full Name</label>
                            </div>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                className="w-full bg-transparent border-none text-2xl font-display font-bold text-white placeholder-zinc-800 focus:ring-0 p-0 italic"
                                placeholder="IDENTIFY YOURSELF"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl focus-within:border-primary/40 transition-all duration-500">
                                <div className="flex items-center gap-3 mb-3">
                                    <Phone className="w-4 h-4 text-primary" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Phone</label>
                                </div>
                                <input
                                    type="tel"
                                    value={profile.phoneNumber}
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                    className="w-full bg-transparent border-none text-xl font-display font-bold text-white placeholder-zinc-800 focus:ring-0 p-0 italic"
                                    placeholder="###-###-####"
                                />
                            </div>
                            <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl focus-within:border-primary/40 transition-all duration-500">
                                <div className="flex items-center gap-3 mb-3">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Email</label>
                                </div>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-transparent border-none text-xl font-display font-bold text-white placeholder-zinc-800 focus:ring-0 p-0 italic"
                                    placeholder="SECURE CHANNEL"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-3 italic">Gender</label>
                                <select
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                    className="w-full bg-transparent border-none text-xl font-display font-bold text-white focus:ring-0 p-0 appearance-none italic"
                                >
                                    <option value="" disabled className="bg-black">SELECT</option>
                                    <option value="male" className="bg-black">MALE</option>
                                    <option value="female" className="bg-black">FEMALE</option>
                                    <option value="other" className="bg-black">OTHER</option>
                                </select>
                            </div>
                            <div className="p-6 rounded-[2.5rem] bg-surface-highlight border border-white/5 shadow-2xl">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-3 italic">Birth Sector</label>
                                <input
                                    type="date"
                                    value={profile.dob}
                                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                    className="w-full bg-transparent border-none text-xl font-display font-bold text-white focus:ring-0 p-0 italic"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Body Metrics */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-1.5 h-6 bg-zinc-800 rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Physical Matrix</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-8 rounded-[3rem] bg-surface-highlight border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000">
                                <Ruler className="w-20 h-20 text-white" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-3 bg-primary rounded-full shadow-glow" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Elevation</span>
                            </div>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <input
                                    type="number"
                                    value={profile.height}
                                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                                    className="w-full bg-transparent border-none text-5xl font-display font-bold text-white p-0 focus:ring-0 italic"
                                    placeholder="0"
                                />
                                <span className="text-zinc-700 font-black text-xs uppercase italic">CM</span>
                            </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-surface-highlight border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000">
                                <Weight className="w-20 h-20 text-white" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-3 bg-primary rounded-full shadow-glow" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Mass</span>
                            </div>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <input
                                    type="number"
                                    value={profile.weight}
                                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                                    className="w-full bg-transparent border-none text-5xl font-display font-bold text-white p-0 focus:ring-0 italic"
                                    placeholder="0"
                                />
                                <span className="text-zinc-700 font-black text-xs uppercase italic">KG</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Goals & Experience */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-1.5 h-6 bg-zinc-800 rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Combat Strategy</h2>
                    </div>
                    <div className="grid gap-6">
                        <div className="p-8 rounded-[3rem] bg-surface-highlight border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Primary Objective</span>
                            </div>
                            <div className="flex gap-3">
                                {['Muscle Gain', 'Fat Loss', 'Strength'].map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setProfile({ ...profile, fitnessGoal: goal as any })}
                                        className={`flex-1 py-4 px-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] italic transition-all duration-500 ${profile.fitnessGoal === goal
                                            ? 'bg-primary text-black shadow-glow scale-105 active:scale-95'
                                            : 'bg-black/40 text-zinc-600 border border-white/5 hover:border-primary/30'
                                            }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-surface-highlight border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Combat Experience</span>
                            </div>
                            <div className="flex gap-3">
                                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setProfile({ ...profile, experienceLevel: level as any })}
                                        className={`flex-1 py-4 px-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] italic transition-all duration-500 ${profile.experienceLevel === level
                                            ? 'bg-primary text-black shadow-glow scale-105 active:scale-95'
                                            : 'bg-black/40 text-zinc-600 border border-white/5 hover:border-primary/30'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sticky Actions */}
            <div className="fixed bottom-32 left-0 right-0 p-8 pointer-events-none z-50">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid || isSaving}
                        className={`w-full h-18 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] shadow-glow transition-all duration-500 flex items-center justify-center gap-4 italic ${isFormValid
                            ? 'bg-primary text-black active:scale-95 hover:scale-[1.02]'
                            : 'bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50'
                            }`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <span>Commit Protocol</span>
                                <CheckCircle2 className="w-6 h-6" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-20 left-6 right-6 z-50 flex justify-center pointer-events-none"
                    >
                        <div className="bg-primary text-black px-10 py-5 rounded-full shadow-glow flex items-center gap-4 pointer-events-auto">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="font-black text-[10px] uppercase tracking-[0.3em] italic">Profile Updated Successfully!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
