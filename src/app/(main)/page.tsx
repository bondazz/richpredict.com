export const revalidate = 0;
import Link from "next/link";
import { Zap, Trophy, Loader2, Star, ArrowRight, ChevronDown } from "lucide-react";
import { cn, generateSEOSlug } from "@/lib/utils";
import { getPredictions, getRegions, getPinnedLeagues, getCountriesByRegion, getPremiumPredictionsCount, Prediction } from "@/lib/supabase";

import { AIPredictTrust } from "@/components/AIPredictTrust";
import { Testimonials } from "@/components/Testimonials";

import SidebarCountries from "@/components/SidebarCountries";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import TopTicker from "@/components/layout/TopTicker";
import PremiumLockedMatches from "@/components/predictions/PremiumLockedMatches";

export default async function Home() {
    let predictions: Prediction[] = [];
    let regions: any[] = [];
    let pinnedLeagues: any[] = [];
    let allCountries: any[] = [];
    let premiumCount = 0;
    let debugError: string | null = null;

    try {
        const [preds, regs, pinned, countries, pCount] = await Promise.all([
            getPredictions(50, 'Football'),
            getRegions(),
            getPinnedLeagues(),
            getCountriesByRegion(),
            getPremiumPredictionsCount('Football')
        ]);
        predictions = preds || [];
        regions = regs || [];
        pinnedLeagues = pinned || [];
        allCountries = countries || [];
        premiumCount = pCount || 0;
    } catch (e: any) {
        console.error("Supabase connection error:", e);
        debugError = e.message;
    }

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
        <div className="flex flex-col min-h-screen bg-[var(--fs-bg)] text-[var(--fs-text-main)] font-sans">
            {/* Premium Animated Global Ticker */}
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
                    {/* High-Performance Premium Inner Ad Banner */}
                    <InnerAdBanner />

                    <PremiumLockedMatches sport="FOOTBALL" count={premiumCount} />

                    {displayLeagues.length > 0 ? displayLeagues.map((league: any) => (
                        <div key={league.id} className="sportName soccer overflow-hidden rounded-sm border border-white/5 shadow-2xl">
                            <div className="headerLeague__wrapper bg-[var(--fs-header)]">
                                <div className="wcl-header_HrElx py-2 px-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Star size={14} className="text-[var(--fs-text-dim)] hover:text-[var(--fs-yellow)] cursor-pointer" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-[var(--fs-text-dim)] uppercase leading-none mb-0.5">{league.category || "FOOTBALL"}</span>
                                            <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none">{league.name}</span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-[var(--fs-text-dim)] uppercase hover:text-white cursor-pointer">Standings</span>
                                </div>
                            </div>

                            <div className="event__content bg-[var(--fs-header)] divide-y divide-white/5">
                                {league.matches.map((match: Prediction) => (
                                    <div key={match.id} className="event__match group flex items-center h-12 hover:bg-white/[0.03] transition-colors relative">
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

                                        <Link href={`/predictions/${generateSEOSlug(match.home_team, match.away_team, match.slug)}`} className="px-2 sm:px-3 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight size={12} className="text-[var(--fs-yellow)]" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
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
