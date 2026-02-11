"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export function RunTimer() {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0); // milliseconds
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const savedTimeRef = useRef<number>(0);

    const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const progress = timestamp - startTimeRef.current;
        setTime(savedTimeRef.current + progress);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = 0; // Reset start time for new animation frame loop
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
            savedTimeRef.current = time;
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isRunning]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(0);
        savedTimeRef.current = 0;
    };

    // Format time
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10); // 2 digits

        return {
            min: minutes.toString().padStart(2, "0"),
            sec: seconds.toString().padStart(2, "0"),
            ms: milliseconds.toString().padStart(2, "0"),
        };
    };

    const { min, sec, ms } = formatTime(time);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4">
            {/* Timer Display */}
            <div className="relative w-80 h-80 flex items-center justify-center mb-16">
                {/* Pulse Animations */}
                <AnimatePresence>
                    {isRunning && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 1 }}
                                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full border border-primary/30 blur-[2px]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 1 }}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0, 0.1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute inset-10 rounded-full bg-primary/10 blur-[20px]"
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Tactical Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-white/5 bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]" />

                {/* Main Clock Circle */}
                <div className={cn(
                    "w-[90%] h-[90%] rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-1000",
                    isRunning
                        ? "border-primary/50 shadow-glow bg-primary/5"
                        : "border-white/10 bg-white/5"
                )}>
                    {/* Inner detail ring */}
                    <div className="absolute inset-4 rounded-full border border-white/5 border-dashed opacity-30" />

                    <div className="flex flex-col items-center relative gap-2">
                        <div className="text-8xl font-display font-bold tracking-tighter text-white tabular-nums leading-none italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            {min}<span className="text-zinc-800">:</span>{sec}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-primary/30 rounded-full" />
                            <div className="text-2xl font-display font-medium text-zinc-600 tabular-nums italic tracking-[0.2em]">
                                {ms}
                            </div>
                            <div className="w-8 h-0.5 bg-primary/30 rounded-full" />
                        </div>
                        <div className="text-[9px] font-black text-primary uppercase tracking-[0.5em] mt-4 italic opacity-50">
                            ELAPSED TIME
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-10 relative z-10">
                <button
                    onClick={toggleTimer}
                    className={cn(
                        "w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl relative group overflow-hidden",
                        isRunning
                            ? "bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800"
                            : "bg-primary text-black shadow-glow hover:scale-110 active:scale-95"
                    )}
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {isRunning ? (
                        <Pause className="w-10 h-10 fill-current relative z-10" />
                    ) : (
                        <Play className="w-10 h-10 fill-current ml-1 relative z-10" />
                    )}
                </button>

                {time > 0 && !isRunning && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: 20 }}
                        onClick={resetTimer}
                        className="w-16 h-16 rounded-[1.5rem] bg-white text-black flex items-center justify-center shadow-2xl hover:bg-zinc-200 hover:scale-110 active:scale-95 transition-all duration-500 group"
                    >
                        <Square className="w-6 h-6 fill-current group-hover:scale-90 transition-transform" />
                    </motion.button>
                )}
            </div>

            <div className="mt-20 flex gap-4">
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest italic">Distance</span>
                    <span className="text-lg font-display font-bold text-white italic">0.00 <span className="text-[10px] text-zinc-700">KM</span></span>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest italic">Intensity</span>
                    <span className="text-lg font-display font-bold text-white italic">LVL <span className="text-[10px] text-zinc-700">01</span></span>
                </div>
            </div>
        </div>
    );
}
