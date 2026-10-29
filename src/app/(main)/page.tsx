import React from 'react';
import { Metadata } from 'next';
import Link from "next/link";
import { Trophy } from "lucide-react";
import { generateSEOSlug, getTeamLogo, slugifyCountry } from "@/lib/utils";
import { getPredictions, getPinnedLeagues, getCountriesByRegion, getPremiumPredictionsCount, Prediction, getBlogPosts, BlogPost, getTeamsByNames } from "@/lib/supabase";

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
import GameTime from "@/components/predictions/GameTime";
import UserWidget from "@/components/user/UserWidget";

export const metadata: Metadata = {
    title: 'Football Predictions, Match Previews & AI Betting Tips',
    description: 'Get free AI football predictions, mathematical match previews, and expert betting tips for Premier League, Champions League, LaLiga, Serie A, and global leagues.',
    alternates: {
        canonical: 'https://richpredict.com',
    },
    openGraph: {
        title: 'Football Predictions, Match Previews & AI Betting Tips | RichPredict',
        description: 'Get free AI football predictions, mathematical match previews, and expert betting tips for Premier League, Champions League, and global sports leagues.',
        url: 'https://richpredict.com',
        siteName: 'RichPredict',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://richpredict.com/logo.png',
                width: 1200,
                height: 630,
                alt: 'RichPredict - AI Sports Predictions',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RichPredict | AI Football Predictions & Match Previews',
        description: 'Expert AI sports predictions and match analytics for football, tennis, basketball, and more.',
        images: ['https://richpredict.com/logo.png'],
    },
};

export const revalidate = 300;

