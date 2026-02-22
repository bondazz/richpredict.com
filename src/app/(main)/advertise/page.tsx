import type { Metadata } from 'next'
import Link from 'next/link'
import {
    Users,
    Monitor,
    Globe,
    Clock,
    BarChart3,
    Mail,
    CheckCircle2,
    Layout,
    Smartphone,
    Maximize,
    Calendar,
    ArrowRight
} from 'lucide-react'
import * as React from 'react'

export const metadata: Metadata = {
    title: 'Advertise',
    description: 'Promote your brand on RichPredict. Reach millions of sports fans with our premium advertising solutions.',
    alternates: {
        canonical: '/advertise',
    },
}

const stats = [
    {
        icon: <Globe className="text-[var(--fs-yellow)]" />,
        text: "Established and internationally recognized sports analytics platform"
    },
    {
        icon: <Users className="text-[var(--fs-yellow)]" />,
        text: "9,123,856+ unique monthly visitors across all platforms"
    },
    {
        icon: <BarChart3 className="text-[var(--fs-yellow)]" />,
        text: "358,259,449+ page views monthly showing high user engagement"
    },
    {
        icon: <CheckCircle2 className="text-[var(--fs-yellow)]" />,
        text: "97% of our active visitors are passionate male sports fans"
    },
    {
        icon: <Calendar className="text-[var(--fs-yellow)]" />,
        text: "31 years is the average age of our high-value audience"
    },
    {
        icon: <Clock className="text-[var(--fs-yellow)]" />,
        text: "22 minutes average time spent per session on our website"
    }
]

const adFormats = [
    { name: "Super Leaderboard", size: "970x90", icon: <Layout /> },
    { name: "Wide Skyscraper", size: "300x600", icon: <Maximize /> },
    { name: "Vertical Banner", size: "120x240", icon: <Layout /> },
    { name: "Box Over Content", size: "688x85 / 320x100", icon: <Monitor /> },
    { name: "Wallpaper", size: "1920x1200", icon: <Layout /> },
    { name: "Mobile Premium Square", size: "480x480", icon: <Smartphone /> },
    { name: "Mobile Medium Rectangle", size: "300x250", icon: <Smartphone /> },
    { name: "Mobile Sticky", size: "320x50", icon: <Smartphone /> },
]

