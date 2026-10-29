import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Crown, ShieldCheck, Zap, BarChart3, CheckCircle2, ArrowRight, Trophy } from 'lucide-react';
import { getPredictions } from '@/lib/supabase';
import { generateSEOSlug } from '@/lib/utils';

export const revalidate = 300;

export const metadata: Metadata = {
    title: 'VIP Premium Sports Predictions & High-Confidence AI Tips',
    description: 'Access RichPredict VIP Premium sports predictions, institutional-grade xG match models, high-confidence football tips, and real-time market value alerts.',
    alternates: {
        canonical: 'https://richpredict.com/vip',
    },
    openGraph: {
        title: 'VIP Premium Sports Predictions & AI Betting Analytics | RichPredict',
        description: 'Institutional-grade AI football predictions, high-probability VIP picks, and deep statistical match previews.',
        url: 'https://richpredict.com/vip',
        type: 'website',
    },
};

export default async function VipPage() {
    const featuredPredictions = await getPredictions(8, 'Football');

    return (
        <div className="max-w-[1240px] mx-auto px-4 py-10 space-y-10 text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            '@context': 'https://schema.org',
                            '@type': 'WebPage',
                            name: 'VIP Premium Sports Predictions & High-Confidence AI Tips | RichPredict',
                            description: 'Access RichPredict VIP Premium sports predictions, institutional-grade xG match models, and high-confidence football tips.',
                            url: 'https://richpredict.com/vip',
                        },
                        {
                            '@context': 'https://schema.org',
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://richpredict.com' },
                                { '@type': 'ListItem', position: 2, name: 'VIP Premium Predictions', item: 'https://richpredict.com/vip' },
                            ],
                        },
                    ]),
                }}
            />

            {/* Hero Header */}
            <section className="bg-[var(--fs-header)] border border-white/10 rounded-2xl p-8 md:p-12 text-center space-y-4 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--fs-yellow)]/10 border border-[var(--fs-yellow)]/30 text-[var(--fs-yellow)] text-[10px] font-black uppercase tracking-widest">
                    <Crown size={14} /> Institutional Sports Intelligence
                </div>
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                    VIP Premium Sports Predictions &amp; AI Match Analytics
                </h1>
                <p className="text-xs md:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
                    Unlock high-confidence mathematical football predictions powered by our proprietary RP-GPT neural ensemble. We analyze expected goals (xG), tactical matchups, squad availability, and sharp market movements across 160+ global competitions.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/predictions"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--fs-yellow)] text-black text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        Explore Today&apos;s Predictions <ArrowRight size={14} />
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Contact VIP Desk
                    </Link>
                </div>
            </section>

            {/* Analytical Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3">
                    <div className="size-10 rounded-lg bg-[var(--fs-yellow)]/10 text-[var(--fs-yellow)] flex items-center justify-center">
                        <BarChart3 size={20} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-white">
                        Expected Goals (xG) &amp; Poisson Modeling
                    </h2>
                    <p className="text-xs text-white/65 leading-relaxed">
                        Every VIP fixture undergoes 10,000 Monte Carlo match simulations using attack/defense efficiency ratings, shot quality metrics, and home/away tactical adjustments.
                    </p>
                </div>

                <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3">
                    <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <ShieldCheck size={20} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-white">
                        Verified Probability Thresholds
                    </h2>
                    <p className="text-xs text-white/65 leading-relaxed">
                        Only fixtures where our calculated mathematical probability significantly exceeds implied market odds are flagged for VIP high-confidence selection.
                    </p>
                </div>

                <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3">
                    <div className="size-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Zap size={20} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-white">
                        Multi-Sport Coverage
                    </h2>
                    <p className="text-xs text-white/65 leading-relaxed">
                        Full access to daily analytical previews across <Link href="/football" className="text-[var(--fs-yellow)] hover:underline">Football</Link>, <Link href="/tennis" className="text-[var(--fs-yellow)] hover:underline">Tennis</Link>, <Link href="/basketball" className="text-[var(--fs-yellow)] hover:underline">Basketball</Link>, and <Link href="/hockey" className="text-[var(--fs-yellow)] hover:underline">Ice Hockey</Link>.
                    </p>
                </div>
            </section>

            {/* Featured Match Previews */}
            {featuredPredictions.length > 0 && (
                <section className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                            <Trophy size={16} className="text-[var(--fs-yellow)]" />
                            Featured Analytical Match Previews
                        </h2>
                        <Link href="/predictions" className="text-[11px] font-bold text-[var(--fs-yellow)] hover:underline uppercase">
                            View All Matches &rarr;
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {featuredPredictions.map((pred) => {
                            const seoSlug = generateSEOSlug(pred.home_team, pred.away_team, pred.slug);
                            return (
                                <Link
                                    key={pred.id}
                                    href={`/predictions/${seoSlug}`}
                                    className="bg-black/30 border border-white/5 hover:border-[var(--fs-yellow)]/40 rounded-lg p-3.5 transition-all space-y-1.5"
                                >
                                    <div className="text-[10px] font-bold uppercase text-white/40 truncate">
                                        {pred.league || 'Football'}
                                    </div>
                                    <div className="text-xs font-black text-white truncate">
                                        {pred.home_team} vs {pred.away_team}
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-[10px] font-black uppercase text-[var(--fs-yellow)]">
                                            Pick: {pred.prediction}
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                            {pred.confidence || '78%'}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}

