"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, Trophy, Zap, Globe, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface GlobalBettingChartProps {
    match: any;
}

export default function GlobalBettingChart({ match }: GlobalBettingChartProps) {
    const [totalBet, setTotalBet] = useState(0);
    const targetTotal = 1420500 + (Math.random() * 500000); // Simulated dynamic data

    // Distribution percentages from database (with fallback)
    const distribution = {
        home: match.dist_home || 45,
        draw: match.dist_draw || 25,
        away: match.dist_away || 30
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTotalBet(targetTotal);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-5 relative overflow-hidden group">
            {/* Subtle light leak for depth */}
            <div className="absolute top-0 right-0 w-64 h-32 bg-[var(--fs-yellow)]/[0.02] rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 bg-white/[0.03] rounded-sm border border-white/10">
                        <BarChart3 size={14} className="text-[var(--fs-yellow)]" />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-[11px] font-black text-white uppercase tracking-wider">Global Distribution</h2>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.1em]">Market Liquidity Analysis</p>
                    </div>
                </div>

                <div className="flex items-center gap-5 px-4 py-2 bg-black/20 rounded-sm border border-white/5">
                    <div className="flex flex-col items-end">
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Liquid_Pool</span>
                        <span className="text-xs font-mono font-black text-white">${totalBet.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="w-px h-6 bg-white/5" />
                    <div className="flex flex-col items-end">
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Active_Nodes</span>
                        <div className="flex items-center gap-1.5 text-[var(--fs-yellow)]">
                            <Users size={10} />
                            <span className="text-xs font-mono font-black">12.4K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPACT HORIZONTAL CHART MODULE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 relative z-10">
                {[
                    { label: 'HOME', percentage: distribution.home, color: 'var(--fs-yellow)', team: match.home_team },
                    { label: 'DRAW', percentage: distribution.draw, color: 'rgba(255,255,255,0.2)', team: 'Draw' },
                    { label: 'AWAY', percentage: distribution.away, color: 'rgba(255,255,255,0.4)', team: match.away_team },
                ].map((item, i) => (
                    <div key={i} className="bg-black/20 p-3 rounded-sm border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-[9px] font-black text-white/80 uppercase truncate max-w-[100px]">{item.team}</span>
                            <span className="text-[10px] font-mono font-black text-[var(--fs-yellow)]">{item.percentage}%</span>
                        </div>

                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{
                                    duration: 4.5, // Ultra slow motion
                                    ease: "easeInOut",
                                    delay: i * 0.3
                                }}
                                className="h-full relative rounded-full"
                                style={{ backgroundColor: item.color }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
