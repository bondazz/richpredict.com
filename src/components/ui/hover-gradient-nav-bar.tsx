"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Home, Trophy, Star, Search, User, LogOut, Menu, Zap, Bell } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface HoverGradientMenuItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    gradient: string;
    iconColor: string;
    mobileOnly?: boolean;
    desktopOnly?: boolean;
}

const mainMenuItems: HoverGradientMenuItem[] = [
    {
        icon: <Home className="h-5 w-5" />,
        label: "Home",
        href: "/",
        gradient: "radial-gradient(circle, rgba(255,228,56,0.15) 0%, rgba(255,228,56,0.06) 50%, transparent 100%)",
        iconColor: "group-hover:text-[var(--fs-yellow)]"
    },
    {
        icon: <Zap className="h-5 w-5" />,
        label: "Live",
        href: "#",
        gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.06) 50%, transparent 100%)",
        iconColor: "group-hover:text-red-500"
    },
    {
        icon: <Trophy className="h-5 w-5" />,
        label: "Leagues",
        href: "#",
        gradient: "radial-gradient(circle, rgba(255,228,56,0.15) 0%, rgba(255,228,56,0.06) 50%, transparent 100%)",
        iconColor: "group-hover:text-[var(--fs-yellow)]"
    },
    {
        icon: <Star className="h-5 w-5" />,
        label: "Favorites",
        href: "#",
        gradient: "radial-gradient(circle, rgba(255,228,56,0.15) 0%, rgba(255,228,56,0.06) 50%, transparent 100%)",
        iconColor: "group-hover:text-[var(--fs-yellow)]"
    },
    {
        icon: <Search className="h-5 w-5" />,
        label: "Search",
        href: "#",
        gradient: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        iconColor: "group-hover:text-white"
    },
];

const subMenuItems: HoverGradientMenuItem[] = [
    { icon: <User className="h-4 w-4" />, label: "Profile", href: "#", gradient: "", iconColor: "text-white/60" },
    { icon: <Bell className="h-4 w-4" />, label: "Alerts", href: "#", gradient: "", iconColor: "text-white/60" },
    { icon: <LogOut className="h-4 w-4" />, label: "Logout", href: "#", gradient: "", iconColor: "text-red-400" },
];

const itemVariants: Variants = {
    initial: { rotateX: 0, opacity: 1 },
    hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
    initial: { rotateX: 90, opacity: 0 },
    hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
        opacity: 1,
        scale: 2,
        transition: {
            opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
        },
    },
};

const sharedTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    duration: 0.5,
};

export default function HoverGradientNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 w-full md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-[100] px-4 pb-4 md:pb-0 pointer-events-none">
            <div className="relative w-full md:w-fit mx-auto pointer-events-auto">

                {/* Upward Opening Sub-menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full right-0 mb-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 min-w-[160px] shadow-2xl overflow-hidden"
                        >
                            <div className="flex flex-col gap-1">
                                {subMenuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className={cn("transition-colors", item.iconColor)}>{item.icon}</span>
                                        <span className="text-[12px] font-bold text-white/70 group-hover:text-white uppercase tracking-wider">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.nav
                    className="w-full md:w-fit px-2 md:px-3 py-2 md:py-2.5 rounded-2xl md:rounded-[2rem] 
          bg-black/80 backdrop-blur-xl
          border border-white/10
          shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-visible"
                >
                    <ul className="flex items-center justify-between md:justify-center gap-1 md:gap-2 relative z-10">
                        {/* Standard Items */}
                        {mainMenuItems.map((item, index) => (
                            <motion.li
                                key={item.label}
                                className={cn(
                                    "relative flex-1 md:flex-none",
                                    index > 2 ? "hidden sm:block" : "" // Hide extra items on very small mobile
                                )}
                            >
                                <div
                                    className="block rounded-2xl overflow-visible group relative cursor-pointer"
                                    style={{ perspective: "600px" }}
                                >
                                    <motion.div
                                        className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
                                        variants={glowVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        style={{ background: item.gradient }}
                                    />

                                    <Link href={item.href} className="relative block">
                                        <motion.div
                                            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 
                      px-3 py-2 md:px-5 md:py-2.5 relative z-10 
                      text-white/50 group-hover:text-white
                      transition-colors rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-tighter"
                                            variants={itemVariants}
                                            initial="initial"
                                            whileHover="hover"
                                            transition={sharedTransition}
                                            style={{
                                                transformStyle: "preserve-3d",
                                                transformOrigin: "center bottom"
                                            }}
                                        >
                                            <span className={cn("transition-colors duration-300", item.iconColor)}>
                                                {item.icon}
                                            </span>
                                            <span className="md:inline">{item.label}</span>
                                        </motion.div>

                                        <motion.div
                                            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 
                      px-3 py-2 md:px-5 md:py-2.5 absolute inset-0 z-10 
                      text-white
                      transition-colors rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-tighter"
                                            variants={backVariants}
                                            initial="initial"
                                            whileHover="hover"
                                            transition={sharedTransition}
                                            style={{
                                                transformStyle: "preserve-3d",
                                                transformOrigin: "center top",
                                                transform: "rotateX(90deg)"
                                            }}
                                        >
                                            <span className={cn("transition-colors duration-300", item.iconColor)}>
                                                {item.icon}
                                            </span>
                                            <span className="md:inline">{item.label}</span>
                                        </motion.div>
                                    </Link>
                                </div>
                            </motion.li>
                        ))}

                        {/* Menu Toggle / More (Mobile & Desktop) */}
                        <li className="relative flex-1 md:flex-none">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={cn(
                                    "w-full flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-2xl relative z-10 transition-all duration-300",
                                    isMenuOpen ? "bg-[var(--fs-yellow)] text-black" : "text-white/50 hover:text-white"
                                )}
                            >
                                <Menu className="h-5 w-5" />
                                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-tighter">More</span>
                            </button>
                        </li>
                    </ul>
                </motion.nav>
            </div>
        </div>
    );
}
