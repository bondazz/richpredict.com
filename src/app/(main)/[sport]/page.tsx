import React from 'react';
import { Metadata } from 'next';
import Link from "next/link";
import { Zap, Trophy, Loader2, Star, ArrowRight, ChevronDown } from "lucide-react";
import { cn, generateSEOSlug, getTeamLogo } from "@/lib/utils";
import { getPredictions, getRegions, getPinnedLeagues, getCountriesByRegion, getPremiumPredictionsCount, Prediction, getTeams, getBlogPosts, BlogPost, getTeamsByNames } from "@/lib/supabase";

import { AIPredictTrust } from "@/components/AIPredictTrust";
import { Testimonials } from "@/components/Testimonials";
import { RichPredictNews } from "@/components/news/RichPredictNews";
import { SiteStatistics } from "@/components/SiteStatistics";

import SidebarCountries from "@/components/SidebarCountries";
import UserWidget from "@/components/user/UserWidget";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import SidebarAd from "@/components/Ads/SidebarAd";
import TopTicker from "@/components/layout/TopTicker";
import PremiumLockedMatches from "@/components/predictions/PremiumLockedMatches";
import { Flag } from "@/components/ui/Flag";
import DateNavigator from "@/components/layout/DateNavigator";
import GameTime from "@/components/predictions/GameTime";

interface Props {
    params: Promise<{ sport: string }>;
    searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sport: sportParam } = await params;
    const sport = sportParam.charAt(0).toUpperCase() + sportParam.slice(1);
    return {
        title: `AI ${sport} Predictions & Betting Tips | RichPredict`,
        description: `Get the most accurate AI-powered ${sport} predictions, analytics, and betting tips. High-probability outcomes for all major ${sport} events.`,
        alternates: {
            canonical: `https://richpredict.com/${sportParam.toLowerCase()}`,
        },
    };
}

export const revalidate = 0;

