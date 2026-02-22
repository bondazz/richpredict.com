import { getCountriesByRegion } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Globe, Search, Edit2, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCountriesPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const countries = await getCountriesByRegion();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Globe className="text-yellow-500" />
                        Region_Registry
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">SEO & Metadata Management Cluster</p>
                </div>

                <div className="flex items-center gap-2 bg-black border border-white/5 rounded-lg px-3 py-1.5 focus-within:border-yellow-500/50 transition-all">
                    <Search size={14} className="text-zinc-500" />
                    <input
                        type="text"
                        placeholder="SEARCH_ISO_OR_NAME..."
                        className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-48 placeholder:text-zinc-800"
                    />
                </div>
            </div>

            <div className="bg-[#0a1118] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Iso_Code</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Country_Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Region_Segment</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Featured_Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {countries.map((country: any) => (
                                <tr key={country.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-400 group-hover:text-yellow-500 transition-colors">
                                            {country.code || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {country.flag_url && (
                                                <img
                                                    src={country.flag_url}
                                                    alt=""
                                                    className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm grayscale group-hover:grayscale-0 transition-all"
                                                />
                                            )}
                                            <span className="text-sm font-bold text-white tracking-tight">{country.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                                            {country.regions?.name || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${country.is_featured ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/10 text-zinc-600'}`}>
                                            <div className={`w-1 h-1 rounded-full ${country.is_featured ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                                            <span className="text-[8px] font-black uppercase tracking-widest">
                                                {country.is_featured ? 'ACTIVE_FEATURE' : 'STANDARD'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <Link
                                                href={`/admin/countries/edit/${country.id}`}
                                                className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
                                                title="Edit SEO & Identity"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <a
                                                href={`/${country.name.toLowerCase()}`}
                                                target="_blank"
                                                className="p-2 bg-white/5 text-zinc-500 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
