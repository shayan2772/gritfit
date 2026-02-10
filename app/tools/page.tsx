"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calculator, Activity, ChevronRight } from "lucide-react";

const tools = [
    {
        id: "bmi",
        title: "BMI Calculator",
        description: "Calculate your Body Mass Index",
        icon: Calculator,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        href: "/tools/bmi"
    },
    {
        id: "tdee",
        title: "TDEE Calculator",
        description: "Total Daily Energy Expenditure",
        icon: Activity,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        href: "/tools/tdee"
    }
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen px-6 pt-12 pb-24 bg-background">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tools</h1>
                <p className="text-gray-500">Health & Fitness Calculators</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {tools.map((tool, i) => (
                    <Link key={tool.id} href={tool.href}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center`}>
                                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{tool.description}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
