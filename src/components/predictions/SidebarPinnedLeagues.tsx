"use client";

import Link from "next/link";
import { Flag } from "@/components/ui/Flag";

interface SidebarPinnedLeaguesProps {
    pinnedLeagues: any[];
}

export default function SidebarPinnedLeagues({ pinnedLeagues }: SidebarPinnedLeaguesProps) {
    if (!pinnedLeagues || pinnedLeagues.length === 0) {
        return <div className="px-2 py-1 text-[9px] text-white/20 italic">No pinned data</div>;
    }

    // Group pinned leagues by country
    const pinnedByCountry = pinnedLeagues.reduce((acc: any, league: any) => {
        const cName = league.countries?.name || "Global";
        if (!acc[cName]) {
            acc[cName] = {
                name: cName,
                flag_url: league.countries?.flag_url,
                code: league.countries?.code,
                leagues: []
            };
        }
        acc[cName].leagues.push(league);
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            <div className="text-[10px] font-black text-white uppercase tracking-wider px-2 mb-1">Pinned Leagues</div>
            {Object.values(pinnedByCountry).map((c: any, i: number) => (
                <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1">
                        {c.code && (
                            <Flag code={c.code} name={c.name} className="w-3.5 h-2.5 rounded-[1px]" />
                        )}
                        <span className="text-[11px] font-black text-white uppercase tracking-tight">{c.name}</span>
                    </div>
                    <div className="space-y-0.5 ml-2 border-l border-white/5">
                        {c.leagues.map((league: any, li: number) => (
                            <div
                                key={li}
                                className="pl-4 py-1 text-[10.5px] text-white/50 hover:text-white cursor-pointer transition-colors truncate"
                                title={league.name}
                            >
                                {league.name.replace(new RegExp(`(${c.name})$`, 'i'), '').trim()}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
