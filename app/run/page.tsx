import { RunTimer } from "@/components/RunTimer";

export default function RunPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-40 bg-background overflow-hidden relative max-w-lg mx-auto">
            {/* Cinematic ambient background */}
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(217,255,91,0.08),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-black/40 z-0" />

            <header className="mb-12 text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary drop-shadow-md">Combat Protocol</p>
                </div>
                <h1 className="text-5xl font-display font-bold text-white leading-none uppercase italic tracking-tighter">
                    Run <span className="text-zinc-800">Mode</span>
                </h1>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-3 italic">Autonomous Endurance Tracking</p>
            </header>

            <div className="relative z-10 w-full">
                <RunTimer />
            </div>
        </div>
    );
}
