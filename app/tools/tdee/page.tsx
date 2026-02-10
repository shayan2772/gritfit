import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { TDEECalculator } from "@/components/TDEECalculator";

export default function TDEEPage() {
    return (
        <div className="min-h-screen px-6 pt-12 pb-24 bg-background">
            <header className="mb-8 flex items-center gap-4">
                <Link
                    href="/tools"
                    className="w-10 h-10 rounded-full bg-surface border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                    TDEE Calculator
                </h1>
            </header>

            <div className="p-1">
                <TDEECalculator />
            </div>
        </div>
    );
}
