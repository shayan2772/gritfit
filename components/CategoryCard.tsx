"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getFitnessImage } from "@/lib/imageService";
import { OptimizedImage } from "./OptimizedImage";

interface CategoryCardProps {
    id: string;
    title: string;
    count: number;
    onClick?: () => void;
    index: number;
}

export function CategoryCard({ id, title, count, onClick, index }: CategoryCardProps) {
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        const fetchImg = async () => {
            const url = await getFitnessImage(id.toLowerCase(), "category");
            setImageUrl(url);
        };
        fetchImg();
    }, [id]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative h-48 overflow-hidden rounded-3xl bg-[#1A1A1A] border border-white/5 shadow-card cursor-pointer"
        >
            {/* Full-bleed Background Image */}
            {imageUrl && (
                <OptimizedImage
                    src={imageUrl}
                    alt={title}
                    containerClassName="absolute inset-0 z-0"
                    className="group-hover:scale-110 transition-transform duration-700 brightness-[0.5] group-hover:brightness-[0.65]"
                />
            )}

            {/* 60% Dark Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-end p-6">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(198,255,0,0.8)]" />
                            <p className="text-xs text-primary font-bold uppercase tracking-wider">
                                {count} Drills
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight text-white uppercase leading-none group-hover:text-primary transition-colors duration-300">
                            {title}
                        </h3>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
