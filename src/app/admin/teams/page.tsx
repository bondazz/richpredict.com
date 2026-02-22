import { getTeams } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Users, Plus } from 'lucide-react';
import TeamsClientPage from './components/TeamsClientPage';

export default async function AdminTeamsPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const teams = await getTeams();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Users className="text-yellow-500" />
                        Team_Database
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Club Identity & Asset Repository</p>
                </div>

                <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black px-4 py-2 rounded-lg transition-all text-[10px] uppercase tracking-widest shadow-[0_4px_15px_rgba(255,221,0,0.15)]">
                    <Plus size={14} strokeWidth={3} />
                    Register_New_Club
                </button>
            </div>

            <TeamsClientPage initialTeams={teams} />
        </div>
    );
}
