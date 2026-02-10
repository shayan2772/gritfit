import { RunTimer } from "@/components/RunTimer";

export default function RunPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 bg-background overflow-hidden relative">
            {/* Simple ambient background */}
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.05),transparent_70%)] pointer-events-none" />

            <header className="mb-8 text-center relative z-10">
                <h1 className="text-2xl font-bold tracking-widest uppercase text-gray-400 mb-2">Run Mode</h1>
                <div className="h-1 w-12 bg-secondary mx-auto rounded-full" />
            </header>

            <RunTimer />
        </div>
    );
}
