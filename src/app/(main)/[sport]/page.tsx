export const revalidate = 0;
import Link from "next/link";
import { Zap, Trophy, Loader2, Star, ArrowRight, ChevronDown } from "lucide-react";
import { cn, generateSEOSlug } from "@/lib/utils";
import { getPredictions, getRegions, getPinnedLeagues, getCountriesByRegion, getPremiumPredictionsCount, Prediction } from "@/lib/supabase";

import SidebarCountries from "@/components/SidebarCountries";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import TopTicker from "@/components/layout/TopTicker";
import PremiumLockedMatches from "@/components/predictions/PremiumLockedMatches";
import { Metadata } from 'next';

interface Props {
    params: { sport: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const sport = params.sport.charAt(0).toUpperCase() + params.sport.slice(1);
    return {
        title: `AI ${sport} Predictions & Betting Tips | RichPredict`,
        description: `Get the most accurate AI-powered ${sport} predictions, analytics, and betting tips. High-probability outcomes for all major ${sport} events.`,
    };
}

export default async function SportPage({ params }: Props) {
    const sportSlug = params.sport.toLowerCase();
    const sportName = sportSlug.charAt(0).toUpperCase() + sportSlug.slice(1);

    // Validate sport
    const validSports = ['tennis', 'basketball', 'hockey', 'golf', 'baseball', 'snooker', 'volleyball'];
    if (!validSports.includes(sportSlug)) {
        // Fallback or 404
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white">Sport Not Found</h1>
                <Link href="/" className="text-yellow-500 hover:text-white transition-colors">Return Home</Link>
            </div>
        );
    }

    let predictions: Prediction[] = [];
    let regions: any[] = [];
    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let premiumCount = 0;

    try {
        const [preds, regs, pinned, countries, pCount] = await Promise.all([
            getPredictions(50, sportName), // Filter by sport name (e.g., "Tennis")
            getRegions(),
            getPinnedLeagues(),
            getCountriesByRegion(),
            getPremiumPredictionsCount(sportName)
        ]);
        predictions = preds || [];
        regions = regs || [];
        pinnedLeagues = pinned || [];
        allCountries = countries || [];
        premiumCount = pCount || 0;
    } catch (e: any) {
        console.error("Supabase connection error:", e);
    }

    // Group predictions by league
    const groupedLeagues = predictions.reduce((acc: any, prediction: Prediction) => {
        const leagueName = prediction.league || "Other Competitions";
        if (!acc[leagueName]) {
            acc[leagueName] = {
                id: leagueName.toLowerCase().replace(/\s+/g, '-'),
                name: leagueName,
                category: sportName.toUpperCase(),
                matches: []
            };
        }
        acc[leagueName].matches.push(prediction);
        return acc;
    }, {});

    const displayLeagues = Object.values(groupedLeagues);

    // Group countries by region
    const countriesByRegion = allCountries.reduce((acc: any, country: any) => {
        const regionObj = country.regions || country.region;
        const regionName = regionObj?.name || "Other";
        if (!acc[regionName]) acc[regionName] = [];
        acc[regionName].push(country);
        return acc;
    }, {});

    const regionOrder = ["Europe", "South America", "World", "Africa", "Asia", "North & Central America", "Australia & Oceania"];

