import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Football Predictions, Results, EPL & Champions League | RichPredict',
    description: 'Get free football predictions, match results, and expert betting tips for Premier League, Champions League, and all major sports leagues worldwide.',
    alternates: {
        canonical: 'https://richpredict.com',
    },
    openGraph: {
        title: 'Football Predictions, Results, EPL & Champions League | RichPredict',
        description: 'Get free football predictions, match results, and expert betting tips for Premier League, Champions League, and all major sports leagues worldwide.',
        url: 'https://richpredict.com',
        siteName: 'RichPredict',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://richpredict.com/logo.png', // Logo as OG image
                width: 1200,
                height: 630,
                alt: 'RichPredict - Premium Sports Predictions',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RichPredict | Sports Predictions & Results',
        description: 'Expert sports predictions and match analytics for football, tennis, and more.',
        images: ['https://richpredict.com/logo.png'],
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
import { SiteStatistics } from "@/components/SiteStatistics";

import SidebarCountries from "@/components/SidebarCountries";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import SidebarAd from "@/components/Ads/SidebarAd";
import TopTicker from "@/components/layout/TopTicker";
import PremiumLockedMatches from "@/components/predictions/PremiumLockedMatches";
import { Flag } from "@/components/ui/Flag";
import DateNavigator from "@/components/layout/DateNavigator";

export default async function Home({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
    const sp = await searchParams;
    const selectedDate = sp.date || new Date().toISOString().split('T')[0];

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
            getPredictions(300, 'Football', selectedDate),
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

    // Group predictions by league + country to prevent name collision (e.g., Premier League in different countries)
    const groupedLeagues = predictions.reduce((acc: any, p: Prediction) => {
        const countryId = p.leagues?.country_id || 'world';
        const leagueId = p.league_id || p.league || 'other';
        const groupKey = `${countryId}-${leagueId}`;

        if (!acc[groupKey]) {
            acc[groupKey] = {
                id: groupKey,
                name: p.league || "Other Competitions",
                category: p.category || "FOOTBALL",
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
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "RichPredict",
                            "url": "https://richpredict.com",
                            "logo": "https://richpredict.com/logo.png",
                            "sameAs": [
                                "https://twitter.com/richpredict",
                                "https://facebook.com/richpredict"
                            ],
                            "description": "Premium sports prediction platform providing expert match analysis and betting tips."
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Football Predictions, Results, EPL & Champions League | RichPredict",
                            "description": "Expert football predictions and match results for Premier League, Champions League, and global sports leagues.",
                            "url": "https://richpredict.com"
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            "name": "Live Sports Predictions & Match Analytics",
                            "description": "A collection of the latest sports predictions and expert betting insights."
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "Latest Football Match Predictions",
                            "itemListElement": predictions.slice(0, 5).map((p, i) => ({
                                "@type": "ListItem",
                                "position": i + 1,
                                "name": `${p.home_team} vs ${p.away_team} - ${p.league}`,
                                "url": `https://richpredict.com/predictions/${generateSEOSlug(p.home_team, p.away_team, p.slug)}`
                            }))
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "What are the most accurate football predictions today?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "content": "RichPredict provides highly accurate football predictions for today's matches, covering EPL, Champions League, and major European leagues using expert analysis."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Are the betting tips on RichPredict free?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "content": "Yes, RichPredict offers free expert betting tips and match previews for a wide range of football matches and other sports."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "How do you calculate match outcomes?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "content": "Our match outcomes are calculated using a combination of deep statistical analysis, team form, injury reports, and historical head-to-head records."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />
            {/* Premium Animated Global Ticker */}
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
                            {league.countries?.flag_url && (
                                <div
                                    className="w-3.5 h-2.5 bg-center bg-no-repeat bg-cover rounded-[1px] opacity-100 pointer-events-none select-none"
                                    style={{ backgroundImage: `url(${league.countries.flag_url})` }}
                                    aria-label={`${league.countries.name} flag`}
                                />
                            )}
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
                    {/* High-Performance Premium Inner Ad Banner */}
                    <InnerAdBanner />

                    {/* Date Navigation for filtering */}
                    <DateNavigator />

                    <PremiumLockedMatches sport="FOOTBALL" count={premiumCount} />

                    {displayLeagues.length > 0 ? displayLeagues.map((league: any, index: number) => (
                        <React.Fragment key={league.id}>
                            <div className="sportName soccer overflow-hidden rounded-xl border border-white/5 shadow-2xl">
                                <div className="headerLeague__wrapper bg-gradient-to-b from-[#164e63] to-[#083344] border-t border-white/20 border-b border-black/40 shadow-lg">
                                    <div className="wcl-header_HrElx py-2.5 px-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {league.matches[0]?.leagues?.countries?.flag_url && (
                                                    <div
                                                        className="w-[18px] h-[12px] flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-[1px] shadow-sm pointer-events-none select-none"
                                                        style={{ backgroundImage: `url(${league.matches[0].leagues.countries.flag_url})` }}
                                                        aria-label={`${league.matches[0].leagues.countries.name} flag`}
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
                                                {/* Date/Time Column */}
                                                <div className="w-16 sm:w-24 flex-shrink-0 flex flex-col items-center justify-center leading-tight border-r border-white/5 ml-2">
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
                                                        <div
                                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-center bg-no-repeat bg-contain pointer-events-none select-none"
                                                            style={{ backgroundImage: `url(${getLogo(match.home_team)})` }}
                                                            aria-label={`${match.home_team} logo`}
                                                        />
                                                        <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.home_team}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                                        <div
                                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-center bg-no-repeat bg-contain pointer-events-none select-none"
                                                            style={{ backgroundImage: `url(${getLogo(match.away_team)})` }}
                                                            aria-label={`${match.away_team} logo`}
                                                        />
                                                        <span className="text-[11px] sm:text-[13px] font-medium text-white truncate drop-shadow-sm">{match.away_team}</span>
                                                    </div>
                                                </div>

                                                {/* Match Preview Column - Visible on all screens */}
                                                <div className="w-32 sm:w-40 flex justify-center flex-shrink-0 relative group/tooltip pr-2 z-10">
                                                    <Link
                                                        href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                                        className="px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-medium uppercase bg-white/5 border border-white/10 rounded-full text-white/80 hover:bg-[var(--fs-yellow)] hover:text-black hover:border-[var(--fs-yellow)] transition-all tracking-wider whitespace-nowrap shadow-sm"
                                                    >
                                                        Match Preview
                                                    </Link>

                                                    {/* Tooltip (Desktop Only) */}
                                                    <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1e293b] text-white text-[10px] font-medium rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible pointer-events-none z-50 shadow-xl border border-white/10 whitespace-nowrap">
                                                        Click to see expert prediction!
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1e293b]"></div>
                                                    </div>
                                                </div>

                                                {/* Full Link Overlay */}
                                                <Link
                                                    href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`}
                                                    className="absolute inset-0 z-0"
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
                                    SUBSCRIBERS
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

                    {/* Site Statistics Section */}
                    <SiteStatistics />
                </aside>
            </main>

        </div>
    );
}
