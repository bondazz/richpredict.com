import { getLeagues, getTeams } from '@/lib/supabase';
import { createPrediction } from '@/app/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Trophy, ArrowLeft, Save, Zap, PlusCircle, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default async function CreateMatchPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const [leagues, teams] = await Promise.all([
        getLeagues(),
        getTeams()
    ]);

    const handleCreate = async (formData: FormData) => {
        'use server';
        const data = {
            home_team: formData.get('home_team'),
            away_team: formData.get('away_team'),
            prediction: formData.get('prediction'),
            odds: formData.get('odds'),
            match_date: formData.get('match_date'),
            match_time: formData.get('match_time'),
            league_id: formData.get('league_id') || null,
            category: formData.get('category') || 'Football',
            is_premium: formData.get('is_premium') === 'on',
            confidence: formData.get('confidence') || '75%',
            analysis: formData.get('analysis') || '',
            status: 'Upcoming',
            // Global Distribution
            dist_home: formData.get('dist_home'),
            dist_draw: formData.get('dist_draw'),
            dist_away: formData.get('dist_away'),
        };
        await createPrediction(data);
        redirect('/admin/dashboard');
    };

    return (
        <div className="space-y-6 max-w-4xl pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <PlusCircle className="text-yellow-500" size={20} />
                            Deploy_New_Match
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tactical Analysis Entry</p>
                    </div>
                </div>
            </div>

            <form action={handleCreate} className="bg-[#0a1118] border border-white/5 rounded-xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 grayscale">
                    <Trophy size={200} />
                </div>

                {/* Team Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Home_Team_Entity</label>
                        <select name="home_team" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold appearance-none cursor-pointer">
                            <option value="">SELECT_HOME_TEAM...</option>
                            {teams.map((team: any, i: number) => (
                                <option key={i} value={team.name}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Away_Team_Entity</label>
                        <select name="away_team" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold appearance-none cursor-pointer">
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
                        <input name="prediction" type="text" required placeholder="E.g. Over 2.5 Goals" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold text-yellow-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Market_Odds</label>
                        <input name="odds" type="number" step="0.01" required placeholder="1.85" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">AI_Confidence_Index</label>
                        <input name="confidence" type="text" placeholder="85%" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
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
                            <input name="dist_home" type="number" min="0" max="100" defaultValue="45" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Draw %</label>
                            <input name="dist_draw" type="number" min="0" max="100" defaultValue="25" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Away %</label>
                            <input name="dist_away" type="number" min="0" max="100" defaultValue="30" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono" />
                        </div>
                    </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Match_Chronology_Date</label>
                        <input name="match_date" type="date" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Sync_Time_Zulu</label>
                        <input name="match_time" type="time" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all" />
                    </div>
                </div>

                {/* League and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">League_Registration</label>
                        <select name="league_id" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer font-bold">
                            <option value="">SELECT_LEAGUE...</option>
                            {leagues.map((league: any) => (
                                <option key={league.id} value={league.id}>{league.name} ({league.countries?.name})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Sport_Classification</label>
                        <select name="category" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all appearance-none cursor-pointer font-bold">
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
                    <textarea name="analysis" rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all resize-none italic" placeholder="Provide technical breakdown..." />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl relative z-10 group cursor-pointer hover:bg-yellow-500/10 transition-all">
                    <input name="is_premium" type="checkbox" id="premium" className="w-6 h-6 rounded-lg border-white/20 bg-black text-yellow-500 focus:ring-yellow-500/50 transition-all cursor-pointer" />
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
                        EXECUTE_DEPLOYMENT
                    </button>
                </div>
            </form>
        </div>
    );
}