export default async function SportPage({ params, searchParams }: Props) {
    const { sport: sportParam } = await params;
    const sp = await searchParams;
    const selectedDate = sp.date || new Date().toISOString().split('T')[0];

    const sportSlug = sportParam.toLowerCase();
    const sportName = sportSlug.charAt(0).toUpperCase() + sportSlug.slice(1);

    // Validate sport
    const validSports = ['tennis', 'basketball', 'hockey', 'golf', 'baseball', 'snooker', 'volleyball', 'football'];
    if (!validSports.includes(sportSlug)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white font-[Klapt]">Sport Not Found</h1>
                <Link href="/" className="text-[var(--fs-yellow)] hover:text-white transition-colors uppercase font-black text-xs">Return Home</Link>
            </div>
        );
    }

    let predictions: Prediction[] = [];
    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let allTeams: any[] = [];
    let blogPosts: BlogPost[] = [];
    let premiumCount = 0;

    try {
        const [preds, pinned, countries, pCount, blogs] = await Promise.all([
            getPredictions(150, sportName, selectedDate),
            getPinnedLeagues(),
            getCountriesByRegion(),
            getPremiumPredictionsCount(sportName),
            getBlogPosts(3)
        ]);
        predictions = preds || [];
        pinnedLeagues = pinned || [];
        allCountries = countries || [];
        premiumCount = pCount || 0;
        blogPosts = blogs || [];

        // Fetch only relevant team logos
        const relevantTeamNames = Array.from(new Set(predictions.flatMap(p => [p.home_team, p.away_team])));
        allTeams = await getTeamsByNames(relevantTeamNames);
    } catch (e: any) {
        console.error("Supabase connection error:", e);
    }

    // Build dynamic logo map from database teams
    const dbLogoMap: Record<string, string> = {};
    allTeams.forEach(team => {
        if (team.name && team.logo_url) {
            const cleanName = team.name.toLowerCase().trim();
            dbLogoMap[cleanName] = team.logo_url;
            if (cleanName === 'manchester united') dbLogoMap['manchester utd'] = team.logo_url;
            if (cleanName === 'manchester utd') dbLogoMap['manchester united'] = team.logo_url;
        }
    });

    // Group predictions by league + country
    const groupedLeagues = predictions.reduce((acc: any, p: Prediction) => {
        const countryId = p.leagues?.country_id || 'world';
        const leagueId = p.league_id || p.league || 'other';
        const groupKey = `${countryId}-${leagueId}`;

        if (!acc[groupKey]) {
            acc[groupKey] = {
                id: groupKey,
                name: p.league || "Other Competitions",
                category: p.category || sportName.toUpperCase(),
                matches: []
            };
        }
        acc[groupKey].matches.push(p);
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

    const regionOrder = ["Europe", "World", "South America", "North & Central America", "Asia", "Australia & Oceania"];
    const getLogo = (name: string) => getTeamLogo(name, dbLogoMap);

    return (
        <div className="flex flex-col min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
            <TopTicker />

            <main className="max-w-[1240px] mx-auto w-full px-2 py-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-4">

                {/* Left Sidebar */}
                <aside className="hidden lg:flex flex-col space-y-1 pr-2">
                    <div className="text-[10px] font-black text-white uppercase tracking-wider px-2 mb-1">Pinned Leagues</div>
                    {pinnedLeagues.length > 0 ? pinnedLeagues.map((league: any, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 px-2 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 text-white"
                            title={`${league.countries?.name?.toUpperCase()}: ${league.name}`}
                        >
                            <Flag
                                code={league.countries?.code}
                                url={league.countries?.flag_url}
                                name={league.countries?.name}
                                className="w-3.5 h-2.5"
                            />
                            <span className="text-[11px] font-medium truncate transition-colors">
                                {league.name.replace(new RegExp(`(${league.countries?.name}|EUR|WORLD|SOUTH AFRICA|BRAZIL|WALES|VENEZUELA|VIETNAM)$`, 'i'), '').trim()}
                            </span>
                        </div>
                    )) : (
                        <div className="px-2 py-1 text-[9px] text-white/20 italic">No pinned data</div>
                    )}

                    <SidebarAd />

                    <div className="pt-2 text-[10px] font-black text-white uppercase tracking-wider px-2 border-t border-white/5 mt-2 font-mono">Countries</div>

                    <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                </aside>

                {/* Main Content */}
                <div className="space-y-3">
                    <InnerAdBanner />
                    <DateNavigator />
                    <PremiumLockedMatches sport={sportName.toUpperCase()} count={premiumCount} />

                    {displayLeagues.length > 0 ? displayLeagues.map((league: any, index: number) => (
                        <React.Fragment key={league.id}>
                            <div className="sportName soccer overflow-hidden rounded-xl border border-white/5 shadow-2xl">
                                <div className="headerLeague__wrapper bg-gradient-to-b from-[#164e63] to-[#083344] border-t border-white/20 border-b border-black/40 shadow-lg">
                                    <div className="wcl-header_HrElx py-2.5 px-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="headerLeague__body flex items-center gap-2">
                                                {league.matches[0]?.leagues?.countries?.flag_url && (
                                                    <img
                                                        className="w-[18px] h-[12px] object-cover rounded-[1px] shadow-sm pointer-events-none select-none"
                                                        src={league.matches[0].leagues.countries.flag_url}
                                                        alt={`${league.matches[0].leagues.countries.name} flag`}
                                                        loading="lazy"
                                                    />
                                                )}
                                                <div className="headerLeague__titleWrapper flex flex-col md:flex-row md:items-center">
                                                    <div className="headerLeague__meta flex items-center">
                                                        {league.matches[0]?.leagues?.countries?.name && (
                                                            <span className="text-[10px] font-bold text-white tracking-tight leading-none drop-shadow-md headerLeague__category uppercase mr-1.5">{league.matches[0].leagues.countries.name}:&nbsp;</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-white tracking-tight leading-none drop-shadow-md headerLeague__title">
                                                        {league.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-[var(--fs-yellow)] drop-shadow-sm uppercase tracking-[0.1em] italic">
                                                {(league.category || sportName).toLowerCase().charAt(0).toUpperCase() + (league.category || sportName).toLowerCase().slice(1)} tips
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
                                    {league.matches.map((match: Prediction) => (
                                        <div key={match.id} className="event__match group flex items-center h-14 hover:bg-white/[0.04] transition-colors relative border-b border-black/10">
                                            <GameTime
                                                date={match.match_date}
                                                time={match.match_time || "19:00"}
                                                className="w-16 sm:w-24 flex-shrink-0 border-r border-white/5 ml-2"
                                            />

                                            <div className="flex-1 flex flex-col justify-center gap-1 sm:gap-1.5 px-3 sm:px-6 min-w-0">
                                                <div className="flex items-center gap-2 sm:gap-2.5">
                                                    <img
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain pointer-events-none select-none"
                                                        src={getLogo(match.home_team)}
                                                        alt={match.home_team}
                                                        loading="lazy"
                                                    />
                                                    <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.home_team}</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-2.5">
                                                    <img
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain pointer-events-none select-none"
                                                        src={getLogo(match.away_team)}
                                                        alt={match.away_team}
                                                        loading="lazy"
                                                    />
                                                    <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.away_team}</span>
                                                </div>
                                            </div>

                                            <div className="w-32 sm:w-40 flex justify-center flex-shrink-0 relative group/tooltip pr-2 z-10">
                                                <Link
                                                    href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                                    className="px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-medium uppercase bg-white/5 border border-white/10 rounded-full text-white/80 hover:bg-[var(--fs-yellow)] hover:text-black hover:border-[var(--fs-yellow)] transition-all tracking-wider whitespace-nowrap shadow-sm"
                                                >
                                                    Match Preview
                                                </Link>
                                            </div>

                                            <Link
                                                href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                                className="absolute inset-0 z-0"
                                                aria-label={`View match preview for ${match.home_team} vs ${match.away_team}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {index === 0 && <RichPredictNews posts={blogPosts} />}
                        </React.Fragment>
                    )) : (
                        <div className="p-20 text-center bg-[var(--fs-header)] rounded-sm border border-white/5 space-y-4">
                            <Trophy size={40} className="mx-auto text-white/10" />
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">No {sportName} Predictions Found</h3>
                                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Our AI nodes are currently analyzing global market data.</p>
                            </div>
                        </div>
                    )}
                    <AIPredictTrust />
                    <Testimonials />
                </div>

                {/* Right Sidebar */}
                <aside className="hidden xl:flex flex-col space-y-6">
                    <UserWidget />
                    <SiteStatistics />
                </aside>
            </main>
        </div>
    );
}
