"use client";

import { Lock, Crown, ArrowRight, Star } from "lucide-react";

export default function PremiumLockedMatches({ sport = "FOOTBALL", count = 0 }: { sport?: string, count?: number }) {
    if (!count || count < 1) return null;

    // Generate accurate number of skeleton blocks based on real DB count
    // We will render visual blocks instead of text to ensure security
    const fakeMatches = Array.from({ length: count });

    return (
        <div className="relative overflow-hidden rounded-sm border border-[var(--fs-yellow)]/30 shadow-[0_0_30px_rgba(255,221,0,0.05)] mb-6 group">

            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--fs-header)] via-[var(--fs-yellow)]/10 to-[var(--fs-header)] border-b border-[var(--fs-yellow)]/20 p-2 sm:p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-[var(--fs-yellow)] text-black p-1 rounded-sm shadow-[0_0_10px_rgba(255,221,0,0.4)]">
                        <Crown size={14} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-[var(--fs-yellow)] uppercase leading-none tracking-widest mb-0.5 opacity-80">VIP ACCESS</span>
                        <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none">PREMIUM {sport} PICKS</span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-[var(--fs-yellow)]/10 px-2 py-1 rounded-sm border border-[var(--fs-yellow)]/20 shadow-[0_0_10px_rgba(255,221,0,0.1)]">
                    <div className="w-1.5 h-1.5 bg-[var(--fs-yellow)] rounded-full animate-pulse shadow-[0_0_5px_rgba(255,221,0,1)]" />
                    <span className="text-[9px] font-black text-[var(--fs-yellow)] uppercase tracking-wide">98% Accuracy</span>
                </div>
            </div>

            {/* Blurred Content Container */}
            <div className="relative bg-[var(--fs-header)] divide-y divide-white/5">
                {fakeMatches.map((_, i) => (
                    <div key={i} className="flex items-center h-12 sm:h-14 px-3 sm:px-4 relative filter blur-[5px] select-none pointer-events-none opacity-50 grayscale-[0.3]">
                        {/* Star Icon */}
                        <div className="pr-3">
                            <Star size={14} className="text-white/20" />
                        </div>

                        {/* Time */}
                        <div className="w-10 sm:w-12 text-center">
                            <div className="h-2 w-8 bg-white/40 rounded-sm mx-auto" />
                        </div>

                        {/* Teams - Visual Skeletons */}
                        <div className="flex-1 px-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-white/30" />
                                <div className="h-2.5 w-[40%] bg-white/30 rounded-sm" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-white/30" />
                                <div className="h-2.5 w-[60%] bg-white/30 rounded-sm" />
                            </div>
                        </div>

                        {/* Odds/Prediction - Fake block */}
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-16 bg-[var(--fs-yellow)]/40 rounded-sm" />
                        </div>
                    </div>
                ))}

                {/* Secure Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <div className="bg-[#0f171a]/95 border border-[var(--fs-yellow)]/30 p-6 rounded-xl text-center space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[280px] sm:max-w-[320px] transform transition-transform group-hover:scale-102 duration-500 backdrop-blur-md relative overflow-hidden">

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--fs-yellow)]/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                        <div className="w-12 h-12 bg-[var(--fs-yellow)]/10 rounded-full flex items-center justify-center mx-auto border border-[var(--fs-yellow)]/20 shadow-[0_0_20px_rgba(255,221,0,0.1)] relative z-10">
                            <Lock size={20} className="text-[var(--fs-yellow)] drop-shadow-[0_0_5px_rgba(255,221,0,0.5)]" />
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-[14px] font-black text-white uppercase tracking-wider font-[Klapt]">Premium Content</h3>
                            <p className="text-[10px] font-medium text-white/50 leading-relaxed max-w-[200px] mx-auto">
                                Join 10,000+ winners getting high-value {sport} predictions daily.
                            </p>
                        </div>

                        <button className="w-full bg-[var(--fs-yellow)] hover:bg-[var(--fs-yellow)]/90 hover:shadow-[0_0_20px_rgba(255,221,0,0.4)] text-black font-black text-[10px] h-10 tracking-[0.1em] uppercase rounded-sm flex items-center justify-center gap-2 transition-all relative z-10 group/btn">
                            Unlock Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
