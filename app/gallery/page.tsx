"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Image as ImageIcon, Search, Zap } from "lucide-react";
import Link from "next/link";
import { searchUnsplashImages } from "@/lib/imageService";
import { OptimizedImage } from "@/components/OptimizedImage";

const COLLECTION_QUERIES = [
    "dark gym motivation",
    "heavy weightlifting",
    "bodybuilding aesthetic",
    "fitness model training",
    "modern gym machines",
    "intense crossfit"
];

export default function GalleryPage() {
    const [images, setImages] = useState<{ url: string; query: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchInitialImages = async () => {
            setLoading(true);
            const allImages: { url: string; query: string }[] = [];

            for (const query of COLLECTION_QUERIES) {
                const results = await searchUnsplashImages(query, 3);
                results.forEach(url => allImages.push({ url, query }));
            }

            setImages(allImages);
            setLoading(false);
        };
        fetchInitialImages();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        const results = await searchUnsplashImages(searchTerm, 12);
        setImages(results.map(url => ({ url, query: searchTerm })));
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-background px-6 pt-16 pb-32 max-w-lg mx-auto">
            <header className="mb-12">
                <div className="flex items-center gap-6 mb-8">
                    <Link
                        href="/"
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Visual Asset Library</p>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tighter italic">
                            Gym Gallery
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search fitness images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all shadow-card"
                    />
                </form>
            </header>

            {loading ? (
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 bg-[#1A1A1A] shadow-card"
                        >
                            <OptimizedImage
                                src={img.url}
                                alt={img.query}
                                className="group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary italic truncate">
                                    {img.query}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <ImageIcon className="w-16 h-16 mb-4 text-muted" />
                    <p className="text-sm font-bold uppercase tracking-widest text-muted">No images found</p>
                </div>
            )}
        </main>
    );
}
