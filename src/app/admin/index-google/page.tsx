"use client";

import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, Send, Search, CheckCircle2, XCircle, AlertCircle, Trash2, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

type IndexStatus = 'SUCCESS' | 'ERROR' | 'NOT_SENT';

interface SiteUrl {
    url: string;
    title?: string;
    type: string;
    status: IndexStatus;
    last_indexed: string | null;
}

export default function IndexGooglePage() {
    const [urls, setUrls] = useState<SiteUrl[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [typeFilter, setTypeFilter] = useState<string>('predictions');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

    const fetchUrls = async () => {
        setIsLoading(true);
        setSelectedUrls(new Set()); // clear selection on fetch
        try {
            const params = new URLSearchParams({ type: typeFilter });
            if (dateFilter) params.append('date', dateFilter);
            if (searchQuery) params.append('q', searchQuery);

            const res = await fetch(`/api/admin/index-google/fetch?${params}`);
            const data = await res.json();

            if (data.success) {
                setUrls(data.data || []);
            } else {
                toast.error(data.error || "Failed to fetch URLs");
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch handled manually to avoid loops on filter changes before hitting search
        fetchUrls();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeFilter, dateFilter]);

    const handleSelectAll = () => {
        if (selectedUrls.size === urls.length) {
            setSelectedUrls(new Set());
        } else {
            setSelectedUrls(new Set(urls.map(u => u.url)));
        }
    };

    const toggleUrl = (url: string) => {
        const newSet = new Set(selectedUrls);
        if (newSet.has(url)) newSet.delete(url);
        else newSet.add(url);
        setSelectedUrls(newSet);
    };

    const submitToGoogle = async (type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') => {
        if (selectedUrls.size === 0) {
            toast.error("Please select at least one URL");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(`Submitting ${selectedUrls.size} URLs...`);

        try {
            const res = await fetch('/api/admin/index-google/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    urls: Array.from(selectedUrls),
                    type
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`Successfully sent ${data.count} URLs to Google!`, { id: toastId });
                // Resync
                fetchUrls();
            } else {
                toast.error(`Error: ${data.error}`, { id: toastId });
            }
        } catch (err: any) {
            toast.error(err.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 border border-blue-500/40 rounded-xl">
                        <Globe className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-0.5">Google Indexing API</h1>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Push URLs directly to Google Search</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchUrls}
                        disabled={isLoading}
                        className="bg-white/5 border border-white/10 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <button
                        onClick={() => submitToGoogle('URL_DELETED')}
                        disabled={isSubmitting || selectedUrls.size === 0}
                        className={cn("border border-red-500/30 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors",
                            selectedUrls.size > 0 ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-white/5 text-zinc-600 cursor-not-allowed")}
                    >
                        <Trash2 size={14} />
                        Delete URL
                    </button>
                    <button
                        onClick={() => submitToGoogle('URL_UPDATED')}
                        disabled={isSubmitting || selectedUrls.size === 0}
                        className={cn("border px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors",
                            selectedUrls.size > 0 ? "bg-blue-600 border-blue-500 text-white hover:bg-blue-500" : "bg-white/5 border-white/10 text-zinc-600 cursor-not-allowed")}
                    >
                        <Send size={14} />
                        Index ({selectedUrls.size})
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#051a24] border border-white/10 p-5 rounded-xl flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by title, team, or URL..."
                            className="bg-black/50 border border-white/10 text-sm text-white rounded-lg pl-10 pr-4 py-2.5 w-full focus:outline-none focus:border-blue-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchUrls()}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-black/50 border border-white/10 text-sm text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors uppercase tracking-wider font-bold"
                    >
                        <option value="predictions">Matches</option>
                        <option value="news">News</option>
                        <option value="static">Static Pages</option>
                        <option value="countries">Countries</option>
                        <option value="leagues">Leagues</option>
                    </select>

                    {typeFilter === 'predictions' && (
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-black/50 border border-white/10 text-sm text-white rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
                        />
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="text-xs uppercase bg-black/50 border-b border-white/10 tracking-widest font-black text-white">
                            <tr>
                                <th scope="col" className="px-4 py-4 w-[50px]">
                                    <button onClick={handleSelectAll} className="text-zinc-500 hover:text-white transition-colors">
                                        {urls.length > 0 && selectedUrls.size === urls.length ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} />}
                                    </button>
                                </th>
                                <th scope="col" className="px-4 py-4 w-[30%]">URL</th>
                                <th scope="col" className="px-4 py-4">Title / Name</th>
                                <th scope="col" className="px-4 py-4">Status</th>
                                <th scope="col" className="px-4 py-4 text-right">Last Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                                        <RefreshCw className="animate-spin mx-auto mb-3 text-blue-500" size={24} />
                                        <p className="uppercase font-bold tracking-widest text-xs">Analyzing Sitemap Nodes...</p>
                                    </td>
                                </tr>
                            ) : urls.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                                        <AlertCircle className="mx-auto mb-3 opacity-50" size={24} />
                                        <p className="uppercase font-bold tracking-widest text-xs">No URLs found</p>
                                    </td>
                                </tr>
                            ) : (
                                urls.map((urlObj) => (
                                    <tr
                                        key={urlObj.url}
                                        onClick={() => toggleUrl(urlObj.url)}
                                        className={cn("border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors",
                                            selectedUrls.has(urlObj.url) ? "bg-blue-500/[0.02]" : ""
                                        )}
                                    >
                                        <td className="px-4 py-3">
                                            {selectedUrls.has(urlObj.url) ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} className="text-zinc-600" />}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-[10px] text-zinc-300 break-all">{urlObj.url.replace('https://richpredict.com', '')}</td>
                                        <td className="px-4 py-3 font-medium text-white text-xs">{urlObj.title || '-'}</td>
                                        <td className="px-4 py-3">
                                            {urlObj.status === 'SUCCESS' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                                                    <CheckCircle2 size={12} /> Indexed
                                                </span>
                                            )}
                                            {urlObj.status === 'ERROR' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                                                    <XCircle size={12} /> Error
                                                </span>
                                            )}
                                            {urlObj.status === 'NOT_SENT' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs text-zinc-500 font-medium">
                                            {urlObj.last_indexed ? new Date(urlObj.last_indexed).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
