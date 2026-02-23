import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import SidebarAd from "@/components/Ads/SidebarAd";
import { supabase, BlogPost, Prediction, getPredictions, getBlogPosts } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Latest Sports News & AI Football Predictions | RICHPREDICT",
    description: "Stay ahead with RICHPREDICT Latest Sports News. Expert analysis and high-accuracy football predictions.",
};

export default async function NewsPage() {
    // Fetch news and predictions for right sidebar
    const [news, predictions] = await Promise.all([
        getBlogPosts(20),
        getPredictions(10, 'Football')
    ]);

    const topNews = news[0];
    const subTopNews = news.slice(1, 4);
    const mostRead = news.slice(4, 9);
    const moreNews = news.slice(9, 20);

    return (
        <div className="flex flex-col min-h-screen bg-[#00141e] text-white font-sans">
            {/* News Category Bar - Alignment match with 1240px container */}
            <div className="bg-[#0b1f27] border-b border-white/5 py-3 overflow-x-auto scrollbar-hide">
                <div className="max-w-[1240px] mx-auto w-full px-2 flex items-center gap-6 min-w-max">
                    {['ALL', 'FOOTBALL', 'PREMIER LEAGUE', 'CHAMPIONS LEAGUE', 'TENNIS', 'FEATURES', 'EUROPA LEAGUE', 'CONFERENCE LEAGUE'].map((cat, i) => (
                        <Link
                            key={cat}
                            href={`/news?cat=${cat}`}
                            className={cn(
                                "text-[11px] font-bold uppercase tracking-tight transition-all pb-1 border-b-2",
                                i === 0 ? "text-white border-red-500" : "text-white/60 border-transparent hover:text-white"
                            )}
                        >
                            {cat}
                        </Link>
                    ))}
                    <span className="text-white/40 text-[11px] font-bold cursor-pointer hover:text-white flex items-center gap-1">MORE <span className="text-[8px] opacity-50">▼</span></span>
                </div>
            </div>

            {/* Main Content Grid - 2 Column Layout (Main + Right Sidebar) */}
            <main className="max-w-[1240px] mx-auto w-full px-2 py-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">

                {/* Center Content Area */}
                <div className="space-y-8">
                    <section className="bg-[#051a24] rounded-xl overflow-hidden shadow-2xl p-6">
                        <h2 className="text-lg font-bold mb-6 text-white/90">Top News</h2>

                        {topNews ? (
                            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 mb-10 group cursor-pointer">
                                <Link href={`/news/${topNews.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black">
                                    <img
                                        src={topNews.image_url}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt={topNews.title}
                                    />
                                </Link>
                                <div className="flex flex-col justify-center">
                                    <Link href={`/news/${topNews.slug}`}>
                                        <h2 className="text-xl md:text-3xl font-black leading-[1.1] group-hover:text-white transition-colors uppercase">
                                            {topNews.title}
                                        </h2>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center italic text-white/20">No news available.</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subTopNews.map((item) => (
                                <Link key={item.id} href={`/news/${item.slug}`} className="group space-y-3">
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black border border-white/5">
                                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                        <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black/80 to-transparent">
                                            <div className="text-[8px] font-black text-white/60 uppercase tracking-widest flex flex-col font-sans">
                                                <span className="text-red-500 leading-none mb-1">FOOTBALL</span>
                                                <span className="leading-none">TRACKER</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-[13px] font-bold leading-tight group-hover:text-white transition-colors">
                                        {item.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <InnerAdBanner />

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-5 bg-red-500 rounded-full" />
                            <h2 className="text-lg font-bold uppercase tracking-tight">More Stories</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {moreNews.map((item) => (
                                <Link key={item.id} href={`/news/${item.slug}`} className="flex gap-4 group cursor-pointer bg-[#051a24] p-3 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-all">
                                    <div className="w-[140px] h-[85px] shrink-0 overflow-hidden rounded-lg relative">
                                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-sans" alt="" />
                                    </div>
                                    <div className="flex flex-col justify-center space-y-1">
                                        <h3 className="text-[14px] font-bold leading-tight group-hover:text-red-500 transition-colors line-clamp-2 italic">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest font-sans">
                                            <span className="text-red-500/60">{item.category || 'FOOTBALL'}</span>
                                            <span>•</span>
                                            <span>{new Date(item.published_at!).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Sidebar - EXACTLY like Home Page */}
                <aside className="hidden lg:flex flex-col space-y-6">
                    {/* VIP PREMIUM CARD - 1:1 Home Match */}
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
                            <p className="text-[11px] font-bold text-white/50 leading-relaxed font-sans">
                                Get 95%+ accurate AI predictions and exclusive analytics.
                            </p>
                            <button className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2">
                                UNLOCK ACCESS <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    <SidebarAd />

                    {/* Most Read Sidebar List - RESTORED from screenshot */}
                    <div className="space-y-6 bg-[#051a24] p-5 rounded-xl border border-white/5 shadow-xl">
                        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2">
                            <Zap size={14} className="text-red-500 fill-red-500" /> Most Read
                        </h3>
                        <div className="space-y-6">
                            {mostRead.map((item, i) => (
                                <Link key={item.id} href={`/news/${item.slug}`} className="flex gap-3 group items-start border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                    <div className="w-[100px] h-[60px] shrink-0 overflow-hidden rounded-lg bg-black">
                                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 font-sans" alt="" />
                                    </div>
                                    <h4 className="text-[12px] font-black leading-tight group-hover:underline group-hover:text-white transition-all text-white/70 italic line-clamp-3">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Signal_Probability Section - 1:1 Home Match */}
                    <div className="space-y-4 px-1">
                        <h3 className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 italic font-sans px-2">
                            <Zap className="w-3 h-3 text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" /> Signal_Probability
                        </h3>
                        <div className="bg-[#051a24]/40 p-3 rounded-xl border border-white/5 space-y-4">
                            {predictions.slice(0, 5).map((p, i) => (
                                <div key={i} className="space-y-1.5 px-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase text-white/60 truncate max-w-[120px] font-sans">{p.home_team}</span>
                                        <span className="text-[var(--fs-yellow)] font-bold font-mono text-[10px]">{p.confidence || '74%'}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[var(--fs-yellow)] shadow-[0_0_8px_rgba(255,228,56,0.3)]" style={{ width: p.confidence || '74%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
