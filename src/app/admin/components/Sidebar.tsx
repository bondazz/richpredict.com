"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Globe,
    Trophy,
    Users,
    LogOut,
    Zap,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Matches', href: '/admin/dashboard', icon: Trophy, active: true }, // For now, Matches is the dashboard list
    { name: 'Countries', href: '/admin/countries', icon: Globe },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Team Scraper', href: '/admin/scraper', icon: Zap },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-black border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                        <Zap className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className="font-black uppercase tracking-tighter text-lg italic">
                        Rich<span className="text-yellow-500">Admin</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-tight transition-all",
                                isActive
                                    ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(255,221,0,0.2)]"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-tight text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
                >
                    <Globe size={18} />
                    View Site
                </Link>
                <form action="/api/admin/logout" method="POST">
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-tight text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </form>
            </div>
        </aside>
    );
}
