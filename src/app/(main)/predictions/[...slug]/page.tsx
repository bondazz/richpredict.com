export const revalidate = 0;
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    Trophy, Zap, ShieldCheck, ChevronLeft, Star, Target, ChevronRight, ChevronDown, Loader2, ArrowRight,
    Calendar, Clock, TrendingUp, Activity
} from "lucide-react";
import Link from "next/link";
import React from 'react';
import { generateSportsEventSchema, generatePredictionSchema, generateBreadcrumbSchema } from "@/lib/schema";
import {
    getPredictionBySlug,
    getPinnedLeagues,
    getCountriesByRegion,
    getPredictions,
    getFeaturedMatches,
    getCountryByName,
    getPredictionsByCountry,
    getLeaguesByCountry,
    getPremiumPredictionsCount,
    Prediction,
    getTeamsByNames,
    getBlogPosts,
    BlogPost
} from "@/lib/supabase";
import { RichPredictNews } from "@/components/news/RichPredictNews";
import { AIPredictTrust } from "@/components/AIPredictTrust";
import { Testimonials } from "@/components/Testimonials";
import SidebarCountries from "@/components/SidebarCountries";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import SidebarAd from "@/components/Ads/SidebarAd";
import MatchPreview from "@/components/predictions/MatchPreview";
import SEOContent from "@/components/predictions/SEOContent";
import GlobalBettingChart from "@/components/predictions/GlobalBettingChart";
import FeaturedMatchesUI from "@/components/predictions/FeaturedMatches";
import TitleSetter from "@/components/layout/TitleSetter";
import { Flag } from "@/components/ui/Flag";
import GameTime from "@/components/predictions/GameTime";
import PremiumLockedMatches from "@/components/predictions/PremiumLockedMatches";
import TopTicker from "@/components/layout/TopTicker";
import DateNavigator from "@/components/layout/DateNavigator";
import { SiteStatistics } from "@/components/SiteStatistics";
import { cn, generateSEOSlug, getTeamLogo } from "@/lib/utils";

interface Props {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug: slugs } = await params;

    // CASE 1: Country Predictions (/predictions/football/azerbaijan)
    if (slugs.length === 2) {
        const [sport, slug] = slugs;
        const country = await getCountryByName(slug);
        if (country) {
            const countryName = country.name;
            const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
            return {
                title: `${countryName} ${sportName} Predictions & Betting Tips | Expert Analysis`,
                description: `Get the most accurate AI-powered ${sport} predictions for ${countryName}. Expert betting tips, match analysis, and high-probability outcomes for all ${countryName} leagues.`,
                alternates: { canonical: `https://richpredict.com/predictions/${sport.toLowerCase()}/${slug.toLowerCase()}` }
            };
        }
    }

    // CASE 2: Match Detail or Country (/predictions/slug)
    if (slugs.length === 1) {
        const slug = slugs[0];

        // Try match first
        const match = await getPredictionBySlug(slug);
        if (match) {
            return {
                title: `${match.home_team} vs ${match.away_team} Predictions - Match Insight & Tips`,
                description: `Professional AI football predictions for ${match.home_team} vs ${match.away_team}. Win probability, H2H statistics, and expert betting insights for today's match.`,
            };
        }

        // Try country fallback
        const country = await getCountryByName(slug);
        if (country) {
            return { title: `${country.name} Football Predictions` };
        }
    }

    return { title: "Predictions - RichPredict" };
}

