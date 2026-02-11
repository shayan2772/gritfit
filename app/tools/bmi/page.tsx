"use client";

import { BMICalculator } from "@/components/BMICalculator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BMIPage() {
    return (
        <div className="min-h-screen px-6 pt-16 pb-40 bg-background max-w-lg mx-auto overflow-x-hidden relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[100px] -z-10" />
            <header className="mb-12 flex items-center gap-6">
                <Link
                    href="/tools"
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-3 bg-primary rounded-full shadow-glow" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary drop-shadow-md">Operational Metric</p>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter leading-none">
                        BMI <span className="text-zinc-800">Calculator</span>
                    </h1>
                </div>
            </header>

            <div className="relative z-10">
                <BMICalculator />
            </div>
        </div>
    );
}
