"use client";

import { useState } from 'react';
import { Shield, Search, Globe } from 'lucide-react';

export default function TeamsClientPage({ initialTeams }: { initialTeams: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter teams based on search query
    const filteredTeams = initialTeams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.countries?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group teams by the new direct league_id relationship
    const finalGrouped: { [key: string]: any[] } = filteredTeams.reduce((acc, team) => {
        const groupName = team.leagues?.name || `${team.countries?.name || 'Local'}: UNASSIGNED`;
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(team);
        return acc;
    }, {} as any);

    // Sort leagues alphabetically
    const sortedLeagues = Object.keys(finalGrouped).sort();

    return (
        <div className="space-y-6">
            {/* Search Top Bar */}
            <div className="bg-[#0a1118] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        <Shield size={12} />
                        Active_Entities: {filteredTeams.length}
                    </div>
                    <div className="flex items-center gap-2 bg-black border border-white/5 rounded-lg px-3 py-1.5 focus-within:border-yellow-500/50 transition-all">
                        <Search size={14} className="text-zinc-500" />
                        <input
                            type="text"
                            placeholder="SEARCH_CLUBS_OR_COUNTRY..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-64 placeholder:text-zinc-800"
                        />
                    </div>
                </div>
            </div>

            {/* Grouped Content - 3 columns grid for leagues */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedLeagues.map((league) => (
                    <div key={league} className="bg-[#0a1118]/40 border border-white/5 rounded-xl overflow-hidden flex flex-col h-fit transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5">
                        {/* League Header */}
                        <div className="bg-black/40 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield size={10} className="text-yellow-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 truncate max-w-[180px]">{league}</span>
                            </div>
                            <span className="text-[8px] font-mono font-bold text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">
                                {finalGrouped[league].length} UNITS
                            </span>
                        </div>

                        {/* Teams Grid (Ultra Compact) */}
                        <div className="p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {finalGrouped[league].map((team: any) => (
                                <div
                                    key={team.id}
                                    className="aspect-square bg-black/60 rounded-lg border border-white/[0.03] flex flex-col items-center justify-center p-1.5 gap-1 hover:border-yellow-500/40 transition-all group cursor-default"
                                    title={`${team.name} (${team.countries?.name || 'Local'})`}
                                >
                                    {team.logo_url ? (
                                        <img src={team.logo_url} alt="" className="size-6 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    ) : (
                                        <div className="size-6 bg-white/5 rounded-full flex items-center justify-center text-[8px] text-zinc-700 font-black">?</div>
                                    )}
                                    <span className="text-[7px] font-black uppercase text-center text-zinc-600 group-hover:text-zinc-400 transition-colors truncate w-full leading-none">
                                        {team.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {sortedLeagues.length === 0 && (
                <div className="py-20 text-center text-zinc-800 text-[10px] font-black uppercase tracking-[0.3em]">
                    No_Data_Match_Filter
                </div>
            )}
        </div>
    );
}
