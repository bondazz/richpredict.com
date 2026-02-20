"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function TopTicker() {
    const items = [
        "FOOTBALL PREDICTIONS",
        "TENNIS PREDICTIONS",
        "BASKETBALL PREDICTIONS",
        "HOCKEY PREDICTIONS",
        "GOLF PREDICTIONS",
        "BASEBALL PREDICTIONS",
        "SNOOKER PREDICTIONS",
        "VOLLEYBALL PREDICTIONS"
    ];

    // Create a long repeated list to ensure seamless looping
    const tickerItems = [...items, ...items, ...items];

    return (
        <div className="bg-[#001e28] border-b border-white/5 h-10">
            <div className="max-w-[1240px] mx-auto w-full h-full relative px-2 flex items-center overflow-hidden">
                {/* Gradient Masks (Constrained to the inner container) */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#001e28] via-[#001e28]/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#001e28] via-[#001e28]/80 to-transparent z-20 pointer-events-none" />

                {/* Static Label (Aligned with main content left edge) */}
                <div className="relative z-30 flex items-center gap-2 bg-[#001e28] pr-4">
                    <Zap size={10} className="text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" />
                    <span className="text-[10px] font-black text-[var(--fs-yellow)] uppercase tracking-wider whitespace-nowrap">PREDICTIONS:</span>
                </div>

                {/* Ticker Container (Scrolling Area) */}
                <div className="flex-1 overflow-hidden ml-4">
                    <motion.div
                        className="flex whitespace-nowrap gap-12 items-center"
                        animate={{ x: [0, -1200] }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {tickerItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] cursor-default">
                                    {item}
                                </span>
                                <div className="size-1 bg-white/10 rounded-full" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
