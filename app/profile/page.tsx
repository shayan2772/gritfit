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
        <div className="min-h-screen px-6 pt-12 pb-32 bg-background transition-colors duration-300">
            <header className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-[3px] shadow-xl group-active:scale-95 transition-transform duration-200">
                            <div className="w-full h-full rounded-full bg-surface-highlight flex items-center justify-center overflow-hidden relative">
                                {profile.image ? (
                                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-muted-foreground/40" />
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                    <Camera className="w-6 h-6 text-white" />
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
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            {profile.fullName || "Your Profile"}
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            {workouts.length} Workouts Accomplished
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-3 rounded-2xl bg-surface border border-glass-border shadow-sm active:scale-90 transition-all"
                >
                    {resolvedTheme === 'dark' ? "🌙" : "☀️"}
                </button>
            </header>

            <div className="space-y-6">
                {/* Personal Information */}
                <section className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Personal Details</h2>
                    <div className="grid gap-4">
                        <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <User className="w-4 h-4 text-primary" />
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                            </div>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                className="w-full bg-transparent border-none text-lg font-bold text-foreground placeholder-muted-foreground/30 focus:ring-0 p-0"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <Phone className="w-4 h-4 text-secondary" />
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phone</label>
                                </div>
                                <input
                                    type="tel"
                                    value={profile.phoneNumber}
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                    className="w-full bg-transparent border-none text-lg font-bold text-foreground placeholder-muted-foreground/30 focus:ring-0 p-0"
                                    placeholder="Number"
                                />
                            </div>
                            <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="w-4 h-4 text-accent" />
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                                </div>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-transparent border-none text-lg font-bold text-foreground placeholder-muted-foreground/30 focus:ring-0 p-0"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Gender</label>
                                <select
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                    className="w-full bg-transparent border-none text-lg font-bold text-foreground focus:ring-0 p-0 appearance-none"
                                >
                                    <option value="" disabled className="text-background">Select</option>
                                    <option value="male" className="text-black">Male</option>
                                    <option value="female" className="text-black">Female</option>
                                    <option value="other" className="text-black">Other</option>
                                </select>
                            </div>
                            <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    value={profile.dob}
                                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                    className="w-full bg-transparent border-none text-lg font-bold text-foreground focus:ring-0 p-0"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Body Metrics */}
                <section className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Physical Metrics</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-3xl bg-surface border border-glass-border shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <Ruler className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Height</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <input
                                    type="number"
                                    value={profile.height}
                                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                                    className="w-full bg-transparent border-none text-3xl font-black text-foreground p-0 focus:ring-0"
                                    placeholder="0"
                                />
                                <span className="text-muted-foreground font-mono text-sm">cm</span>
                            </div>
                        </div>

                        <div className="p-5 rounded-3xl bg-surface border border-glass-border shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-secondary">
                                <Weight className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Weight</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <input
                                    type="number"
                                    value={profile.weight}
                                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                                    className="w-full bg-transparent border-none text-3xl font-black text-foreground p-0 focus:ring-0"
                                    placeholder="0"
                                />
                                <span className="text-muted-foreground font-mono text-sm">kg</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Goals & Experience */}
                <section className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Fitness Strategy</h2>
                    <div className="grid gap-4">
                        <div className="p-5 rounded-3xl bg-surface border border-glass-border shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-5 h-5 text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Fitness Goal</span>
                            </div>
                            <div className="flex gap-2">
                                {['Muscle Gain', 'Fat Loss', 'Strength'].map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setProfile({ ...profile, fitnessGoal: goal as any })}
                                        className={`flex-1 py-3 px-2 rounded-2xl text-xs font-bold transition-all ${profile.fitnessGoal === goal
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                : 'bg-surface-highlight text-muted-foreground hover:bg-surface'
                                            }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 rounded-3xl bg-surface border border-glass-border shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-5 h-5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Experience Level</span>
                            </div>
                            <div className="flex gap-2">
                                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setProfile({ ...profile, experienceLevel: level as any })}
                                        className={`flex-1 py-3 px-2 rounded-2xl text-xs font-bold transition-all ${profile.experienceLevel === level
                                                ? 'bg-secondary text-white shadow-lg shadow-secondary/30 scale-105'
                                                : 'bg-surface-highlight text-muted-foreground hover:bg-surface'
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
            <div className="fixed bottom-24 left-0 right-0 p-6 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid || isSaving}
                        className={`w-full py-5 rounded-3xl font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${isFormValid
                                ? 'bg-gradient-to-r from-primary to-accent text-white active:scale-95 hover:shadow-primary/40'
                                : 'bg-surface-highlight text-muted-foreground cursor-not-allowed opacity-50'
                            }`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <span>Save Profile</span>
                                <CheckCircle2 className="w-5 h-5" />
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
                        className="fixed bottom-10 left-6 right-6 z-50 flex justify-center pointer-events-none"
                    >
                        <div className="bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-bold">Profile Updated Successfully!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
