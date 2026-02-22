import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    Trophy,
    Zap,
    TrendingUp,
    ShieldCheck,
    Users,
    Activity,
    ChevronLeft,
    Calendar,
    Clock,
    Star,
    ArrowRight,
    Share2,
    BarChart3,
    Target
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateSportsEventSchema, generatePredictionSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { getPredictionBySlug, getPinnedLeagues, getCountriesByRegion, getPredictions, getTeams, getFeaturedMatches } from "@/lib/supabase";
import SidebarCountries from "@/components/SidebarCountries";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import MatchPreview from "@/components/predictions/MatchPreview";
import SEOContent from "@/components/predictions/SEOContent";
import GlobalBettingChart from "@/components/predictions/GlobalBettingChart";
import FeaturedMatches from "@/components/predictions/FeaturedMatches";
import TitleSetter from "@/components/layout/TitleSetter";
import { Flag } from "@/components/ui/Flag";
import { cn, generateSEOSlug, getTeamLogo } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const match = await getPredictionBySlug(slug);
    if (!match) return { title: "Match Not Found" };

    const title = `${match.home_team} vs ${match.away_team} Predictions - Match Insight & Tips`;
    const description = `Professional AI football predictions for ${match.home_team} vs ${match.away_team}. Win probability, H2H statistics, and expert betting insights for today's match.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
        alternates: {
            canonical: `https://richpredict.com/predictions/${slug}`,
        },
    };
}

