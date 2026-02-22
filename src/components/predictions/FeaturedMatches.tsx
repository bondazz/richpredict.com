import Link from "next/link";
import { Star, Zap } from "lucide-react";
import { cn, generateSEOSlug, getTeamLogo } from "@/lib/utils";
import { Prediction } from "@/lib/supabase";
import { Flag } from "@/components/ui/Flag";

interface FeaturedMatchesProps {
    matches: Prediction[];
    dbLogoMap: Record<string, string>;
}

export default function FeaturedMatches({ matches, dbLogoMap }: FeaturedMatchesProps) {
    if (!matches || matches.length === 0) return null;

    const getLogo = (name: string) => getTeamLogo(name, dbLogoMap);

    return (
        <section className="space-y-3 mt-12">
            <div className="flex items-center gap-2 px-1 mb-2">
                <Zap size={14} className="text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white/80">Featured Upcoming Matches</h3>
            </div>

            <div className="sportName soccer overflow-hidden rounded-sm border border-white/5 shadow-2xl">
                {/* Header - EXACT SAME AS HOME PAGE */}
                <div className="headerLeague__wrapper bg-gradient-to-b from-[#164e63] to-[#083344] border-t border-white/20 border-b border-black/40 shadow-lg">
                    <div className="wcl-header_HrElx py-2.5 px-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Star size={14} className="text-white/40 hover:text-[var(--fs-yellow)] cursor-pointer transition-colors" />
                            <div className="flex items-center gap-2">
                                {matches[0]?.leagues?.countries?.code ? (
                                    <Flag
                                        code={matches[0].leagues.countries.code}
                                        className="w-[18px] h-[12px] flex-shrink-0 rounded-[1px] shadow-sm"
                                    />
                                ) : matches[0]?.leagues?.countries?.flag_url && (
                                    <img
                                        src={matches[0].leagues.countries.flag_url}
                                        alt=""
                                        className="w-[18px] h-[12px] flex-shrink-0 object-cover rounded-[1px]"
                                    />
                                )}
                                <span className="text-[11px] font-bold text-white tracking-tight leading-none drop-shadow-md">
                                    {matches[0]?.leagues?.countries?.name && (
                                        <span className="text-white/60 font-black uppercase text-[10px] mr-1.5">{matches[0].leagues.countries.name}:</span>
                                    )}
                                    Featured League Cluster
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-[var(--fs-yellow)] drop-shadow-sm uppercase tracking-[0.1em] italic">
                                {(matches[0]?.category || "Football").toLowerCase()} tips
                            </span>
                            <div className="w-4 h-4 flex items-center justify-center text-white/40">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - EXACT SAME AS HOME PAGE */}
                <div className="event__content bg-[var(--fs-header)] divide-y divide-white/5">
                    {matches.map((match: Prediction) => {
                        const dateObj = new Date(match.match_date);
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const formattedDate = `${day}.${month}.`;

                        return (
                            <div key={match.id} className="event__match group flex items-center h-14 hover:bg-white/[0.04] transition-colors relative border-b border-black/10">
                                {/* Star Column */}
                                <div className="w-8 sm:w-10 flex justify-center flex-shrink-0">
                                    <Star size={12} className="text-white/20 group-hover:text-[var(--fs-yellow)] transition-colors cursor-pointer" />
                                </div>

                                {/* Date/Time Column */}
                                <div className="w-16 sm:w-24 flex-shrink-0 flex flex-col items-center justify-center leading-tight border-r border-white/5">
                                    <span className="text-[8px] sm:text-[10px] font-black text-white/90 whitespace-nowrap">
                                        {formattedDate}
                                    </span>
                                    <span className="text-[8px] sm:text-[10px] font-black text-white/50">
                                        {match.match_time || "19:00"}
                                    </span>
                                </div>

                                {/* Teams Column */}
                                <div className="flex-1 flex flex-col justify-center gap-1 sm:gap-1.5 px-3 sm:px-6 min-w-0">
                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                        <img src={getLogo(match.home_team)} alt={`${match.home_team} logo`} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
                                        <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.home_team}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                        <img src={getLogo(match.away_team)} alt={`${match.away_team} logo`} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
                                        <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.away_team}</span>
                                    </div>
                                </div>

                                {/* Match Preview Column */}
                                <div className="w-32 sm:w-40 flex justify-center flex-shrink-0 relative pr-2">
                                    <Link
                                        href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                        className="px-2 sm:px-4 py-1.5 text-[8px] sm:text-[9px] font-black uppercase bg-white/5 border border-white/10 rounded-md text-white/80 hover:bg-[var(--fs-yellow)] hover:text-black hover:border-[var(--fs-yellow)] transition-all tracking-wider whitespace-nowrap shadow-sm"
                                    >
                                        Match Preview
                                    </Link>
                                </div>

                                {/* Mobile Link Overlay */}
                                <Link
                                    href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                    className="absolute inset-0 z-0 sm:hidden"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
