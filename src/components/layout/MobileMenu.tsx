"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Star, ChevronDown, ChevronUp } from "lucide-react";
import SidebarCountries from "@/components/SidebarCountries";
import { useState } from "react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    pinnedLeagues: any[];
    countriesByRegion: Record<string, any[]>;
    regionOrder: string[];
}

export default function MobileMenu({
    isOpen,
    onClose,
    pinnedLeagues,
    countriesByRegion,
    regionOrder
}: MobileMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Menu Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[280px] bg-[var(--fs-header)] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-[var(--fs-yellow)]" />
                                <span className="text-[11px] font-black uppercase tracking-tighter text-white">Navigation</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/5 rounded-full text-[var(--fs-text-dim)] hover:text-white transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                            {/* Sports Navigation SECTION */}
                            <div className="space-y-3">
                                <div className="text-[9px] font-black text-[var(--fs-text-dim)] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Trophy size={10} className="text-[var(--fs-yellow)]" />
                                    Sports
                                </div>
                                <div className="space-y-1">
                                    {[
                                        { name: "Football", path: "/", icon: (props: any) => <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}><path d="m17 2.9c-3.9-3.9-10.2-3.9-14.1 0s-3.9 10.2 0 14.1c2.5 2.5 6.2 3.5 9.6 2.6s6.1-3.6 7-7c1-3.5 0-7.2-2.5-9.7zm.4 2.8c.6 1.1 1 2.2 1.1 3.4l-1.8-1zm-1.4-1.8c.1.1.3.3.4.4l-1.1 3.6-1.3.4-3.3-2.4v-1.4l3.2-2.2c.7.4 1.5.9 2.1 1.6zm-6-2.5c.8 0 1.6.1 2.3.3l-2.3 1.6-2.3-1.6c.7-.2 1.5-.3 2.3-.3zm-6.1 2.5c.6-.7 1.4-1.2 2.2-1.6l3.2 2.2v1.4l-3.3 2.4-1.4-.4-1.1-3.6c.1-.1.3-.3.4-.4zm-1.4 1.8.7 2.4-1.8 1c.1-1.2.5-2.4 1.1-3.4zm1.4 10.3c-.1-.1-.1-.2-.2-.2h2l.7 1.9c-1-.4-1.8-1-2.5-1.7zm2-1.6h-3.3c-.7-1.1-1.1-2.4-1.2-3.7l2.8-1.5 1.4.4 1.3 3.9zm6 3.9c-1.3.3-2.7.3-4 0l-1-3 1.1-1.1h3.8l1.1 1.1zm0-5.4h-3.9l-1.1-3.7 3.1-2.2 3.1 2.3zm4.1 3.1c-.7.7-1.5 1.3-2.4 1.7l.7-1.9h2c-.1.1-.2.2-.3.2zm-2-1.6-.9-.9 1.3-3.9 1.4-.4 2.8 1.5c-.1 1.3-.5 2.6-1.2 3.7z" /></svg> },
                                        { name: "Tennis", path: "/tennis", icon: (props: any) => <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}><path d="m13.2.1c2-.3 3.9.3 5.1 1.6 1.3 1.3 1.8 3.1 1.6 5.1-.3 2-1.3 3.9-2.8 5.5-.8.8-1.6 1.4-2.6 1.9-.8.4-1.7.7-2.6.9l-7.6 1.6-3.3 3.2h-1v-1l3.3-3.3 1.6-7.6c.3-1.9 1.3-3.7 2.8-5.2 1.5-1.5 3.5-2.5 5.5-2.7zm-7.8 12.1-.6 2.9 2.9-.6c-1-.5-1.8-1.3-2.3-2.3zm8.7-10.8c-.3 0-.5 0-.8.1-1.6.2-3.3 1-4.7 2.4-1.2 1.2-2 2.6-2.3 4.1l-.1.3v.2c-.2 1.6.2 3-1.2 4s2.4 1.4 4 1.2h.2l.4-.1c1.5-.3 2.9-1.1 4.1-2.3.7-.7 1.2-1.4 1.6-2.2s.7-1.6.8-2.5c.2-1.6-.2-3-1.2-4-.8-.8-1.9-1.2-3.2-1.2zm-11.4-1.4c.7 0 1.4.3 1.9.8.6.5.9 1.2.9 1.9 0 1.5-1.2 2.7-2.7 2.7s-2.8-1.1-2.8-2.7c0-1.5 1.2-2.7 2.7-2.7zm0 1.4c-.7 0-1.3.6-1.3 1.3 0 .8.6 1.4 1.4 1.4.4 0 .7-.1 1-.4s.4-.6.4-1c-.1-.7-.7-1.3-1.5-1.3z" /></svg> },
                                        { name: "Basketball", path: "/basketball", icon: (props: any) => <svg viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M15.782 16.392A27.055 27.055 0 0 0 8.438 6.027c.488-.37.998-.71 1.537-1.008 1.184 1.16 2.743 1.715 3.843 2.1.189.064.365.126.523.185 2.666 1 3.361 1.443 4.264 2.147.011.182.028.364.028.548a8.607 8.607 0 0 1-2.851 6.393M9.735 18.62c-.64-1.44-1.117-2.933-1.552-4.905-.347-1.575-.932-3.528-2.332-5.06a12.89 12.89 0 0 1 1.535-1.739 25.73 25.73 0 0 1 7.271 10.342A8.587 8.587 0 0 1 10 18.633c-.09 0-.176-.01-.265-.013m-6.323-3.053c.096-2.08.689-4.03 1.668-5.735.801.971 1.347 2.266 1.768 4.178.377 1.708.797 3.118 1.318 4.422a8.64 8.64 0 0 1-4.754-2.865M1.469 8.738a3.636 3.636 0 0 1 2.544.221 14.02 14.02 0 0 0-1.773 4.8A8.578 8.578 0 0 1 1.367 10c0-.429.042-.848.102-1.26M3.604 4.22a25.941 25.941 0 0 1 2.707 1.831 14.128 14.128 0 0 0-1.538 1.765c-.65-.339-1.697-.714-2.953-.557a8.62 8.62 0 0 1 1.784-3.039m5.524-.297c-.623.356-1.209.766-1.768 1.208A27.728 27.728 0 0 0 4.631 3.25a8.592 8.592 0 0 1 3.971-1.76 5.353 5.353 0 0 0 .526 2.434m.843-2.557H10c1.376 0 2.673.331 3.828.906a13.98 13.98 0 0 0-3.484 1.03 3.946 3.946 0 0 1-.373-1.936m8.306 6.198c-.741-.444-1.695-.88-3.456-1.54a20.046 20.046 0 0 0-.554-.198c-.902-.315-2.047-.718-2.958-1.437a12.663 12.663 0 0 1 4.305-.936 8.646 8.646 0 0 1 2.663 4.111M10 0C4.486 0 0 4.485 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0" /></svg> },
                                        { name: "Hockey", path: "/hockey", icon: (props: any) => <svg viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M19.993 4.25v2.884l-6.297 11.713H1.3l-1.3-1.3v-3.166l1.299-1.3h13.946l4.748-8.83zm-5.481 10.197H1.866l-.5.5v2.035l.499.5H12.88l1.632-3.035zM7.734 2c2.58 0 5.356.77 5.356 2.461v3.018c0 1.691-2.777 2.462-5.356 2.462-2.579 0-5.355-.771-5.355-2.462V4.461C2.38 2.77 5.155 2 7.734 2zm3.99 4.174c-1.046.508-2.548.749-3.99.749-1.44 0-2.944-.241-3.989-.749v1.305c0 .282 1.372 1.096 3.99 1.096 2.617 0 3.99-.814 3.99-1.096zm-3.99-2.809c-2.617 0-3.989.815-3.989 1.096 0 .282 1.372 1.097 3.99 1.097 2.617 0 3.99-.815 3.99-1.097 0-.281-1.373-1.096-3.99-1.096z" /></svg> },
                                        { name: "Golf", path: "/golf", icon: (props: any) => <svg viewBox="0 0 20 20" fill="currentColor" {...props}><path d="m7.4 13.4c2 .5 3.5 1.8 3.5 3.2 0 1.9-2.5 3.4-5.5 3.4s-5.5-1.5-5.5-3.4c0-1.4 1.4-2.7 3.5-3.2v1.4c-1.3.4-2.1 1.1-2.1 1.8 0 .4.4.9 1 1.3.8.5 2 .8 3.2.8 2.4 0 4.2-1.1 4.2-2.1 0-.4-.4-.9-1-1.3-.4-.2-.7-.4-1.2-.5zm-2.7-13.4 11.7 5.5-10.3 5.5v6.2h-1.4zm12.1 10.3c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.3-3.1 3.1-3.1zm0 1.4c-1 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7c1 0 1.7-.8 1.7-1.7s-.8-1.7-1.7-1.7zm-10.7-9.6v7.6l7.6-4.2z" /></svg> },
                                        { name: "Baseball", path: "/baseball", icon: (props: any) => <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}><path d="m3 0 8.8 8.8 3.2 5.2 3.4 3.4.5-.5 1 1-2.1 2.1-1-1 .6-.6-3.4-3.4-5.2-3.1-8.8-8.8v-2l1.1-1.1zm-.5 1.4h-.9l-.2.3v.8l8.3 8.3 2.8 1.7-1.7-2.8c0-.1-8.3-8.3-8.3-8.3zm14.3-1.4c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm0 1.4c-.9 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.8 1.7-1.7c0-1-.7-1.7-1.7-1.7z" /></svg> },
                                        { name: "Snooker", path: "/snooker", icon: (props: any) => <svg viewBox="0 0 20 20" fill="currentColor" {...props}><path d="m3.1 13.8c1.7 0 3.1 1.4 3.1 3.1 0 1.3-.8 2.4-1.9 2.9-1.2.5-2.5.2-3.4-.7s-1.2-2.2-.7-3.4 1.6-1.9 2.9-1.9zm13.8 0c1.7 0 3.1 1.4 3.1 3.1 0 1.3-.8 2.4-1.9 2.9-1.2.5-2.5.2-3.4-.7s-1.2-2.2-.7-3.4 1.6-1.9 2.9-1.9zm-6.9 0c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm0 1.4c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7 1 0 1.7-.8 1.7-1.7 0-1-.7-1.7-1.7-1.7zm-6.9 0c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7 1 0 1.7-.8 1.7-1.7 0-1-.7-1.7-1.7-1.7zm13.8 0c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7 1 0 1.7-.8 1.7-1.7 0-1-.8-1.7-1.7-1.7zm-10.3-8.3c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.3-3.1 3.1-3.1zm6.8 0c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm-6.8 1.4c-1 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.7 1.7-1.7-.8-1.7-1.7-1.7zm6.8 0c-1 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.8 1.7-1.7-.7-1.7-1.7-1.7zm-3.4-8.3c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1zm0 1.4c-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7-.7-1.7-1.7-1.7z" /></svg> },
                                        { name: "Volleyball", path: "/volleyball", icon: (props: any) => <svg viewBox="0 0 19.9 19.9" fill="currentColor" {...props}><path d="m17 2.9c-2.8-2.8-7-3.7-10.7-2.2s-6.1 4.9-6.3 8.9 2 7.6 5.6 9.4c3.1 1.5 6.7 1.3 9.6-.5s4.7-5 4.7-8.5c0-2.7-1-5.2-2.9-7.1zm1.6 7.1c0 1.2-.2 2.4-.7 3.4-.9 0-1.8-.1-2.6-.4.5-2.1.5-4.4 0-6.5-.3-1.5-.9-2.9-1.6-4.2 3 1.4 4.8 4.4 4.9 7.7zm-6.9-8.5c1.1 1.6 1.8 3.3 2.2 5.2s.4 3.8 0 5.7c-1.2-.6-2.3-1.5-3.2-2.7.2-1.7.1-3.3-.5-4.9-.3-1.2-1-2.3-1.8-3.3 1.1-.2 2.2-.2 3.3 0zm-7.8 2.4c.8-.9 1.9-1.5 3-1.9.8.7 1.4 1.6 1.8 2.6-1.9 1-3.5 2.4-4.7 4-1 1.1-1.7 2.5-2.3 3.9-.9-3.1 0-6.4 2.2-8.6zm-1.2 10.7c0-.1-.1-.2-.1-.2.5-1.8 1.3-3.5 2.5-5 1.1-1.5 2.5-2.7 4.1-3.6.3 1.2.4 2.5.2 3.8-2.4 1.8-4 4.6-4.1 7.6-1.1-.7-1.9-1.6-2.6-2.6zm3.9 3.3c0-1.1.2-2.2.6-3.2 1.3 1.5 3 2.8 4.9 3.6-.7.2-1.4.3-2.1.3-1.2 0-2.3-.3-3.4-.7zm9.4-1.9c-.6.6-1.3 1.1-2.1 1.5-2.4-.8-4.5-2.3-6.1-4.2.5-.9 1.2-1.7 2.1-2.4 1.8 2.2 4.4 3.6 7.2 3.8-.3.5-.7.9-1.1 1.3z" /></svg> },
                                    ].map((sport, i) => (
                                        <a href={sport.path} key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-white">
                                            <sport.icon className="w-4 h-4 text-[var(--fs-yellow)]" />
                                            <span className="text-[10px] font-bold uppercase truncate">{sport.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Pinned Leagues SECTION */}
                            <div className="space-y-3">
                                <div className="text-[9px] font-black text-[var(--fs-text-dim)] uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Star size={10} className="text-[var(--fs-yellow)]" />
                                    Pinned Leagues
                                </div>
                                <div className="space-y-1">
                                    {pinnedLeagues.length > 0 ? pinnedLeagues.map((league: any, i) => (
                                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-white">
                                            <span className="text-[10px] font-bold uppercase truncate">{league.name}</span>
                                        </div>
                                    )) : (
                                        <div className="px-3 py-2 text-[10px] text-white/20 italic">No pinned data</div>
                                    )}
                                </div>
                            </div>

                            {/* Countries SECTION */}
                            <div className="space-y-3">
                                <div className="text-[9px] font-black text-[var(--fs-text-dim)] uppercase tracking-[0.2em]">Countries</div>
                                <div className="bg-black/20 rounded-sm border border-white/5">
                                    <SidebarCountries
                                        countriesByRegion={countriesByRegion}
                                        regionOrder={regionOrder}
                                    />
                                </div>
                            </div>

                            {/* Utility Links */}
                            <div className="pt-6 border-t border-white/5 space-y-2">
                                <div className="px-3 py-2 text-[10px] font-black uppercase text-[var(--fs-text-dim)] hover:text-white transition-colors cursor-pointer">Live Predictions</div>
                                <div className="px-3 py-2 text-[10px] font-black uppercase text-[var(--fs-text-dim)] hover:text-white transition-colors cursor-pointer">All Leagues</div>
                                <div className="px-3 py-2 text-[10px] font-black uppercase text-[var(--fs-yellow)] hover:opacity-80 transition-opacity cursor-pointer">Elite Access</div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 bg-black/40">
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none tracking-tighter">AI<span className="text-[var(--fs-yellow)]">PREDICT</span></span>
                                <span className="text-[8px] font-mono text-[var(--fs-text-dim)] uppercase tracking-widest leading-none">v2.0_SYNC</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
