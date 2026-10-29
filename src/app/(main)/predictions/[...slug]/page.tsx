export const revalidate = 3600;

export async function generateStaticParams() {
    return [];
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    Trophy, Zap, ShieldCheck, ChevronLeft, Target, ChevronRight, ChevronDown, ArrowRight,
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
import UserWidget from "@/components/user/UserWidget";
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
import { generateSEOSlug, getTeamLogo, slugifyCountry } from "@/lib/utils";

interface Props {
    params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug: slugs } = await params;

    // CASE 1: Country Predictions (/predictions/football/england)
    if (slugs.length === 2) {
        const [sport, slug] = slugs;
        const country = await getCountryByName(slug);
        if (country) {
            const countryName = country.name;
            const canonicalCountrySlug = slugifyCountry(countryName);
            const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
            return {
                title: `${countryName} ${sportName} Predictions, Betting Tips & League Previews`,
                description: `Get accurate AI-powered ${sport.toLowerCase()} predictions for ${countryName}. Mathematical betting tips, xG match analysis, and high-probability picks for all ${countryName} leagues.`,
                alternates: { canonical: `https://richpredict.com/predictions/${sport.toLowerCase()}/${canonicalCountrySlug}` },
                openGraph: {
                    title: `${countryName} ${sportName} Predictions & Betting Tips | RichPredict`,
                    description: `Expert AI ${sport.toLowerCase()} predictions, tactical previews, and betting tips for ${countryName} leagues.`,
                    url: `https://richpredict.com/predictions/${sport.toLowerCase()}/${canonicalCountrySlug}`,
                    type: 'website',
                }
            };
        }
    }

    // CASE 2: Match Detail or Country (/predictions/slug)
    if (slugs.length === 1) {
        const slug = slugs[0];

        const match = await getPredictionBySlug(slug);
        if (match) {
            const canonicalMatchSlug = generateSEOSlug(match.home_team, match.away_team, match.slug);
            const canonicalUrl = `https://richpredict.com/predictions/${canonicalMatchSlug}`;
            const leagueLabel = match.league || 'Football';
            return {
                title: `${match.home_team} vs ${match.away_team} Prediction, Betting Tips & Match Preview`,
                description: `AI football prediction for ${match.home_team} vs ${match.away_team} (${leagueLabel}): ${match.prediction} with ${match.confidence || '75%'} confidence. Read full H2H stats, tactical preview, and odds.`,
                alternates: {
                    canonical: canonicalUrl,
                },
                openGraph: {
                    title: `${match.home_team} vs ${match.away_team} Prediction & Tactical Preview | RichPredict`,
                    description: `Expert AI prediction for ${match.home_team} vs ${match.away_team} (${leagueLabel}): Pick ${match.prediction} (${match.confidence || '75%'} confidence).`,
                    url: canonicalUrl,
                    type: 'article',
                }
            };
        }

        const country = await getCountryByName(slug);
        if (country) {
            const canonicalCountrySlug = slugifyCountry(country.name);
            return {
                title: `${country.name} Football Predictions & Betting Tips`,
                description: `Accurate AI football predictions, league previews, and mathematical betting tips for ${country.name}.`,
                alternates: {
                    canonical: `https://richpredict.com/predictions/football/${canonicalCountrySlug}`,
                },
            };
        }
    }

    notFound();
}

