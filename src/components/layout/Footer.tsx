"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Zap } from "lucide-react";
import type { Prediction, BlogPost } from "@/lib/supabase";
import { generateSEOSlug } from "@/lib/utils";

interface FooterProps {
    footballPredictions?: Prediction[];
    tennisPredictions?: Prediction[];
    latestNews?: BlogPost[];
}

const TOP_COUNTRY_HUBS = [
    { label: "England Premier League Tips", href: "/predictions/football/england" },
    { label: "Spain LaLiga Predictions", href: "/predictions/football/spain" },
    { label: "Germany Bundesliga Tips", href: "/predictions/football/germany" },
    { label: "Italy Serie A Predictions", href: "/predictions/football/italy" },
    { label: "France Ligue 1 Tips", href: "/predictions/football/france" },
    { label: "UEFA & Europe Predictions", href: "/predictions/football/europe" },
    { label: "Brazil Serie A Tips", href: "/predictions/football/brazil" },
    { label: "Netherlands Eredivisie Tips", href: "/predictions/football/netherlands" },
];

const QUICK_SPORT_HUBS = [
    { label: "All Football Predictions", href: "/predictions" },
    { label: "Football Match Center", href: "/football" },
    { label: "Tennis Match Predictions", href: "/tennis" },
    { label: "Basketball Betting Tips", href: "/basketball" },
    { label: "Ice Hockey Predictions", href: "/hockey" },
    { label: "VIP Premium Analytics", href: "/vip" },
    { label: "Sports Betting News", href: "/news" },
];

