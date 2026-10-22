"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Globe,
    Trophy,
    Users,
    LogOut,
    Zap,
    Settings,
    Newspaper,
    Bot,
    Flag,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Matches', href: '/admin/dashboard', icon: Trophy },
    { name: 'News', href: '/admin/news', icon: Newspaper },
    { name: 'Auto News', href: '/admin/news/auto', icon: Zap },
    { name: 'AI Bot', href: '/admin/bot', icon: Bot },
    { name: 'Flag Sync', href: '/admin/bot?mode=flags', icon: Flag },
    { name: 'Countries', href: '/admin/countries', icon: Globe },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Team Scraper', href: '/admin/scraper', icon: Zap },
    { name: 'Index Google', href: '/admin/index-google', icon: Globe },
    { name: 'Ad Stats', href: '/admin/ads', icon: BarChart3 },
    { name: 'Pricing', href: '/admin/pricing', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedState = localStorage.getItem('admin-sidebar-collapsed');
        if (savedState === 'true') setIsCollapsed(true);
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('admin-sidebar-collapsed', String(newState));
    };

    if (!isMounted) return <aside className="w-64 bg-black border-r border-white/5 h-screen sticky top-0" />;

    return (
        <>
            <style jsx global>{`
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="bg-black border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden group/sidebar"
            >
                {/* Header / Branding */}
                <div className="p-6 border-b border-white/5 relative h-[81px] flex items-center overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                            <Zap className="w-5 h-5 text-black fill-black" />
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-black uppercase tracking-tighter text-lg italic whitespace-nowrap"
                                >
                                    Rich<span className="text-yellow-500">Admin</span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isCollapsed ? item.name : ""}
                                className={cn(
                                    "flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-tight transition-all relative group",
                                    isActive
                                        ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(255,221,0,0.2)]"
                                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon size={20} className="shrink-0" />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-yellow-500 text-black text-[10px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link
                        href="/"
                        title={isCollapsed ? "View Site" : ""}
                        className="flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-tight text-zinc-500 hover:bg-white/5 hover:text-white transition-all relative group"
                    >
                        <Globe size={20} className="shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="whitespace-nowrap"
                                >
                                    View Site
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    <form action="/api/admin/logout" method="POST">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-tight text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all relative group"
                        >
                            <LogOut size={20} className="shrink-0" />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="whitespace-nowrap"
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </form>

                    {/* PRO Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="mt-4 w-full flex items-center justify-center p-2 rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all shadow-inner bg-zinc-900/40"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
