"use client";

import React, { useEffect, useState } from "react";
import { Lock, Crown, ArrowRight, Star, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPremiumPredictions, Prediction } from "@/lib/supabase";
import GameTime from "./GameTime";
import Link from "next/link";
import { generateSEOSlug } from "@/lib/utils";

export default function PremiumLockedMatches({ sport = "FOOTBALL", count = 0 }: { sport?: string, count?: number }) {
    const { subscription, setAuthModalOpen } = useAuth();
    const [premiumMatches, setPremiumMatches] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(false);

    const isPremium = subscription?.status === 'active';

    useEffect(() => {
        if (isPremium) {
            setLoading(true);
            getPremiumPredictions(sport).then(data => {
                setPremiumMatches(data);
                setLoading(false);
            });
        }
    }, [isPremium, sport]);

    if (!count || count < 1) return null;

    // If premium, and we have the matches, show them
    if (isPremium && premiumMatches.length > 0) {
        return (
            <div className="relative overflow-hidden rounded-xl border border-[var(--fs-yellow)] shadow-[0_0_40px_rgba(255,221,0,0.1)] mb-8 bg-[#001e28]">
                {/* VIP Header */}
                <div className="bg-gradient-to-r from-[#00141e] via-[#0c4a6e] to-[#00141e] border-b border-[var(--fs-yellow)]/30 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--fs-yellow)] text-black p-1.5 rounded-lg shadow-[0_0_15px_rgba(255,221,0,0.5)]">
                            <Crown size={18} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--fs-yellow)] uppercase leading-none tracking-[0.2em] mb-1">VIP UNLOCKED</span>
                            <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none font-[Klapt]">PREMIUM {sport} PREDICTIONS</h3>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {premiumMatches.map((match) => (
                        <Link
                            key={match.id}
                            href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                            className="flex items-center h-16 px-4 hover:bg-white/5 transition-colors group/match"
                        >
                            <GameTime date={match.match_date} time={match.match_time || "19:00"} className="w-20 border-r border-white/5 mr-4" />

                            <div className="flex-1 flex flex-col justify-center gap-1">
                                <span className="text-[11px] font-black text-white uppercase truncate group-hover/match:text-[var(--fs-yellow)] transition-colors">{match.home_team} vs {match.away_team}</span>
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest italic">{match.league}</span>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <div className="text-[11px] font-black text-[var(--fs-yellow)] uppercase">{match.prediction}</div>
                                <div className="text-[9px] font-bold text-white/30 uppercase">Odds: {match.odds}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-40 flex flex-col items-center justify-center bg-[#001e28] border border-white/5 rounded-xl space-y-3 mb-6">
                <Loader2 className="animate-spin text-[var(--fs-yellow)]" size={24} />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Unlocking VIP data...</span>
            </div>
        );
    }

    // Blurred fallback
    const fakeMatches = Array.from({ length: count });

    return (
        <div className="relative overflow-hidden rounded-sm border border-[var(--fs-yellow)]/30 shadow-[0_0_30px_rgba(255,221,0,0.05)] mb-6 group">
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
            </div>
            <div className="relative bg-[var(--fs-header)] divide-y divide-white/5">
                {fakeMatches.map((_, i) => (
                    <div key={i} className="flex items-center h-12 sm:h-14 px-3 sm:px-4 relative filter blur-[5px] select-none pointer-events-none opacity-50 grayscale-[0.3]">
                        <div className="pr-3"><Star size={14} className="text-white/20" /></div>
                        <div className="w-10 sm:w-12 text-center text-xs text-white/40">19:00</div>
                        <div className="flex-1 px-4 space-y-1">
                            <div className="h-2.5 w-[40%] bg-white/10 rounded-sm" />
                            <div className="h-2.5 w-[60%] bg-white/10 rounded-sm" />
                        </div>
                        <div className="h-5 w-16 bg-[var(--fs-yellow)]/20 rounded-sm" />
                    </div>
                ))}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <div className="bg-[#0f171a]/95 border border-[var(--fs-yellow)]/30 p-6 rounded-xl text-center space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[280px] sm:max-w-[320px] transform transition-transform group-hover:scale-102 duration-500 backdrop-blur-md relative overflow-hidden">
                        <div className="w-12 h-12 bg-[var(--fs-yellow)]/10 rounded-full flex items-center justify-center mx-auto border border-[var(--fs-yellow)]/20 shadow-[0_0_20px_rgba(255,221,0,0.1)] relative z-10">
                            <Lock size={20} className="text-[var(--fs-yellow)] drop-shadow-[0_0_5px_rgba(255,221,0,0.5)]" />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-[14px] font-black text-white uppercase tracking-wider font-[Klapt]">Premium Content</h3>
                            <p className="text-[10px] font-medium text-white/50 leading-relaxed max-w-[200px] mx-auto">
                                Join 10,000+ winners getting high-value {sport} predictions daily.
                            </p>
                        </div>
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="w-full bg-[var(--fs-yellow)] hover:bg-[var(--fs-yellow)]/90 hover:shadow-[0_0_20px_rgba(255,221,0,0.4)] text-black font-black text-[10px] h-10 tracking-[0.1em] uppercase rounded-sm flex items-center justify-center gap-2 transition-all relative z-10 group/btn"
                        >
                            Unlock Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

