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
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
            {/* Timer Display */}
            <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                {/* Pulse Animations */}
                {isRunning && (
                    <>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full border-2 border-secondary/30"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0, 0.1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute inset-4 rounded-full bg-secondary/5"
                        />
                    </>
                )}

                {/* Main Clock Circle */}
                <div className={cn(
                    "w-full h-full rounded-full border-4 flex items-center justify-center bg-white/40 backdrop-blur-sm transition-colors duration-500",
                    isRunning ? "border-secondary shadow-[0_0_30px_rgba(255,149,0,0.3)]" : "border-gray-200"
                )}>
                    <div className="flex flex-col items-center">
                        <div className="text-7xl font-mono font-bold tracking-tighter text-gray-900 tabular-nums leading-none">
                            {min}:{sec}
                        </div>
                        <div className="text-xl font-mono text-gray-500 mt-2 font-light tracking-widest">
                            .{ms}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTimer}
                    className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
                        isRunning
                            ? "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                            : "bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_20px_rgba(255,149,0,0.4)]"
                    )}
                >
                    {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                {time > 0 && !isRunning && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={resetTimer}
                        className="w-14 h-14 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 flex items-center justify-center shadow-md"
                    >
                        <Square className="w-5 h-5 fill-current" />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
