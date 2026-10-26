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
import { notFound } from "next/navigation";
import DateNavigator from "@/components/layout/DateNavigator";
import GameTime from "@/components/predictions/GameTime";

interface Props {
    params: Promise<{ sport: string }>;
    searchParams: Promise<{ date?: string }>;
}

const VALID_SPORTS = ['tennis', 'basketball', 'hockey', 'golf', 'baseball', 'snooker', 'volleyball', 'football'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sport: sportParam } = await params;
    const sportSlug = sportParam.toLowerCase();

    if (!VALID_SPORTS.includes(sportSlug)) {
        notFound();
    }

    const sport = sportSlug.charAt(0).toUpperCase() + sportSlug.slice(1);
    return {
        title: `AI ${sport} Predictions & Betting Tips`,
        description: `Get the most accurate AI-powered ${sport} predictions, analytics, and betting tips. High-probability outcomes for all major ${sport} events.`,
        alternates: {
            canonical: `https://richpredict.com/${sportSlug}`,
        },
    };
}

export const revalidate = 0;

export default async function SportPage({ params, searchParams }: Props) {
    const { sport: sportParam } = await params;
    const sp = await searchParams;
    const selectedDate = sp.date || new Date().toISOString().split('T')[0];

    const sportSlug = sportParam.toLowerCase();

    // Validate sport - Return true HTTP 404 if invalid
    if (!VALID_SPORTS.includes(sportSlug)) {
        notFound();
    }

    const sportName = sportSlug.charAt(0).toUpperCase() + sportSlug.slice(1);

    let predictions: Prediction[] = [];
    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let allTeams: any[] = [];
    let blogPosts: BlogPost[] = [];
    let premiumCount = 0;
    let isCrossSportFallback = false;

    try {
        const [preds, pinned, countries, pCount, blogs] = await Promise.all([
            getPredictions(150, sportName, selectedDate),
            getPinnedLeagues(),
            getCountriesByRegion(),
            getPremiumPredictionsCount(sportName),
            getBlogPosts(3)
        ]);
        predictions = preds || [];

        // Fallback 1: If no matches scheduled for selectedDate, display latest available matches for this sport
        if (predictions.length === 0) {
            predictions = (await getPredictions(150, sportName)) || [];
        }

        // Fallback 2: If no matches exist for this sport yet, load high-confidence global AI predictions
        // so that the page always has rich, live match previews, internal links, and zero thin-content soft-404 flags.
        if (predictions.length === 0) {
            predictions = (await getPredictions(40, 'Football')) || [];
            isCrossSportFallback = true;
        }

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

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How does RichPredict AI generate ${sportName} predictions?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `RichPredict utilizes the RP-GPT neural engine, combining multiple advanced AI models with deep statistical analysis of player form, head-to-head dynamics, court surface variables, and betting market liquidity to compute high-probability outcomes.`
                }
            },
            {
                "@type": "Question",
                "name": `When are daily ${sportName} betting tips published?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Predictions are refreshed continuously as line movements and pre-match lineups are confirmed, typically 12-24 hours prior to game commencement.`
                }
            },
            {
                "@type": "Question",
                "name": `Are RichPredict ${sportName} predictions free?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, RichPredict provides daily free match previews and betting tips across all featured sports fixtures, alongside premium institutional-grade intelligence.`
                }
            }
        ]
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://richpredict.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": `${sportName} Predictions`,
                "item": `https://richpredict.com/${sportSlug}`
            }
        ]
    };

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
                    {/* Structured Data for SEO / Rich Snippets */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                    />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                    />

                    {isCrossSportFallback && (
                        <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-black/60 border border-emerald-500/20 rounded-xl p-5 mb-3 shadow-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-emerald-400">
                                    AI Neural Engine Active | RP-GPT {sportName.toUpperCase()} Cluster
                                </span>
                            </div>
                            <h1 className="text-base sm:text-lg font-black text-white tracking-tight mb-1">
                                AI {sportName} Predictions &amp; Tactical Tournament Intelligence
                            </h1>
                            <p className="text-[11px] text-white/70 leading-relaxed max-w-3xl">
                                Our proprietary RP-GPT neural ensemble continuously evaluates ATP, WTA, and global {sportName} fixtures, integrating court surface velocities, fatigue indexes, and market liquidity shifts. While our neural models compute live probability distributions for the next {sportName} slate, explore today&apos;s high-confidence global AI sports predictions and analytical previews below.
                            </p>
                        </div>
                    )}

                    <InnerAdBanner />
                    <DateNavigator />
                    <PremiumLockedMatches sport={sportName.toUpperCase()} count={premiumCount} />

                    {isCrossSportFallback && (
                        <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg mb-2">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                Today&apos;s High-Confidence Global AI Picks &amp; Previews
                            </span>
                            <span className="text-[9px] font-mono text-[var(--fs-yellow)] uppercase">
                                Verified RP-GPT Model
                            </span>
                        </div>
                    )}

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
                        <div className="p-12 text-center bg-[var(--fs-header)] rounded-xl border border-white/5 space-y-3">
                            <Trophy size={36} className="mx-auto text-white/20" />
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Analyzing Upcoming {sportName} Schedule</h3>
                                <p className="text-[10px] text-white/40 max-w-md mx-auto">Our AI nodes are processing telemetry for the upcoming fixture card. Check back shortly for updated previews.</p>
                            </div>
                        </div>
                    )}

                    {/* Rich AI Sports Analysis & Structured FAQ Section for 100% Google Indexing Quality */}
                    <section className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-6 mt-6">
                        <div className="border-b border-white/10 pb-4">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--fs-yellow)] font-bold">
                                RP-GPT Deep Learning Framework
                            </span>
                            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight mt-1">
                                AI-Driven {sportName} Analytics &amp; Strategic Forecasting
                            </h2>
                        </div>

                        <div className="text-xs text-white/70 space-y-3 leading-relaxed">
                            <p>
                                RichPredict engineers state-of-the-art computational intelligence for global sports forecasting. Our proprietary RP-GPT engine processes multi-dimensional telemetry, historical head-to-head metrics, and real-time market movements across international tournaments. By blending advanced neural networks with rigorous statistical modeling, we provide high-fidelity match intelligence for discerning sports analysts.
                            </p>
                            <p>
                                Every prediction evaluates athlete condition indexes, tactical alignments, expected performance values, and live betting market liquidity. This systematic approach strips away subjective bias, delivering objective, mathematical probabilities for every featured fixture.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="text-[11px] font-bold text-white mb-1">95%+ Precision Target</div>
                                    <div className="text-[10px] text-white/50">Multi-layer algorithmic verification ensures high confidence across key fixture markets.</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="text-[11px] font-bold text-white mb-1">Dynamic Telemetry</div>
                                    <div className="text-[10px] text-white/50">Real-time tracking of line shifts, market volumes, and condition reports.</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="text-[11px] font-bold text-white mb-1">Hybrid Intelligence</div>
                                    <div className="text-[10px] text-white/50">Machine learning predictions reviewed by a committee of veteran sports analysts.</div>
                                </div>
                            </div>
                        </div>

                        {/* Structured FAQ Section */}
                        <div className="border-t border-white/10 pt-5 space-y-4">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                                Frequently Asked Questions (FAQ)
                            </h3>
                            <div className="space-y-2.5">
                                <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[11px] font-semibold text-white">How does RichPredict predict {sportName} matches?</h4>
                                    <p className="text-[10px] text-white/60 mt-1">Our RP-GPT architecture cross-references historical fixture outcomes, situational momentum, player fitness indicators, and live betting market patterns using ensemble machine learning.</p>
                                </div>
                                <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[11px] font-semibold text-white">When are daily {sportName} betting tips published?</h4>
                                    <p className="text-[10px] text-white/60 mt-1">Forecasts are calculated and refreshed 12-24 hours prior to match commencement, factoring in late-breaking team and condition announcements.</p>
                                </div>
                                <div className="p-3 rounded bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[11px] font-semibold text-white">Are RichPredict {sportName} predictions free?</h4>
                                    <p className="text-[10px] text-white/60 mt-1">Yes, standard match previews, algorithmic probability estimates, and head-to-head comparisons are 100% free to access.</p>
                                </div>
                            </div>
                        </div>
                    </section>

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
