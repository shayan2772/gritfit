"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
    title: string;
    count: number;
    onClick?: () => void;
    index: number;
}

export function CategoryCard({ title, count, onClick, index }: CategoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative overflow-hidden rounded-3xl bg-white border border-white/50 shadow-lg shadow-gray-200/50 p-6 cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                        {count} Exercises
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
}