export default async function UnifiedPredictionsPage({ params, searchParams }: Props) {
    const { slug: slugs } = await params;
    const sp = await searchParams;
    const selectedDate = sp.date || new Date().toISOString().split('T')[0];

    // --- LOGIC: Identify if this is a country page or a match page ---
    let country: any = null;
    let match: any = null;
    let sportName = "Football";
    let sportSlug = "football";

    if (slugs.length === 2) {
        sportSlug = slugs[0].toLowerCase();
        sportName = sportSlug.charAt(0).toUpperCase() + sportSlug.slice(1);
        country = await getCountryByName(slugs[1]);
    } else if (slugs.length === 1) {
        match = await getPredictionBySlug(slugs[0]);
        if (!match) {
            country = await getCountryByName(slugs[0]);
        }
    }

    // --- RENDER COUNTRY PAGE ---
    if (country) {
        let predictions: Prediction[] = [];
        let countryLeagues: any[] = [];
        let allCountries: any[] = [];
        let allTeams: any[] = [];
        let blogPosts: BlogPost[] = [];
        let premiumCount = 0;

        try {
            const [preds, leagues, countries, pCount, blogs] = await Promise.all([
                getPredictionsByCountry(country.id, 100, selectedDate),
                getLeaguesByCountry(country.id),
                getCountriesByRegion(),
                getPremiumPredictionsCount(sportName),
                getBlogPosts(3)
            ]);
            predictions = preds || [];
            countryLeagues = leagues || [];
            allCountries = countries || [];
            premiumCount = pCount || 0;
            blogPosts = blogs || [];

            // Fetch only relevant team logos
            const relevantTeamNames = Array.from(new Set(predictions.flatMap(p => [p.home_team, p.away_team])));
            allTeams = await getTeamsByNames(relevantTeamNames);
        } catch (e) { console.error(e); }

        const dbLogoMap: Record<string, string> = {};
        allTeams.forEach(team => { if (team.name && team.logo_url) dbLogoMap[team.name.toLowerCase().trim()] = team.logo_url; });
        const getLogo = (name: string) => getTeamLogo(name, dbLogoMap);

        const groupedLeagues = predictions.reduce((acc: any, prediction: Prediction) => {
            const leagueName = prediction.league || "Other Competitions";
            if (!acc[leagueName]) {
                acc[leagueName] = { id: leagueName.toLowerCase().replace(/\s+/g, '-'), name: leagueName, country: country.name, matches: [] };
            }
            acc[leagueName].matches.push(prediction);
            return acc;
        }, {});

        const displayLeagues = Object.values(groupedLeagues);
        const countriesByRegion = allCountries.reduce((acc: any, c: any) => {
            const rName = (c.regions || c.region)?.name || "Other";
            if (!acc[rName]) acc[rName] = [];
            acc[rName].push(c);
            return acc;
        }, {});
        const regionOrder = ["Europe", "World", "South America", "North & Central America", "Asia", "Australia & Oceania"];

        return (
            <div className="flex flex-col min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
                <TitleSetter title={`${country.name} Football Predictions`} />
                <TopTicker>
                    <div className="flex gap-4 items-center">
                        <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-[var(--fs-yellow)] transition-colors">
                            <ChevronLeft size={14} /> Back
                        </Link>
                        <div className="h-3 w-[1px] bg-white/10" />
                        <TopTicker>
                            <nav aria-label="Breadcrumb" className="w-full">
                                <ol className="flex items-center gap-2.5 m-0 p-0 list-none" itemScope itemType="https://schema.org/BreadcrumbList">
                                    <li className="flex items-center gap-2.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <div className="flex items-center gap-2 text-white/60">
                                            <svg fill="currentColor" viewBox="0 0 20 20" width="14" height="14" className="opacity-80">
                                                <path fillRule="evenodd" d="M17 2.93a9.96 9.96 0 1 0-14.08 14.1A9.96 9.96 0 0 0 17 2.92Zm.41 2.77a8.5 8.5 0 0 1 1.1 3.43L16.66 8.1l.75-2.4Zm-1.37-1.8.37.4-1.11 3.57-1.33.4-3.32-2.41V4.5l3.16-2.2a8.6 8.6 0 0 1 2.22 1.6ZM9.96 1.4c.78-.01 1.55.1 2.3.3l-2.3 1.6-2.3-1.6c.75-.2 1.52-.31 2.3-.3ZM3.9 3.9a8.6 8.6 0 0 1 2.22-1.6l3.16 2.2v1.36l-3.32 2.4-1.32-.4L3.52 4.3l.37-.4ZM2.52 5.7l.75 2.4-1.85 1.03a8.5 8.5 0 0 1 1.1-3.43Zm1.37 10.35-.22-.23H5.7l.65 1.95a8.6 8.6 0 0 1-2.45-1.72Zm2.01-1.6H2.63A8.5 8.5 0 0 1 1.4 10.7l2.75-1.55 1.41.43 1.28 3.91-.95.95Zm6.05 3.89c-1.3.3-2.66.3-3.97 0l-1.01-3.02 1.1-1.1h3.79l1.1 1.1-1.01 3.02Zm-.07-5.44H8.05L6.86 9.25 9.96 7l3.1 2.25-1.18 3.65Zm4.15 3.15a8.6 8.6 0 0 1-2.45 1.72l.66-1.94h2.01l-.22.22Zm-2-1.6-.95-.95 1.27-3.91 1.41-.43 2.76 1.55a8.5 8.5 0 0 1-1.22 3.74h-3.27Z"></path>
                                            </svg>
                                            <Link href={`/${sportSlug}`} className="hover:text-white transition-colors uppercase font-black" itemProp="item">
                                                <span itemProp="name">{sportName}</span>
                                            </Link>
                                        </div>
                                        <meta itemProp="position" content="1" />
                                        <ChevronRight size={12} className="text-white/20" />
                                    </li>
                                    <li className="flex items-center gap-2.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <div className="flex items-center gap-2 text-white uppercase font-black">
                                            <Flag code={country.code} name={country.name} className="w-5 h-3.5 shadow-sm" />
                                            <span itemProp="name">{country.name}</span>
                                        </div>
                                        <meta itemProp="position" content="2" />
                                    </li>
                                </ol>
                            </nav>
                        </TopTicker>
                    </div>
                </TopTicker>

                <main className="max-w-[1240px] mx-auto w-full px-2 py-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-4">
                    <aside className="hidden lg:flex flex-col space-y-4 pr-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 px-2 py-3 border-b border-white/5">
                                <Flag code={country.code} name={country.name} className="w-4 h-3 rounded-[1px] shadow-sm" />
                                <span className="text-[13px] font-black text-white uppercase tracking-tight">{country.name}</span>
                            </div>
                            <div className="space-y-1">
                                {countryLeagues.length > 0 ? countryLeagues.map((league: any) => (
                                    <div key={league.id} className="px-2 py-2 text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-all rounded-sm truncate">
                                        {league.name}
                                    </div>
                                )) : <div className="px-2 py-1 text-[10px] text-white/20 italic">No leagues found</div>}
                            </div>
                        </div>
                        <SidebarAd />
                        <div className="pt-2 text-[10px] font-black text-white uppercase tracking-wider px-2 border-t border-white/5 mt-2 font-mono">Countries</div>
                        <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                    </aside>

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
                                                    <Flag code={country.code} url={country.flag_url} name={country.name} className="w-[18px] h-[12px] shadow-sm" />
                                                    <div className="headerLeague__titleWrapper flex flex-col md:flex-row md:items-center">
                                                        <div className="headerLeague__meta flex items-center">
                                                            <span className="text-[10px] font-bold text-white tracking-tight leading-none drop-shadow-md headerLeague__category uppercase mr-1.5">{country.name}:&nbsp;</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white tracking-tight leading-none drop-shadow-md headerLeague__title">
                                                            {league.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black text-[var(--fs-yellow)] drop-shadow-sm uppercase tracking-[0.1em] italic">
                                                    {sportName.toLowerCase()} tips
                                                </span>
                                                <ChevronDown size={14} className="text-white/40" />
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

                                                    {/* Tooltip (Desktop Only) */}
                                                    <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1e293b] text-white text-[10px] font-medium rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible pointer-events-none z-50 shadow-xl border border-white/10 whitespace-nowrap">
                                                        Click to see expert prediction!
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1e293b]"></div>
                                                    </div>
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
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--fs-yellow)] mx-auto" />
                                <p className="text-[11px] font-black uppercase tracking-widest text-[var(--fs-text-dim)]">
                                    NO_DATA_DETECTED
                                </p>
                            </div>
                        )}
                        <AIPredictTrust />
                        <Testimonials />
                    </div>

                    <aside className="hidden xl:flex flex-col space-y-6">
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
                                <p className="text-[11px] font-bold text-white/50 leading-relaxed uppercase">Get 95%+ accurate AI predictions and exclusive analytics.</p>
                                <button className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2">
                                    UNLOCK ACCESS <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                        <SiteStatistics />
                    </aside>
                </main>
            </div>
        );
    }

    // --- RENDER MATCH PAGE ---
    if (match) {
        let pinnedLeagues: any[] = [];
        let allCountries: any[] = [];
        let recentPredictions: any[] = [];
        let allTeams: any[] = [];
        let featuredMatches: any[] = [];

        try {
            const [pinned, countries, recents, featured] = await Promise.all([
                getPinnedLeagues(), getCountriesByRegion(), getPredictions(5),
                getFeaturedMatches(match.leagues?.country_id, 10, match.category)
            ]);
            pinnedLeagues = pinned || [];
            allCountries = countries || [];
            recentPredictions = recents || [];
            featuredMatches = featured || [];

            // Fetch only relevant team logos for match and featured matches
            const teamNames = new Set([match.home_team, match.away_team]);
            featuredMatches.forEach(fm => { teamNames.add(fm.home_team); teamNames.add(fm.away_team); });
            allTeams = await getTeamsByNames(Array.from(teamNames));
        } catch (e) { console.error(e); }

        const dbLogoMap: Record<string, string> = {};
        allTeams.forEach(t => { if (t.name && t.logo_url) dbLogoMap[t.name.toLowerCase().trim()] = t.logo_url; });
        const getLogo = (name: string) => getTeamLogo(name, dbLogoMap);
        const countriesByRegion = allCountries.reduce((acc: any, c: any) => {
            const rName = (c.regions || c.region)?.name || "Other";
            if (!acc[rName]) acc[rName] = [];
            acc[rName].push(c);
            return acc;
        }, {});
        const regionOrder = ["Europe", "World", "South America", "North & Central America", "Asia", "Australia & Oceania"];

        return (
            <div className="min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
                <TitleSetter title={`${match.home_team} vs ${match.away_team} Predictions`} />
                <TopTicker>
                    <nav aria-label="Breadcrumb" className="w-full">
                        <ol className="flex items-center gap-2.5 m-0 p-0 list-none" itemScope itemType="https://schema.org/BreadcrumbList">
                            <li className="flex items-center gap-2.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <div className="flex items-center gap-2 text-white/60">
                                    <svg fill="currentColor" viewBox="0 0 20 20" width="14" height="14" className="opacity-80">
                                        <path fillRule="evenodd" d="M17 2.93a9.96 9.96 0 1 0-14.08 14.1A9.96 9.96 0 0 0 17 2.92Zm.41 2.77a8.5 8.5 0 0 1 1.1 3.43L16.66 8.1l.75-2.4Zm-1.37-1.8.37.4-1.11 3.57-1.33.4-3.32-2.41V4.5l3.16-2.2a8.6 8.6 0 0 1 2.22 1.6ZM9.96 1.4c.78-.01 1.55.1 2.3.3l-2.3 1.6-2.3-1.6c.75-.2 1.52-.31 2.3-.3ZM3.9 3.9a8.6 8.6 0 0 1 2.22-1.6l3.16 2.2v1.36l-3.32 2.4-1.32-.4L3.52 4.3l.37-.4ZM2.52 5.7l.75 2.4-1.85 1.03a8.5 8.5 0 0 1 1.1-3.43Zm1.37 10.35-.22-.23H5.7l.65 1.95a8.6 8.6 0 0 1-2.45-1.72Zm2.01-1.6H2.63A8.5 8.5 0 0 1 1.4 10.7l2.75-1.55 1.41.43 1.28 3.91-.95.95Zm6.05 3.89c-1.3.3-2.66.3-3.97 0l-1.01-3.02 1.1-1.1h3.79l1.1 1.1-1.01 3.02Zm-.07-5.44H8.05L6.86 9.25 9.96 7l3.1 2.25-1.18 3.65Zm4.15 3.15a8.6 8.6 0 0 1-2.45 1.72l.66-1.94h2.01l-.22.22Zm-2-1.6-.95-.95 1.27-3.91 1.41-.43 2.76 1.55a8.5 8.5 0 0 1-1.22 3.74h-3.27Z"></path>
                                    </svg>
                                    <Link href="/" className="hover:text-white transition-colors uppercase font-black" itemProp="item">
                                        <span itemProp="name">Football</span>
                                    </Link>
                                </div>
                                <meta itemProp="position" content="1" />
                                <ChevronRight size={12} className="text-white/20" />
                            </li>
                            {match.leagues?.countries?.name && (
                                <li className="flex items-center gap-2.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Flag code={match.leagues.countries.code} name={match.leagues.countries.name} className="w-5 h-3.5 shadow-sm" />
                                        <Link href={`/predictions/football/${match.leagues.countries.name.toLowerCase()}`} className="hover:text-white transition-colors uppercase font-black" itemProp="item">
                                            <span itemProp="name">{match.leagues.countries.name}</span>
                                        </Link>
                                    </div>
                                    <meta itemProp="position" content="2" />
                                    <ChevronRight size={12} className="text-white/20" />
                                </li>
                            )}
                            <li className="flex items-center gap-2.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <span itemProp="name" className="text-white uppercase font-black">{match.league}</span>
                                <meta itemProp="position" content={match.leagues?.countries?.name ? "3" : "2"} />
                                <ChevronRight size={12} className="text-white/20" />
                            </li>
                            <li className="flex items-center gap-2.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <span itemProp="name" className="text-[var(--fs-yellow)] uppercase font-black leading-none">{match.home_team} vs {match.away_team}</span>
                                <meta itemProp="position" content={match.leagues?.countries?.name ? "4" : "3"} />
                            </li>
                        </ol>
                    </nav>
                </TopTicker>

                <main className="max-w-[1240px] mx-auto w-full px-2 py-6 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-6">
                    <aside className="hidden lg:flex flex-col space-y-1 pr-2">
                        <div className="text-[10px] font-black text-white uppercase px-2 mb-1">Pinned Leagues</div>
                        {pinnedLeagues.map((l, i) => (
                            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 text-white">
                                <Flag
                                    code={l.countries?.code}
                                    url={l.countries?.flag_url}
                                    name={l.countries?.name}
                                    className="w-3.5 h-2.5"
                                />
                                <span className="text-[11px] font-medium truncate">{l.name}</span>
                            </div>
                        ))}
                        <SidebarAd />
                        <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                    </aside>

                    <div className="space-y-6">
                        <InnerAdBanner />

                        <div className="bg-[var(--fs-header)] rounded-xl overflow-hidden border border-white/5 shadow-2xl relative duelParticipant__container">
                            {/* Premium Header with Integrated Hanging Date */}
                            <div className="relative">
                                <div className="bg-gradient-to-b from-[#164e63] to-[#083344] px-6 py-3 border-b border-black/40 flex items-center">
                                    <div className="flex items-center gap-3">
                                        <Flag
                                            code={match.leagues?.countries?.code}
                                            url={match.leagues?.countries?.flag_url}
                                            name={match.leagues?.countries?.name}
                                            className="w-[18px] h-[12px] shadow-sm"
                                        />
                                        <span className="text-[10px] font-black text-white uppercase tracking-tight drop-shadow-md">
                                            {match.leagues?.countries?.name}:&nbsp;
                                            <span className="text-white/70 font-bold">{match.league}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Hanging Date Badge - Honeycomb / Hexagonal Style */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 z-20 -mt-[1px] duelParticipant__startTime">
                                    {/* Joint Overlay Softener */}
                                    <div className="absolute inset-x-0 top-0 h-4 bg-black/40 blur-md pointer-events-none" />

                                    <div className="bg-[#083344] px-7 py-2 flex items-center gap-3 shadow-2xl relative"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={11} className="text-[var(--fs-yellow)] drop-shadow-sm" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider font-mono">
                                                {match.match_date ? new Date(match.match_date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '25.02.2026'}
                                            </span>
                                        </div>
                                        <div className="w-[1px] h-3 bg-white/20" />
                                        <div className="flex items-center gap-2">
                                            <Clock size={11} className="text-[var(--fs-yellow)] drop-shadow-sm" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider font-mono italic">{match.match_time || "21:00"}</span>
                                        </div>
                                    </div>

                                    {/* Honeycomb Corner Overlays - Smoother Joint */}
                                    <div className="absolute top-0 -left-1.5 w-1.5 h-1.5 bg-black/50 blur-[1px] pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                                    <div className="absolute top-0 -right-1.5 w-1.5 h-1.5 bg-black/50 blur-[1px] pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />

                                    {/* Bottom-Edge Glow/Overlay */}
                                    <div className="absolute -bottom-1 left-2 right-2 h-[1px] bg-[var(--fs-yellow)]/20 blur-[2px] pointer-events-none" />
                                </div>
                            </div>

                            {/* Compact Match Body - Forced Inline for Mobile */}
                            <div className="pt-12 pb-8 px-4 md:px-12 relative flex flex-col items-center overflow-hidden duelParticipant">
                                {/* Subtle Background Elements */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--fs-yellow)]/5 rounded-full blur-[80px] pointer-events-none" />

                                <div className="w-full grid grid-cols-3 items-center gap-2 md:gap-8 relative z-10">
                                    {/* Home Team */}
                                    <div className="flex flex-col items-center text-center space-y-3 duelParticipant__home">
                                        <div className="relative participant__participantLink participant__participantLink--team" title={`Show ${match.home_team} profile`}>
                                            <img
                                                className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-2xl participant__image"
                                                src={getLogo(match.home_team)}
                                                alt={match.home_team}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="participant__participantNameWrapper">
                                            <h2 className="text-[11px] md:text-sm font-black uppercase text-white tracking-tighter leading-tight max-w-[100px] md:max-w-none participant__participantName participant__overflow">
                                                {match.home_team}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Premium VS Divider */}
                                    <div className="flex flex-col items-center duelParticipant__score">
                                        <div className="relative flex items-center justify-center detailScore__matchInfo">
                                            {/* Glowing Background Ring */}
                                            <div className="absolute inset-0 bg-[var(--fs-yellow)]/20 blur-xl opacity-30 select-none animate-pulse" style={{ animationDuration: '4s' }} />

                                            {/* Central VS Emblem */}
                                            <div className="relative size-10 md:size-14 bg-[#083344] border border-white/10 rounded-lg rotate-45 flex items-center justify-center shadow-2xl detailScore__wrapper overflow-hidden">
                                                <style dangerouslySetInnerHTML={{
                                                    __html: `
                                                    @keyframes borderBeamRotate {
                                                        from { transform: translate(-50%, -50%) rotate(0deg); }
                                                        to { transform: translate(-50%, -50%) rotate(360deg); }
                                                    }
                                                `}} />
                                                {/* 60FPS Border Light Effect */}
                                                <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] pointer-events-none"
                                                    style={{
                                                        background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, var(--fs-yellow) 50%, transparent 60%, transparent 100%)',
                                                        animation: 'borderBeamRotate 4s linear infinite',
                                                        mixBlendMode: 'overlay',
                                                        opacity: 0.8
                                                    }} />
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                                <div className="-rotate-45 flex flex-col items-center">
                                                    <span className="text-[10px] md:text-xs font-black italic text-[var(--fs-yellow)] tracking-tight detailScore__divider select-none">
                                                        VS
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Decorative Side Lines */}
                                            <div className="absolute left-1/2 -translate-x-1/2 w-[140px] md:w-[200px] flex items-center justify-between pointer-events-none">
                                                <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent via-white/10 to-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Away Team */}
                                    <div className="flex flex-col items-center text-center space-y-3 duelParticipant__away">
                                        <div className="relative participant__participantLink participant__participantLink--team" title={`Show ${match.away_team} profile`}>
                                            <img
                                                className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-2xl participant__image"
                                                src={getLogo(match.away_team)}
                                                alt={match.away_team}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="participant__participantNameWrapper">
                                            <h2 className="text-[11px] md:text-sm font-black uppercase text-white tracking-tighter leading-tight max-w-[100px] md:max-w-none participant__participantName participant__overflow">
                                                {match.away_team}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modern Prediction Bar */}
                            <div className="bg-[#020d12] border-t border-white/5 py-3 flex justify-center items-center gap-3 relative overflow-hidden group/pred">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--fs-yellow)]/5 to-transparent -translate-x-full group-hover/pred:translate-x-full transition-transform duration-1000" />
                                <div className="flex items-center gap-2.5 px-6 py-1.5 bg-[var(--fs-yellow)]/10 rounded-full border border-[var(--fs-yellow)]/20 shadow-[0_0_20px_rgba(255,221,0,0.05)]">
                                    <div className="bg-[var(--fs-yellow)] size-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,221,0,0.4)]">
                                        <ShieldCheck className="text-black w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span className="text-[11px] md:text-xs font-black text-[var(--fs-yellow)] uppercase tracking-[0.25em] drop-shadow-sm">
                                        {match.prediction}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <MatchPreview content={match.analysis} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-6 space-y-6 relative overflow-hidden">
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--fs-yellow)]/5 rounded-full blur-3xl pointer-events-none" />
                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white relative z-10">
                                    <Zap className="w-4 h-4 text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" /> Probability Matrix
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase text-white/30 italic">Signal Confidence</span>
                                        <span className="text-3xl font-black text-[var(--fs-yellow)] font-mono">{match.confidence || '75%'}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex gap-1">
                                        <div className="h-full bg-[var(--fs-yellow)]" style={{ width: `${match.dist_home || 45}%` }} />
                                        <div className="h-full bg-white/10" style={{ width: `${match.dist_draw || 25}%` }} />
                                        <div className="h-full bg-[var(--fs-yellow)] opacity-40" style={{ width: `${match.dist_away || 30}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                                        <span>{match.home_team} ({match.dist_home || 45}%)</span>
                                        <span>Draw ({match.dist_draw || 25}%)</span>
                                        <span>{match.away_team} ({match.dist_away || 30}%)</span>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-6 grid grid-cols-2 gap-3 relative overflow-hidden">
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                                {[
                                    { label: 'Attacking_Index', val: '8.4', icon: TrendingUp },
                                    { label: 'Defense_Node', val: '6.9', icon: ShieldCheck },
                                    { label: 'Market_Delta', val: 'High', icon: Activity },
                                    { label: 'Accuracy_Bias', val: 'Verify', icon: Target },
                                ].map((m, i) => (
                                    <div key={i} className="bg-black/20 p-4 rounded-sm border border-white/5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-[var(--fs-yellow)]/30 transition-all relative z-10">
                                        <m.icon size={16} className="text-[var(--fs-yellow)]" />
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black uppercase text-white/20 whitespace-nowrap">{m.label}</p>
                                            <p className="text-sm font-black text-white">{m.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </div>

                        <GlobalBettingChart match={match} />
                        <FeaturedMatchesUI matches={featuredMatches} dbLogoMap={dbLogoMap} />
                        <SEOContent match={match} />
                    </div>

                    <aside className="hidden xl:flex flex-col space-y-6">
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
                                <p className="text-[11px] font-bold text-white/50 leading-relaxed uppercase">Get 95%+ accurate AI predictions and exclusive analytics.</p>
                                <button className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2">
                                    UNLOCK ACCESS <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                        <SiteStatistics />
                    </aside>
                </main>
            </div>
        );
    }

    notFound();
}