export default function AdvertisePage() {
    return (
        <div className="min-h-screen bg-[var(--fs-bg)] pb-12">
            <div className="max-w-[1240px] mx-auto px-4 pt-8 space-y-8">

                {/* 1. HERO SECTION - Flashscore Style Redesign */}
                <div className="relative h-[220px] md:h-[260px] rounded-2xl overflow-hidden border border-white/5 bg-[#00141e] flex items-center group shadow-2xl">
                    <div className="relative z-20 w-full md:w-[65%] pl-8 md:pl-12 flex flex-col justify-center">
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2 uppercase">
                            Advertisement on <span className="text-white">RichPredict.com</span>
                        </h1>
                        <p className="text-[12px] md:text-[13px] text-white/50 leading-snug font-bold mb-6 max-w-sm">
                            Do you want to reach out to sports fans? We are one of the most popular sports servers and 97% of our visitors are male.
                        </p>
                        <Link
                            href="#contact"
                            className="w-fit bg-[var(--fs-yellow)] hover:opacity-90 text-black font-black uppercase tracking-tighter px-6 py-3 rounded-lg text-[11px] md:text-[12px] transition-all shadow-[0_4px_20px_rgba(255,228,56,0.2)] hover:scale-[1.02] active:scale-95"
                        >
                            I want to advertise with you
                        </Link>
                    </div>

                    {/* Masked Action Image - Pure CSS Clip Effect */}
                    <div className="absolute right-0 top-0 h-full w-[55%] z-10 hidden md:block">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop')`,
                                clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#00141e]/10 to-[#00141e]" />
                        </div>
                    </div>

                    {/* Mobile Background Fade */}
                    <div className="absolute inset-0 md:hidden opacity-20">
                        <img
                            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
                            className="w-full h-full object-cover"
                            alt="Background"
                        />
                    </div>
                </div>

                {/* 2. STATS SECTION - Flashscore Style Redesign */}
                <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#00141e] flex flex-col md:flex-row items-center py-8 md:py-0 min-h-[300px] shadow-2xl">
                    {/* Left: Masked Baseball Photo */}
                    <div className="relative w-full md:w-[40%] h-[200px] md:h-full min-h-[300px] z-10">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1508344928928-71657adc7212?q=80&w=1200&auto=format&fit=crop')`,
                                clipPath: 'polygon(0% 0%, 75% 0%, 100% 25%, 100% 100%, 0% 100%)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00141e]/10 to-[#00141e]/40" />
                        </div>
                        {/* CSS-drawn 'curve' to match the image's rounded-inward look */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00141e] rounded-bl-[80px] pointer-events-none" />
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="relative z-20 w-full md:w-[60%] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-1">
                            <p className="text-[11px] md:text-[12px] leading-relaxed text-white font-bold opacity-80">
                                This website (desktop, mobile, tablet) has <span className="text-white">9 123 856</span> unique visitors and <span className="text-white">358 259 449</span> page views monthly (April 2026)
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] md:text-[12px] leading-relaxed text-white font-bold opacity-80">
                                <span className="text-white">22 minutes</span> is the average time spent on our website
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] md:text-[12px] leading-relaxed text-white font-bold opacity-80">
                                <span className="text-white">31 years</span> is the average age of visitors
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] md:text-[12px] leading-relaxed text-white font-bold opacity-80">
                                <span className="text-white">97%</span> of visitors are men
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] md:text-[12px] leading-relaxed text-white font-bold opacity-80">
                                <span className="text-white">93%</span> of RichPredict.com users use the internet every day
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] md:text-[12px] leading-relaxed text-white font-bold opacity-80 uppercase tracking-tight">
                                Established and well recognized website
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. AD FORMATS SECTION - Compact Visual Redesign */}
                <div className="bg-[#00141e] rounded-2xl border border-white/5 p-8 md:p-10 space-y-10 shadow-2xl">
                    <div className="space-y-4">
                        <h2 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
                            The Most Sold Ads. Formats
                        </h2>
                        <div className="h-px bg-white/5 w-full" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 items-start">
                        {/* 1. Super Leaderboard */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-16 h-10 border border-white/20 rounded-sm bg-white/5 overflow-hidden">
                                <div className="absolute top-1 left-1 right-1 h-2 bg-[var(--fs-yellow)] rounded-[1px]" />
                                <div className="absolute top-4 left-1 w-10 h-1 bg-white/10" />
                                <div className="absolute top-6 left-1 w-8 h-1 bg-white/10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Super <br />leaderboard</p>
                                <p className="text-[9px] font-bold text-white/40">970x90</p>
                            </div>
                        </div>

                        {/* 2. Wide Skyscraper */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-16 h-10 border border-white/20 rounded-sm bg-white/5 overflow-hidden">
                                <div className="absolute top-1 right-1 bottom-1 w-4 bg-[var(--fs-yellow)] rounded-[1px]" />
                                <div className="absolute top-2 left-1 w-8 h-1 bg-white/10" />
                                <div className="absolute top-4 left-1 w-6 h-1 bg-white/10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Wide <br />skyscraper</p>
                                <p className="text-[9px] font-bold text-white/40">300x600</p>
                            </div>
                        </div>

                        {/* 3. Vertical Banner */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-16 h-10 border border-white/20 rounded-sm bg-white/5 overflow-hidden">
                                <div className="absolute top-1 bottom-1 left-2 w-2 bg-[var(--fs-yellow)] rounded-[1px]" />
                                <div className="absolute top-2 left-6 w-6 h-1 bg-white/10" />
                                <div className="absolute top-4 left-6 w-8 h-1 bg-white/10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Vertical <br />banner</p>
                                <p className="text-[9px] font-bold text-white/40">120x240</p>
                            </div>
                        </div>

                        {/* 4. Box over Content */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-16 h-10 border border-white/20 rounded-sm bg-white/5 overflow-hidden">
                                <div className="absolute top-3 left-3 right-3 bottom-3 border border-white/10" />
                                <div className="absolute top-4 left-4 right-4 h-2 bg-[var(--fs-yellow)] rounded-[1px]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Box over <br />content</p>
                                <p className="text-[8px] font-bold text-white/40 leading-[1.1]">688x85(d) <br />320x100(m)</p>
                            </div>
                        </div>

                        {/* 5. Wallpaper */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-16 h-10 border border-white/20 rounded-sm bg-white/5 overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 w-2 bg-[var(--fs-yellow)]" />
                                <div className="absolute top-0 bottom-0 right-0 w-2 bg-[var(--fs-yellow)]" />
                                <div className="absolute top-2 left-4 right-4 h-1 bg-white/10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Wallpaper</p>
                                <p className="text-[9px] font-bold text-white/40">1920x1200</p>
                            </div>
                        </div>

                        {/* 6. Mobile Premium Square */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-8 h-12 border border-white/20 rounded-md bg-white/5 overflow-hidden mx-auto">
                                <div className="absolute top-4 left-1 right-1 bottom-4 bg-[var(--fs-yellow)] rounded-[1px]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Mobile <br />premium square</p>
                                <p className="text-[9px] font-bold text-white/40">480x480</p>
                            </div>
                        </div>

                        {/* 7. Mobile Medium Rectangle */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-8 h-12 border border-white/20 rounded-md bg-white/5 overflow-hidden mx-auto">
                                <div className="absolute top-6 left-1 right-1 bottom-3 bg-[var(--fs-yellow)] rounded-[1px]" />
                                <div className="absolute top-2 left-2 right-2 h-[2px] bg-white/10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Mobile <br />medium rect.</p>
                                <p className="text-[9px] font-bold text-white/40">300x250</p>
                            </div>
                        </div>

                        {/* 8. Mobile Sticky */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-8 h-12 border border-white/20 rounded-md bg-white/5 overflow-hidden mx-auto">
                                <div className="absolute bottom-1 left-1 right-1 h-2 bg-[var(--fs-yellow)] rounded-[1px]" />
                                <div className="absolute top-2 left-2 right-2 h-1 bg-white/10" />
                                <div className="absolute top-4 left-2 right-2 h-1 bg-white/10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Mobile <br />sticky</p>
                                <p className="text-[9px] font-bold text-white/40">320x50</p>
                            </div>
                        </div>

                        {/* 9. Multimedia */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative w-10 h-10 border-2 border-white/20 rounded-lg bg-white/5 flex items-center justify-center mx-auto">
                                <div className="w-full h-1/2 bg-[var(--fs-yellow)] absolute bottom-0 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full border border-black/40 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full border border-black/40" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white leading-tight">Multimedia</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/2 w-fit mx-auto px-5 py-2.5 rounded-lg border border-white/5">
                        <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                            <span className="text-[10px] font-black text-white/40">i</span>
                        </div>
                        <p className="text-[11px] font-bold text-white/40">
                            We don't sell text links, pop-unders or interstitials.
                        </p>
                    </div>
                </div>

                {/* 4. CONTACT SECTION - Refined & Consistent */}
                <div id="contact" className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#00141e] p-8 md:p-12 shadow-2xl">
                    <div className="max-w-2xl">
                        <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tight mb-2 uppercase">
                            Connect with <span className="text-[var(--fs-yellow)]">Ads Team</span>
                        </h2>
                        <p className="text-[12px] md:text-[13px] text-white/40 leading-relaxed font-bold mb-8">
                            Ready to launch? Reach out directly and we'll get back to you within 24 hours.
                        </p>

                        <a
                            href="mailto:ads@richpredict.com"
                            className="group inline-flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-3 pr-8 rounded-xl transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[var(--fs-yellow)] text-black flex items-center justify-center transition-transform group-hover:scale-95">
                                <Mail size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1">Email Us</span>
                                <span className="text-sm md:text-base font-black text-white group-hover:text-[var(--fs-yellow)] transition-colors">ads@richpredict.com</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="text-center pb-4 opacity-10">
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.4em]">RichPredict Global Advertising Network &copy; 2026</p>
                </div>

            </div>
        </div>
    )
}
