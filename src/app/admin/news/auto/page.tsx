"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Play,
    Trash2,
    Terminal,
    AlertCircle,
    Zap,
    Settings,
    Loader2,
    LayoutDashboard,
    Newspaper
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogType = 'info' | 'success' | 'warning' | 'error';

export default function AutoNewsPage() {
    const [category, setCategory] = useState<string>("football");
    const [articleCount, setArticleCount] = useState<number>(3);
    const [targetLink, setTargetLink] = useState<string>("");
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<{ msg: string; type: LogType }[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const addLog = (msg: string, type: LogType = 'info') => {
        setLogs(prev => [...prev, { msg, type }]);
    };

    const startSync = async () => {
        if (isRunning) return;

        setIsRunning(true);
        setLogs([]);
        addLog(`🚀 INITIALIZING_NEWS_BOT_CLUSTER...`, 'info');
        addLog(`Target Category: ${category.toUpperCase()}`, 'info');
        addLog(`Fetch Depth: ${articleCount} articles`, 'info');
        if (targetLink) addLog(`Custom Target URL: ${targetLink}`, 'info');

        try {
            const res = await fetch('/api/admin/news/auto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, articleCount, targetLink })
            });

            const data = await res.json();

            if (data.logs && Array.isArray(data.logs)) {
                data.logs.forEach((log: string) => {
                    let type: LogType = 'info';
                    if (log.includes('✅')) type = 'success';
                    if (log.includes('⚠️')) type = 'warning';
                    if (log.includes('❌') || log.includes('CRITICAL')) type = 'error';
                    addLog(log, type);
                });
            }

            if (data.success) {
                addLog(`🎯 BATCH_PROCESSING_COMPLETE: ${data.count} articles synchronized.`, 'success');
            } else {
                addLog(`❌ RUNTIME_EXCEPTION: ${data.error}`, 'error');
            }
        } catch (err: any) {
            addLog(`CRITICAL_SYSTEM_FAILURE: ${err.message}`, 'error');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-30 py-4 border-b border-white/5 mx-[-1rem] px-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/news"
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-white">Auto News_Bot</h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Automated Scraper & Rewriter v1.0.4</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setLogs([])}
                        className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                    >
                        <Trash2 size={16} />
                        Clear Terminal
                    </button>
                    <button
                        onClick={startSync}
                        disabled={isRunning}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,221,0,0.1)]",
                            isRunning
                                ? "bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5"
                                : "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(255,221,0,0.3)]"
                        )}
                    >
                        {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />}
                        {isRunning ? 'SYNCHRONIZING...' : 'START_BOT_SEQUENCE'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <Settings size={14} className="text-yellow-500" /> Scraper Config
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Sport Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none transition-all text-white"
                                >
                                    <option value="football">Football</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="hockey">Hockey</option>
                                    <option value="golf">Golf</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Target Link (Optional)</label>
                                <input
                                    type="text"
                                    value={targetLink}
                                    onChange={(e) => setTargetLink(e.target.value)}
                                    placeholder="https://www.flashscore.com/news/football/"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 transition-all font-mono text-white"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Fetch Depth (Count)</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={articleCount}
                                    onChange={(e) => setArticleCount(parseInt(e.target.value) || 1)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none transition-all text-white"
                                />
                            </div>
                        </div>

                        <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10 space-y-2">
                            <h3 className="text-[9px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-1.5">
                                <AlertCircle size={10} /> AI_Integration_Node
                            </h3>
                            <p className="text-[9px] text-zinc-400 font-medium leading-relaxed uppercase">
                                Bot will scrape Flashscore, extract raw data, and use DeepSeek V3 to rewrite content with 100+ readability, 5 FAQs, and optimized SEO metadata.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#051a24] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Zap size={32} className="text-yellow-500 animate-pulse relative z-10" />
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Auto_Sync_Active</h3>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Real-time processing enabled</p>
                        </div>
                    </div>
                </div>

                {/* Log Terminal */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
                        <div className="p-3 bg-zinc-900 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5 mr-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">/var/log/auto-news-bot.log</span>
                            </div>
                            <span className="text-[9px] font-mono text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded uppercase">DeepSeek_Engine_v6</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed scrollbar-hide text-white/80 bg-black/60">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-3">
                                    <Terminal size={48} className="opacity-20" />
                                    <p className="uppercase tracking-[0.4em] font-black italic">Waiting for bot_signal...</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {logs.map((log, i) => (
                                        <div key={i} className={cn(
                                            "flex gap-4 border-l-2 pl-3 py-0.5",
                                            log.type === 'error' ? "border-red-500 bg-red-500/5 text-red-400" :
                                                log.type === 'success' ? "border-green-500 bg-green-500/5 text-green-400" :
                                                    log.type === 'warning' ? "border-yellow-500 bg-yellow-500/5 text-yellow-500" :
                                                        "border-zinc-800 text-zinc-300"
                                        )}>
                                            <span className="text-[9px] opacity-30 shrink-0 font-bold min-w-[70px]">
                                                {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                            <span className="break-all">{log.msg}</span>
                                        </div>
                                    ))}
                                    <div ref={logEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-2 italic">
                        <Terminal size={12} />
                        Console output reflects real-time status from edge compute nodes.
                    </div>
                </div>
            </div>
        </div>
    );
}
