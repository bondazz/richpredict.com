import { getAllPredictions } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Crown, Trophy, Calendar, Zap, Activity } from 'lucide-react'
import { deletePrediction, togglePremium } from '@/app/actions'

// Helper component for Delete
function DeleteButton({ id }: { id: string | number }) {
    return (
        <form action={deletePrediction.bind(null, id)}>
            <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Delete">
                <Trash2 size={14} />
            </button>
        </form>
    )
}

// Helper component for Toggle Premium
function TogglePremiumButton({ id, isPremium }: { id: string | number, isPremium: boolean }) {
    return (
        <form action={togglePremium.bind(null, id, isPremium)}>
            <button className={`p-2 rounded-lg transition-all border ${isPremium ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500 shadow-[0_0_10px_rgba(255,221,0,0.1)]' : 'bg-white/5 border-white/5 text-zinc-600 hover:text-white'}`} title="Toggle Premium">
                <Crown size={14} fill={isPremium ? "currentColor" : "none"} />
            </button>
        </form>
    )
}

export default async function AdminDashboard() {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session) {
        redirect('/admin/login')
    }

    const predictions = await getAllPredictions(100)

    // Stats
    const total = predictions.length
    const premium = predictions.filter(p => p.is_premium).length
    const football = predictions.filter(p => !p.category || p.category.toLowerCase() === 'football').length
    const other = total - football

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Activity className="text-yellow-500 shadow-[0_0_15px_rgba(255,221,0,0.2)]" />
                        System_Operational_Deck
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Live Intelligence Processing Core</p>
                </div>

                <Link href="/admin/create" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black px-5 py-3 rounded-xl transition-all text-[11px] uppercase tracking-widest shadow-[0_4px_20px_rgba(255,221,0,0.2)] group active:scale-95">
                    <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    Deploy_Signal
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#0a1118] border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Trophy size={80} />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total_Predictions</span>
                        <Trophy size={16} className="text-zinc-600" />
                    </div>
                    <div className="text-4xl font-black font-mono tracking-tighter relative z-10">{total}</div>
                </div>

                <div className="bg-[#0a1118] border border-yellow-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:bg-yellow-500/[0.02] transition-all">
                    <div className="absolute inset-0 bg-yellow-500/[0.03] group-hover:bg-yellow-500/[0.05] transition-colors" />
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform text-yellow-500">
                        <Crown size={80} />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Premium_Active</span>
                        <Crown size={16} className="text-yellow-500" />
                    </div>
                    <div className="text-4xl font-black font-mono tracking-tighter text-yellow-500 relative z-10">{premium}</div>
                </div>

                <div className="bg-[#0a1118] border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Football_Log</span>
                        <Zap size={16} className="text-zinc-600" />
                    </div>
                    <div className="text-4xl font-black font-mono tracking-tighter relative z-10">{football}</div>
                </div>

                <div className="bg-[#0a1118] border border-white/5 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Multi_Sport_Node</span>
                        <Zap size={16} className="text-zinc-600" />
                    </div>
                    <div className="text-4xl font-black font-mono tracking-tighter relative z-10">{other}</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0a1118] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Execution_Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Entity_Identification</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Signal_Data</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Classification</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Module_Override</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {predictions.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            {p.is_premium && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black bg-yellow-500/10 text-yellow-500 uppercase tracking-[0.15em] w-fit border border-yellow-500/20 shadow-[0_0_10px_rgba(255,221,0,0.1)]">
                                                    PREMIUM_NODE
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Calendar size={12} />
                                                <span className="font-mono text-[9px] font-bold uppercase tracking-tighter tracking-tight">{p.match_date} - {p.match_time}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1.5">
                                            <div className="font-black text-white text-sm tracking-tight group-hover:text-yellow-500 transition-colors uppercase italic">{p.home_team}</div>
                                            <div className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                                <div className="h-[1px] w-4 bg-zinc-800" /> SYSTEM_VS <div className="h-[1px] w-4 bg-zinc-800" />
                                            </div>
                                            <div className="font-black text-white text-sm tracking-tight group-hover:text-yellow-500 transition-colors uppercase italic">{p.away_team}</div>
                                            {p.league && <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pt-1">{p.league}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="font-black text-yellow-500 text-xs uppercase tracking-widest bg-yellow-500/5 px-2 py-1 border border-yellow-500/10 rounded w-fit">{p.prediction}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block px-2 py-0.5 bg-white/5 rounded text-[10px] font-black font-mono text-zinc-400">
                                                    ODDS: {p.odds}
                                                </span>
                                                {p.confidence && (
                                                    <span className="text-[10px] font-black font-mono text-zinc-600">{p.confidence}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500 transition-colors" />
                                            <span className="uppercase text-[9px] font-black text-zinc-500 tracking-widest">
                                                {p.category || 'FOOTBALL'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <TogglePremiumButton id={p.id} isPremium={!!p.is_premium} />
                                            <Link href={`/admin/edit/${p.id}`} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="Edit">
                                                <Edit size={14} />
                                            </Link>
                                            <DeleteButton id={p.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {predictions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-600">
                                        <div className="flex flex-col items-center gap-4">
                                            <Zap size={32} className="text-zinc-800 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">No_Neural_Signals_Detected</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
