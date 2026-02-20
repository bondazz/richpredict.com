import { Metadata } from "next";
import Link from "next/link";
import { Zap, Clock, ArrowRight, Share2, MessageSquare, Newspaper, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";

export const metadata: Metadata = {
    title: "Sports News, Football Predictions & Transfer Rumours | RICHPREDICT",
    description: "Stay ahead with RICHPREDICT Latest Sports News. Get exclusive football predictions, transfer rumours, match highlights, live scores, and AI-driven betting analytics.",
    keywords: "sports news, football predictions, transfer rumours, match highlights, betting intelligence, RICHPREDICT news, live scores, football analysis",
    openGraph: {
        title: "Latest Sports News & AI Football Predictions | RICHPREDICT",
        description: "Breaking sports news, expert analysis, and high-accuracy football predictions. Your daily source for match intelligence.",
        url: "https://richpredict.com/news",
        siteName: "RICHPREDICT",
        images: [
            {
                url: "https://richpredict.com/og-news.jpg",
                width: 1200,
                height: 630,
                alt: "RICHPREDICT Sports News",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "RICHPREDICT | Breaking Sports News & Predictions",
        description: "Get the latest football news, transfer updates, and pro betting insights with RICHPREDICT AI.",
        images: ["https://richpredict.com/og-news.jpg"],
    },
    alternates: {
        canonical: "https://richpredict.com/news",
    },
};

const NEWS_SECTIONS = {
    top: {
        title: "Top News",
        featured: {
            title: "Hogh the hero as Bodo/Glimt claim famous win & put Inter on brink of Champions League exit",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
            category: "FOOTBALL"
        },
        items: [
            { title: "Mikel Arteta demands more from his Arsenal side after unexpected draw at Wolves", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=500&auto=format&fit=crop" },
            { title: "AC Milan draw with Como and miss chance to revive Serie A title fight", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500&auto=format&fit=crop" },
            { title: "Carlos Alcaraz moves into the last eight in Doha after second-set comeback against Royer", image: "https://images.unsplash.com/photo-1595435064212-36263f373cf5?q=80&w=500&auto=format&fit=crop" }
        ]
    },
    ucl: {
        title: "UEFA Champions League",
        link: "More UCL News",
        featured: {
            title: "Club Brugge and Atletico Madrid draw six-goal thriller in Champions League",
            image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000&auto=format&fit=crop"
        },
        items: [
            { title: "Schick fires Bayer Leverkusen to first-leg victory over Olympiakos", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=500&auto=format&fit=crop" },
            { title: "Gordon nets four as Newcastle maul Qarabag in Champions League play-off", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=500&auto=format&fit=crop" },
            { title: "Gianni Infantino 'shocked and saddened' by alleged racism directed at Vinicius Junior", image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=500&auto=format&fit=crop" }
        ]
    },
    more: [
        { title: "Matildas coach Montemurro promises 'exciting' and 'proactive' football", time: "45 min ago", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400&auto=format&fit=crop" },
        { title: "Socceroos defender Miller to miss World Cup", time: "1 h ago", image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=400&auto=format&fit=crop" },
        { title: "Ruben Love to miss more than a month of Super Rugby with injury", time: "2 h ago", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop" },
        { title: "Kansas City Chiefs star Rashee Rice accused of assaulting girlfriend", time: "2 h ago", image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=400&auto=format&fit=crop" }
    ]
};

export default function NewsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsMediaOrganization",
                        "name": "RICHPREDICT",
                        "url": "https://richpredict.com/news",
                        "logo": "https://richpredict.com/icon.svg",
                        "description": "Daily sports news, football predictions, and advanced betting analytics.",
                        "sameAs": [
                            "https://twitter.com/richpredict",
                            "https://facebook.com/richpredict"
                        ],
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Digital",
                            "addressCountry": "Global"
                        }
                    })
                }}
            />

            <div className="flex flex-col min-h-screen bg-[#00141e] text-white font-sans">
                <div className="bg-[#001e28] border-b border-white/5 py-3 overflow-x-auto scrollbar-hide">
                    <div className="max-w-[1240px] mx-auto w-full px-4 flex gap-8 text-[11px] font-black uppercase tracking-wider">
                        <span className="text-[var(--fs-yellow)] cursor-pointer">Top News</span>
                        <span className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">Football</span>
                        <span className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">Basketball</span>
                        <span className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">Tennis</span>
                        <span className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity">Motorsport</span>
                    </div>
                </div>

                <main className="max-w-[1240px] mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
                    <div className="space-y-12 min-w-0">
                        <section className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[var(--fs-yellow)] rounded-full" />
                                <h2 className="text-lg font-black text-white uppercase">{NEWS_SECTIONS.top.title}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer">
                                <div className="relative overflow-hidden rounded-lg aspect-[16/10] shrink-0">
                                    <img src={NEWS_SECTIONS.top.featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-xl md:text-2xl font-black leading-tight group-hover:text-[var(--fs-yellow)] transition-colors">
                                        {NEWS_SECTIONS.top.featured.title}
                                    </h3>
                                    <div className="mt-3 flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                        <span>{NEWS_SECTIONS.top.featured.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                        <span>2 hours ago</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {NEWS_SECTIONS.top.items.map((item, i) => (
                                    <div key={i} className="space-y-3 group cursor-pointer">
                                        <div className="aspect-[16/10] overflow-hidden rounded-lg relative">
                                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <h4 className="text-[13px] font-bold leading-snug group-hover:text-[var(--fs-yellow)] transition-colors line-clamp-2">
                                            {item.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-5 bg-[var(--fs-yellow)] rounded-full" />
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight">{NEWS_SECTIONS.ucl.title}</h2>
                                </div>
                                <Link href="/news" className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors flex items-center gap-1 group">
                                    {NEWS_SECTIONS.ucl.link} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer">
                                <div className="relative overflow-hidden rounded-lg aspect-[16/10] shrink-0">
                                    <img src={NEWS_SECTIONS.ucl.featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-xl md:text-2xl font-black leading-tight group-hover:text-[var(--fs-yellow)] transition-colors">
                                        {NEWS_SECTIONS.ucl.featured.title}
                                    </h3>
                                    <div className="mt-3 flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                        <span>Article</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                        <span>1 hour ago</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {NEWS_SECTIONS.ucl.items.map((item, i) => (
                                    <div key={i} className="space-y-3 group cursor-pointer">
                                        <div className="aspect-[16/10] overflow-hidden rounded-lg relative">
                                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <h4 className="text-[13px] font-bold leading-snug group-hover:text-[var(--fs-yellow)] transition-colors line-clamp-2">
                                            {item.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6 pt-12 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[var(--fs-yellow)] rounded-full" />
                                <h2 className="text-lg font-black text-white uppercase tracking-tight">More Stories</h2>
                            </div>
                            <div className="space-y-6">
                                {NEWS_SECTIONS.more.map((item, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer bg-white/[0.02] p-3 rounded-lg border border-white/5 hover:bg-white/[0.04] transition-all">
                                        <div className="w-[120px] h-[75px] sm:w-[180px] sm:h-[110px] shrink-0 overflow-hidden rounded-lg relative">
                                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <div className="flex flex-col justify-center space-y-2">
                                            <h3 className="text-sm md:text-base font-black leading-tight group-hover:text-[var(--fs-yellow)] transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{item.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-8">
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
                                <p className="text-[11px] font-bold text-white/50 leading-relaxed max-w-[200px]">
                                    Get 95%+ accurate AI-driven football predictions and exclusive pro analytics.
                                </p>
                                <div className="w-full space-y-2 py-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                                        <div className="w-1 h-1 rounded-full bg-[var(--fs-yellow)]" />
                                        <span>Daily 5+ Odds VIP Slips</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                                        <div className="w-1 h-1 rounded-full bg-[var(--fs-yellow)]" />
                                        <span>No-Ads Experience</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                                        <div className="w-1 h-1 rounded-full bg-[var(--fs-yellow)]" />
                                        <span>Live Instant Telegram Alerts</span>
                                    </div>
                                </div>
                                <button className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2">
                                    UNLOCK ACCESS <ArrowRight size={14} />
                                </button>
                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Starting from $9.99/mo</span>
                            </div>
                        </div>

                        <div className="rounded-xl overflow-hidden border border-white/5 bg-[#000000] group">
                            <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em] text-center py-1 bg-white/5">ADVERTISEMENT</div>
                            <a href="https://med.etoro.com/B13679_A121771_TClick_.aspx" target="_blank" rel="nofollow" className="block transition-opacity hover:opacity-95">
                                <img src="/images/Evergreen_Crypto_04-22_V1_300x600_ES_ASIC.gif" alt="eToro Advertisement" className="w-full h-auto" />
                            </a>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1 italic">Social_Trending</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex gap-3 group cursor-pointer hover:translate-x-1 transition-transform">
                                        <span className="text-xl font-black text-white/10 group-hover:text-[var(--fs-yellow)]/30">#0{i + 1}</span>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors leading-tight">
                                                Transfer Market: Next big move as clubs eye summer targets.
                                            </p>
                                            <span className="text-[8px] font-bold text-white/20 uppercase">Match Intelligence</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </>
    );
}
