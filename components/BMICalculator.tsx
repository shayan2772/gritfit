"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Ruler, Weight, User, Apple, CheckCircle2,
    XCircle, Info, Flame, Trophy, Quote,
    ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface DietMeal {
    time: string;
    food: string;
    icon: any;
}

interface DietPlan {
    type: 'Muscle Gain' | 'Fat Loss' | 'Maintenance';
    title: string;
    meals: DietMeal[];
    dos: string[];
    donts: string[];
}

const MOTIVATIONAL_QUOTES = [
    { text: "The last three or four reps is what makes the muscle grow.", author: "Arnold Schwarzenegger" },
    { text: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.", author: "Ronnie Coleman" },
    { text: "Success isn't always about greatness. It's about consistency.", author: "Chris Bumstead" },
    { text: "There is no secret formula. I lift heavy, work hard, and aim to be the best.", author: "Ronnie Coleman" },
    { text: "If you want to be the best, you have to do things that other people aren't willing to do.", author: "Jay Cutler" }
];

export function BMICalculator() {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [bmi, setBmi] = useState<number | null>(null);
    const [showMotivation, setShowMotivation] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

    const [savedBMI, setSavedBMI] = useLocalStorage<any>("gritfit_last_bmi", null);
    const [bmiHistory, setBmiHistory] = useLocalStorage<any[]>("gritfit_bmi_history", []);
    const [dietHistory, setDietHistory] = useLocalStorage<any[]>("gritfit_diet_history", []);

    useEffect(() => {
        if (savedBMI) {
            setHeight(savedBMI.height);
            setWeight(savedBMI.weight);
            setAge(savedBMI.age || "");
            setGender(savedBMI.gender || "");
            setBmi(savedBMI.value);
        }
    }, []);

    const calculateBMI = () => {
        if (!height || !weight) return;

        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);

        if (h > 0 && w > 0) {
            const val = Math.round((w / (h * h)) * 10) / 10;
            setBmi(val);
            const date = new Date().toISOString();
            const status = getBMIStatus(val);
            const plan = generateDietPlan(val);

            setSavedBMI({ value: val, height, weight, age, gender, date });

            // Add to history
            setBmiHistory(prev => [{
                id: Date.now(),
                date,
                value: val,
                weight,
                category: status.label
            }, ...prev]);

            setDietHistory(prev => [{
                id: Date.now(),
                date,
                type: plan.type,
                title: plan.title,
                meals: plan.meals.map(m => m.food) // Simplified summary
            }, ...prev]);

            // Randomly select a quote
            setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

            // Show motivation after a short delay
            setTimeout(() => setShowMotivation(true), 1500);
        }
    };

    const getBMIStatus = (val: number) => {
        if (val < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
        if (val < 25) return { label: "Normal Weight", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" };
        if (val < 30) return { label: "Overweight", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };
        return { label: "Obese", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
    };

    const generateDietPlan = (val: number): DietPlan => {
        if (val < 18.5) {
            return {
                type: 'Muscle Gain',
                title: 'High-Calorie Muscle Building Plan',
                meals: [
                    { time: 'Breakfast', food: 'Oats with whole milk, 2 bananas, and 3 whole eggs', icon: Apple },
                    { time: 'Mid-Morning', food: 'Protein shake with peanut butter and mixed nuts', icon: Flame },
                    { time: 'Lunch', food: 'Chicken breast (200g) with large portion of brown rice and broccoli', icon: Trophy },
                    { time: 'Evening Snack', food: 'Greek yogurt with honey and granola', icon: Apple },
                    { time: 'Dinner', food: 'Beef or Salmon with sweet potatoes and avocado', icon: Trophy }
                ],
                dos: ['Eat every 3 hours', 'Focus on compound lifts', 'Drink plenty of milk'],
                donts: ['Skip meals', 'Do excessive cardio', 'Ignore healthy fats']
            };
        } else if (val >= 25) {
            return {
                type: 'Fat Loss',
                title: 'Lean Shredding & Fat Loss Plan',
                meals: [
                    { time: 'Breakfast', food: '4 Egg whites, 1 whole egg + spinach and 1/2 cup oats', icon: Apple },
                    { time: 'Lunch', food: 'Grilled chicken breast with large green salad (no heavy dressing)', icon: Flame },
                    { time: 'Snack', food: 'Green apple and a handful of almonds', icon: Apple },
                    { time: 'Dinner', food: 'Baked fish with asparagus and moderate quinoa', icon: Trophy }
                ].map(m => (m.time === 'Lunch' ? { ...m, icon: Flame } : m)), // Fix icon ref
                dos: ['Drink 4L water daily', 'High protein intake', 'Prioritize Fiber'],
                donts: ['Liquid calories (soda/juice)', 'Processed sugars', 'Late night snacking']
            };
        } else {
            return {
                type: 'Maintenance',
                title: 'Balanced Vitality & Performance Plan',
                meals: [
                    { time: 'Breakfast', food: 'Smoothie or Oats with eggs', icon: Apple },
                    { time: 'Lunch', food: 'Balanced plate: Protein, Complex Carbs, Veggies', icon: Trophy },
                    { time: 'Dinner', food: 'Light protein with steamed vegetables', icon: Apple }
                ],
                dos: ['Stay consistent', 'Mix cardio and weights', 'Quality sleep'],
                donts: ['Over-exercising', 'Under-eating', 'Processed foods']
            };
        }
    };

    const status = bmi ? getBMIStatus(bmi) : null;
    const dietPlan = bmi ? generateDietPlan(bmi) : null;

    return (
        <div className="w-full max-w-md mx-auto pb-12">
            <div className="space-y-6">
                {/* Input Section */}
                <div className="grid grid-cols-2 gap-4">
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
                    <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            <User className="w-3 h-3 text-accent" /> Age
                        </label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-transparent border-none text-2xl font-black text-foreground placeholder-muted-foreground/20 focus:ring-0 p-0"
                            placeholder="25"
                        />
                    </div>
                    <div className="p-4 rounded-3xl bg-surface border border-glass-border shadow-sm">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full bg-transparent border-none text-lg font-bold text-foreground focus:ring-0 p-0 appearance-none"
                        >
                            <option value="" disabled>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={calculateBMI}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary font-black text-white uppercase tracking-tighter text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                >
                    Calculate Results
                </button>

                {bmi && status && dietPlan && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Result Card */}
                        <div className={cn("p-8 rounded-[2rem] border-2 text-center relative overflow-hidden", status.bg, status.border)}>
                            <div className="relative z-10">
                                <div className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Your current Score</div>
                                <div className="text-7xl font-black text-foreground tracking-tighter">{bmi}</div>
                                <div className={cn("text-xl font-black mt-4 uppercase tracking-widest", status.color)}>
                                    {status.label}
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-5">
                                <Trophy className="w-32 h-32" />
                            </div>
                        </div>

                        {/* Diet Plan Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <Apple className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{dietPlan.title}</h3>
                            </div>

                            <div className="space-y-3">
                                {dietPlan.meals.map((meal, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-5 rounded-3xl bg-surface border border-glass-border shadow-sm flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-surface-highlight flex items-center justify-center text-primary shadow-inner">
                                            <meal.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{meal.time}</div>
                                            <div className="text-sm font-bold text-foreground leading-relaxed">{meal.food}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* DOs & DON'Ts */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-5 rounded-3xl bg-green-500/5 border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-3 text-green-500">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase">Guidelines</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {dietPlan.dos.map((item, i) => (
                                            <li key={i} className="text-[11px] font-bold text-foreground/80 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-green-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-5 rounded-3xl bg-red-500/5 border border-red-500/20">
                                    <div className="flex items-center gap-2 mb-3 text-red-500">
                                        <XCircle className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase">Avoid</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {dietPlan.donts.map((item, i) => (
                                            <li key={i} className="text-[11px] font-bold text-foreground/80 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-red-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Motivational Modal */}
            <AnimatePresence>
                {showMotivation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-sm bg-surface-highlight border border-white/20 rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Quote className="w-24 h-24" />
                            </div>

                            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                                <Trophy className="w-8 h-8 text-primary" />
                            </div>

                            <h4 className="text-2xl font-black text-foreground mb-4 leading-tight italic">
                                "{currentQuote.text}"
                            </h4>

                            <p className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-10">
                                — {currentQuote.author}
                            </p>

                            <button
                                onClick={() => setShowMotivation(false)}
                                className="w-full py-5 rounded-[2rem] bg-foreground text-background font-black text-lg shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Stay Consistent 💪
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
