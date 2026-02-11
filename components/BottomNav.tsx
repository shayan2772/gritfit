"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dumbbell, Zap, History, User, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "lift", label: "Lift", icon: Dumbbell, path: "/" },
    { id: "run", label: "Run", icon: Zap, path: "/run" },
    { id: "tools", label: "Tools", icon: Calculator, path: "/tools" },
    { id: "history", label: "History", icon: History, path: "/history" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
            <nav className="relative flex items-center justify-around p-2.5 bg-[#0E0E0E]/95 backdrop-blur-2xl border border-white/5 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    const Icon = tab.icon;

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => router.push(tab.path)}
                            whileTap={{ scale: 0.85 }}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300",
                                isActive ? "text-primary" : "text-[#A0A0A0] hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}

                            <Icon className={cn(
                                "w-6 h-6 transition-all duration-300 relative z-10",
                                isActive && "drop-shadow-[0_0_8px_rgba(198,255,0,0.5)]"
                            )} />
                            <span className={cn(
                                "text-[9px] mt-1 font-bold uppercase tracking-tight transition-opacity duration-300 relative z-10",
                                isActive ? "opacity-100" : "opacity-50"
                            )}>
                                {tab.label}
                            </span>
                        </motion.button>
                    );
                })}
            </nav>
        </div>
    );
}
