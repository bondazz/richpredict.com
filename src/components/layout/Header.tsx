"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Trophy, Search, Menu, Newspaper, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/layout/MobileMenu";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useTitle } from "@/context/TitleContext";

interface HeaderProps {
    pinnedLeagues: any[];
    countriesByRegion: Record<string, any[]>;
    regionOrder: string[];
}

export default function Header({ pinnedLeagues, countriesByRegion, regionOrder }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();

    const { title } = useTitle();

    const isNewsActive = pathname.startsWith("/news");
    const isScoresActive = !isNewsActive && !pathname.startsWith("/admin");

    const getH1Text = () => {
        if (pathname === "/") return "AI Football Predictions, Results, EPL & Champions League";
        if (pathname.startsWith("/news")) return "Sports news, interviews, highlights, rumours, scores and statistics";
        if (pathname.startsWith("/predictions")) return "AI-Powered Football Predictions & Match Analytics";

        // Handle sports paths like /tennis, /basketball etc.
        const sportName = pathname.substring(1); // Get name from /name
        const validSports = ["football", "tennis", "basketball", "hockey", "golf", "baseball", "snooker", "volleyball"];
        if (validSports.includes(sportName)) {
            const capitalized = sportName.charAt(0).toUpperCase() + sportName.slice(1);
            return `AI ${capitalized} Predictions, Results & Match Analytics`;
        }

        return "AI Football Predictions, Results, EPL & Champions League";
    };

    return (
        <header className="z-50 w-full flex flex-col">
            {/* 1. TOP UTILITY BAR (Very Thin) */}
            <div className="bg-[#00141e] border-b border-white/5 py-1 hidden sm:block">
                <div className="max-w-[1240px] mx-auto w-full px-2 flex justify-between items-center">
                    <h1 className="text-[8px] font-bold text-white uppercase tracking-widest leading-none opacity-90">
                        {title || getH1Text()}
                    </h1>
                    <div className="flex gap-4 text-[8px] font-bold text-[var(--fs-text-dim)]">
                        <span className="hover:text-white cursor-pointer transition-colors">MOBILE APP</span>
                        <span className="hover:text-white cursor-pointer transition-colors">ADVERTISE</span>
                    </div>
                </div>
            </div>

            {/* 2. AD BANNER AREA */}
            <div className="bg-[var(--fs-bg)] py-3 px-2 hidden md:flex justify-center border-b border-white/5">
                <div className="max-w-[1240px] mx-auto w-full flex justify-center overflow-hidden">
                    <a
                        href="https://z.cdn.ftd.agency/go?z=1862533368"
                        target="_blank"
                        rel="nofollow"
                        className="block m-auto outline-none text-center leading-[0] max-w-none shadow-2xl hover:opacity-90 transition-opacity"
                    >
                        <img
                            src="https://f7.cdn.ftd.agency/uploads/media/3/0/174903/v1/casino_smartphone_10000_970x90.gif"
                            width="970"
                            alt="Advertisement"
                            className="static w-full max-w-[970px] h-auto rounded-sm"
                        />
                    </a>
                </div>
            </div>

            {/* 3. MAIN HEADER LAYER */}
            <div className="bg-[var(--fs-header)] border-b border-white/5">
                <div className="max-w-[1240px] mx-auto w-full px-2 flex justify-between items-center h-14 md:h-16">
                    <div className="flex items-center gap-3 md:gap-8 h-full min-w-0">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group shrink-0" aria-label="RichPredict Homepage">
                            <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
                                <svg viewBox="0 0 160 100" fill="currentColor" className="w-full h-full">
                                    <g className="text-white">
                                        <path d="M21.1 55.1C20.6 52.5 20.5 50 20.8 47.5L0.2 45.6C-0.2 49.9 0 54.2 0.8 58.6C1.6 63 2.9 67.2 4.7 71.1L23.4 62.4C22.4 60.1 21.6 57.7 21.1 55.1Z" />
                                        <path d="M27.6 68.8L11.7 82.1C16.4 87.7 22.3 92.2 28.9 95.3L37.6 76.6C33.8 74.7 30.3 72.1 27.6 68.8Z" />
                                        <path d="M55.1 78.9C52.5 79.4 49.9 79.5 47.5 79.2L45.7 99.8C50 100.2 54.3 100 58.7 99.2C60.1 98.9 61.6 98.6 63 98.3L57.6 78.3C56.8 78.5 55.9 78.7 55.1 78.9Z" />
                                        <path d="M44.9 21.1C48.4 20.5 52 20.5 55.3 21.1L64.2 2C57 0 49.2 -0.6 41.3 0.8C21.6 4.3 6.6 19 1.7 37.2L21.7 42.6C24.6 31.9 33.3 23.3 44.9 21.2Z" />
                                        <path d="M68.8 72.5L82.1 88.3C85.4 85.5 88.4 82.2 90.9 78.7L74 66.8C72.5 68.9 70.8 70.8 68.8 72.5Z" />
                                        <path d="M99.8 45.6L79.2 47.4C79.4 49.1 79.4 50.8 79.2 52.5L99.8 54.3C100.1 51.5 100.1 48.6 99.8 45.6Z" />
                                    </g>
                                    <path d="M73.3 0L54.1 41.3L137.2 0Z" fill="var(--fs-yellow)" />
                                </svg>
                            </div>
                            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase font-[Klapt] leading-none ml-[-8px] md:ml-[-12px]">
                                RICH<span className="text-[var(--fs-yellow)]">PREDICT</span>
                            </span>
                        </Link>

                        {/* Main Navigation Tabs - Visible on LG screens up */}
                        <nav className="hidden lg:flex items-center h-full">
                            <div className="flex h-full">
                                <Link
                                    href="/"
                                    className={cn(
                                        "px-6 flex items-center gap-3 border-r border-white/5 cursor-pointer hover:bg-white/5 transition-colors group relative h-full",
                                        isScoresActive ? "active-tab" : ""
                                    )}
                                >
                                    <svg viewBox="0 0 20 20" className={cn("w-5 h-5 transition-colors", isScoresActive ? "text-white" : "text-[var(--fs-text-dim)] group-hover:text-white")} fill="currentColor">
                                        <path d="M17.528,0 L20,2.471 L20,17.528 L17.531,20 L2.469,20 L0,17.528 L0,2.47 L2.473,0 L17.528,0 Z M16.958,1.373 L10.686,1.373 L10.686,18.626 L16.961,18.626 L18.625,16.959 L18.625,3.041 L16.958,1.373 Z M9.313,1.373 L3.041,1.373 L1.373,3.039 L1.373,16.959 L3.039,18.626 L9.313,18.626 L9.313,1.373 Z M4.6461,5.9522 C4.7861,5.9522 4.9171,6.0052 5.0131,6.1032 L5.0131,6.1032 L6.0211,7.1112 C6.1181,7.2082 6.1731,7.3382 6.1731,7.4792 L6.1731,7.4792 L6.1731,12.1692 C6.1731,12.2022 6.1941,12.2252 6.2271,12.2252 L6.2271,12.2252 L8.2091,12.2252 C8.2421,12.2462 8.2641,12.2462 8.2641,12.2792 L8.2641,12.2792 L8.2641,13.4812 C8.2421,13.5142 8.2421,13.5352 8.2091,13.5352 L8.2091,13.5352 L2.8251,13.5352 C2.7921,13.5352 2.7711,13.5142 2.7711,13.4812 L2.7711,13.4812 L2.7711,12.2792 C2.7711,12.2462 2.7921,12.2252 2.8251,12.2252 L2.8251,12.2252 L4.8071,12.2252 C4.8401,12.2252 4.8621,12.2022 4.8621,12.1692 L4.8621,12.1692 L4.8621,7.5232 C4.8621,7.3812 4.7421,7.2622 4.6021,7.2622 L4.6021,7.2622 L2.8251,7.2622 C2.7921,7.2622 2.7711,7.2412 2.7711,7.2082 L2.7711,7.2082 L2.7711,6.0052 C2.7711,5.9732 2.7921,5.9522 2.8251,5.9522 L2.8251,5.9522 Z M15.8925,5.9515 C16.0325,5.9515 16.1635,6.0055 16.2605,6.1035 L16.2605,6.1035 L17.2685,7.1105 C17.3655,7.2085 17.4195,7.3385 17.4195,7.4795 L17.4195,7.4795 L17.4195,12.0065 C17.4195,12.1485 17.3655,12.2785 17.2685,12.3765 L17.2685,12.3765 L16.2605,13.3835 C16.1635,13.4815 16.0325,13.5345 15.8925,13.5345 L15.8925,13.5345 L13.4545,13.5345 C13.3145,13.5345 13.1835,13.4815 13.0865,13.3835 L13.0865,13.3835 L12.0785,12.3765 C11.9815,12.2785 11.9275,12.1485 11.9275,12.0065 L11.9275,12.0065 L11.9275,7.4795 C11.9275,7.3385 11.9815,7.2085 12.0785,7.1105 L12.0785,7.1105 L13.0865,6.1035 C13.1835,6.0055 13.3145,5.9515 13.4545,5.9515 L13.4545,5.9515 Z M15.8495,7.2625 L13.4985,7.2625 C13.3465,7.2625 13.2375,7.3815 13.2375,7.5235 L13.2375,7.5235 L13.2375,11.9645 C13.2375,12.1045 13.3465,12.2255 13.4985,12.2255 L13.4985,12.2255 L15.8495,12.2255 C15.9895,12.2255 16.1085,12.1045 16.1085,11.9645 L16.1085,11.9645 L16.1085,7.5235 C16.1085,7.3815 15.9895,7.2625 15.8495,7.2625 L15.8495,7.2625 Z" />
                                    </svg>
                                    <span className={cn("text-[11px] font-black uppercase transition-colors", isScoresActive ? "text-white" : "text-[var(--fs-text-dim)] group-hover:text-white")}>Scores</span>
                                    {isScoresActive && (
                                        <motion.div
                                            layoutId="header-active-bar"
                                            className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--fs-yellow)] shadow-[0_0_15px_rgba(255,221,0,0.3)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                                <Link
                                    href="/news"
                                    className={cn(
                                        "px-6 flex items-center gap-3 border-r border-white/5 cursor-pointer hover:bg-white/5 transition-colors group relative h-full",
                                        isNewsActive ? "active-tab" : ""
                                    )}
                                >
                                    <Newspaper size={20} className={cn("transition-colors", isNewsActive ? "text-white" : "text-[var(--fs-text-dim)] group-hover:text-white")} />
                                    <span className={cn("text-[11px] font-black uppercase transition-colors flex items-center gap-2", isNewsActive ? "text-white" : "text-[var(--fs-text-dim)] group-hover:text-white")}>
                                        News
                                        <span className="bg-[var(--fs-yellow)] text-black text-[8px] px-1.5 py-0.5 rounded-sm font-black whitespace-nowrap uppercase">SPORTS</span>
                                    </span>
                                    {isNewsActive && (
                                        <motion.div
                                            layoutId="header-active-bar"
                                            className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--fs-yellow)] shadow-[0_0_15px_rgba(255,221,0,0.3)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </div>
                        </nav>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-[var(--fs-text-dim)] hover:bg-white/5 h-8 w-8 md:h-10 md:w-10 shrink-0" aria-label="Search">
                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <Button variant="ghost" className="flex items-center gap-1.5 px-2 md:px-3 hover:bg-white/5 text-[var(--fs-text-dim)] hover:text-white transition-colors h-8 md:h-10 shrink-0">
                            <div className="bg-white/5 p-1 rounded-sm">
                                <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </div>
                            <span className="text-[10px] md:text-[11px] font-black uppercase hidden sm:block">Login</span>
                        </Button>
                        <div className="lg:hidden shrink-0 ml-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(true)}
                                className="text-[var(--fs-text-dim)] hover:bg-white/5 h-8 w-8"
                                aria-label="Open menu"
                            >
                                <Menu size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. SPORTS BAR (Flashscore Style) */}
            <div className="bg-[#00141e]/50 backdrop-blur-md border-t border-white/5">
                <div className="max-w-[1240px] mx-auto w-full px-2 flex items-center h-10 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-1 min-w-max">
                        {[
                            {
                                name: "Favorites", slug: "favorites", icon: (props: any) => (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ), count: 0
                            },
                            {
                                name: "Football", slug: "football", path: "/", icon: (props: any) => (
                                    <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}>
                                        <path d="m17 2.9c-3.9-3.9-10.2-3.9-14.1 0s-3.9 10.2 0 14.1c2.5 2.5 6.2 3.5 9.6 2.6s6.1-3.6 7-7c1-3.5 0-7.2-2.5-9.7zm.4 2.8c.6 1.1 1 2.2 1.1 3.4l-1.8-1zm-1.4-1.8c.1.1.3.3.4.4l-1.1 3.6-1.3.4-3.3-2.4v-1.4l3.2-2.2c.7.4 1.5.9 2.1 1.6zm-6-2.5c.8 0 1.6.1 2.3.3l-2.3 1.6-2.3-1.6c.7-.2 1.5-.3 2.3-.3zm-6.1 2.5c.6-.7 1.4-1.2 2.2-1.6l3.2 2.2v1.4l-3.3 2.4-1.4-.4-1.1-3.6c.1-.1.3-.3.4-.4zm-1.4 1.8.7 2.4-1.8 1.c.1-1.2.5-2.4 1.1-3.4zm1.4 10.3c-.1-.1-.1-.2-.2-.2h2l.7 1.9c-1-.4-1.8-1-2.5-1.7zm2-1.6h-3.3c-.7-1.1-1.1-2.4-1.2-3.7l2.8-1.5 1.4.4 1.3 3.9zm6 3.9c-1.3.3-2.7.3-4 0l-1-3 1.1-1.1h3.8l1.1 1.1zm0-5.4h-3.9l-1.1-3.7 3.1-2.2 3.1 2.3zm4.1 3.1c-.7.7-1.5 1.3-2.4 1.7l.7-1.9h2c-.1.1-.2.2-.3.2zm-2-1.6-.9-.9 1.3-3.9 1.4-.4 2.8 1.5c-.1 1.3-.5 2.6-1.2 3.7z" />
                                    </svg>
                                )
                            },
                            {
                                name: "Tennis", slug: "tennis", icon: (props: any) => (
                                    <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}>
                                        <path d="m13.2.1c2-.3 3.9.3 5.1 1.6 1.3 1.3 1.8 3.1 1.6 5.1-.3 2-1.3 3.9-2.8 5.5-.8.8-1.6 1.4-2.6 1.9-.8.4-1.7.7-2.6.9l-7.6 1.6-3.3 3.2h-1v-1l3.3-3.3 1.6-7.6c.3-1.9 1.3-3.7 2.8-5.2 1.5-1.5 3.5-2.5 5.5-2.7zm-7.8 12.1-.6 2.9 2.9-.6c-1-.5-1.8-1.3-2.3-2.3zm8.7-10.8c-.3 0-.5 0-.8.1-1.6.2-3.3 1-4.7 2.4-1.2 1.2-2 2.6-2.3 4.1l-.1.3v.2c-.2 1.6.2 3-1.2 4s2.4 1.4 4 1.2h.2l.4-.1c1.5-.3 2.9-1.1 4.1-2.3.7-.7 1.2-1.4 1.6-2.2s.7-1.6.8-2.5c.2-1.6-.2-3-1.2-4-.8-.8-1.9-1.2-3.2-1.2zm-11.4-1.4c.7 0 1.4.3 1.9.8.6.5.9 1.2.9 1.9 0 1.5-1.2 2.7-2.7 2.7s-2.8-1.1-2.8-2.7c0-1.5 1.2-2.7 2.7-2.7zm0 1.4c-.7 0-1.3.6-1.3 1.3 0 .8.6 1.4 1.4 1.4.4 0 .7-.1 1-.4s.4-.6.4-1c-.1-.7-.7-1.3-1.5-1.3z" />
                                    </svg>
                                )
                            },
                            {
                                name: "Basketball", slug: "basketball", icon: (props: any) => (
                                    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
                                        <path d="M15.782 16.392A27.055 27.055 0 0 0 8.438 6.027c.488-.37.998-.71 1.537-1.008 1.184 1.16 2.743 1.715 3.843 2.1.189.064.365.126.523.185 2.666 1 3.361 1.443 4.264 2.147.011.182.028.364.028.548a8.607 8.607 0 0 1-2.851 6.393M9.735 18.62c-.64-1.44-1.117-2.933-1.552-4.905-.347-1.575-.932-3.528-2.332-5.06a12.89 12.89 0 0 1 1.535-1.739 25.73 25.73 0 0 1 7.271 10.342A8.587 8.587 0 0 1 10 18.633c-.09 0-.176-.01-.265-.013m-6.323-3.053c.096-2.08.689-4.03 1.668-5.735.801.971 1.347 2.266 1.768 4.178.377 1.708.797 3.118 1.318 4.422a8.64 8.64 0 0 1-4.754-2.865M1.469 8.738a3.636 3.636 0 0 1 2.544.221 14.02 14.02 0 0 0-1.773 4.8A8.578 8.578 0 0 1 1.367 10c0-.429.042-.848.102-1.26M3.604 4.22a25.941 25.941 0 0 1 2.707 1.831 14.128 14.128 0 0 0-1.538 1.765c-.65-.339-1.697-.714-2.953-.557a8.62 8.62 0 0 1 1.784-3.039m5.524-.297c-.623.356-1.209.766-1.768 1.208A27.728 27.728 0 0 0 4.631 3.25a8.592 8.592 0 0 1 3.971-1.76 5.353 5.353 0 0 0 .526 2.434m.843-2.557H10c1.376 0 2.673.331 3.828.906a13.98 13.98 0 0 0-3.484 1.03 3.946 3.946 0 0 1-.373-1.936m8.306 6.198c-.741-.444-1.695-.88-3.456-1.54a20.046 20.046 0 0 0-.554-.198c-.902-.315-2.047-.718-2.958-1.437a12.663 12.663 0 0 1 4.305-.936 8.646 8.646 0 0 1 2.663 4.111M10 0C4.486 0 0 4.485 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0" />
                                    </svg>
                                )
                            },
                            {
                                name: "Hockey", slug: "hockey", icon: (props: any) => (
                                    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
                                        <path d="M19.993 4.25v2.884l-6.297 11.713H1.3l-1.3-1.3v-3.166l1.299-1.3h13.946l4.748-8.83zm-5.481 10.197H1.866l-.5.5v2.035l.499.5H12.88l1.632-3.035zM7.734 2c2.58 0 5.356.77 5.356 2.461v3.018c0 1.691-2.777 2.462-5.356 2.462-2.579 0-5.355-.771-5.355-2.462V4.461C2.38 2.77 5.155 2 7.734 2zm3.99 4.174c-1.046.508-2.548.749-3.99.749-1.44 0-2.944-.241-3.989-.749v1.305c0 .282 1.372 1.096 3.99 1.096 2.617 0 3.99-.814 3.99-1.096zm-3.99-2.809c-2.617 0-3.989.815-3.989 1.096 0 .282 1.372 1.097 3.99 1.097 2.617 0 3.99-.815 3.99-1.097 0-.281-1.373-1.096-3.99-1.096z" />
                                    </svg>
                                )
                            },
                            {
                                name: "Golf", slug: "golf", icon: (props: any) => (
                                    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
                                        <path d="m7.4 13.4c2 .5 3.5 1.8 3.5 3.2 0 1.9-2.5 3.4-5.5 3.4s-5.5-1.5-5.5-3.4c0-1.4 1.4-2.7 3.5-3.2v1.4c-1.3.4-2.1 1.1-2.1 1.8 0 .4.4.9 1 1.3.8.5 2 .8 3.2.8 2.4 0 4.2-1.1 4.2-2.1 0-.4-.4-.9-1-1.3-.4-.2-.7-.4-1.2-.5zm-2.7-13.4 11.7 5.5-10.3 5.5v6.2h-1.4zm12.1 10.3c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.3-3.1 3.1-3.1zm0 1.4c-1 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7c1 0 1.7-.8 1.7-1.7s-.8-1.7-1.7-1.7zm-10.7-9.6v7.6l7.6-4.2z" />
                                    </svg>
                                )
                            },
                            {
                                name: "Baseball", slug: "baseball", icon: (props: any) => (
                                    <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}>
                                        <path d="m3 0 8.8 8.8 3.2 5.2 3.4 3.4.5-.5 1 1-2.1 2.1-1-1 .6-.6-3.4-3.4-5.2-3.1-8.8-8.8v-2l1.1-1.1zm-.5 1.4h-.9l-.2.3v.8l8.3 8.3 2.8 1.7-1.7-2.8c0-.1-8.3-8.3-8.3-8.3zm14.3-1.4c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm0 1.4c-.9 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.8 1.7-1.7c0-1-.7-1.7-1.7-1.7z" />
                                    </svg>
                                )
                            },
                            {
                                name: "Snooker", slug: "snooker", icon: (props: any) => (
                                    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
                                        <path d="m3.1 13.8c1.7 0 3.1 1.4 3.1 3.1 0 1.3-.8 2.4-1.9 2.9-1.2.5-2.5.2-3.4-.7s-1.2-2.2-.7-3.4 1.6-1.9 2.9-1.9zm13.8 0c1.7 0 3.1 1.4 3.1 3.1 0 1.3-.8 2.4-1.9 2.9-1.2.5-2.5.2-3.4-.7s-1.2-2.2-.7-3.4 1.6-1.9 2.9-1.9zm-6.9 0c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm0 1.4c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7 1 0 1.7-.8 1.7-1.7 0-1-.7-1.7-1.7-1.7zm-6.9 0c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7 1 0 1.7-.8 1.7-1.7 0-1-.7-1.7-1.7-1.7zm13.8 0c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7 1 0 1.7-.8 1.7-1.7 0-1-.8-1.7-1.7-1.7zm-10.3-8.3c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.3-3.1 3.1-3.1zm6.8 0c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm-6.8 1.4c-1 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.7 1.7-1.7-.8-1.7-1.7-1.7zm6.8 0c-1 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.8 1.7-1.7-.7-1.7-1.7-1.7zm-3.4-8.3c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm0 1.4c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7-.7-1.7-1.7-1.7z" />
                                    </svg>
                                )
                            },
                            {
                                name: "Volleyball", slug: "volleyball", icon: (props: any) => (
                                    <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}>
                                        <path d="m17 2.9c-2.8-2.8-7-3.7-10.7-2.2s-6.1 4.9-6.3 8.9 2 7.6 5.6 9.4c3.1 1.5 6.7 1.3 9.6-.5s4.7-5 4.7-8.5c0-2.7-1-5.2-2.9-7.1zm1.6 7.1c0 1.2-.2 2.4-.7 3.4-.9 0-1.8-.1-2.6-.4.5-2.1.5-4.4 0-6.5-.3-1.5-.9-2.9-1.6-4.2 3 1.4 4.8 4.4 4.9 7.7zm-6.9-8.5c1.1 1.6 1.8 3.3 2.2 5.2s.4 3.8 0 5.7c-1.2-.6-2.3-1.5-3.2-2.7.2-1.7.1-3.3-.5-4.9-.3-1.2-1-2.3-1.8-3.3 1.1-.2 2.2-.2 3.3 0zm-7.8 2.4c.8-.9 1.9-1.5 3-1.9.8.7 1.4 1.6 1.8 2.6-1.9 1-3.5 2.4-4.7 4-1 1.1-1.7 2.5-2.3 3.9-.9-3.1 0-6.4 2.2-8.6zm-1.2 10.7c0-.1-.1-.2-.1-.2.5-1.8 1.3-3.5 2.5-5 1.1-1.5 2.5-2.7 4.1-3.6.3 1.2.4 2.5.2 3.8-2.4 1.8-4 4.6-4.1 7.6-1.1-.7-1.9-1.6-2.6-2.6zm3.9 3.3c0-1.1.2-2.2.6-3.2 1.3 1.5 3 2.8 4.9 3.6-.7.2-1.4.3-2.1.3-1.2 0-2.3-.3-3.4-.7zm9.4-1.9c-.6.6-1.3 1.1-2.1 1.5-2.4-.8-4.5-2.3-6.1-4.2.5-.9 1.2-1.7 2.1-2.4 1.8 2.2 4.4 3.6 7.2 3.8-.3.5-.7.9-1.1 1.3z" />
                                    </svg>
                                )
                            },
                        ].map((sport) => {
                            const isSportActive = sport.path
                                ? pathname === sport.path
                                : pathname === `/${sport.slug}`;

                            return (
                                <Link
                                    key={sport.name}
                                    href={sport.path || `/${sport.slug}`}
                                    className={cn(
                                        "px-4 h-10 flex items-center gap-2 cursor-pointer transition-all border-b-2 relative",
                                        isSportActive
                                            ? "border-[var(--fs-yellow)] bg-white/5"
                                            : "border-transparent hover:bg-white/5"
                                    )}
                                >
                                    <sport.icon className={cn("w-[14px] h-[14px]", isSportActive ? "text-[var(--fs-yellow)]" : "text-[var(--fs-text-dim)]")} />
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-wider",
                                        isSportActive ? "text-white" : "text-[var(--fs-text-dim)]"
                                    )}>
                                        {sport.name}
                                    </span>
                                    {sport.count !== undefined && (
                                        <span className="text-[7px] font-bold bg-white/10 px-1 rounded-sm text-[var(--fs-text-dim)]">
                                            {sport.count}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                pinnedLeagues={pinnedLeagues}
                countriesByRegion={countriesByRegion}
                regionOrder={regionOrder}
            />
        </header>
    );
}