export default async function Home() {
    let predictions: Prediction[] = [];
    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let allTeams: any[] = [];
    let blogPosts: BlogPost[] = [];
    let premiumCount = 0;

    try {
        const [preds, pinned, countries, pCount, blogs] = await Promise.all([
            getPredictions(40, 'Football'),
            getPinnedLeagues(),
            getCountriesByRegion(true),
            getPremiumPredictionsCount('Football'),
            getBlogPosts(3)
        ]);
        predictions = preds || [];
        pinnedLeagues = pinned || [];
        allCountries = countries || [];
        premiumCount = pCount || 0;
        blogPosts = blogs || [];

        const relevantTeamNames = Array.from(new Set(predictions.flatMap(p => [p.home_team, p.away_team])));
        allTeams = await getTeamsByNames(relevantTeamNames);
    } catch (e: any) {
        console.error("Supabase connection error:", e);
    }

    const dbLogoMap: Record<string, string> = {};
    allTeams.forEach(team => {
        if (team.name && team.logo_url) {
            const cleanName = team.name.toLowerCase().trim();
            dbLogoMap[cleanName] = team.logo_url;
            if (cleanName === 'manchester united') dbLogoMap['manchester utd'] = team.logo_url;
            if (cleanName === 'manchester utd') dbLogoMap['manchester united'] = team.logo_url;
        }
    });

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

    const countriesByRegion = allCountries.reduce((acc: any, country: any) => {
        const regionObj = country.regions || country.region;
        const regionName = regionObj?.name || "Other";
        if (!acc[regionName]) acc[regionName] = [];
        acc[regionName].push(country);
        return acc;
    }, {});

    const regionOrder = ["Europe", "World", "South America", "North & Central America", "North and Central America", "Asia", "Africa", "Australia & Oceania", "Australia and Oceania", "Other"];

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
                            "description": "Premium AI sports prediction platform providing expert match analysis and mathematical betting tips."
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Football Predictions, Match Previews & AI Betting Tips | RichPredict",
                            "description": "Expert football predictions and match previews for Premier League, Champions League, and global sports leagues.",
                            "url": "https://richpredict.com"
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "Featured Football Match Predictions",
                            "itemListElement": predictions.slice(0, 10).map((p, i) => ({
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
                                        "text": "RichPredict provides highly accurate AI football predictions for today's matches, covering the Premier League, Champions League, LaLiga, Serie A, Bundesliga, and international tournaments."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Are the betting tips on RichPredict free?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes, RichPredict offers free expert betting tips, mathematical win probabilities, and tactical match previews across global football leagues."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "How do you calculate match outcomes?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Our match outcomes are calculated using the RP-GPT neural engine, combining deep statistical analysis, expected goals (xG), team form, injury reports, and historical head-to-head records."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />

            <TopTicker />

            <main className="max-w-[1240px] mx-auto w-full px-2 py-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-4">

                {/* Left Sidebar */}
                <aside className="hidden lg:flex flex-col space-y-1 pr-2">
                    <div className="text-[10px] font-black text-white uppercase tracking-wider px-2 mb-1">Pinned Leagues</div>
                    {pinnedLeagues.length > 0 ? pinnedLeagues.map((league: any, i) => {
                        const countrySlug = slugifyCountry(league.countries?.name || 'europe');
                        return (
                            <Link
                                key={i}
                                href={`/predictions/football/${countrySlug}`}
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
                            </Link>
                        );
                    }) : (
                        <div className="px-2 py-1 text-[9px] text-white/20 italic">No pinned data</div>
                    )}

                    <SidebarAd />

                    <div className="pt-2 text-[10px] font-black text-white uppercase tracking-wider px-2 border-t border-white/5 mt-2 font-mono">Countries</div>

                    <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                </aside>

                {/* Main Content */}
                <div className="space-y-3">
                    {/* Visible Primary H1 Header */}
                    <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
                                Today&apos;s AI Football Predictions, Match Previews &amp; Betting Tips
                            </h1>
                            <p className="text-[11px] text-white/60">
                                Mathematical win probabilities, tactical previews, and verified picks across {allCountries.length}+ countries and major leagues.
                            </p>
                        </div>
                        <Link
                            href="/predictions"
                            className="text-[10px] font-black uppercase tracking-wider text-[var(--fs-yellow)] hover:underline whitespace-nowrap"
                        >
                            Full Archive &amp; Leagues &rarr;
                        </Link>
                    </div>

                    <InnerAdBanner />
                    <DateNavigator />
                    <PremiumLockedMatches sport="FOOTBALL" count={premiumCount} />

                    {displayLeagues.length > 0 ? displayLeagues.map((league: any, index: number) => {
                        const leagueCountryName = league.matches[0]?.leagues?.countries?.name;
                        const leagueCountrySlug = leagueCountryName ? slugifyCountry(leagueCountryName) : '';

                        return (
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
                                                            alt={`${leagueCountryName} flag`}
                                                            loading="lazy"
                                                        />
                                                    )}
                                                    <div className="headerLeague__titleWrapper flex flex-col md:flex-row md:items-center">
                                                        <div className="headerLeague__meta flex items-center">
                                                            {leagueCountryName && (
                                                                <Link
                                                                    href={`/predictions/football/${leagueCountrySlug}`}
                                                                    className="text-[10px] font-bold text-white hover:text-[var(--fs-yellow)] tracking-tight leading-none drop-shadow-md headerLeague__category uppercase mr-1.5 transition-colors"
                                                                >
                                                                    {leagueCountryName}:&nbsp;
                                                                </Link>
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
                                                    {(league.category || "FOOTBALL").toLowerCase().charAt(0).toUpperCase() + (league.category || "FOOTBALL").toLowerCase().slice(1)} tips
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="event__content bg-[var(--fs-header)] divide-y divide-white/5">
                                        {league.matches.map((match: Prediction) => {
                                            const matchSeoSlug = generateSEOSlug(match.home_team, match.away_team, match.slug);
                                            return (
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
                                                            href={`/predictions/${matchSeoSlug}`}
                                                            className="px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-medium uppercase bg-white/5 border border-white/10 rounded-full text-white/80 hover:bg-[var(--fs-yellow)] hover:text-black hover:border-[var(--fs-yellow)] transition-all tracking-wider whitespace-nowrap shadow-sm"
                                                        >
                                                            Match Preview
                                                        </Link>
                                                    </div>

                                                    <Link
                                                        href={`/predictions/${matchSeoSlug}`}
                                                        className="absolute inset-0 z-0"
                                                        aria-label={`View match preview for ${match.home_team} vs ${match.away_team}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {index === 0 && <RichPredictNews posts={blogPosts} />}
                            </React.Fragment>
                        );
                    }) : (
                        <div className="p-16 text-center bg-[var(--fs-header)] rounded-sm border border-white/5 space-y-4">
                            <Trophy className="w-10 h-10 text-white/20 mx-auto" />
                            <div className="space-y-1">
                                <h2 className="text-sm font-black uppercase text-white tracking-wider">No Matches Scheduled For This Date</h2>
                                <p className="text-[11px] text-white/40">Check our predictions archive or select another date from the calendar above.</p>
                            </div>
                            <Link href="/predictions" className="inline-block px-4 py-2 bg-[var(--fs-yellow)] text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-yellow-400 transition-colors">
                                Browse All Predictions
                            </Link>
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
