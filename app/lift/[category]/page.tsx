import { getExercisesByCategory } from "@/lib/data";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Correct type for Next.js 15+ Page Props (awaitable params)
interface PageProps {
    params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;
    const exercises = getExercisesByCategory(category);

    if (!exercises.length) return notFound();

    return (
        <div className="min-h-screen px-6 pt-12 pb-24">
            <header className="mb-8 flex items-center gap-4">
                <Link
                    href="/"
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold capitalize tracking-tight text-gray-900">
                    {category}
                </h1>
            </header>

            <div className="space-y-4">
                {exercises.map((ex) => (
                    <Link
                        key={ex.id}
                        href={`/lift/${category}/${ex.id}`}
                        className="block group"
                    >
                        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                    {ex.name}
                                </h3>
                                <span className="text-[10px] uppercase font-mono px-2 py-1 rounded-md bg-gray-100 text-gray-500">
                                    {ex.difficulty}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{ex.muscle}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
