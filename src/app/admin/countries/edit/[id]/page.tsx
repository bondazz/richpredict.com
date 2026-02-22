import { getCountryById } from '@/lib/supabase';
import { updateCountry } from '@/app/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Globe, ArrowLeft, Save, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function EditCountryPage({ params }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const country = await getCountryById(params.id);

    if (!country) {
        redirect('/admin/countries');
    }

    const handleUpdate = async (formData: FormData) => {
        'use server';
        const updates = {
            name: formData.get('name'),
            code: formData.get('code'),
            flag_url: formData.get('flag_url'),
            is_featured: formData.get('is_featured') === 'on',
            // SEO fields could be added here if they exist in schema
        };
        await updateCountry(params.id, updates);
        redirect('/admin/countries');
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/countries" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight">Edit_Node: {country.name}</h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Configuration Interface</p>
                    </div>
                </div>
            </div>

            <form action={handleUpdate} className="bg-[#0a1118] border border-white/5 rounded-xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Globe size={180} />
                </div>

                <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Entity_Name</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={country.name}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Iso_Atlas_Code</label>
                        <input
                            name="code"
                            type="text"
                            defaultValue={country.code}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Flag_Asset_Url</label>
                    <input
                        name="flag_url"
                        type="text"
                        defaultValue={country.flag_url || ''}
                        placeholder="https://example.com/flag.png"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 p-4 bg-black/30 border border-white/5 rounded-xl relative z-10 group cursor-pointer">
                    <input
                        name="is_featured"
                        type="checkbox"
                        id="featured"
                        defaultChecked={country.is_featured}
                        className="w-5 h-5 rounded border-white/20 bg-black text-yellow-500 focus:ring-yellow-500/50 transition-all cursor-pointer"
                    />
                    <label htmlFor="featured" className="flex-1 cursor-pointer">
                        <div className="text-[10px] font-black uppercase text-white tracking-widest">Featured_Priority</div>
                        <div className="text-[9px] font-medium text-zinc-500 uppercase tracking-tighter">Promote this region in global dashboards</div>
                    </label>
                </div>

                <div className="pt-4 flex justify-end relative z-10">
                    <button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-3 text-xs"
                    >
                        <Save size={18} />
                        Sync_Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
