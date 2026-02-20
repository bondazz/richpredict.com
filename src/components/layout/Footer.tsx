"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
    return (
        <footer className="bg-[#00141e] border-t border-white/5 pt-12 pb-6 mt-auto">
            <div className="max-w-[1240px] mx-auto w-full px-4">

                {/* 1. SEO Text Section (Collapsed style) */}
                <div className="mb-12 border-b border-white/5 pb-8">
                    <h2 className="text-[11px] font-black text-white uppercase tracking-widest mb-4">
                        RichPredict - The World's Best AI Sports Predictions
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-[var(--fs-text-dim)] leading-relaxed">
                        RichPredict offers the most accurate football predictions, tennis tips, and basketball analytics driven by advanced AI algorithms.
                        We cover over 100+ football leagues including the <span className="text-white cursor-pointer hover:underline">Premier League</span>,
                        <span className="text-white cursor-pointer hover:underline"> Champions League</span>, <span className="text-white cursor-pointer hover:underline">La Liga</span>,
                        and <span className="text-white cursor-pointer hover:underline">Serie A</span>.
                        Our nodes analyze millions of data points to provide you with high-probability betting tips, live scores, and match previews.
                        Whether you are looking for <span className="text-white cursor-pointer hover:underline">Today's Football Predictions</span> or
                        <span className="text-white cursor-pointer hover:underline">Weekend Betting Tips</span>, RichPredict is your ultimate source for winning strategies.
                    </p>
                </div>

                {/* 2. Main Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest border-l-2 border-[var(--fs-yellow)] pl-2">Football</h3>
                        <ul className="space-y-2">
                            {["Football News", "Premier League", "Champions League", "Europa League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] text-[var(--fs-text-dim)] hover:text-white transition-colors block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest border-l-2 border-[#ff4646] pl-2">Tennis</h3>
                        <ul className="space-y-2">
                            {["Tennis News", "ATP Tour", "WTA Tour", "Australian Open", "French Open", "Wimbledon", "US Open", "Davis Cup"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] text-[var(--fs-text-dim)] hover:text-white transition-colors block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest border-l-2 border-[#ff8c00] pl-2">Basketball</h3>
                        <ul className="space-y-2">
                            {["Basketball News", "NBA", "EuroLeague", "ACB", "NBA Playoffs", "FIBA World Cup", "College Basketball"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] text-[var(--fs-text-dim)] hover:text-white transition-colors block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest border-l-2 border-[#00b4ff] pl-2">Hockey</h3>
                        <ul className="space-y-2">
                            {["Hockey News", "NHL", "KHL", "SHL", "IIHF World Championship", "NHL Playoffs", "Stanley Cup"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] text-[var(--fs-text-dim)] hover:text-white transition-colors block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5 - Community / Trending */}
                    <div className="space-y-4 col-span-2 md:col-span-4 lg:col-span-1">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest border-l-2 border-white pl-2">Trending</h3>
                        <ul className="space-y-2">
                            {["Erling Haaland", "Kylian Mbappé", "LeBron James", "Novak Djokovic", "Connor McDavid", "Manchester City", "Real Madrid"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] text-[var(--fs-text-dim)] hover:text-white transition-colors block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. Bottom Utility Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end border-t border-white/5 pt-10">

                    {/* Brand & Links */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center opacity-90">
                                <svg viewBox="0 0 160 100" fill="currentColor" className="w-full h-full">
                                    <g className="text-white">
                                        <path d="m21.1 55.1c-.5-2.6-.6-5.1-.3-7.6l-20.6-1.9c-.4 4.3-.2 8.6.6 13s2.1 8.6 3.9 12.5l18.7-8.7c-1-2.3-1.8-4.7-2.3-7.3" />
                                        <path d="m27.6 68.8-15.9 13.3c4.7 5.6 10.6 10.1 17.2 13.2l8.7-18.7c-3.8-1.9-7.3-4.5-10-7.8" />
                                        <path d="m55.1 78.9c-2.6.5-5.2.6-7.6.3l-1.8 20.6c4.3.4 8.6.2 13-.6 1.4-.3 2.9-.6 4.3-.9l-5.4-20c-.8.2-1.7.4-2.5.6" />
                                        <path d="m44.9 21.1c3.5-.6 7.1-.6 10.4 0l8.9-19.1c-7.2-2.1-15-2.7-22.9-1.3-19.7 3.5-34.7 18.2-39.6 36.4l20 5.4c2.9-10.7 11.6-19.3 23.2-21.4" />
                                        <path d="m68.8 72.5 13.3 15.8c3.3-2.8 6.3-6.1 8.8-9.6l-16.9-11.9c-1.5 2.1-3.2 4-5.2 5.7" />
                                        <path d="m99.8 45.6-20.6 1.8c.2 1.7.2 3.4 0 5.1l20.6 1.8c.3-2.8.3-5.7 0-8.7" />
                                    </g>
                                    <path d="m73.3 0-19.2 41.3 83.1-41.3z" fill="var(--fs-yellow)" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white uppercase font-[Klapt] leading-none">
                                RICH<span className="text-[var(--fs-yellow)]">PREDICT</span>
                            </span>
                        </div>

                        <ul className="flex flex-wrap gap-x-6 gap-y-2">
                            {["Terms of Use", "Privacy Policy", "Advertising", "Contact", "Cookie Policy", "GDPR Compliance"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-wider transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-4">
                            <SocialIcon Icon={Facebook} />
                            <SocialIcon Icon={Twitter} />
                            <SocialIcon Icon={Instagram} />
                            <SocialIcon Icon={Youtube} />
                        </div>
                    </div>

                    {/* App Download Section */}
                    <div className="flex flex-col sm:flex-row items-center lg:justify-end gap-6 bg-white/5 rounded-xl p-4 lg:p-6 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--fs-yellow)]/5 rounded-full blur-[40px] group-hover:bg-[var(--fs-yellow)]/10 transition-colors" />

                        <div className="relative z-10 flex flex-col gap-3 text-center sm:text-left">
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-[var(--fs-yellow)] uppercase tracking-[0.2em]">Mobile Experience</span>
                                <h4 className="text-base font-black text-white uppercase leading-tight">Download Our App</h4>
                            </div>
                            <p className="text-[10px] text-white/50 max-w-[200px]">Get real-time notifications and exclusive premium tips directly on your phone.</p>

                            <div className="flex gap-2 justify-center sm:justify-start">
                                <button className="bg-black border border-white/10 rounded px-2 py-1 flex items-center gap-1.5 hover:border-white/30 transition-colors">
                                    <Smartphone size={16} className="text-white" />
                                    <div className="text-left">
                                        <div className="text-[6px] text-white/60 uppercase font-bold leading-none">Download on the</div>
                                        <div className="text-[9px] text-white font-bold leading-none mt-0.5">App Store</div>
                                    </div>
                                </button>
                                <button className="bg-black border border-white/10 rounded px-2 py-1 flex items-center gap-1.5 hover:border-white/30 transition-colors">
                                    <Smartphone size={16} className="text-white" />
                                    <div className="text-left">
                                        <div className="text-[6px] text-white/60 uppercase font-bold leading-none">Get it on</div>
                                        <div className="text-[9px] text-white font-bold leading-none mt-0.5">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Pseudo-phone visual */}
                        <div className="relative w-24 h-48 bg-black border-4 border-zinc-800 rounded-[1.5rem] shadow-2xl shrink-0 rotate-12 translate-y-4 group-hover:rotate-0 group-hover:translate-y-0 transition-all duration-500 hidden sm:block">
                            <div className="absolute top-2 w-full flex justify-center"><div className="w-8 h-1 bg-zinc-800 rounded-full" /></div>
                            <div className="absolute inset-1 top-4 bg-[var(--fs-bg)] rounded-[1rem] overflow-hidden flex flex-col items-center justify-center pt-4 opacity-50">
                                <div className="w-full h-8 bg-zinc-800/50 mb-2" />
                                <div className="w-[80%] h-2 bg-zinc-800/50 rounded-full mb-2" />
                                <div className="w-[60%] h-2 bg-zinc-800/50 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-[9px] text-white/20 font-mono">
                        © 2026 RICHPREDICT. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-white/20 uppercase font-bold">Gamble Responsibly 18+</span>
                        <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[8px] text-white/40 font-bold">18+</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ Icon }: { Icon: any }) {
    return (
        <a href="#" className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/40 hover:bg-[var(--fs-yellow)] hover:text-black transition-all">
            <Icon size={14} />
        </a>
    );
}
