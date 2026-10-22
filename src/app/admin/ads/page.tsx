"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart3,
    TrendingUp,
    MousePointer2,
    Users,
    Layout,
    Target,
    ArrowUpRight,
    Search,
    Download,
    Zap,
    Trophy,
    Percent,
    Globe,
    X,
    Filter,
    Smartphone,
    Monitor,
    Eye,
    TrendingDown,
    Layers,
    Clock,
    Chrome,
    Compass,
    AppWindow,
    Activity,
    Map,
    ArrowDownWideNarrow,
    History,
    TrendingUpDown,
    Calculator,
    ShieldCheck,
    Coins,
    Dna,
    Maximize2,
    BarChart4,
    PieChart,
    ChevronDown,
    ChevronUp,
    Info,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type TimeRange = 'Day' | 'Week' | 'Month' | 'Year';

export default function AdsAnalyticsPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('Month');
    const [mount, setMount] = useState(false);
    const [expandedNode, setExpandedNode] = useState<number | null>(0);

    useEffect(() => {
        setMount(true);
    }, []);

    const dataByRange = useMemo(() => {
        return {
            'Day': {
                stats: [
                    { label: "Active Ad Impressions", value: "112.4K", trend: "+2.1%" },
                    { label: "Total Asset Interactions", value: "5.8K", trend: "+5.3%" },
                    { label: "Global Avg. CTR", value: "1.65%", trend: "-0.1%" },
                    { label: "Active Revenue Sourcing", value: "$910", trend: "+0.5%" },
                ],
                chart: [45, 35, 55, 45, 75, 95, 85, 55, 40, 30, 50, 65],
                zones: [
                    { name: "Global Header Banner", views: "34.1K", clicks: "820", ctr: "2.41%", status: "Max Reach", color: "text-blue-500", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070" },
                    { name: "Full Background Takeover", views: "52.5K", clicks: "1,240", ctr: "2.36%", status: "Premium", color: "text-purple-500", img: "https://images.unsplash.com/photo-1614028674026-a35308693c0d?q=80&w=2070" },
                    { name: "Right Strategic Sidebar", views: "15.8K", clicks: "410", ctr: "2.59%", status: "Targeted", color: "text-emerald-500", img: "https://images.unsplash.com/photo-1550745165-9bc0b252723f?q=80&w=2070" },
                    { name: "Left Interactive Sidebar", views: "10.0K", clicks: "215", ctr: "2.15%", status: "Active", color: "text-yellow-500", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070" },
                ],
                reach: [
                    { country: "United States", value: "34%" }, { country: "India", value: "18%" }, { country: "Brazil", value: "15%" }, { country: "Germany", value: "10%" },
                    { country: "United Kingdom", value: "8%" }, { country: "Vietnam", value: "7%" }, { country: "France", value: "5%" }, { country: "Other", value: "3%" },
                ],
                devices: { desktop: "58.2%", mobile: "41.8%" },
                sessionDepth: "4m 21s",
                scrollDepth: { s1: 95, s2: 82, s3: 56, s4: 31 },
                heatmap: [15, 30, 55, 75, 100, 85, 60, 40, 20, 10, 45, 90]
            },
            'Week': {
                stats: [
                    { label: "Active Ad Impressions", value: "920.5K", trend: "+5.4%" },
                    { label: "Total Asset Interactions", value: "42.1K", trend: "+8.7%" },
                    { label: "Global Avg. CTR", value: "1.72%", trend: "+0.3%" },
                    { label: "Active Revenue Sourcing", value: "$6.4K", trend: "+1.8%" },
                ],
                chart: [55, 75, 50, 35, 80, 90, 70, 55, 85, 65, 45, 75],
                zones: [
                    { name: "Global Header Banner", views: "245.0K", clicks: "5,840", ctr: "2.38%", status: "Max Reach", color: "text-blue-500", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070" },
                    { name: "Full Background Takeover", views: "410.2K", clicks: "9,620", ctr: "2.35%", status: "Premium", color: "text-purple-500", img: "https://images.unsplash.com/photo-1614028674026-a35308693c0d?q=80&w=2070" },
                    { name: "Right Strategic Sidebar", views: "142.5K", clicks: "3,140", ctr: "2.20%", status: "Targeted", color: "text-emerald-500", img: "https://images.unsplash.com/photo-1550745165-9bc0b252723f?q=80&w=2070" },
                    { name: "Left Interactive Sidebar", views: "122.8K", clicks: "2,600", ctr: "2.12%", status: "Active", color: "text-yellow-500", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070" },
                ],
                reach: [
                    { country: "United States", value: "34%" }, { country: "India", value: "18%" }, { country: "Brazil", value: "15%" }, { country: "Germany", value: "10%" },
                    { country: "United Kingdom", value: "8%" }, { country: "Vietnam", value: "7%" }, { country: "France", value: "5%" }, { country: "Other", value: "3%" },
                ],
                devices: { desktop: "61.2%", mobile: "38.8%" },
                sessionDepth: "5m 12s",
                scrollDepth: { s1: 98, s2: 85, s3: 61, s4: 38 },
                heatmap: [25, 45, 65, 85, 100, 90, 70, 50, 30, 20, 50, 95]
            },
            'Month': {
                stats: [
                    { label: "Active Ad Impressions", value: "4.25M", trend: "+8.2%" },
                    { label: "Total Asset Interactions", value: "185.1K", trend: "+15.3%" },
                    { label: "Global Avg. CTR", value: "1.82%", trend: "+0.2%" },
                    { label: "Active Revenue Sourcing", value: "$27.3K", trend: "+4.1%" },
                ],
                chart: [45, 65, 40, 70, 90, 65, 80, 95, 95, 80, 85, 90],
                zones: [
                    { name: "Global Header Banner", views: "1.1M", clicks: "28.4K", ctr: "2.58%", status: "Max Reach", color: "text-blue-500", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070" },
                    { name: "Full Background Takeover", views: "1.8M", clicks: "42.1K", ctr: "2.34%", status: "Premium", color: "text-purple-500", img: "https://images.unsplash.com/photo-1614028674026-a35308693c0d?q=80&w=2070" },
                    { name: "Right Strategic Sidebar", views: "820.5K", clicks: "15.1K", ctr: "1.84%", status: "Targeted", color: "text-emerald-500", img: "https://images.unsplash.com/photo-1550745165-9bc0b252723f?q=80&w=2070" },
                    { name: "Left Interactive Sidebar", views: "530.4K", clicks: "11.1K", ctr: "2.09%", status: "Active", color: "text-yellow-500", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070" },
                ],
                reach: [
                    { country: "United States", value: "34%" }, { country: "India", value: "18%" }, { country: "Brazil", value: "15%" }, { country: "Germany", value: "10%" },
                    { country: "United Kingdom", value: "8%" }, { country: "Vietnam", value: "7%" }, { country: "France", value: "5%" }, { country: "Other", value: "3%" },
                ],
                devices: { desktop: "64.8%", mobile: "35.2%" },
                sessionDepth: "6m 28s",
                scrollDepth: { s1: 100, s2: 88, s3: 65, s4: 42 },
                heatmap: [35, 55, 75, 90, 100, 95, 80, 60, 40, 30, 65, 100]
            },
            'Year': {
                stats: [
                    { label: "Active Ad Impressions", value: "54.2M", trend: "+12.8%" },
                    { label: "Total Asset Interactions", value: "2.4M", trend: "+18.2%" },
                    { label: "Global Avg. CTR", value: "1.78%", trend: "+0.5%" },
                    { label: "Active Revenue Sourcing", value: "$327K", trend: "+15%" },
                ],
                chart: [70, 50, 90, 100, 85, 65, 95, 85, 90, 95, 85, 100],
                zones: [
                    { name: "Global Header Banner", views: "15.4M", clicks: "385.1K", ctr: "2.50%", status: "Max Reach", color: "text-blue-500", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070" },
                    { name: "Full Background Takeover", views: "24.1M", clicks: "542.5K", ctr: "2.25%", status: "Premium", color: "text-purple-500", img: "https://images.unsplash.com/photo-1614028674026-a35308693c0d?q=80&w=2070" },
                    { name: "Right Strategic Sidebar", views: "10.8M", clicks: "242.4K", ctr: "2.24%", status: "Targeted", color: "text-emerald-500", img: "https://images.unsplash.com/photo-1550745165-9bc0b252723f?q=80&w=2070" },
                    { name: "Left Interactive Sidebar", views: "3.9M", clicks: "80.4K", ctr: "2.06%", status: "Active", color: "text-yellow-500", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070" },
                ],
                reach: [
                    { country: "United States", value: "34%" }, { country: "India", value: "18%" }, { country: "Brazil", value: "15%" }, { country: "Germany", value: "10%" },
                    { country: "United Kingdom", value: "8%" }, { country: "Vietnam", value: "7%" }, { country: "France", value: "5%" }, { country: "Other", value: "3%" },
                ],
                devices: { desktop: "68.4%", mobile: "31.6%" },
                sessionDepth: "7m 12s",
                scrollDepth: { s1: 100, s2: 92, s3: 72, s4: 48 },
                heatmap: [45, 65, 85, 100, 95, 85, 70, 55, 45, 40, 75, 100]
            }
        };
    }, []);

    const COUNTRIES = [
        { id: "US", name: "United States", share: 0.34 },
        { id: "IN", name: "India", share: 0.18 },
        { id: "BR", name: "Brazil", share: 0.15 },
        { id: "DE", name: "Germany", share: 0.10 },
        { id: "UK", name: "United Kingdom", share: 0.08 },
        { id: "VN", name: "Vietnam", share: 0.07 },
        { id: "FR", name: "France", share: 0.05 },
        { id: "OT", name: "Other", share: 0.03 }
    ];

    const NODE_MATRICES = useMemo(() => {
        const zones = [
            { total: 6500, type: "Header Large", imp: 1100000, ctr: 2.58, baseReg: 2200 },
            { total: 14000, type: "Full Background", imp: 1800000, ctr: 2.34, baseReg: 3500 },
            { total: 4500, type: "Right Sidebar", imp: 820000, ctr: 1.84, baseReg: 1100 },
            { total: 2300, type: "Left Sidebar", imp: 530000, ctr: 2.09, baseReg: 650 },
        ];

        return zones.map(z => {
            return COUNTRIES.map(c => {
                const countryImp = Math.floor(z.imp * c.share);
                const countryClicks = Math.floor(countryImp * (z.ctr / 100));
                const countryReg = Math.floor(z.baseReg * c.share * (1 + Math.random() * 0.1));
                const countryPrice = Math.floor(z.total * c.share);
                return {
                    id: c.id,
                    country: c.name,
                    platform: "RichPredict Global",
                    type: z.type,
                    model: "Allocated",
                    unit: `$${Math.floor(countryPrice / 1.5).toLocaleString()}`, // Simulated unit pricing
                    qty: "1",
                    price: `$${countryPrice.toLocaleString()}.00`,
                    imp: countryImp > 1000 ? (countryImp / 1000).toFixed(1) + "K" : countryImp.toString(),
                    ctr: (z.ctr + (Math.random() * 0.2 - 0.1)).toFixed(2) + "%",
                    clicks: countryClicks.toLocaleString(),
                    reg: `${Math.floor(countryReg * 0.95)}-${Math.floor(countryReg * 1.05)}`
                };
            });
        });
    }, []);

    const activeData = dataByRange[timeRange];
    const statIcons = [Users, MousePointer2, Percent, TrendingUp];

    if (!mount) return null;

    return (
        <div className="space-y-6 pb-24">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-yellow-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                        <Trophy size={14} className="fill-yellow-500" /> Advanced Ad Intelligence
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                        Performance <span className="text-yellow-500">Dashboard</span>
                    </h1>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest font-bold">Comprehensive Advertisement Monitoring</p>
                </div>

                <div className="flex bg-[#0a1118]/80 border border-white/5 p-1 rounded-xl shadow-inner">
                    {(['Day', 'Week', 'Month', 'Year'] as TimeRange[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeRange(t)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                timeRange === t ? "bg-yellow-500 text-black shadow-lg" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {activeData.stats.map((stat, i) => {
                    const Icon = statIcons[i];
                    return (
                        <div
                            key={`${timeRange}-${i}`}
                            className="bg-[#0a1118] border border-white/5 p-5 rounded-2xl relative overflow-hidden group shadow-xl"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <Icon size={40} className={i === 0 ? "text-blue-500" : i === 1 ? "text-purple-500" : i === 2 ? "text-emerald-500" : "text-yellow-500"} />
                            </div>
                            <div className="space-y-0.5 relative z-10">
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                                <div className={cn("text-[9px] font-black flex items-center gap-1 mt-1",
                                    stat.trend.startsWith('+') ? "text-emerald-500" : "text-red-500"
                                )}>
                                    {stat.trend}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Analytical Core */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[#0a1118] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-500"><TrendingUpDown size={20} /></div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-tight text-white mb-0.5">Engagement Flow Velocity</h2>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Real-time dynamic traffic density</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Momentum</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                    <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Density</span>
                                </div>
                            </div>
                        </div>

                        {/* CHART */}
                        <div key={timeRange} className="px-10 py-16 flex items-end gap-3.5 h-[450px] relative bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent)]">
                            <div className="absolute inset-x-0 bottom-16 top-10 flex flex-col justify-between opacity-10 pointer-events-none px-10">
                                {[1, 2, 3, 4].map(l => <div key={l} className="w-full border-t border-white/10" />)}
                            </div>

                            {activeData.chart.map((val, i) => (
                                <div key={i} className="flex-1 group relative h-full flex flex-col justify-end z-10">
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: `${val}%`, opacity: 1 }}
                                        transition={{
                                            duration: 2.5,
                                            delay: i * 0.05,
                                            ease: "easeInOut"
                                        }}
                                        className={cn("w-full rounded-xl transition-all relative border border-white/10 shadow-lg min-h-[5px]",
                                            i % 2 === 0 ? "bg-gradient-to-t from-blue-900/60 via-blue-600 to-blue-400 shadow-blue-500/20" : "bg-gradient-to-t from-yellow-900/60 via-yellow-600 to-yellow-400 shadow-yellow-500/20"
                                        )}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-white/20 blur-[1px] rounded-t-xl" />
                                    </motion.div>
                                    <div className="h-6 mt-4 text-[9px] font-black text-zinc-700 text-center uppercase tracking-tighter">{(i + 1) * 10}:00</div>
                                </div>
                            ))}
                        </div>

                        {/* HEATMAP */}
                        <div className="p-6 border-t border-white/5 bg-black/40">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-600 mb-5 tracking-widest">
                                <Clock size={14} /> Peak Engagement Heatmap Analytics
                            </div>
                            <div className="grid grid-cols-12 gap-2 h-8 mb-2">
                                {activeData.heatmap.map((val, i) => (
                                    <div key={i} className="relative group">
                                        <div
                                            className={cn("h-full rounded-md transition-all duration-700",
                                                val > 80 ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" :
                                                    val > 50 ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" :
                                                        val > 20 ? "bg-yellow-900/30" : "bg-zinc-900"
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-12 gap-2 text-[7.5px] font-black text-zinc-700 uppercase tracking-tighter">
                                {activeData.heatmap.map((_, i) => (
                                    <div key={i} className="text-center">{(i * 2).toString().padStart(2, '0')}-{(i * 2 + 2).toString().padStart(2, '0')}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-[#0a1118] border border-white/5 p-5 rounded-2xl shadow-xl space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                            <Smartphone size={14} /> Viewport Distribution
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/5"><Monitor size={22} /></div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter italic"><span className="text-zinc-400">Desktop</span><span className="text-blue-500">{activeData.devices.desktop}</span></div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div key={`${timeRange}-d`} initial={{ width: 0 }} animate={{ width: activeData.devices.desktop }} transition={{ duration: 1 }} className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-yellow-500/10 p-3 rounded-2xl border border-yellow-500/20 text-yellow-500 shadow-lg shadow-yellow-500/5"><Smartphone size={22} /></div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter italic"><span className="text-zinc-400">Mobile</span><span className="text-yellow-500">{activeData.devices.mobile}</span></div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div key={`${timeRange}-m`} initial={{ width: 0 }} animate={{ width: activeData.devices.mobile }} transition={{ duration: 1 }} className="h-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a1118] border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 text-white/50"><Globe size={16} /></div>
                            <h2 className="text-[10px] font-black uppercase text-white tracking-widest italic">Global Impact</h2>
                        </div>
                        <div className="space-y-4">
                            {activeData.reach.map((reg, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="text-[9px] font-black text-zinc-600 group-hover:text-white transition-colors uppercase tracking-[0.1em]">{reg.country}</div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div key={`${timeRange}-${i}`} initial={{ width: 0 }} animate={{ width: reg.value }} className="h-full bg-blue-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-white w-6 text-right italic">{reg.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* STRATEGIC NODES - Extensive Accordion System */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xs font-black uppercase tracking-widest text-white italic flex items-center gap-2">
                        <Layers size={16} className="text-yellow-500" /> Procurement Matrix Intelligence
                    </h2>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic opacity-60">Full traffic-share price distribution applied</span>
                </div>

                {activeData.zones.map((zone, idx) => (
                    <div
                        key={`${timeRange}-${idx}`}
                        className={cn(
                            "bg-[#0a1118] border rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl",
                            expandedNode === idx ? "border-emerald-500/40 ring-1 ring-emerald-500/20" : "border-white/5"
                        )}
                    >
                        <div
                            onClick={() => setExpandedNode(expandedNode === idx ? null : idx)}
                            className="p-6 cursor-pointer hover:bg-white/[0.01] transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-6">
                                <div className={cn("w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden", idx === 0 ? "text-blue-500" : idx === 1 ? "text-purple-500" : idx === 2 ? "text-emerald-500" : "text-yellow-500")}>
                                    <div className={cn("absolute inset-0 opacity-10 bg-current")} />
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-tighter group-hover:text-emerald-500 transition-colors italic">{zone.name}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                            <Eye size={12} /> {zone.views} Monthly IMP
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                                            <MousePointer2 size={12} /> {zone.clicks} FLOW
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <div className="text-sm font-black text-emerald-500 italic">
                                        {idx === 0 ? "$6,500" : idx === 1 ? "$14,000" : idx === 2 ? "$4,500" : "$2,300"}
                                    </div>
                                    <div className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">Zone Value</div>
                                </div>
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-white/5 transition-transform duration-500", expandedNode === idx ? "rotate-180 border border-emerald-500/40 text-emerald-500" : "text-zinc-500")}>
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedNode === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5 bg-black/40"
                                >
                                    <div className="bg-gradient-to-r from-emerald-950/40 via-emerald-900/40 to-emerald-950/40 p-6 flex flex-wrap items-center justify-between border-b border-emerald-500/10 gap-6">
                                        <div className="flex items-center gap-12">
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest italic">Inventory Acquisition Value</div>
                                                <div className="text-xl font-black text-white tabular-nums tracking-tighter">
                                                    {idx === 0 ? "$6,500" : idx === 1 ? "$14,000" : idx === 2 ? "$4,500" : "$2,300"} Zone Total
                                                </div>
                                            </div>
                                            <div className="h-10 w-px bg-white/5" />
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest italic">Projected Node Conversion</div>
                                                <div className="text-xl font-black text-emerald-500 tabular-nums tracking-tighter">
                                                    {idx === 0 ? "2,200 - 2,800" : idx === 1 ? "3,500 - 4,200" : idx === 2 ? "1,100 - 1,400" : "650 - 800"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-black/80 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 border-b border-white/5">
                                                    <th className="px-6 py-4">Country Matrix</th>
                                                    <th className="px-6 py-4">Inventory Entity</th>
                                                    <th className="px-6 py-4">Price Allocation</th>
                                                    <th className="px-6 py-4">Imp. Flow</th>
                                                    <th className="px-6 py-4 text-emerald-400">CTR Forecast</th>
                                                    <th className="px-6 py-4 text-emerald-400">Total Clicks</th>
                                                    <th className="px-6 py-4 text-emerald-400 text-center">Exp. Reg (Monthly)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.03]">
                                                {NODE_MATRICES[idx].map((row, rIdx) => (
                                                    <tr key={rIdx} className="hover:bg-emerald-500/[0.02] transition-colors group/row">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 text-[10px] uppercase font-black">
                                                                <span className="w-6 h-4 bg-zinc-900 border border-white/10 rounded-sm flex items-center justify-center text-[7px] text-zinc-500 group-hover/row:text-white transition-colors">{row.id}</span>
                                                                <span className="text-zinc-400 italic tracking-tighter whitespace-nowrap">{row.country}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">{row.type}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[10px] font-black text-emerald-500 whitespace-nowrap tabular-nums">{row.price}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[10px] font-black text-zinc-500 tabular-nums italic">{row.imp}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[10px] font-black text-white">{row.ctr}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[10px] font-black text-white tabular-nums">{row.clicks}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-white">{row.reg}</span>
                                                                <span className="text-[7px] font-black text-zinc-700 uppercase tracking-tighter mt-0.5">ACTIVE REGS</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Campaign Summary Widget */}
            <div className="bg-gradient-to-br from-[#0a1118] to-emerald-950/20 border border-white/10 p-8 rounded-[40px] shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={160} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <Zap size={20} className="fill-emerald-500" />
                            <span className="text-xs font-black uppercase tracking-[0.4em] italic">RichPredict Strategic Core</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Acquisition <span className="text-emerald-500">Excellence</span>
                        </h2>
                        <p className="text-zinc-500 max-w-md text-sm font-medium leading-relaxed">
                            Full-spectrum traffic distribution across major regions ensures a consistent flow of 500-4,000 targeted user registrations monthly.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                        <div className="space-y-1">
                            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Monthly Sourcing</div>
                            <div className="text-4xl font-black text-white italic tracking-tighter tabular-nums">$27,300</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Projected Conversion Flow</div>
                            <div className="text-4xl font-black text-emerald-500 italic tracking-tighter tabular-nums">4,000+</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 cursor-zoom-out">
                        <motion.button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-4 bg-white/5 rounded-full"><X size={32} /></motion.button>
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={(e) => e.stopPropagation()} className="max-w-6xl w-full bg-[#0a1118] rounded-[50px] overflow-hidden border border-white/10 shadow-3xl text-center p-20 flex flex-col relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                            <div className="bg-yellow-500 text-black px-12 py-3.5 rounded-full text-sm font-black uppercase mb-12 inline-block self-center shadow-2xl">Capture Hub Visualization</div>
                            <div className="relative rounded-[40px] overflow-hidden border border-white/5 shadow-inner">
                                <img src={selectedImage} className="w-full h-auto" alt="Visualization" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
