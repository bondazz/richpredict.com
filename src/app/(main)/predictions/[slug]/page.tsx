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
import { getPredictionBySlug, getPinnedLeagues, getCountriesByRegion, getPredictions } from "@/lib/supabase";
import SidebarCountries from "@/components/SidebarCountries";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import MatchPreview from "@/components/predictions/MatchPreview";
import SEOContent from "@/components/predictions/SEOContent";
import GlobalBettingChart from "@/components/predictions/GlobalBettingChart";
import TitleSetter from "@/components/layout/TitleSetter";
import { cn, generateSEOSlug } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const match = await getPredictionBySlug(slug);
    if (!match) return { title: "Match Not Found" };

    // H1 and SEO Title must end with 'Predictions' as requested
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
            canonical: `https://richpredict.com/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`,
        },
    };
}

export default async function PredictionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const match = await getPredictionBySlug(slug);

    if (!match) {
        notFound();
    }

    // Custom human-like preview for the big derby
    if (match.home_team === "Manchester United" && match.away_team === "Liverpool") {
        match.analysis = "Let’s be real, when Manchester United and Liverpool face off, you can throw the form book right out the window. This isn't just another game on the calendar; it’s a collision of history, pride, and the biggest rivalry in English football. The atmosphere at Old Trafford is always electric, but there's a special kind of tension in the air when the Scousers come to town.\n\nUnited might have been a bit of a roller coaster lately, but at home, they’ve got this uncanny ability to turn into a completely different beast—especially in these high-stakes derbies. They play like a wounded lion, dangerous and unpredictable. On the flip side, Liverpool’s front line has been looking sharp, operating with that surgical precision we’ve come to expect. But this is the kind of game where tactics often take a backseat to pure grit and determination.\n\nEveryone is bracing for a goal-fest, and given the attacking firepower on both sides, it’s hard to imagine a quiet 0-0. This won't be a cagey game of chess; expect it to feel more like a heavyweight boxing match with both teams trading blows from the first whistle. My gut tells me neither side is going to back down, and we’ll be on the edge of our seats until the very last second. \n\nBottom line: grab your popcorn, because this is going to be an absolute thriller!";
    }

    // Fetch Sidebar Data
    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let recentPredictions: any[] = [];

    try {
        const [pinned, countries, recents] = await Promise.all([
            getPinnedLeagues(),
            getCountriesByRegion(),
            getPredictions(5)
        ]);
        pinnedLeagues = pinned || [];
        allCountries = countries || [];
        recentPredictions = recents || [];
    } catch (e) {
        console.error("Sidebar data fetch error:", e);
    }

    const countriesByRegion = allCountries.reduce((acc: any, country: any) => {
        const regionObj = country.regions || country.region;
        const regionName = regionObj?.name || "Other";
        if (!acc[regionName]) acc[regionName] = [];
        acc[regionName].push(country);
        return acc;
    }, {});

    const regionOrder = ["Europe", "South America", "World", "Africa", "Asia", "North & Central America", "Australia & Oceania"];

    // Schema Logic (Google Bot friendly)
    const schemaMatch = {
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        date: match.match_date?.split('T')[0],
        time: match.match_time || "21:00",
        prediction: { type: match.prediction, probability: 75 }
    };

    const breadcrumbItems = [
        { name: "Home", item: "https://richpredict.com" },
        { name: "Predictions", item: "https://richpredict.com/predictions" },
        { name: match.league || "Leagues", item: "https://richpredict.com/predictions" },
        { name: `${match.home_team} vs ${match.away_team} Predictions`, item: `https://richpredict.com/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}` }
    ];

    const sportsSchema = generateSportsEventSchema(schemaMatch);
    const predictionSchema = generatePredictionSchema(schemaMatch);
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    const getLogo = (name: string) => {
        const logoMap: Record<string, string> = {
            'Real Madrid': 'https://static.flashscore.com/res/image/data/W8mj7MDD.png',
            'Barcelona': 'https://static.flashscore.com/res/image/data/nVtr6hT-GEKimEim.png',
            'Arsenal': 'https://static.flashscore.com/res/image/data/ttVtr6hT-GEKimEim.png',
            'Manchester City': 'https://static.flashscore.com/res/image/data/0GPhnpne-ttfpEDUq.png',
            'Inter': 'https://static.flashscore.com/res/image/data/WOOHTbSq-KtCfnbWp.png',
            'Juventus': 'https://static.flashscore.com/res/image/data/4pxypIS0-hpmw8K1h.png',
            'Liverpool': 'https://static.flashscore.com/res/image/data/Gr0cGteM-KCp4zq5F.png',
            'Manchester United': 'https://static.flashscore.com/res/image/data/nwSRlyWg-h2pPXz3k.png',
            'Bayern Munich': 'https://static.flashscore.com/res/image/data/xSfDCO76-WrjrBuU2.png',
            'Dortmund': 'https://static.flashscore.com/res/image/data/nP1i5US1.png'
        };
        return logoMap[name] || `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=001e28&textColor=ffe438`;
    };

    return (
        <div className="min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(predictionSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <TitleSetter title={`${match.home_team} vs ${match.away_team} Predictions`} />

            {/* Sub-Header Area: BACK TO FIXTURES / BREADCRUMBS */}
            <div className="bg-[#001e28] border-b border-white/5 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="max-w-[1240px] mx-auto w-full px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                    <div className="flex gap-4 items-center">
                        <Link href="/" className="text-[var(--fs-yellow)] flex items-center gap-1 hover:opacity-80 transition-opacity">
                            <ChevronLeft size={14} /> BACK TO FIXTURES
                        </Link>
                        <span className="opacity-20">/</span>
                        <Link href="/predictions" className="opacity-40 hover:opacity-100 transition-opacity">
                            {match.league || "PREMIER LEAGUE"}
                        </Link>
                        <span className="opacity-20">/</span>
                        <span className="text-white/80">{match.home_team} vs {match.away_team} match predict</span>
                    </div>
                    <div className="flex gap-4 items-center opacity-40">
                        <Star size={14} className="cursor-pointer hover:text-[var(--fs-yellow)] transition-colors" />
                        <Share2 size={14} className="cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            <main className="max-w-[1240px] mx-auto w-full px-2 py-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-4">

                {/* LEFT SIDEBAR */}
                <aside className="hidden lg:flex flex-col space-y-1 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-hide">
                    <div className="text-[9px] font-black text-white/50 uppercase tracking-wider px-2 mb-1">Pinned Leagues</div>
                    {pinnedLeagues.map((league: any, i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded transition-all cursor-pointer group hover:bg-white/5 text-white/80">
                            <span className="text-[10px] font-extrabold uppercase truncate group-hover:text-white">{league.name}</span>
                        </div>
                    ))}
                    <div className="pt-4 text-[9px] font-black text-white/50 uppercase tracking-wider px-2 border-t border-white/5 mt-2">Countries</div>
                    <SidebarCountries countriesByRegion={countriesByRegion} regionOrder={regionOrder} />
                </aside>

                {/* MAIN CONTENT */}
                <div className="space-y-4 min-w-0">
                    <InnerAdBanner />

                    {/* Match Result Display */}
                    <div className="bg-[var(--fs-header)] rounded-sm border border-white/5 overflow-hidden shadow-2xl relative">
                        <div className="bg-black/20 border-b border-white/5 px-4 py-2 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                                <Trophy size={10} className="text-[var(--fs-yellow)]" />
                                {match.league}
                            </div>
                            <div className="text-[8px] font-black text-[var(--fs-yellow)] uppercase tracking-[0.2em] bg-[var(--fs-yellow)]/5 px-2 py-0.5 rounded-sm">
                                NODE_STABLE
                            </div>
                        </div>

                        <div className="p-6 md:p-10 relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[120%] bg-gradient-to-r from-transparent via-[var(--fs-yellow)]/5 to-transparent -rotate-12 pointer-events-none" />

                            <div className="grid grid-cols-3 items-center relative z-10">
                                <div className="flex flex-col items-center text-center space-y-5">
                                    <div className="relative group">
                                        <div className="absolute -inset-2 bg-gradient-to-b from-[var(--fs-yellow)]/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src={getLogo(match.home_team)} alt={match.home_team} className="w-16 h-16 md:w-28 md:h-28 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-[10px] md:text-lg font-black uppercase text-white tracking-widest leading-none font-outfit">{match.home_team}</h2>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] font-mono whitespace-nowrap">
                                        DATAGRAM: {match.match_date?.split('T')[0]}
                                    </div>

                                    <div className="text-3xl md:text-5xl font-black italic text-white/5 font-outfit select-none leading-none tracking-tighter">VS</div>

                                    {/* THE MATCH SIGNAL BLOCK */}
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative">
                                            {/* Subtle stationary glow */}
                                            <div className="absolute -inset-4 bg-[var(--fs-yellow)]/5 rounded-full blur-2xl pointer-events-none" />

                                            <div className="bg-[#001e28]/60 backdrop-blur-md border border-white/5 px-6 py-3 rounded-sm flex flex-col items-center gap-1.5 relative z-10 min-w-[150px] shadow-2xl">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center justify-center size-5 bg-[var(--fs-yellow)]/10 rounded-full">
                                                        <Zap size={10} className="text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" />
                                                    </div>
                                                    <span className="text-[11px] md:text-sm font-black text-white uppercase tracking-wider">{match.prediction}</span>
                                                </div>

                                                <div className="flex items-center gap-3 w-full mt-1.5">
                                                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[var(--fs-yellow)] shadow-[0_0_10px_rgba(255,228,56,0.5)]"
                                                            style={{ width: match.confidence || '82%' }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-[var(--fs-yellow)] font-mono">{match.confidence || "82%"}</span>
                                                </div>

                                                <div className="text-[7px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1 border-t border-white/5 w-full pt-1.5 text-center">
                                                    AI_QUANTUM_SIGNAL
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 px-3 py-1 rounded-sm border border-white/5">
                                            <span className="text-[9px] font-bold text-white/40 font-mono tracking-[0.2em]">{match.match_time || "21:00"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center text-center space-y-5">
                                    <div className="relative group">
                                        <div className="absolute -inset-2 bg-gradient-to-b from-[var(--fs-yellow)]/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src={getLogo(match.away_team)} alt={match.away_team} className="w-16 h-16 md:w-28 md:h-28 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-[10px] md:text-lg font-black uppercase text-white tracking-widest leading-none font-outfit">{match.away_team}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EXPANDABLE PREVIEW MODULE */}
                    <MatchPreview content={match.analysis} />

                    {/* STATS MODULES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-6 space-y-6 relative overflow-hidden">
                            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white">
                                <Zap className="w-4 h-4 text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" /> Probability Matrix
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-white/30 italic">Signal Confidence</span>
                                    <span className="text-3xl font-black text-[var(--fs-yellow)] font-mono">75.4%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden flex gap-1">
                                    <div className="h-full bg-[var(--fs-yellow)]" style={{ width: '45%' }} />
                                    <div className="h-full bg-white/10" style={{ width: '25%' }} />
                                    <div className="h-full bg-[var(--fs-yellow)] opacity-40" style={{ width: '30%' }} />
                                </div>
                                <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                                    <span>Home (45%)</span>
                                    <span>Neutral (25%)</span>
                                    <span>Away (30%)</span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-6 grid grid-cols-2 gap-3">
                            {[
                                { label: 'Attacking_Index', val: '8.4', icon: TrendingUp },
                                { label: 'Defense_Node', val: '6.9', icon: ShieldCheck },
                                { label: 'Market_Delta', val: 'High', icon: Activity },
                                { label: 'Accuracy_Bias', val: 'Verify', icon: Target },
                            ].map((m, i) => (
                                <div key={i} className="bg-black/20 p-4 rounded-sm border border-white/5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-[var(--fs-yellow)]/30 transition-all">
                                    <m.icon size={16} className="text-[var(--fs-yellow)]" />
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-black uppercase text-white/20 whitespace-nowrap">{m.label}</p>
                                        <p className="text-sm font-black text-white">{m.val}</p>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>

                    {/* GLOBAL BETTING VOLUME CHART */}
                    <GlobalBettingChart match={match} />

                    {/* AUTO-GENERATED SEO CONTENT SECTION */}
                    <SEOContent match={match} />
                </div>

                {/* RIGHT SIDEBAR */}
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