    const getLogo = (name: string) => {
        // Basic logo mapping logic or placeholder
        return `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=001e28&textColor=ffe438`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
            <TopTicker />

            <main className="max-w-[1240px] mx-auto w-full px-2 py-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-4">
                {/* Left Sidebar */}
                <aside className="hidden lg:flex flex-col space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-hide">
                    <div className="text-[9px] font-black text-white/50 uppercase tracking-wider px-2 mb-1">Pinned Leagues</div>
                    {pinnedLeagues.length > 0 ? pinnedLeagues.map((league: any, i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 text-white/80">
                            <span className="text-[10px] font-extrabold uppercase truncate group-hover:text-white">{league.name}</span>
                        </div>
                    )) : (
                        <div className="px-2 py-1 text-[9px] text-white/20 italic">No pinned data</div>
                    )}

                    <div className="pt-4 text-[9px] font-black text-white/50 uppercase tracking-wider px-2 border-t border-white/5 mt-2 font-mono">Countries</div>
                    <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                </aside>

                {/* Main Content */}
                <div className="space-y-3">
                    <InnerAdBanner />

                    <PremiumLockedMatches sport={sportName.toUpperCase()} count={premiumCount} />

                    {displayLeagues.length > 0 ? displayLeagues.map((league: any) => (
                        <div key={league.id} className="sportName soccer overflow-hidden rounded-sm border border-white/5 shadow-2xl">
                            <div className="headerLeague__wrapper bg-[var(--fs-header)]">
                                <div className="wcl-header_HrElx py-2 px-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Star size={14} className="text-[var(--fs-text-dim)] hover:text-[var(--fs-yellow)] cursor-pointer" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-[var(--fs-text-dim)] uppercase leading-none mb-0.5">{league.category}</span>
                                            <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none">{league.name}</span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-[var(--fs-text-dim)] uppercase hover:text-white cursor-pointer">Standings</span>
                                </div>
                            </div>

                            <div className="event__content bg-[var(--fs-header)] divide-y divide-white/5">
                                {league.matches.map((match: Prediction) => {
                                    const matchSlug = match.slug || generateSEOSlug(match.home_team, match.away_team, match.id);
                                    return (
                                        <Link key={match.id} href={`/predictions/${matchSlug}`} className="event__match group flex items-center h-12 hover:bg-white/[0.03] transition-colors relative">
                                            <div className="px-3">
                                                <Star size={14} className="text-[var(--fs-text-dim)] group-hover:text-white/40 transition-colors cursor-pointer" />
                                            </div>

                                            <div className="w-12 text-center">
                                                <span className="text-[9px] font-black text-[var(--fs-text-dim)] uppercase whitespace-nowrap opacity-60">
                                                    {match.match_time || "LIVE"}
                                                </span>
                                            </div>

                                            <div className="flex-1 flex flex-col justify-center gap-0.5 px-2 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <img src={getLogo(match.home_team)} alt="" className="w-3 sm:w-3.5 h-3 sm:h-3.5 object-contain" />
                                                    <span className="text-[10px] sm:text-[11px] font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">{match.home_team}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <img src={getLogo(match.away_team)} alt="" className="w-3 sm:w-3.5 h-3 sm:h-3.5 object-contain" />
                                                    <span className="text-[10px] sm:text-[11px] font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">{match.away_team}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3">
                                                <em className="text-[7px] sm:text-[8px] font-black uppercase bg-white/5 px-1 sm:px-1.5 py-0.5 rounded-sm text-[var(--fs-text-dim)] group-hover:text-[var(--fs-yellow)] transition-colors not-italic">Preview</em>
                                            </div>

                                            <div className="flex items-center justify-center min-w-[70px] sm:min-w-[100px] bg-black/20 h-full border-l border-white/5 group-hover:bg-white/[0.05] transition-all px-2">
                                                <span className="text-[9px] sm:text-[11px] font-black text-[var(--fs-yellow)] uppercase tracking-tight">{match.prediction}</span>
                                            </div>

                                            <div className="px-2 sm:px-3 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight size={12} className="text-[var(--fs-yellow)]" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )) : (
                        <div className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-12 text-center space-y-4">
                            <Trophy size={40} className="mx-auto text-white/10" />
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">No {sportName} Predictions Found</h3>
                                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Our AI nodes are currently analyzing global market data.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <aside className="hidden lg:flex flex-col space-y-4">
                    <div className="bg-[#001e28] border border-[var(--fs-yellow)]/20 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--fs-yellow)]/10 rounded-full blur-[60px] group-hover:bg-[var(--fs-yellow)]/20 transition-colors duration-700" />
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-[var(--fs-yellow)] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,221,0,0.2)]">
                                <Trophy className="w-6 h-6 text-black" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white font-[Klapt]">
                                    VIP <span className="text-[var(--fs-yellow)]">PREMIUM</span>
                                </h3>
                                <div className="text-[9px] font-black bg-[var(--fs-yellow)]/10 text-[var(--fs-yellow)] px-2 py-0.5 rounded-sm inline-block uppercase tracking-[0.2em]">
                                    Professional Intent
                                </div>
                            </div>
                            <p className="text-[11px] font-bold text-white/50 leading-relaxed uppercase">Get 95%+ accurate AI predictions and exclusive analytics.</p>
                            <Button className="w-full bg-[var(--fs-yellow)] hover:bg-[var(--fs-yellow)]/90 text-black font-black text-[10px] h-9 tracking-tighter uppercase">
                                Unlock Access <ArrowRight size={14} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

// Simple Button component since we can't easily import ui components in server components if they use 'use client'
function Button({ className, children, ...props }: any) {
    return (
        <button className={cn("inline-flex items-center justify-center rounded-sm transition-colors", className)} {...props}>
            {children}
        </button>
    );
}
