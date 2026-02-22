import { getPredictionById, getLeagues, getTeams } from '@/lib/supabase';
import { updatePrediction } from '@/app/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Trophy, ArrowLeft, Save, Edit3, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default async function EditMatchPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = await paramsPromise;
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const [prediction, leagues, teams] = await Promise.all([
        getPredictionById(params.id),
        getLeagues(),
        getTeams()
    ]);

    if (!prediction) {
        redirect('/admin/dashboard');
    }

    const handleUpdate = async (formData: FormData) => {
        'use server';
        const data = {
            home_team: formData.get('home_team'),
            away_team: formData.get('away_team'),
            prediction: formData.get('prediction'),
            odds: formData.get('odds'),
            match_date: formData.get('match_date'),
            match_time: formData.get('match_time'),
            league_id: formData.get('league_id') || null,
            category: formData.get('category'),
            is_premium: formData.get('is_premium') === 'on',
            confidence: formData.get('confidence'),
            analysis: formData.get('analysis'),
            status: formData.get('status'),
            result: formData.get('result'),
            // Ensure numeric values
            dist_home: parseInt(formData.get('dist_home') as string) || 0,
            dist_draw: parseInt(formData.get('dist_draw') as string) || 0,
            dist_away: parseInt(formData.get('dist_away') as string) || 0,
        };
        await updatePrediction(params.id, data);
        redirect('/admin/dashboard');
    };

    // Format date for <input type="date"> (YYYY-MM-DD)
    const formattedDate = prediction.match_date ? new Date(prediction.match_date).toISOString().split('T')[0] : '';
    // Time is already stored as HH:mm usually, but let's ensure it works
    const formattedTime = prediction.match_time || '';

    return (
        <div className="space-y-6 max-w-4xl pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <Edit3 className="text-yellow-500" size={20} />
                            Reconfigure_Signal: {prediction.home_team}_VS_{prediction.away_team}
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tactical Overwrite Module</p>
                    </div>
                </div>
            </div>

            <form action={handleUpdate} className="bg-[#0a1118] border border-white/5 rounded-xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 grayscale">
                    <Trophy size={200} />
                </div>

                {/* Team Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Home_Team_Entity</label>
                        <select name="home_team" required defaultValue={prediction.home_team} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold appearance-none cursor-pointer">
                            <option value="">SELECT_HOME_TEAM...</option>
                            {teams.map((team: any, i: number) => (
                                <option key={i} value={team.name}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Away_Team_Entity</label>
                        <select name="away_team" required defaultValue={prediction.away_team} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold appearance-none cursor-pointer">
                            <option value="">SELECT_AWAY_TEAM...</option>
                            {teams.map((team: any, i: number) => (
                                <option key={i} value={team.name}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Prediction Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">AI_Signal_Outcome</label>
                        <input name="prediction" type="text" required defaultValue={prediction.prediction} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold text-yellow-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Market_Odds</label>
                        <input name="odds" type="number" step="0.01" required defaultValue={prediction.odds} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">AI_Confidence_Index</label>
                        <input name="confidence" type="text" defaultValue={prediction.confidence} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                    </div>
                </div>

                {/* Global Distribution Cluster */}
                <div className="space-y-4 p-6 bg-black/40 border border-white/5 rounded-2xl relative z-10">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <BarChart3 size={16} className="text-yellow-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global_Distribution_Matrix</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Home %</label>
                            <input name="dist_home" type="number" min="0" max="100" defaultValue={prediction.dist_home ?? 45} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Draw %</label>
                            <input name="dist_draw" type="number" min="0" max="100" defaultValue={prediction.dist_draw ?? 25} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Away %</label>
                            <input name="dist_away" type="number" min="0" max="100" defaultValue={prediction.dist_away ?? 30} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                        </div>
                    </div>
                </div>

                {/* Status and Result */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 border-y border-white/5 py-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Deployment_Status</label>
                        <select name="status" defaultValue={prediction.status} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer font-bold">
                            <option value="Upcoming">UPCOMING</option>
                            <option value="Live">LIVE_DATA_STREAM</option>
                            <option value="Finished">FINISHED_NODE</option>
                            <option value="Cancelled">ABORTED</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Final_Tactical_Result</label>
                        <input name="result" type="text" defaultValue={prediction.result || ''} placeholder="E.g. 2-1" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-black text-center" />
                    </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Match_Chronology_Date</label>
                        <input name="match_date" type="date" required defaultValue={formattedDate} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Sync_Time_Zulu</label>
                        <input name="match_time" type="time" required defaultValue={formattedTime} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all" />
                    </div>
                </div>

                {/* League and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">League_Registration</label>
                        <select name="league_id" defaultValue={prediction.league_id || ''} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer font-bold">
                            <option value="">SELECT_LEAGUE...</option>
                            {leagues.map((league: any) => (
                                <option key={league.id} value={league.id}>{league.name} ({league.countries?.name})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Sport_Classification</label>
                        <select name="category" defaultValue={prediction.category || 'Football'} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer font-bold">
                            <option value="Football">FOOTBALL</option>
                            <option value="Tennis">TENNIS</option>
                            <option value="Basketball">BASKETBALL</option>
                            <option value="Hockey">HOCKEY</option>
                        </select>
                    </div>
                </div>

                {/* Analysis */}
                <div className="space-y-2 relative z-10">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">AI_Strategic_Analysis</label>
                    <textarea name="analysis" rows={6} defaultValue={prediction.analysis} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all resize-none italic" placeholder="Provide technical breakdown..." />
                </div>

                {/* Toggles */}
                <div className={`flex items-center gap-3 p-4 border rounded-xl relative z-10 group cursor-pointer transition-all ${prediction.is_premium ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/2 border-white/5 hover:bg-white/5'}`}>
                    <input name="is_premium" type="checkbox" id="premium" defaultChecked={prediction.is_premium} className="w-6 h-6 rounded-lg border-white/20 bg-black text-yellow-500 focus:ring-yellow-500/50 transition-all cursor-pointer" />
                    <label htmlFor="premium" className="flex-1 cursor-pointer">
                        <div className="text-[11px] font-black uppercase text-yellow-500 tracking-widest flex items-center gap-2">
                            VIP_PREMIUM_SIGNAL
                        </div>
                        <div className="text-[9px] font-medium text-zinc-500 uppercase tracking-tighter">Restrict access to registered tactical subscribers only</div>
                    </label>
                </div>

                <div className="pt-4 flex justify-end relative z-10">
                    <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest px-12 py-5 rounded-xl transition-all shadow-[0_4px_30px_rgba(255,221,0,0.2)] flex items-center justify-center gap-3 text-xs">
                        <Save size={18} />
                        COMMIT_RECONFIGURATION
                    </button>
                </div>
            </form>
        </div>
    );
}
