import { getLeagues } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Zap } from 'lucide-react'
import ScraperForm from './components/ScraperForm'

export default async function ScraperPage() {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session) {
        redirect('/admin/login')
    }

    const leagues = await getLeagues()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                    <Zap className="text-yellow-500 shadow-[0_0_15px_rgba(255,221,0,0.2)]" />
                    Team_Intelligence_Scraper
                </h1>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Autonomous Entity Extraction Module</p>
            </div>

            <div className="bg-[#0a1118] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                <div className="max-w-2xl relative z-10">
                    <ScraperForm leagues={leagues} />
                </div>
            </div>

            {/* Instruction Card */}
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                    <Zap size={16} />
                    <h3 className="text-sm font-black uppercase tracking-widest">Protocol Instructions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight">
                    <div className="space-y-2">
                        <p className="text-blue-400">01. URL_EXTRACTION</p>
                        <p>Daxil olun: flashscore.com &gt; Seçin: Liga &gt; Seçin: Standings. Linki kopyalayın və bura yerləşdirin.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-blue-400">02. LOGO_HARVESTING</p>
                        <p>Sistem hər bir komandanın öz səhifəsinə daxil olaraq daha yüksək keyfiyyətli loqo linkini avtomatik çəkəcək.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
