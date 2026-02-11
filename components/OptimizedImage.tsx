"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    priority?: boolean;
}

export function OptimizedImage({ src, alt, className, containerClassName, priority = false }: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
        setIsLoading(true);
        setImageSrc(src);
    }, [src]);

    return (
        <div className={cn("relative overflow-hidden bg-surface-highlight", containerClassName)}>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 bg-zinc-900 animate-pulse"
                    >
                        <div className="w-full h-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-[length:200%_100%] animate-shimmer" />
                    </motion.div>
                )}
            </AnimatePresence>

            <Image
                src={imageSrc}
                alt={alt}
                fill
                priority={priority}
                className={cn(
                    "object-cover transition-all duration-700",
                    isLoading ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0",
                    className
                )}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => {
                    // Fallback to a safe placeholder if the dynamic image fails
                    setImageSrc("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000");
                    setIsLoading(false);
                }}
            />
        </div>
    );
}
