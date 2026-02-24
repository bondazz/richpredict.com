'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DateNavigator() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const dateParam = searchParams.get('date');
    const getValidDate = (dateStr: string | null) => {
        if (!dateStr) return new Date();
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? new Date() : d;
    };

    const currentSelected = getValidDate(dateParam);

    const navigate = (days: number) => {
        const nextDate = new Date(currentSelected);
        nextDate.setDate(nextDate.getDate() + days);
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        const day = String(nextDate.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        const params = new URLSearchParams(searchParams.toString());
        params.set('date', formatted);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const displayDate = currentSelected.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    const weekday = currentSelected.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase().slice(0, 2);

    return (
        <div className="w-full h-10 bg-[#02111a] border border-white/5 rounded flex items-center justify-between shadow-lg mb-2 overflow-hidden select-none">
            {/* Left Button - Yellow arrow for site consistency */}
            <button
                onClick={() => navigate(-1)}
                className="w-12 h-full flex items-center justify-center text-[var(--fs-yellow)]/60 hover:text-[var(--fs-yellow)] hover:bg-white/[0.05] transition-all border-r border-white/5 group"
                aria-label="Previous Day"
            >
                <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Center Date Info - Clean, no demo text, consistent fonts */}
            <div className="flex items-center gap-2.5 px-4 h-full justify-center">
                <Calendar size={14} className="text-white/20" strokeWidth={2} />
                <div className="flex items-center gap-2 font-bold text-white tracking-widest text-[13px] uppercase">
                    <span className="drop-shadow-sm">{displayDate}</span>
                    <span className="text-white/20">{weekday}</span>
                </div>
            </div>

            {/* Right Button - Yellow arrow for site consistency */}
            <button
                onClick={() => navigate(1)}
                className="w-12 h-full flex items-center justify-center text-[var(--fs-yellow)]/60 hover:text-[var(--fs-yellow)] hover:bg-white/[0.05] transition-all border-l border-white/5 group"
                aria-label="Next Day"
            >
                <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
}
