"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { Dashboard } from "@/components/Dashboard";
import { useRouter } from "next/navigation";
import { Zap, LayoutGrid, Target as TargetIcon, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DailyGoalModal } from "@/components/DailyGoalModal";
import { WorkoutPlanList } from "@/components/WorkoutPlanList";
import { WorkoutPlanDetail } from "@/components/WorkoutPlanDetail";
import { WorkoutPlan } from "@/lib/plans";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getFitnessImage } from "@/lib/imageService";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface UserPrefs {
  goal: string;
  experience: string;
  weeklyDays: string;
}

const CATEGORIES = [
  { id: "chest", title: "Chest", count: 12, goals: ["muscle", "strength"] },
  { id: "back", title: "Back", count: 14, goals: ["muscle", "strength"] },
  { id: "legs", title: "Legs", count: 16, goals: ["muscle", "strength", "fat-loss"] },
  { id: "shoulders", title: "Shoulders", count: 10, goals: ["muscle", "strength"] },
  { id: "biceps", title: "Biceps", count: 6, goals: ["muscle"] },
  { id: "triceps", title: "Triceps", count: 6, goals: ["muscle"] },
  { id: "abs", title: "Abs", count: 8, goals: ["fat-loss", "beginner"] },
  { id: "full-body", title: "Full Body", count: 10, goals: ["strength", "fat-loss"] },
  { id: "cardio", title: "Cardio", count: 5, goals: ["fat-loss", "beginner"] },
];

export default function Home() {
  const router = useRouter();
  const [prefs] = useLocalStorage<UserPrefs | null>("gritfit_user_prefs", null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dailyGoal, setDailyGoal] = useLocalStorage<any>("gritfit_daily_goal_current", null);
  const [activePlan, setActivePlan] = useLocalStorage<any>("gritfit_active_plan", null);

  const [activeTab, setActiveTab] = useState<"train" | "plans">("train");
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [mounted, setMounted] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const fetchBanner = async () => {
      const url = await getFitnessImage("banner", "section");
      setBannerUrl(url);
    };
    fetchBanner();
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const goalKey = `gritfit_goal_${today}`;
    const savedGoal = localStorage.getItem(goalKey);

    if (!savedGoal) {
      const timer = setTimeout(() => setShowGoalModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGoalSet = (goal?: any) => {
    setShowGoalModal(false);
    if (goal) {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const goalKey = `gritfit_goal_${today}`;
      localStorage.setItem(goalKey, JSON.stringify(goal));
      setDailyGoal(goal);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleEnroll = (plan: WorkoutPlan) => {
    const enrollment = {
      ...plan,
      enrolledAt: new Date().toISOString(),
      currentWeek: 1
    };
    setActivePlan(enrollment);
    setSelectedPlan(null);
    setActiveTab("train");
  };

  const personalizedCategories = [...CATEGORIES].sort((a, b) => {
    if (!prefs) return 0;
    const aMatch = a.goals.includes(prefs.goal);
    const bMatch = b.goals.includes(prefs.goal);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 pt-12 pb-24 max-w-lg mx-auto">
        {selectedPlan ? (
          <WorkoutPlanDetail
            plan={selectedPlan}
            onBack={() => setSelectedPlan(null)}
            onEnroll={handleEnroll}
            isEnrolled={activePlan?.id === selectedPlan.id}
          />
        ) : (
          <>
            {/* ─── HERO SECTION ─── */}
            <header className="mb-10 relative overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl p-8">
              {/* Dynamic Unsplash Banner */}
              {bannerUrl && (
                <OptimizedImage
                  src={bannerUrl}
                  alt="Gym Banner"
                  containerClassName="absolute inset-0 z-0"
                  className="brightness-[0.4] scale-105"
                />
              )}

              {/* Cinematic gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
              <div className="absolute -top-20 -left-10 w-60 h-60 bg-primary/10 blur-[120px] rounded-full z-10" />

              <div className="relative z-20 flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(198,255,0,1)] animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary drop-shadow-lg">
                      Elite Protocol
                    </p>
                  </div>
                  <h1 className="text-[40px] leading-[1.05] font-display font-bold tracking-tight text-white uppercase">
                    {getGreeting()},<br />
                    <span className="text-primary drop-shadow-[0_0_30px_rgba(198,255,0,0.4)]">
                      Beast
                    </span>
                  </h1>
                  <p className="text-muted text-sm mt-3 font-medium">
                    Your training arena is ready. Let's dominate.
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-[#1A1A1A] border border-white/5 p-1 rounded-2xl shadow-card">
                  <button
                    onClick={() => setActiveTab("train")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                      activeTab === "train"
                        ? "bg-primary text-black shadow-[0_0_15px_rgba(198,255,0,0.3)]"
                        : "text-muted hover:text-white"
                    )}
                  >
                    Train
                  </button>
                  <button
                    onClick={() => setActiveTab("plans")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                      activeTab === "plans"
                        ? "bg-primary text-black shadow-[0_0_15px_rgba(198,255,0,0.3)]"
                        : "text-muted hover:text-white"
                    )}
                  >
                    Plans
                  </button>
                </div>
              </div>

              {/* Animated CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const firstCat = personalizedCategories[0];
                  if (firstCat) router.push(`/lift/${firstCat.id}`);
                }}
                className="w-full py-5 rounded-full bg-primary text-black font-bold text-base uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(198,255,0,0.25)] hover:shadow-[0_0_40px_rgba(198,255,0,0.4)] transition-shadow duration-500"
              >
                <Zap className="w-5 h-5 fill-current" />
                Start Workout
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </header>

            <AnimatePresence mode="wait">
              {activeTab === "train" ? (
                <motion.div
                  key="train"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-10"
                >
                  <Dashboard />

                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight leading-none">
                          Drill Library
                        </h2>
                        <p className="text-xs text-muted mt-1">Select a muscle group</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {personalizedCategories.map((cat, i) => (
                        <CategoryCard
                          key={cat.id}
                          id={cat.id}
                          title={cat.title}
                          count={cat.count}
                          index={i}
                          onClick={() => router.push(`/lift/${cat.id}`)}
                        />
                      ))}
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <WorkoutPlanList onSelectPlan={setSelectedPlan} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <DailyGoalModal
        isOpen={showGoalModal}
        onClose={handleGoalSet}
      />
    </main>
  );
}
