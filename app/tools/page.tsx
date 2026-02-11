"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calculator, Activity, ChevronRight } from "lucide-react";
import { getFitnessImage } from "@/lib/imageService";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useState, useEffect } from "react";

const tools = [
    {
        id: "bmi",
        title: "BMI Calculator",
        description: "Calculate your Body Mass Index",
        icon: Calculator,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        href: "/tools/bmi"
    },
    {
        id: "tdee",
        title: "TDEE Calculator",
        description: "Total Daily Energy Expenditure",
        icon: Activity,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        href: "/tools/tdee"
    }
];

export default function ToolsPage() {
    const [bannerImg, setBannerImg] = useState("");
    useEffect(() => {
        const fetchBanner = async () => {
            const url = await getFitnessImage("tools", "section");
            setBannerImg(url);
        };
        fetchBanner();
    }, []);
    return (
        <div className="min-h-screen px-6 pt-16 pb-32 bg-background max-w-lg mx-auto overflow-x-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[100px] -z-10" />

            <header className="mb-12 h-[35vh] flex flex-col justify-end p-8 relative -mx-6 -mt-16 overflow-hidden">
                {bannerImg && (
                    <OptimizedImage
                        src={bannerImg}
                        alt="Tools"
                        containerClassName="absolute inset-0 z-0"
                        className="brightness-[0.35] scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-[1]" />
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-3 bg-primary rounded-full shadow-glow" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary drop-shadow-md">Operational Support</p>
                </div>
                <h1 className="text-5xl font-display font-bold text-white leading-none uppercase italic tracking-tighter">
                    Health <span className="text-zinc-800">Analytics</span>
                </h1>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-3 italic">Advanced Biometric Assessment Tools</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {tools.map((tool, i) => (
                    <Link key={tool.id} href={tool.href}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="p-8 rounded-[3rem] bg-surface-highlight border border-white/5 shadow-2xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`w-16 h-16 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-primary/20 shadow-xl`}>
                                    <tool.icon className={`w-8 h-8 ${tool.color} group-hover:scale-110 transition-transform duration-500`} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white uppercase italic leading-none mb-2 group-hover:text-primary transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">{tool.description}</p>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-700 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500 relative z-10">
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            <div className="mt-16 p-8 rounded-[3.5rem] bg-zinc-950/50 border border-white/5 border-dashed relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                    <Activity className="w-5 h-5 text-zinc-700" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Technical Advisory</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed italic">
                    Calculations are based on standard physiological formulas. Consult with a tactical nutrition specialist for mission-specific protocols.
                </p>
            </div>
        </div>
    );
}
