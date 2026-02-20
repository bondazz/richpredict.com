import { getAllPredictions } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Crown, Trophy, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { deletePrediction, togglePremium } from '@/app/actions'

// Helper component for Delete
function DeleteButton({ id }: { id: string | number }) {
    return (
        <form action={deletePrediction.bind(null, id)}>
            <button className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors" title="Delete">
                <Trash2 size={16} />
            </button>
        </form>
    )
}

// Helper component for Toggle Premium
function TogglePremiumButton({ id, isPremium }: { id: string | number, isPremium: boolean }) {
    return (
        <form action={togglePremium.bind(null, id, isPremium)}>
            <button className={`p-2 rounded transition-colors ${isPremium ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-zinc-500 hover:text-white'}`} title="Toggle Premium">
                <Crown size={16} fill={isPremium ? "currentColor" : "none"} />
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <Link href="/admin/create" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-md transition-colors text-sm uppercase tracking-wide">
                    <Plus size={18} />
                    Create Prediction
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Total Predictions</span>
                        <Trophy size={18} className="text-zinc-500" />
                    </div>
                    <div className="text-3xl font-black font-mono">{total}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-sm font-medium text-yellow-500/80">Premium Active</span>
                        <Crown size={18} className="text-yellow-500" />
                    </div>
                    <div className="text-3xl font-black font-mono text-yellow-500 relative z-10">{premium}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Football</span>
                        <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">Default</span>
                    </div>
                    <div className="text-3xl font-black font-mono">{football}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Other Sports</span>
                        <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">Sports</span>
                    </div>
                    <div className="text-3xl font-black font-mono">{other}</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/20 text-zinc-400 font-medium uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Match Info</th>
                                <th className="px-6 py-4">Prediction</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {predictions.map((p) => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            {p.is_premium && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-500 uppercase tracking-wide w-fit border border-yellow-500/20">
                                                    Premium
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Calendar size={14} />
                                                <span className="font-mono text-xs">{p.match_date} {p.match_time}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="font-bold text-white max-w-[200px] truncate" title={p.home_team}>{p.home_team}</div>
                                            <div className="text-xs text-zinc-500 font-mono">vs</div>
                                            <div className="font-bold text-white max-w-[200px] truncate" title={p.away_team}>{p.away_team}</div>
                                            {p.league && <div className="text-[10px] text-zinc-500 uppercase tracking-widest pt-1">{p.league}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="font-black text-yellow-500">{p.prediction}</div>
                                            <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold font-mono text-zinc-300">
                                                @{p.odds}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="uppercase text-xs font-bold text-zinc-400">
                                            {p.category || 'FOOTBALL'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <TogglePremiumButton id={p.id} isPremium={!!p.is_premium} />
                                            <Link href={`/admin/edit/${p.id}`} className="p-2 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </Link>
                                            <DeleteButton id={p.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {predictions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No predictions found. Create your first one!
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
