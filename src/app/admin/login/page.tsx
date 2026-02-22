"use client";
import { useState } from 'react';
import { Zap, Loader2, Link } from 'lucide-react';

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password');

        // Simple hardcoded or database-backed login logic
        // For now, let's assume we have an API route or server action
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            window.location.href = '/admin/dashboard';
        } else {
            setError("Invalid credentials");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-[#0a1118] p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />

                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl mb-4 shadow-[0_0_20px_rgba(255,221,0,0.2)]">
                        <Zap className="text-black fill-black" size={24} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white font-[Klapt]">
                        Rich<span className="text-yellow-500">Admin</span> Access
                    </h1>
                    <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">Secure Terminal Entry</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Access Module Key</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all font-mono placeholder:text-zinc-700"
                            placeholder="••••••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider p-3 rounded-lg text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isLoading}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(255,221,0,0.15)] flex items-center justify-center gap-2 text-xs"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : "AUTHORIZE ACCESS"}
                    </button>
                </form>

                <div className="text-center">
                    <a href="/" className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">
                        ← Return to public mainframe
                    </a>
                </div>
            </div>
        </div>
    );
}
