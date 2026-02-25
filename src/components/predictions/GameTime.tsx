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
    const [displayTime, setDisplayTime] = useState(time);
    const [displayDate, setDisplayDate] = useState("");

    useEffect(() => {
        try {
            // 1. Extract only the YYYY-MM-DD part from the date string
            // Even if it is "2026-02-25T00:00:00+00:00"
            const datePart = date.split('T')[0];

            // 2. Extract hours and minutes from the time string
            const timePart = time || "19:00";
            const [hours, minutes] = timePart.includes(':') ? timePart.split(':') : ["19", "00"];

            // 3. Construct a proper UTC ISO string
            const isoString = `${datePart}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00Z`;
            const utcDate = new Date(isoString);

            if (isNaN(utcDate.getTime())) {
                console.warn("Invalid date created:", isoString);
                return;
            }

            // 4. Format to user's local timezone
            const localTime = utcDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const localDay = String(utcDate.getDate()).padStart(2, '0');
            const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
            const localDateStr = `${localDay}.${localMonth}.`;

            setDisplayTime(localTime);
            setDisplayDate(localDateStr);
        } catch (e) {
            console.error("Error formatting local time:", e);
        }
    }, [date, time]);

    // SSR / Initial Fallback
    const getDefaultDate = () => {
        try {
            const datePart = date.split('T')[0];
            const d = new Date(datePart);
            if (isNaN(d.getTime())) return "??.??.";
            return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
        } catch (e) { return "??.??."; }
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
                    {displayTime}
                </span>
            </div>
        </div>
    );
}
