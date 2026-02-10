import { BMICalculator } from "@/components/BMICalculator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BMIPage() {
    return (
        <div className="min-h-screen px-6 pt-12 pb-24 bg-background">
            <header className="mb-8 flex items-center gap-4">
                <Link
                    href="/tools"
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    BMI Calculator
                </h1>
            </header>

            <div className="p-1">
                <BMICalculator />
            </div>
        </div>
    );
}
