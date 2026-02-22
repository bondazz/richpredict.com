import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: 'https://richpredict.com',
    },
};

export const revalidate = 0;
import Link from "next/link";
import { Zap, Trophy, Loader2, Star, ArrowRight, ChevronDown } from "lucide-react";
import { cn, generateSEOSlug, getTeamLogo } from "@/lib/utils";
import { getPredictions, getRegions, getPinnedLeagues, getCountriesByRegion, getPremiumPredictionsCount, Prediction, getTeams, getBlogPosts, BlogPost } from "@/lib/supabase";

import { AIPredictTrust } from "@/components/AIPredictTrust";
import { Testimonials } from "@/components/Testimonials";
import { RichPredictNews } from "@/components/news/RichPredictNews";

import SidebarCountries from "@/components/SidebarCountries";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import SidebarAd from "@/components/Ads/SidebarAd";
import TopTicker from "@/components/layout/TopTicker";
import PremiumLockedMatches from "@/components/predictions/PremiumLockedMatches";
import { Flag } from "@/components/ui/Flag";

export default async function Home() {
    let predictions: Prediction[] = [];
    let regions: any[] = [];
    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let allTeams: any[] = [];
    let blogPosts: BlogPost[] = [];
    let premiumCount = 0;
    let debugError: string | null = null;

    try {
        const [preds, regs, pinned, countries, pCount, teams, blogs] = await Promise.all([
            getPredictions(50, 'Football'),
            getRegions(),
            getPinnedLeagues(),
            getCountriesByRegion(),
            getPremiumPredictionsCount('Football'),
            getTeams(),
            getBlogPosts(3)
        ]);
        predictions = preds || [];
        regions = regs || [];
        pinnedLeagues = pinned || [];
        allCountries = countries || [];
        premiumCount = pCount || 0;
        allTeams = teams || [];
        blogPosts = blogs || [];
    } catch (e: any) {
        console.error("Supabase connection error:", e);
        debugError = e.message;
    }

    // Build dynamic logo map from database teams
    const dbLogoMap: Record<string, string> = {};
    allTeams.forEach(team => {
        if (team.name && team.logo_url) {
            const cleanName = team.name.toLowerCase().trim();
            dbLogoMap[cleanName] = team.logo_url;
            // Handle common name variations
            if (cleanName === 'manchester united') dbLogoMap['manchester utd'] = team.logo_url;
            if (cleanName === 'manchester utd') dbLogoMap['manchester united'] = team.logo_url;
        }
    });

    // Group predictions by league
    const groupedLeagues = predictions.reduce((acc: any, prediction: Prediction) => {
        const leagueName = prediction.league || "Other Competitions";

        if (!acc[leagueName]) {
            acc[leagueName] = {
                id: leagueName.toLowerCase().replace(/\s+/g, '-'),
                name: leagueName,
                category: "FOOTBALL",
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

    const getLogo = (name: string) => getTeamLogo(name, dbLogoMap);

    return (
        <div className="flex flex-col min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
            {/* Premium Animated Global Ticker */}
            <TopTicker />

            <main className="max-w-[1240px] mx-auto w-full px-2 py-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-4">

                {/* Left Sidebar */}
                <aside className="hidden lg:flex flex-col space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-hide">
                    <div className="text-[9px] font-black text-white/50 uppercase tracking-wider px-2 mb-1">Pinned Leagues</div>
                    {pinnedLeagues.length > 0 ? pinnedLeagues.map((league: any, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 px-2 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 text-white/80"
                            title={`${league.countries?.name?.toUpperCase()}: ${league.name}`}
                        >
                            {league.countries?.flag_url && (
                                <img src={league.countries.flag_url} alt="" className="w-3.5 h-2.5 object-cover rounded-[1px] opacity-80 group-hover:opacity-100" />
                            )}
                            <span className="text-[10px] font-medium truncate group-hover:text-white transition-colors">{league.name}</span>
                        </div>
                    )) : (
                        <div className="px-2 py-1 text-[9px] text-white/20 italic">No pinned data</div>
                    )}

                    <SidebarAd />

                    <div className="pt-2 text-[9px] font-black text-white/50 uppercase tracking-wider px-2 border-t border-white/5 mt-2 font-mono">Countries</div>

                    <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                </aside>

                {/* Main Content */}
                <div className="space-y-3">
                    {/* High-Performance Premium Inner Ad Banner */}
                    <InnerAdBanner />

                    <PremiumLockedMatches sport="FOOTBALL" count={premiumCount} />

                    {displayLeagues.length > 0 ? displayLeagues.map((league: any, index: number) => (
                        <React.Fragment key={league.id}>
                            <div className="sportName soccer overflow-hidden rounded-sm border border-white/5 shadow-2xl">
                                <div className="headerLeague__wrapper bg-gradient-to-b from-[#164e63] to-[#083344] border-t border-white/20 border-b border-black/40 shadow-lg">
                                    <div className="wcl-header_HrElx py-2.5 px-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Star size={14} className="text-white/40 hover:text-[var(--fs-yellow)] cursor-pointer transition-colors" />
                                            <div className="flex items-center gap-2">
                                                {league.matches[0]?.leagues?.countries?.code ? (
                                                    <Flag
                                                        code={league.matches[0].leagues.countries.code}
                                                        className="w-[18px] h-[12px] flex-shrink-0 rounded-[1px] shadow-sm"
                                                    />
                                                ) : league.matches[0]?.leagues?.countries?.flag_url && (
                                                    <img
                                                        src={league.matches[0].leagues.countries.flag_url}
                                                        alt=""
                                                        className="w-[18px] h-[12px] flex-shrink-0 object-cover rounded-[1px]"
                                                    />
                                                )}
                                                <span className="text-[11px] font-bold text-white tracking-tight leading-none drop-shadow-md">
                                                    {league.matches[0]?.leagues?.countries?.name && (
                                                        <span className="text-white/60 font-black uppercase text-[10px] mr-1.5">{league.matches[0].leagues.countries.name}:</span>
                                                    )}
                                                    {league.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-[var(--fs-yellow)] drop-shadow-sm uppercase tracking-[0.1em] italic">
                                                {(league.category || "FOOTBALL").toLowerCase().charAt(0).toUpperCase() + (league.category || "FOOTBALL").toLowerCase().slice(1)} tips
                                            </span>
                                            <div className="w-4 h-4 flex items-center justify-center text-white/40">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="event__content bg-[var(--fs-header)] divide-y divide-white/5">
                                    {league.matches.map((match: Prediction) => {
                                        // Format date: 2026-02-21 -> 21.02.
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
                                                        <img src={getLogo(match.home_team)} alt={`${match.home_team} logo`} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" referrerPolicy="no-referrer" />
                                                        <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.home_team}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                                        <img src={getLogo(match.away_team)} alt={`${match.away_team} logo`} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" referrerPolicy="no-referrer" />
                                                        <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.away_team}</span>
                                                    </div>
                                                </div>

                                                {/* Match Preview Column - Visible on all screens */}
                                                <div className="w-32 sm:w-40 flex justify-center flex-shrink-0 relative group/tooltip pr-2">
                                                    <Link
                                                        href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                                        className="px-2 sm:px-4 py-1.5 text-[8px] sm:text-[9px] font-black uppercase bg-white/5 border border-white/10 rounded-md text-white/80 hover:bg-[var(--fs-yellow)] hover:text-black hover:border-[var(--fs-yellow)] transition-all tracking-wider whitespace-nowrap shadow-sm group-hover:scale-105"
                                                    >
                                                        Match Preview
                                                    </Link>

                                                    {/* Tooltip (Desktop Only) */}
                                                    <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1e293b] text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-white/10">
                                                        Click to see expert prediction!
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1e293b]"></div>
                                                    </div>
                                                </div>

                                                {/* Mobile Link Overlay */}
                                                <Link
                                                    href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                                    className="absolute inset-0 z-0 sm:hidden"
                                                    aria-label={`View match preview for ${match.home_team} vs ${match.away_team}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Insert News after the first league */}
                            {index === 0 && <RichPredictNews posts={blogPosts} />}
                        </React.Fragment>
                    )) : (
                        <div className="p-20 text-center bg-[var(--fs-header)] rounded-sm border border-white/5 space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--fs-yellow)] mx-auto" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--fs-text-dim)]">
                                NO_DATA_DETECTED_IN_CLUSTER
                                <br />
                                <span className="text-white/20">Check Supabase connection</span>
                            </p>
                        </div>
                    )}
                    <AIPredictTrust />
                    <Testimonials />
                </div>

                {/* Right Sidebar */}
                <aside className="hidden xl:flex flex-col space-y-6">
                    {/* VIP PREMIUM CARD - Standardized across pages */}
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
                            <p className="text-[11px] font-bold text-white/50 leading-relaxed">
                                Get 95%+ accurate AI predictions and exclusive analytics.
                            </p>
                            <button className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2">
                                UNLOCK ACCESS <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Signal_Probability Section - Transparent Background */}
                    <div className="space-y-4 px-1">
                        <h3 className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 italic">
                            <Zap className="w-3 h-3 text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" /> Signal_Probability
                        </h3>
                        {predictions.slice(0, 3).map((p, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-white/60 truncate max-w-[140px]">{p.home_team}</span>
                                    <span className="text-[var(--fs-yellow)] font-bold font-mono text-[10px]">{p.confidence || '74%'}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--fs-yellow)] shadow-[0_0_8px_rgba(255,228,56,0.3)]" style={{ width: p.confidence || '74%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>

        </div>
    );
}
