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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
            <nav className="relative flex items-center justify-around p-2 bg-surface/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => router.push(tab.path)}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-colors duration-300",
                                isActive ? "text-primary" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}

                            <Icon className={cn("w-5 h-5", isActive && "text-primary drop-shadow-sm")} />
                            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