export default async function UnifiedPredictionsPage({ params }: Props) {
    const { slug: slugs } = await params;

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
        let isGlobalFallback = false;

        try {
            const [preds, leagues, countries, pCount, blogs] = await Promise.all([
                getPredictionsByCountry(country.id, 45),
                getLeaguesByCountry(country.id),
                getCountriesByRegion(true),
                getPremiumPredictionsCount(sportName),
                getBlogPosts(3)
            ]);
            predictions = preds || [];

            // Fallback: If this country has no matches in DB yet, fallback to featured global predictions so it never renders Soft-404 NO_DATA_DETECTED
            if (predictions.length === 0) {
                predictions = (await getPredictions(25, 'Football')) || [];
                isGlobalFallback = true;
            }

            countryLeagues = leagues || [];
            allCountries = countries || [];
            premiumCount = pCount || 0;
            blogPosts = blogs || [];

            const relevantTeamNames = Array.from(new Set(predictions.flatMap(p => [p.home_team, p.away_team])));
            allTeams = await getTeamsByNames(relevantTeamNames);
        } catch (e) { console.error(e); }

        const dbLogoMap: Record<string, string> = {};
        allTeams.forEach(team => { if (team.name && team.logo_url) dbLogoMap[team.name.toLowerCase().trim()] = team.logo_url; });
        const getLogo = (name: string) => getTeamLogo(name, dbLogoMap);

        const groupedLeagues = predictions.reduce((acc: any, prediction: Prediction) => {
            const leagueName = prediction.league || "Featured Competitions";
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
        const regionOrder = ["Europe", "World", "South America", "North & Central America", "North and Central America", "Asia", "Africa", "Australia & Oceania", "Australia and Oceania", "Other"];

        const canonicalCountryUrl = `https://richpredict.com/predictions/${sportSlug}/${slugifyCountry(country.name)}`;
        const countryBreadcrumbSchema = generateBreadcrumbSchema([
            { name: "Home", url: "https://richpredict.com" },
            { name: `${sportName} Predictions`, url: `https://richpredict.com/${sportSlug}` },
            { name: `${country.name} ${sportName} Predictions`, url: canonicalCountryUrl }
        ]);

        const countryCollectionSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${country.name} ${sportName} Predictions & Betting Tips`,
            "description": `AI-powered ${sportName.toLowerCase()} predictions, match previews, and mathematical betting tips for ${country.name} leagues.`,
            "url": canonicalCountryUrl,
            "mainEntity": {
                "@type": "ItemList",
                "itemListElement": predictions.slice(0, 10).map((p, idx) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": `${p.home_team} vs ${p.away_team} (${p.league})`,
                    "url": `https://richpredict.com/predictions/${generateSEOSlug(p.home_team, p.away_team, p.slug)}`
                }))
            }
        };

        return (
            <div className="flex flex-col min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify([countryBreadcrumbSchema, countryCollectionSchema]) }}
                />
                <TitleSetter title={`${country.name} ${sportName} Predictions`} />
                <TopTicker>
                    <div className="flex gap-4 items-center">
                        <Link href="/predictions" className="flex items-center gap-1.5 text-white/40 hover:text-[var(--fs-yellow)] transition-colors">
                            <ChevronLeft size={14} /> All Countries
                        </Link>
                        <div className="h-3 w-[1px] bg-white/10" />
                        <nav aria-label="Breadcrumb" className="w-full">
                            <ol className="flex items-center gap-2.5 m-0 p-0 list-none">
                                <li className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Link href={`/${sportSlug}`} className="hover:text-white transition-colors uppercase font-black">
                                            <span>{sportName}</span>
                                        </Link>
                                    </div>
                                    <ChevronRight size={12} className="text-white/20" />
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-2 text-white uppercase font-black">
                                        <Flag code={country.code} url={country.flag_url} name={country.name} className="w-5 h-3.5 shadow-sm" />
                                        <span>{country.name}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </TopTicker>

                <main className="max-w-[1240px] mx-auto w-full px-2 py-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-4">
                    <aside className="hidden lg:flex flex-col space-y-4 pr-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 px-2 py-3 border-b border-white/5">
                                <Flag code={country.code} url={country.flag_url} name={country.name} className="w-4 h-3 rounded-[1px] shadow-sm" />
                                <span className="text-[13px] font-black text-white uppercase tracking-tight">{country.name}</span>
                            </div>
                            <div className="space-y-1">
                                {countryLeagues.length > 0 ? countryLeagues.map((league: any) => (
                                    <div key={league.id} className="px-2 py-2 text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all rounded-sm truncate">
                                        {league.name}
                                    </div>
                                )) : <div className="px-2 py-1 text-[10px] text-white/40 italic">National Competitions</div>}
                            </div>
                        </div>
                        <SidebarAd />
                        <div className="pt-2 text-[10px] font-black text-white uppercase tracking-wider px-2 border-t border-white/5 mt-2 font-mono">Countries</div>
                        <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                    </aside>

                    <div className="space-y-3">
                        {/* Visible Server-Rendered H1 Header for Country Hub */}
                        <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-4 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2.5">
                                <Flag code={country.code} url={country.flag_url} name={country.name} className="w-5 h-3.5 rounded-[1px] shadow-sm" />
                                <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
                                    {country.name} {sportName} Predictions, Betting Tips &amp; Match Previews
                                </h1>
                            </div>
                            <p className="text-[11px] text-white/60 leading-relaxed">
                                {isGlobalFallback
                                    ? `Our AI analytics engine monitors ${country.name} ${sportName.toLowerCase()} competitions and international fixtures. While the next domestic ${country.name} matchday card is being scheduled, explore our top-rated active football predictions below.`
                                    : `Mathematical ${country.name} ${sportName.toLowerCase()} predictions, win probabilities, and tactical previews across ${countryLeagues.length || displayLeagues.length} domestic competitions${countryLeagues.length > 0 ? ` (${countryLeagues.slice(0, 4).map((l: any) => l.name).join(', ')})` : ''}.`}
                            </p>
                        </div>

                        <InnerAdBanner />
                        <DateNavigator />
                        <PremiumLockedMatches sport={sportName.toUpperCase()} count={premiumCount} />
                        {displayLeagues.map((league: any, index: number) => (
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
                        ))}

                        {/* Country-Specific SEO Analytical Overview */}
                        <section className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-5 space-y-3">
                            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                                About {country.name} {sportName} Predictions &amp; Mathematical Analytics
                            </h2>
                            <p className="text-xs text-white/70 leading-relaxed">
                                RichPredict provides automated, data-driven {sportName.toLowerCase()} predictions for {country.name} leagues and cup tournaments. Each fixture in {country.name} is evaluated by our RP-GPT statistical model using historical club performance, home and away goal expectancy (xG), head-to-head trends, and market odds movements.
                            </p>
                            {countryLeagues.length > 0 && (
                                <div className="pt-2">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--fs-yellow)] mb-2">
                                        Covered Competitions in {country.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {countryLeagues.map((l: any) => (
                                            <span key={l.id} className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/5 text-[10px] text-white/70">
                                                {l.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

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
                                <Link href="/vip" className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2">
                                    UNLOCK ACCESS <ArrowRight size={14} />
                                </Link>
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
        let allTeams: any[] = [];
        let featuredMatches: any[] = [];

        try {
            const [pinned, countries, featured] = await Promise.all([
                getPinnedLeagues(),
                getCountriesByRegion(true),
                getFeaturedMatches(match.leagues?.country_id, 10, match.category)
            ]);
            pinnedLeagues = pinned || [];
            allCountries = countries || [];
            featuredMatches = featured || [];

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
        const regionOrder = ["Europe", "World", "South America", "North & Central America", "North and Central America", "Asia", "Africa", "Australia & Oceania", "Australia and Oceania", "Other"];

        const canonicalSlug = generateSEOSlug(match.home_team, match.away_team, match.slug);
        const canonicalUrl = `https://richpredict.com/predictions/${canonicalSlug}`;
        const countryName = match.leagues?.countries?.name;
        const countrySlug = countryName ? slugifyCountry(countryName) : '';

        const breadcrumbItems = [
            { name: "Football", url: "https://richpredict.com/football" },
            ...(countryName ? [{ name: countryName, url: `https://richpredict.com/predictions/football/${countrySlug}` }] : []),
            { name: `${match.home_team} vs ${match.away_team}`, url: canonicalUrl }
        ];

        const sportsEventSchema = generateSportsEventSchema(
            { ...match, home_logo: getLogo(match.home_team), away_logo: getLogo(match.away_team) },
            canonicalUrl
        );
        const predictionArticleSchema = generatePredictionSchema(match, canonicalUrl);
        const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

        return (
            <div className="min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
                {/* JSON-LD Structured Data for Match Page */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify([sportsEventSchema, predictionArticleSchema, breadcrumbSchema])
                    }}
                />
                <TitleSetter title={`${match.home_team} vs ${match.away_team} Predictions`} />
                <TopTicker>
                    <nav aria-label="Breadcrumb" className="w-full">
                        <ol className="flex items-center gap-2.5 m-0 p-0 list-none">
                            <li className="flex items-center gap-2.5">
                                <div className="flex items-center gap-2 text-white/60">
                                    <svg fill="currentColor" viewBox="0 0 20 20" width="14" height="14" className="opacity-80">
                                        <path fillRule="evenodd" d="M17 2.93a9.96 9.96 0 1 0-14.08 14.1A9.96 9.96 0 0 0 17 2.92Zm.41 2.77a8.5 8.5 0 0 1 1.1 3.43L16.66 8.1l.75-2.4Zm-1.37-1.8.37.4-1.11 3.57-1.33.4-3.32-2.41V4.5l3.16-2.2a8.6 8.6 0 0 1 2.22 1.6ZM9.96 1.4c.78-.01 1.55.1 2.3.3l-2.3 1.6-2.3-1.6c.75-.2 1.52-.31 2.3-.3ZM3.9 3.9a8.6 8.6 0 0 1 2.22-1.6l3.16 2.2v1.36l-3.32 2.4-1.32-.4L3.52 4.3l.37-.4ZM2.52 5.7l.75 2.4-1.85 1.03a8.5 8.5 0 0 1 1.1-3.43Zm1.37 10.35-.22-.23H5.7l.65 1.95a8.6 8.6 0 0 1-2.45-1.72Zm2.01-1.6H2.63A8.5 8.5 0 0 1 1.4 10.7l2.75-1.55 1.41.43 1.28 3.91-.95.95Zm6.05 3.89c-1.3.3-2.66.3-3.97 0l-1.01-3.02 1.1-1.1h3.79l1.1 1.1-1.01 3.02Zm-.07-5.44H8.05L6.86 9.25 9.96 7l3.1 2.25-1.18 3.65Zm4.15 3.15a8.6 8.6 0 0 1-2.45 1.72l.66-1.94h2.01l-.22.22Zm-2-1.6-.95-.95 1.27-3.91 1.41-.43 2.76 1.55a8.5 8.5 0 0 1-1.22 3.74h-3.27Z"></path>
                                    </svg>
                                    <Link href="/football" className="hover:text-white transition-colors uppercase font-black">
                                        <span>Football</span>
                                    </Link>
                                </div>
                                <ChevronRight size={12} className="text-white/20" />
                            </li>
                            {countryName && (
                                <li className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Flag code={match.leagues?.countries?.code} url={match.leagues?.countries?.flag_url} name={countryName} className="w-5 h-3.5 shadow-sm" />
                                        <Link href={`/predictions/football/${countrySlug}`} className="hover:text-white transition-colors uppercase font-black">
                                            <span>{countryName}</span>
                                        </Link>
                                    </div>
                                    <ChevronRight size={12} className="text-white/20" />
                                </li>
                            )}
                            <li className="flex items-center gap-2.5">
                                <span className="text-white uppercase font-black">{match.league}</span>
                                <ChevronRight size={12} className="text-white/20" />
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="text-[var(--fs-yellow)] uppercase font-black leading-none">{match.home_team} vs {match.away_team}</span>
                            </li>
                        </ol>
                    </nav>
                </TopTicker>

                <main className="max-w-[1240px] mx-auto w-full px-2 py-6 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-6">
                    <aside className="hidden lg:flex flex-col space-y-1 pr-2">
                        <div className="text-[10px] font-black text-white uppercase px-2 mb-1">Pinned Leagues</div>
                        {pinnedLeagues.map((l, i) => {
                            const lCountrySlug = slugifyCountry(l.countries?.name || 'europe');
                            return (
                                <Link
                                    key={i}
                                    href={`/predictions/football/${lCountrySlug}`}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 text-white"
                                >
                                    <Flag
                                        code={l.countries?.code}
                                        url={l.countries?.flag_url}
                                        name={l.countries?.name}
                                        className="w-3.5 h-2.5"
                                    />
                                    <span className="text-[11px] font-medium truncate">{l.name}</span>
                                </Link>
                            );
                        })}
                        <SidebarAd />
                        <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                    </aside>

                    <div className="space-y-6">
                        <InnerAdBanner />

                        <div className="bg-[var(--fs-header)] rounded-xl overflow-hidden border border-white/5 shadow-2xl relative duelParticipant__container">
                            {/* Premium Header with Integrated Hanging Date & Visible Server-Rendered H1 */}
                            <div className="relative">
                                <div className="bg-gradient-to-b from-[#164e63] to-[#083344] px-6 py-3 border-b border-black/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                    <div className="flex items-center gap-3">
                                        <Flag
                                            code={match.leagues?.countries?.code}
                                            url={match.leagues?.countries?.flag_url}
                                            name={countryName}
                                            className="w-[18px] h-[12px] shadow-sm"
                                        />
                                        <span className="text-[10px] font-black text-white uppercase tracking-tight drop-shadow-md">
                                            {countryName && (
                                                <Link href={`/predictions/football/${countrySlug}`} className="hover:text-[var(--fs-yellow)] transition-colors">
                                                    {countryName}:&nbsp;
                                                </Link>
                                            )}
                                            <span className="text-white/70 font-bold">{match.league}</span>
                                        </span>
                                    </div>
                                    <h1 className="text-[11px] sm:text-xs font-black text-white uppercase tracking-tight">
                                        {match.home_team} vs {match.away_team} Prediction &amp; Match Preview
                                    </h1>
                                </div>

                                {/* Hanging Date Badge */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 z-20 -mt-[1px] duelParticipant__startTime">
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

                                    <div className="absolute top-0 -left-1.5 w-1.5 h-1.5 bg-black/50 blur-[1px] pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                                    <div className="absolute top-0 -right-1.5 w-1.5 h-1.5 bg-black/50 blur-[1px] pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                                    <div className="absolute -bottom-1 left-2 right-2 h-[1px] bg-[var(--fs-yellow)]/20 blur-[2px] pointer-events-none" />
                                </div>
                            </div>

                            {/* Compact Match Body */}
                            <div className="pt-12 pb-8 px-4 md:px-12 relative flex flex-col items-center overflow-hidden duelParticipant">
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
                                            <div className="absolute inset-0 bg-[var(--fs-yellow)]/20 blur-xl opacity-30 select-none animate-pulse" style={{ animationDuration: '4s' }} />

                                            <div className="relative size-10 md:size-14 bg-[#083344] border border-white/10 rounded-lg rotate-45 flex items-center justify-center shadow-2xl detailScore__wrapper overflow-hidden">
                                                <style dangerouslySetInnerHTML={{
                                                    __html: `
                                                    @keyframes borderBeamRotate {
                                                        from { transform: translate(-50%, -50%) rotate(0deg); }
                                                        to { transform: translate(-50%, -50%) rotate(360deg); }
                                                    }
                                                `}} />
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
                        <UserWidget />
                        <SiteStatistics />
                    </aside>
                </main>
            </div>
        );
    }

    notFound();
}
