"use client";

import { useState } from 'react';
import { Zap, Loader2, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface League {
    id: string;
    name: string;
    countries?: {
        name: string;
    };
}

interface ScraperFormProps {
    leagues: any[];
}

export default function ScraperForm({ leagues }: ScraperFormProps) {
    const [url, setUrl] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('');
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setStatus('running');
        setLogs([]);
        addLog('Initalizing Intelligence Crawler...');
        addLog(`Target: ${url}`);
        addLog(`League Node: ${selectedLeague || 'AUTO_DETECT_AND_SYNCHRONIZE'}`);

        try {
            const response = await fetch('/api/admin/scrape-teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, leagueId: selectedLeague || null })
            });

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader found');

            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                // The API will send multiple JSON objects in the stream
                const lines = text.split('\n').filter(Boolean);
                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.log) addLog(data.log);
                        if (data.status === 'success') setStatus('success');
                        if (data.status === 'error') {
                            setStatus('error');
                            addLog(`ERROR: ${data.message}`);
                        }
                    } catch (e) {
                        console.error('Error parsing stream line:', line);
                    }
                }
            }
        } catch (error: any) {
            setStatus('error');
            addLog(`CRITICAL_FAILURE: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleScrape} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Flashscore_Standings_URL</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.flashscore.com/football/france/ligue-1/standings"
                        required
                        className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-sm font-mono text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder:text-zinc-800"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Destination_League_Node</label>
                    <select
                        value={selectedLeague}
                        onChange={(e) => setSelectedLeague(e.target.value)}
                        className="w-full bg-black border border-white/5 rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-white focus:outline-none focus:border-yellow-500/50 transition-all cursor-pointer appearance-none"
                    >
                        <option value="">-- SELECT_LEAGUE_NODE --</option>
                        {leagues.map((league) => (
                            <option key={league.id} value={league.id}>
                                {league.countries?.name ? `${league.countries.name}: ` : ''}{league.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={cn(
                    "w-full flex items-center justify-center gap-3 font-black py-4 rounded-xl transition-all text-xs uppercase tracking-[0.3em] shadow-2xl relative overflow-hidden group border",
                    loading
                        ? "bg-zinc-900 border-white/5 text-zinc-500 cursor-not-allowed"
                        : "bg-yellow-500 border-yellow-400 text-black hover:bg-yellow-400 active:scale-[0.98]"
                )}
            >
                {loading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        RUNNING_EXTRACTION_SEQUENCE...
                    </>
                ) : (
                    <>
                        <Zap size={16} fill="currentColor" />
                        INITIATE_DATA_HARVEST
                    </>
                )}
            </button>

            {/* Console Output */}
            {logs.length > 0 && (
                <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Terminal size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Neural_Activity_Log</span>
                        </div>
                        {status === 'success' && <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} /> Sequence_Complete</span>}
                        {status === 'error' && <span className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> Sequence_Aborted</span>}
                    </div>
                    <div className="bg-black/80 border border-white/5 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[10px] space-y-1 custom-scrollbar scroll-smooth">
                        {logs.map((log, i) => (
                            <div key={i} className={cn(
                                "border-l-2 pl-3 py-0.5",
                                log.includes('ERROR') ? "border-red-500 text-red-400 bg-red-500/5" :
                                    log.includes('SUCCESS') ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" :
                                        "border-zinc-800 text-zinc-500"
                            )}>
                                {log}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-2 text-zinc-600 animate-pulse pl-3 border-l-2 border-zinc-800">
                                <div className="size-1 bg-zinc-600 rounded-full animate-bounce" />
                                Waiting for neural connection...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </form>
    );
}
