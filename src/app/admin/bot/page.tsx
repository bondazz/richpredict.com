"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Bot,
    Play,
    Calendar as CalendarIcon,
    Settings,
    Database,
    Search,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Flag
} from 'lucide-react';

export default function BotControlPage() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const isFlagMode = mode === 'flags';

    const [syncing, setSyncing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    // Form State - Simplified: No league selection needed
    const [config, setConfig] = useState({
        matchDate: new Date().toISOString().split('T')[0],
        maxMatches: 10,
        testMode: true
    });

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 100));
    };

    const handleStartSync = async () => {
        setSyncing(true);
        setLogs([]);

        if (isFlagMode) {
            addLog("🚀 Flag Sync Bot starting...");
            addLog("Target: All countries in database");

            try {
                const response = await fetch('/api/admin/countries/sync-flags', {
                    method: 'POST'
                });
                const result = await response.json();
                if (result.success) {
                    if (result.logs) result.logs.forEach((l: string) => addLog(l));
                    addLog("✅ Flag Sync Completed Successfully!");
                } else {
                    addLog(`❌ Error: ${result.error}`);
                }
            } catch (err) {
                addLog(`Critical Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally {
                setSyncing(false);
            }
            return;
        }

        addLog(`Starting Smart Bot for Date: ${config.matchDate}`);
        addLog(`Searching all leagues (Max: ${config.maxMatches} games)`);

        try {
            const response = await fetch('/api/admin/bot/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();

            if (result.success) {
                if (result.logs && result.logs.length > 0) {
                    result.logs.forEach((l: string) => addLog(l));
                }
                addLog(`Success! Created/Updated matches from Flashscore.`);
            } else {
                addLog(`Error: ${result.error || 'Sync failed'}`);
                if (result.logs) result.logs.forEach((l: string) => addLog(l));
            }
        } catch (err) {
            addLog(`Critical Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                        {isFlagMode ? (
                            <><Flag className="text-yellow-500" size={28} /> COUNTRY FLAG BOT</>
                        ) : (
                            <><Bot className="text-yellow-500" size={28} /> GLOBAL AI SYNC BOT</>
                        )}
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        {isFlagMode
                            ? "Flashscore Asset Scraper: Fetching official country flags from CSS."
                            : "Flashscore Web-Scraper: Scanning top global fixtures and AI Analysis."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl space-y-6 shadow-2xl">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-500">
                            <Settings size={14} /> Bot Parameters
                        </div>

                        <div className="space-y-5">
                            {!isFlagMode ? (
                                <>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Target Sync Date</label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                            <input
                                                type="date"
                                                value={config.matchDate}
                                                onChange={(e) => setConfig({ ...config, matchDate: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-all font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Game Capture Limit</label>
                                        <input
                                            type="number"
                                            value={config.maxMatches}
                                            onChange={(e) => setConfig({ ...config, maxMatches: parseInt(e.target.value) })}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-all font-mono"
                                            min="1"
                                            max="50"
                                        />
                                        <p className="text-[9px] text-zinc-600 mt-2 italic">* Bot will stop after scraping this many matches.</p>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                                    <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                                        This bot will visit all country links on Flashscore and extract their flag URLs from the CSS breadcrumb.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleStartSync}
                                disabled={syncing}
                                className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_4px_20px_rgba(255,221,0,0.3)]"
                            >
                                {syncing ? <RefreshCw className="animate-spin" size={20} /> : <Play size={20} />}
                                {syncing ? 'RUNNING BOT...' : isFlagMode ? 'START FLAG SYNC' : 'EXECUTE SYNC'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                            <Database size={14} /> Data Intelligence
                        </div>
                        <ul className="text-[10px] text-zinc-400 space-y-2 leading-relaxed italic">
                            <li>• Source: <span className="text-white">Flashscore.com</span></li>
                            {isFlagMode ? (
                                <>
                                    <li>• Scanning CSS Breadcrumb flags.</li>
                                    <li>• Auto-updating DB Country table.</li>
                                    <li>• Sync_Mode: <span className="text-green-500">ASSET_SCRAPER</span></li>
                                </>
                            ) : (
                                <>
                                    <li>• AI Engine: <span className="text-white">DeepSeek-V3</span></li>
                                    <li>• Auto-navigation to selected date.</li>
                                    <li>• Sync_Status: <span className="text-green-500">REAL_TIME_MATCHES</span></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Live Console */}
                <div className="flex flex-col h-full">
                    <div className="bg-[#0b1f27] border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Bot Console
                            </div>
                            <button
                                onClick={() => setLogs([])}
                                className="text-[8px] font-black text-zinc-600 hover:text-white uppercase transition-colors"
                            >
                                Clear Console
                            </button>
                        </div>

                        <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-1.5 scrollbar-hide bg-black/40 min-h-[400px]">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-800 italic space-y-2">
                                    {isFlagMode ? <Flag size={40} className="opacity-10" /> : <Bot size={40} className="opacity-10" />}
                                    <p>Ready for {isFlagMode ? 'flag synchronization' : 'match synchronization'}.</p>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className={`border-l-2 pl-3 py-0.5 ${log.includes('Error') || log.includes('❌') ? 'text-red-400 border-red-500 bg-red-500/5' :
                                        log.includes('Success') || log.includes('✅') ? 'text-green-400 border-green-500 bg-green-500/5' :
                                            log.includes('🔍') || log.includes('Created') || log.includes('Synced') ? 'text-yellow-400 border-yellow-500' :
                                                'text-zinc-500 border-zinc-800'
                                        }`}>
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
