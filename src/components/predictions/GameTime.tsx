"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface GameTimeProps {
    date: string; // "2026-02-25"
    time: string; // "17:45"
    className?: string;
    showIcons?: boolean;
}

/**
 * GameTime Component
 * Displays match time in the user's local timezone.
 * Handles the UTC-to-Local conversion and hydration safety.
 */
export default function GameTime({ date, time, className, showIcons = false }: GameTimeProps) {
    const [displayTime, setDisplayTime] = useState(time);
    const [displayDate, setDisplayDate] = useState("");

    useEffect(() => {
        try {
            // Construct a UTC date object
            const [hours, minutes] = time.split(':');
            const utcDate = new Date(`${date}T${hours}:${minutes}:00Z`);

            if (isNaN(utcDate.getTime())) return;

            // Format to local hours and minutes
            const localTime = utcDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // Format to local day and month
            const localDay = String(utcDate.getDate()).padStart(2, '0');
            const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
            const localDateStr = `${localDay}.${localMonth}.`;

            setDisplayTime(localTime);
            setDisplayDate(localDateStr);
        } catch (e) {
            console.error("Error formatting local time:", e);
        }
    }, [date, time]);

    // Initial render uses server-side UTC time to prevent layout shift

    const defaultDate = () => {
        try {
            const d = new Date(date);
            return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
        } catch (e) { return date; }
    };

    const isFlexRow = className?.includes('flex-row');

    return (
        <div className={cn("flex flex-col items-center justify-center leading-tight", className)} suppressHydrationWarning>
            <div className="flex items-center gap-1.5 min-w-0">
                {showIcons && <Calendar size={9} className="text-[var(--fs-yellow)] flex-shrink-0" />}
                <span className="text-[8px] sm:text-[10px] font-black text-white/90 whitespace-nowrap">
                    {displayDate || defaultDate()}
                </span>
            </div>
            {isFlexRow && <div className="w-[1px] h-2 bg-white/10 hidden md:block" />}
            <div className="flex items-center gap-1.5 min-w-0">
                {showIcons && <Clock size={9} className="text-[var(--fs-yellow)] flex-shrink-0" />}
                <span className="text-[8px] sm:text-[10px] font-black text-white/50">
                    {displayTime}
                </span>
            </div>
        </div>
    );
}
