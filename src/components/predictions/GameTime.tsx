"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface GameTimeProps {
    date: string; // Could be "2026-02-25" or "2026-02-25T00:00:00+00:00"
    time: string; // "17:45"
    className?: string;
    showIcons?: boolean;
}

/**
 * GameTime Component
 * Robust version to handle complex date strings from Supabase.
 */
export default function GameTime({ date, time, className, showIcons = false }: GameTimeProps) {
    const [displayTime, setDisplayTime] = useState("");
    const [displayDate, setDisplayDate] = useState("");

    useEffect(() => {
        if (!date || !time) return;

        try {
            // 1. Extract YYYY-MM-DD
            const datePart = date.includes('T') ? date.split('T')[0] : date;

            // 2. Extract HH:mm
            const timePart = time || "00:00";
            const [hours, minutes] = timePart.includes(':') ? timePart.split(':') : ["00", "00"];

            // 3. Create UTC Date object
            // Using Date.UTC to avoid environment-specific parsing issues
            const year = parseInt(datePart.split('-')[0]);
            const month = parseInt(datePart.split('-')[1]) - 1;
            const day = parseInt(datePart.split('-')[2]);
            const h = parseInt(hours);
            const m = parseInt(minutes);

            const utcDate = new Date(Date.UTC(year, month, day, h, m));

            if (isNaN(utcDate.getTime())) return;

            // 4. Local display formatting
            const localTime = utcDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const localDay = String(utcDate.getDate()).padStart(2, '0');
            const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
            const localYear = utcDate.getFullYear();
            const localDateStr = `${localDay}.${localMonth}.${localYear}`;

            setDisplayTime(localTime);
            setDisplayDate(localDateStr);
        } catch (e) {
            console.error("GameTime conversion error:", e);
        }
    }, [date, time]);

    // SSR / Initial Fallback
    const getDefaultDate = () => {
        try {
            const datePart = date.split('T')[0];
            const parts = datePart.split('-');
            if (parts.length < 3) return "??.??.????";
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        } catch (e) { return "??.??.????"; }
    };

    const isFlexRow = className?.includes('flex-row');

    return (
        <div className={cn("flex flex-col items-center justify-center leading-tight", className)} suppressHydrationWarning>
            <div className="flex items-center gap-1.5 min-w-0">
                {showIcons && <Calendar size={9} className="text-[var(--fs-yellow)] flex-shrink-0" />}
                <span className="text-[8px] sm:text-[10px] font-black text-white/90 whitespace-nowrap">
                    {displayDate || getDefaultDate()}
                </span>
            </div>
            {isFlexRow && <div className="w-[1px] h-2 bg-white/10 hidden md:block" />}
            <div className="flex items-center gap-1.5 min-w-0">
                {showIcons && <Clock size={9} className="text-[var(--fs-yellow)] flex-shrink-0" />}
                <span className="text-[8px] sm:text-[10px] font-black text-white/50">
                    {displayTime || time}
                </span>
            </div>
        </div>
    );
}
