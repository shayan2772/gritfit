"use client";

import { CategoryCard } from "@/components/CategoryCard";
import { Dashboard } from "@/components/Dashboard";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DailyGoalModal } from "@/components/DailyGoalModal";

interface UserPrefs {
  goal: string;
  experience: string;
  weeklyDays: string;
}

const categories = [
  { id: "chest", title: "Chest", count: 12, goals: ["muscle", "strength"] },
  { id: "back", title: "Back", count: 14, goals: ["muscle", "strength"] },
  { id: "legs", title: "Legs", count: 16, goals: ["muscle", "strength", "fat-loss"] },
  { id: "shoulders", title: "Shoulders", count: 10, goals: ["muscle", "strength"] },
  { id: "arms", title: "Arms", count: 18, goals: ["muscle"] },
  { id: "core", title: "Core", count: 8, goals: ["fat-loss", "beginner"] },
  { id: "cardio", title: "Cardio", count: 5, goals: ["fat-loss", "beginner"] },
];

export default function Home() {
  const router = useRouter();
  const [prefs] = useLocalStorage<UserPrefs | null>("gritfit_user_prefs", null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dailyGoal, setDailyGoal] = useLocalStorage<any>("gritfit_daily_goal_current", null);

  useEffect(() => {
    // Check if goal for today exists
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
      setDailyGoal(goal); // Sync for dashboard tracking
    }
  };

  // Simple personalization: move goal-relevant categories to the top
  const personalizedCategories = [...categories].sort((a, b) => {
    if (!prefs) return 0;
    const aMatch = a.goals.includes(prefs.goal);
    const bMatch = b.goals.includes(prefs.goal);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="px-6 pt-12 pb-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50">
          {getGreeting()}
        </h1>
        <p className="text-gray-500 mt-2">
          {prefs?.goal
            ? `Ready to crush your ${prefs.goal.replace('-', ' ')} goal?`
            : "Elevate your performance today."}
        </p>
      </header>

      <Dashboard />

      {/* Smart Suggestion Section */}
      <section className="mb-8">
        <div className="p-5 rounded-[2rem] bg-primary/10 border border-primary/20 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2 text-primary">
            <Zap className="w-5 h-5 fill-current" />
            <h3 className="text-sm font-black uppercase tracking-widest">Smart Suggestion</h3>
          </div>
          <p className="text-foreground/80 text-sm font-medium mb-4">
            Based on your {prefs?.goal || "general"} goal, we recommend hitting {prefs?.goal === 'muscle' ? 'heavy compounds' : 'higher volume'} today.
          </p>
          <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-primary text-black rounded-lg hover:opacity-90 transition-opacity">
            View Recommended Workout
          </button>
        </div>
      </section>

      <h2 className="text-xl font-bold text-foreground mb-4">Recommended for You</h2>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {personalizedCategories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            index={i}
            title={cat.title}
            count={cat.count}
            onClick={() => router.push(`/lift/${cat.id}`)}
          />
        ))}
      </div>

      {/* Fuel Section */}
      <section className="pb-24">
        <h2 className="text-xl font-bold text-foreground mb-4">Fuel for Growth</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { title: "High Protein", color: "bg-blue-500/20", text: "Optimal for muscle repair." },
            { title: "Pre-Workout", color: "bg-orange-500/20", text: "Fuel your performance." },
            { title: "Post-Work", color: "bg-green-500/20", text: "Restore glycogen levels." }
          ].map((item, i) => (
            <div key={i} className={`min-w-[200px] p-5 rounded-3xl ${item.color} border border-white/5`}>
              <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
              <p className="text-xs text-foreground/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <DailyGoalModal
        isOpen={showGoalModal}
        onClose={handleGoalSet}
      />
    </div>
  );
}