export default function Footer({ footballPredictions = [], tennisPredictions = [], latestNews = [] }: FooterProps) {
    const socialLinks = [
        { id: "fb", label: "Facebook", href: "https://facebook.com/richpredict" },
        { id: "tw", label: "X", href: "https://twitter.com/richpredict" },
        { id: "in", label: "Instagram", href: "https://instagram.com/richpredict" },
        { id: "tiktok", label: "TikTok", href: "https://tiktok.com/@richpredict" },
    ];

    const utilityLinks = [
        { label: "Terms of Use", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "GDPR and Journalism", href: "/gdpr" },
        { label: "Impressum", href: "/impressum" },
        { label: "Advertise", href: "/advertise" },
        { label: "Contact", href: "/contact" },
        { label: "Mobile", href: "/mobile" },
        { label: "All Predictions", href: "/predictions" },
        { label: "Recommended Sites", href: "/recommended" },
        { label: "FAQ", href: "/faq" }
    ];

    return (
        <footer className="footerContainer bg-[#000a0f] border-t border-white/5 pt-16 relative overflow-hidden">
            <div className="footerContainer__content max-w-[1240px] mx-auto px-6 relative z-10">

                {/* 1. SEO FOOTER (Dynamic Sections) */}
                <div className="seoFooter mb-16 pb-12 border-b border-white/5">
                    <div className="seoFooter__categories grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

                        {/* Football Predictions */}
                        <div className="seoFooter__category">
                            <h3 className="seoFooter__categoryTitle mb-5">
                                <Link href="/football" className="text-[12px] font-black text-white hover:text-[var(--fs-yellow)] uppercase tracking-[0.1em] transition-colors">
                                    FOOTBALL PREDICTIONS
                                </Link>
                            </h3>
                            <div className="seoFooter__categoryLinks flex flex-col gap-2.5">
                                {footballPredictions.map((pred) => {
                                    const seoSlug = generateSEOSlug(pred.home_team, pred.away_team, pred.slug);
                                    return (
                                        <div key={pred.id}>
                                            <Link href={`/predictions/${seoSlug}`} className="text-[11px] font-medium text-white hover:text-[var(--fs-yellow)] transition-colors">
                                                {pred.home_team} vs {pred.away_team}
                                            </Link>
                                        </div>
                                    );
                                })}
                                {footballPredictions.length === 0 && (
                                    <div className="text-[11px] text-white/40 italic uppercase tracking-tighter">No predictions found</div>
                                )}
                            </div>
                        </div>

                        {/* Tennis Predictions */}
                        <div className="seoFooter__category">
                            <h3 className="seoFooter__categoryTitle mb-5">
                                <Link href="/tennis" className="text-[12px] font-black text-white hover:text-[var(--fs-yellow)] uppercase tracking-[0.1em] transition-colors">
                                    TENNIS PREDICTIONS
                                </Link>
                            </h3>
                            <div className="seoFooter__categoryLinks flex flex-col gap-2.5">
                                {tennisPredictions.map((pred) => {
                                    const seoSlug = generateSEOSlug(pred.home_team, pred.away_team, pred.slug);
                                    return (
                                        <div key={pred.id}>
                                            <Link href={`/predictions/${seoSlug}`} className="text-[11px] font-medium text-white hover:text-[var(--fs-yellow)] transition-colors">
                                                {pred.home_team} vs {pred.away_team}
                                            </Link>
                                        </div>
                                    );
                                })}
                                {tennisPredictions.length === 0 && (
                                    <div className="text-[11px] text-white/40 italic uppercase tracking-tighter">No predictions found</div>
                                )}
                            </div>
                        </div>

                        {/* Sports News */}
                        <div className="seoFooter__category">
                            <h3 className="seoFooter__categoryTitle mb-5">
                                <Link href="/news" className="text-[12px] font-black text-white hover:text-[var(--fs-yellow)] uppercase tracking-[0.1em] transition-colors">
                                    SPORTS NEWS
                                </Link>
                            </h3>
                            <div className="seoFooter__categoryLinks flex flex-col gap-2.5">
                                {latestNews.map((post) => (
                                    <div key={post.id}>
                                        <Link href={`/news/${post.slug}`} className="text-[11px] font-medium text-white hover:text-[var(--fs-yellow)] transition-colors line-clamp-1">
                                            {post.title}
                                        </Link>
                                    </div>
                                ))}
                                {latestNews.length === 0 && (
                                    <div className="text-[11px] text-white/40 italic uppercase tracking-tighter">No news found</div>
                                )}
                            </div>
                        </div>

                        {/* Top Country Hubs */}
                        <div className="seoFooter__category">
                            <h3 className="seoFooter__categoryTitle mb-5">
                                <Link href="/predictions" className="text-[12px] font-black text-white hover:text-[var(--fs-yellow)] uppercase tracking-[0.1em] transition-colors">
                                    TOP LEAGUES & COUNTRIES
                                </Link>
                            </h3>
                            <div className="seoFooter__categoryLinks flex flex-col gap-2.5">
                                {TOP_COUNTRY_HUBS.map((item) => (
                                    <div key={item.href}>
                                        <Link href={item.href} className="text-[11px] font-medium text-white hover:text-[var(--fs-yellow)] transition-colors">
                                            {item.label}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Sport Hubs */}
                        <div className="seoFooter__category">
                            <h3 className="seoFooter__categoryTitle mb-5">
                                <Link href="/predictions" className="text-[12px] font-black text-white hover:text-[var(--fs-yellow)] uppercase tracking-[0.1em] transition-colors">
                                    PREDICTION HUBS
                                </Link>
                            </h3>
                            <div className="seoFooter__categoryLinks flex flex-col gap-2.5">
                                {QUICK_SPORT_HUBS.map((item) => (
                                    <div key={item.href}>
                                        <Link href={item.href} className="text-[11px] font-medium text-white hover:text-[var(--fs-yellow)] transition-colors">
                                            {item.label}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. SELF PROMO SECTION */}
                <div className="selfPromo grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="selfPromo__box selfPromo__box--project lg:col-span-6">
                        <h4 className="selfPromo__boxTitle text-[11px] font-black text-white uppercase tracking-widest mb-6 px-3 border-l-2 border-[var(--fs-yellow)]">
                            RichPredict.com
                        </h4>
                        <div className="selfPromo__boxContent">
                            <div className="selfPromo__boxContent--links flex flex-wrap gap-x-6 gap-y-3">
                                {utilityLinks.map(item => (
                                    <div key={item.label} className="selfPromo__boxItemWrapper">
                                        <Link href={item.href} className="text-[10px] font-bold text-white hover:text-[var(--fs-yellow)] uppercase tracking-wider transition-colors">
                                            {item.label}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Social Section */}
                    <div className="selfPromo__box selfPromo__box--social lg:col-span-3">
                        <h4 className="selfPromo__boxTitle text-[11px] font-black text-white uppercase tracking-widest mb-6">
                            Follow us
                        </h4>
                        <div className="selfPromo__boxContent flex flex-col gap-3">
                            {socialLinks.map(soc => (
                                <div key={soc.id} className="selfPromo__boxItemWrapper">
                                    <Link href={soc.href} target="_blank" className="flex items-center gap-3 text-[11px] font-medium text-white hover:text-[var(--fs-yellow)] transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--fs-yellow)] group-hover:text-black transition-all">
                                            <SocialIconById id={soc.id} />
                                        </div>
                                        <span className="uppercase tracking-tight">{soc.label}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Apps Section */}
                    <div className="selfPromo__box selfPromo__box--apps lg:col-span-3">
                        <div className="selfPromo__wrapper--texts space-y-2 mb-6">
                            <h4 className="selfPromo__boxTitle text-[11px] font-black text-white uppercase tracking-widest">
                                Mobile applications
                            </h4>
                            <p className="selfPromo__boxContent text-[11px] text-white leading-relaxed">
                                Our mobile app is optimized for your phone. Download it for free!
                            </p>
                        </div>
                        <div className="selfPromo__wrapper--stores flex flex-col gap-2.5">
                            <StoreButton type="apple" />
                            <StoreButton type="google" />
                            <StoreButton type="huawei" />
                        </div>
                    </div>
                </div>

                {/* 3. CORE FOOTER (Legal & Copyright) */}
                <div className="footer mt-10 pb-10 border-t border-white/5 pt-10">
                    <div className="footer__content flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/40">
                            <Link href="/predictions" className="footer__link text-[10px] font-black text-white uppercase hover:text-[var(--fs-yellow)] transition-colors">
                                Match Archive
                            </Link>
                            <div className="footer__gambleResponsiblyLink text-[10px] font-black uppercase text-white">
                                Gamble Responsibly. <Link href="/terms" className="text-white hover:underline">Gambling Therapy</Link>. 18+
                            </div>
                        </div>

                        <div className="footer__copyright flex items-center gap-6">
                            <div className="footer__copyrightText text-[10px] font-black uppercase text-white tracking-widest">
                                Copyright © 2006-26 RichPredict.com
                            </div>
                            <span className="footer__privacyButton text-[10px] font-bold text-white cursor-pointer hover:text-[var(--fs-yellow)] uppercase border border-white/20 px-3 py-1 rounded-sm">
                                Set privacy
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Visual Phone Mockup */}
            <div className="footer__lazyLoadImage absolute -bottom-10 right-0 lg:right-40 w-[240px] opacity-10 pointer-events-none hidden lg:block">
                <img
                    src="https://static.flashscore.com/res/_fs/image/3_footer/mobile_screen.png"
                    alt="Mobile Preview"
                    width={240}
                    height={300}
                    loading="lazy"
                    className="rotate-[-10deg] translate-y-10"
                />
            </div>

            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_bottom,rgba(255,228,56,0.02),transparent_70%)] pointer-events-none" />
        </footer>
    );
}

function SocialIconById({ id }: { id: string }) {
    if (id === 'fb') return <Facebook size={14} />;
    if (id === 'tw') return <Twitter size={14} />;
    if (id === 'in') return <Instagram size={14} />;
    return <Zap size={14} />;
}

function StoreButton({ type }: { type: 'apple' | 'google' | 'huawei' }) {
    const urls = {
        apple: "https://static.flashscore.com/res/_fs/image/9_stores/apple/en.svg",
        google: "https://static.flashscore.com/res/_fs/image/9_stores/google/en.svg",
        huawei: "https://static.flashscore.com/res/_fs/image/9_stores/huawei/en.svg",
    };
    const labels = {
        apple: "Download on the App Store",
        google: "Get it on Google Play",
        huawei: "Explore it on AppGallery",
    };
    return (
        <Link href="/mobile" className="opacity-80 hover:opacity-100 transition-opacity" aria-label={labels[type]}>
            <img src={urls[type]} alt={labels[type]} height={32} width={120} className="h-8 w-auto filter grayscale invert" loading="lazy" />
        </Link>
    );
}
