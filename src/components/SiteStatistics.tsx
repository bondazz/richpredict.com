"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Activity, Crown, Users } from 'lucide-react';
import { getSynchronizedStats } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// MECHANICAL DIGIT - Compact but with perfect mechanical bounce
const Digit = ({ char, direction, colorClass }: { char: string, direction: 'up' | 'down', colorClass: string }) => {
    return (
        <div className="relative h-[18px] w-[0.62em] flex justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={char}
                    initial={{ y: direction === 'up' ? 18 : -18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: direction === 'up' ? -18 : 18, opacity: 0 }}
                    transition={{
                        ease: [0.68, -0.55, 0.27, 1.55], // Elastic Bounce
                        duration: 0.6
                    }}
                    className={`absolute inset-0 flex items-center justify-center font-[Klapt] font-black ${colorClass}`}
                >
                    {char}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

// MINI MECHANICAL COUNTER
const MiniCounter = ({ value }: { value: number }) => {
    const stringValue = value.toLocaleString();
    const prevValueRef = useRef<number>(value);
    const [direction, setDirection] = useState<'up' | 'down'>('up');
    const [colorClass, setColorClass] = useState('text-white');

    useEffect(() => {
        if (value > prevValueRef.current) {
            setDirection('up');
            setColorClass('text-green-400');
            const timer = setTimeout(() => setColorClass('text-white'), 1500);
            prevValueRef.current = value;
            return () => clearTimeout(timer);
        } else if (value < prevValueRef.current) {
            setDirection('down');
            setColorClass('text-red-400');
            const timer = setTimeout(() => setColorClass('text-white'), 1500);
            prevValueRef.current = value;
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className="flex items-center text-[16px] font-[Klapt] font-black tracking-tighter">
            {stringValue.split('').map((char, i) => (
                <React.Fragment key={`${i}-${char === ',' ? 'sep' : 'digit'}`}>
                    {char === ',' || char === '.' ? (
                        <span className="opacity-30 mx-[0.2px] text-white font-[Klapt] font-black">,</span>
                    ) : (
                        <Digit char={char} direction={direction} colorClass={colorClass} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export const SiteStatistics = () => {
    const [stats, setStats] = useState(() => getSynchronizedStats());
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const interval = setInterval(() => {
            setStats(getSynchronizedStats());
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const labels = useMemo(() => ({
        header: "Live Stats",
        premium: "PREMIUM SUBSCRIBERS",
        online: "LIVE USERS"
    }), []);

    if (!hasMounted) {
        return (
            <div className="bg-[#001e28] border border-[var(--fs-yellow)]/20 rounded-xl p-4 h-[100px] animate-pulse" />
        );
    }

    return (
        <div className="bg-[#001e28] border border-[var(--fs-yellow)]/20 rounded-xl px-5 py-4 shadow-2xl relative overflow-hidden group translate-y-[-10px]">
            {/* Ambient Background Shine (Matches VIP Card) */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--fs-yellow)]/10 rounded-full blur-[40px] group-hover:bg-[var(--fs-yellow)]/20 transition-colors duration-700" />

            <div className="relative z-10 space-y-3.5">
                {/* Header (Minimal Matching Style) */}
                <div className="flex items-center justify-center gap-3">
                    <div className="h-[0.5px] w-6 bg-[var(--fs-yellow)]/20" />
                    <h3 className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">
                        {labels.header}
                    </h3>
                    <div className="h-[0.5px] w-6 bg-[var(--fs-yellow)]/20" />
                </div>

                <div className="space-y-3">
                    {/* Row 1: Premium */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Crown className="w-3 h-3 text-[var(--fs-yellow)] opacity-80" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-wide">
                                {labels.premium}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MiniCounter value={stats.premium} />
                            <motion.div
                                key={stats.premium}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-1.5 py-0.5 bg-[var(--fs-yellow)]/10 border border-[var(--fs-yellow)]/20 rounded-sm"
                            >
                                <span className="text-[10px] font-black text-[var(--fs-yellow)]">
                                    +{stats.lastIncrement}
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Row 2: Live Users */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 text-green-500 opacity-80" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-wide">
                                {labels.online}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MiniCounter value={stats.online} />
                            <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-sm">
                                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest leading-none">LIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
