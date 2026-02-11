"use client";

import { useState, useEffect } from "react";
import { getFitnessImage } from "@/lib/imageService";
import { OptimizedImage } from "./OptimizedImage";

interface ExerciseThumbnailProps {
    exerciseId: string;
    name: string;
    className?: string;
}

export function ExerciseThumbnail({ exerciseId, name, className }: ExerciseThumbnailProps) {
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        const fetchImg = async () => {
            const url = await getFitnessImage(exerciseId, "exercise");
            setImageUrl(url);
        };
        fetchImg();
    }, [exerciseId]);

    return (
        <OptimizedImage
            src={imageUrl}
            alt={name}
            containerClassName={className}
            className="group-hover:scale-110 transition-transform duration-700"
        />
    );
}