export default async function PredictionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const match = await getPredictionBySlug(slug);

    if (!match) {
        notFound();
    }

    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let recentPredictions: any[] = [];
    let allTeams: any[] = [];
    let featuredMatches: any[] = [];

    try {
        const [pinned, countries, recents, teams, featured] = await Promise.all([
            getPinnedLeagues(),
            getCountriesByRegion(),
            getPredictions(5),
            getTeams(),
            getFeaturedMatches(match.leagues?.country_id, 10, match.category)
        ]);
        pinnedLeagues = pinned || [];
        allCountries = countries || [];
        recentPredictions = recents || [];
        allTeams = teams || [];
        featuredMatches = featured || [];
    } catch (e) {
        console.error("Sidebar data fetch error:", e);
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

    const countriesByRegion = allCountries.reduce((acc: any, country: any) => {
        const regionObj = country.regions || country.region;
        const regionName = regionObj?.name || "Other";
        if (!acc[regionName]) acc[regionName] = [];
        acc[regionName].push(country);
        return acc;
    }, {});

    const regionOrder = ["Europe", "South America", "World", "Africa", "Asia", "North & Central America", "Australia & Oceania"];

    const schemaMatch = {
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        date: match.match_date?.split('T')[0],
        leagueName: match.league || "Global Football Match",
        prediction: match.prediction,
        odds: match.odds,
        stadium: match.venue || "Global Stadium",
        description: match.analysis || "Live match analysis and expert betting tips."
    };

    const breadcrumbItems = [
        { name: "Home", item: "https://richpredict.com" },
        { name: "Predictions", item: "https://richpredict.com/predictions" },
        { name: `${match.home_team} vs ${match.away_team}`, item: `https://richpredict.com/predictions/${slug}` }
    ];

    const sportsSchema = generateSportsEventSchema(schemaMatch);
    const predictionSchema = generatePredictionSchema(schemaMatch);
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    const getLogo = (name: string) => getTeamLogo(name, dbLogoMap);

    return (
        <div className="min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(predictionSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <TitleSetter title={`${match.home_team} vs ${match.away_team} Predictions`} />

            <div className="bg-[#001e28] border-b border-white/5 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="max-w-[1240px] mx-auto w-full px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                    <div className="flex gap-4 items-center">
                        <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-[var(--fs-yellow)] transition-colors">
                            <ChevronLeft size={14} /> Back to Fixtures
                        </Link>
                        <div className="h-3 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-white/20">Predictions</span>
                            <span className="text-white/10">/</span>
                            <span className="text-white/80 truncate max-w-[100px] md:max-w-none">{match.league}</span>
                            <span className="text-white/10">/</span>
                            <span className="text-[var(--fs-yellow)]">{match.home_team} vs {match.away_team}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1240px] mx-auto w-full px-2 py-6 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-6">
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
                    <div className="pt-4 text-[9px] font-black text-white/50 uppercase tracking-wider px-2 border-t border-white/5 mt-2 font-mono">Countries</div>
                    <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                </aside>

                <div className="space-y-6">
                    <InnerAdBanner />

                    <div className="rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                        <div className="bg-[#0b242e]/80 backdrop-blur-xl px-6 py-3 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {match.leagues?.countries?.code ? (
                                    <Flag
                                        code={match.leagues.countries.code}
                                        className="w-[18px] h-[12px] rounded-[1px] shadow-sm flex-shrink-0"
                                    />
                                ) : match.leagues?.countries?.flag_url && (
                                    <img
                                        src={match.leagues.countries.flag_url}
                                        alt=""
                                        className="w-[18px] h-[12px] object-cover rounded-[1px] flex-shrink-0"
                                    />
                                )}
                                <div className="text-[11px] font-bold text-white tracking-tight leading-none drop-shadow-md flex items-center">
                                    {match.leagues?.countries?.name && (
                                        <span className="text-white/40 font-black uppercase text-[10px] mr-1.5">{match.leagues.countries.name}:</span>
                                    )}
                                    {match.league}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#001e28] p-4 md:py-10 md:px-12 relative overflow-hidden flex flex-col items-center">
                            {/* Premium Intelligence Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                            {/* Soft Corner Glows */}
                            <div className="absolute top-0 left-0 w-80 h-80 bg-[var(--fs-yellow)]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

                            <div className="max-w-4xl w-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 relative z-10">
                                {/* Home Team */}
                                <div className="flex flex-col items-center text-center space-y-2 md:space-y-4 flex-1 min-w-0">
                                    <div className="relative">
                                        <img src={getLogo(match.home_team)} alt={match.home_team} className="w-10 h-10 sm:w-16 sm:h-16 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-2xl" referrerPolicy="no-referrer" />
                                    </div>
                                    <h2 className="text-[9px] sm:text-xs md:text-xl font-black uppercase text-white tracking-tighter leading-none font-outfit truncate w-full px-1">{match.home_team}</h2>
                                </div>

                                {/* Center Signal Cluster */}
                                <div className="flex flex-col items-center justify-center space-y-3 md:space-y-6 flex-shrink-0">
                                    {/* Consolidated Date & Time */}
                                    <div className="flex items-center gap-1.5 md:gap-3 bg-white/5 border border-white/5 px-2 md:px-4 py-1 md:py-1.5 rounded-full">
                                        <div className="flex items-center gap-1 md:gap-1.5">
                                            <Calendar size={8} className="text-[var(--fs-yellow)] md:w-2.5 md:h-2.5" />
                                            <span className="text-[7px] md:text-[9px] font-black text-white/60 font-mono">{match.match_date?.split('T')[0]}</span>
                                        </div>
                                        <div className="w-[1px] h-2 md:h-3 bg-white/10" />
                                        <div className="flex items-center gap-1 md:gap-1.5">
                                            <Clock size={8} className="text-[var(--fs-yellow)] md:w-2.5 md:h-2.5" />
                                            <span className="text-[7px] md:text-[9px] font-black text-white/60 font-mono">{match.match_time || "21:00"}</span>
                                        </div>
                                    </div>

                                    {/* Refined Prediction Chip */}
                                    <div className="relative max-w-[100px] sm:max-w-[150px] md:max-w-[200px] w-full">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--fs-yellow)]/10 to-cyan-500/10 rounded-lg md:rounded-xl opacity-50" />
                                        <div className="relative bg-[#0b242e] border border-white/10 p-1.5 md:p-4 rounded-lg md:rounded-xl flex flex-col items-center gap-1 md:gap-3 shadow-2xl overflow-hidden">
                                            <div className="absolute top-0 right-0 text-[10px] md:text-[18px] font-black text-white/5 -mr-1 -mt-1 md:-mr-2 md:-mt-2 italic select-none">AI</div>

                                            <div className="flex items-center gap-1 md:gap-2">
                                                <div className="size-3 md:size-6 bg-[var(--fs-yellow)] rounded md:rounded-lg flex items-center justify-center">
                                                    <Zap size={8} className="text-black fill-black md:w-3 md:h-3" />
                                                </div>
                                                <span className="text-[8px] sm:text-xs md:text-base font-black text-white uppercase tracking-tight whitespace-nowrap">{match.prediction}</span>
                                            </div>

                                            <div className="w-full space-y-0.5 md:space-y-1 hidden sm:block">
                                                <div className="flex justify-between items-center text-[6px] md:text-[8px] font-black text-white/40 uppercase">
                                                    <span>Signal</span>
                                                    <span className="text-[var(--fs-yellow)]">{match.confidence || "82%"}</span>
                                                </div>
                                                <div className="h-0.5 md:h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[var(--fs-yellow)] to-amber-400"
                                                        style={{ width: match.confidence || '82%' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs md:text-4xl font-black italic text-white/[0.03] font-outfit select-none pointer-events-none">VS</div>
                                </div>

                                {/* Away Team */}
                                <div className="flex flex-col items-center text-center space-y-2 md:space-y-4 flex-1 min-w-0">
                                    <div className="relative">
                                        <img src={getLogo(match.away_team)} alt={match.away_team} className="w-10 h-10 sm:w-16 sm:h-16 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-2xl" referrerPolicy="no-referrer" />
                                    </div>
                                    <h2 className="text-[9px] sm:text-xs md:text-xl font-black uppercase text-white tracking-tighter leading-none font-outfit truncate w-full px-1">{match.away_team}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <MatchPreview content={match.analysis} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-6 space-y-6 relative overflow-hidden">
                            {/* Inner Overlay Glow */}
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
                            {/* Inner Overlay Glow */}
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
                    <FeaturedMatches matches={featuredMatches} dbLogoMap={dbLogoMap} />
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
                                    Professional Intent
                                </div>
                            </div>
                            <button className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2">
                                UNLOCK ACCESS <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Zap className="w-3 h-3 text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" /> Signal_Probability
                        </h3>
                        {recentPredictions.slice(0, 3).map((p, i) => (
                            <div key={i} className="space-y-1.5 px-1">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                                    <span className="text-white/60 truncate max-w-[140px]">{p.home_team}</span>
                                    <span className="text-[var(--fs-yellow)] font-bold">{p.confidence || '74%'}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--fs-yellow)]" style={{ width: p.confidence || '74%' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/5 bg-black group relative">
                        <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em] text-center py-1 bg-white/5">ADVERTISEMENT</div>
                        <a href="https://med.etoro.com/B13679_A121771_TClick_.aspx" target="_blank" rel="nofollow">
                            <img src="/images/Evergreen_Crypto_04-22_V1_300x600_ES_ASIC.gif" alt="eToro" className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </aside>
            </main>
        </div>
    );
}
