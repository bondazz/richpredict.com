"use client";

import { motion } from "framer-motion";
import { Zap, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function InnerAdBanner() {
    return (
        <motion.div
            whileHover={{ scale: 1.002 }}
            className="relative overflow-hidden rounded-sm border border-white/20 group cursor-pointer shadow-2xl w-full block min-h-[60px] bg-[#001e28]"
        >
            {/* 60FPS Animated Background Gradient */}
            <div
                className="absolute inset-0 bg-[#001e28]"
            />
            <motion.div
                animate={{
                    background: [
                        "linear-gradient(110deg, #001e28 0%, #002d3c 50%, #001e28 100%)",
                        "linear-gradient(110deg, #002d3c 0%, #001e28 50%, #002d3c 100%)",
                        "linear-gradient(110deg, #001e28 0%, #002d3c 50%, #001e28 100%)"
                    ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-40"
            />

            {/* Shimmer Effect Layer */}
            <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
            />

            <div className="relative z-10 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 backdrop-blur-md bg-black/20">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Compact Logo */}
                    <div className="bg-black/60 p-2 rounded-sm border border-white/10 shrink-0">
                        <img src="https://static.flashscore.com/res/data/005863.png" alt="1xBet" className="h-4 sm:h-5 object-contain" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="text-[11px] sm:text-[13px] font-black text-white uppercase tracking-tight leading-none mb-1">
                            100% WELCOME BONUS <span className="text-[var(--fs-yellow)]">UP TO 200 AZN</span>
                        </span>
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
                            <Zap size={8} className="text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" />
                            Gamble Responsibly. T&Cs apply. 18+
                        </span>
                    </div>
                </div>

                <div className="w-full sm:w-auto mt-1 sm:mt-0">
                    <a
                        href="https://z.cdn.ftd.agency/go?z=1862533368"
                        target="_blank"
                        className="relative group block w-full text-center sm:w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white text-black text-[10px] sm:text-[11px] font-black uppercase px-8 py-2.5 rounded-sm shadow-2xl group-hover:bg-[var(--fs-yellow)] transition-colors duration-300">
                            GET BONUS
                        </div>
                    </a>
                </div>
            </div>

            {/* Top Right Detail */}
            <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <ChevronDown size={14} className="text-white" />
            </div>
        </motion.div>
    );
}
