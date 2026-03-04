import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-[#00141e]">
            <div className="max-w-md w-full bg-[#001e28] border border-[var(--fs-yellow)]/20 rounded-2xl p-8 text-center shadow-[0_0_100px_rgba(255,221,0,0.05)] relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--fs-yellow)]/10 blur-[80px] rounded-full group-hover:bg-[var(--fs-yellow)]/20 transition-all duration-700" />

                {/* Animated Success Icon */}
                <div className="relative mb-8 inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-[var(--fs-yellow)]/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative size-20 bg-gradient-to-br from-[var(--fs-yellow)] to-[#ffd700] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,221,0,0.3)]">
                        <CheckCircle2 size={42} className="text-black" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter font-[Klapt]">
                        Payment Successful!
                    </h1>
                    <p className="text-[var(--fs-text-dim)] text-sm leading-relaxed">
                        Your premium access has been activated. Welcome to the elite circle of winners! You now have full access to all VIP predictions.
                    </p>
                </div>

                <div className="mt-10 space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 text-left transition-colors hover:bg-white/[0.08]">
                        <div className="size-10 bg-[var(--fs-yellow)]/10 rounded-lg flex items-center justify-center">
                            <Zap size={20} className="text-[var(--fs-yellow)]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Access Status</span>
                            <span className="text-sm font-bold text-white uppercase">Premium Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 text-left transition-colors hover:bg-white/[0.08]">
                        <div className="size-10 bg-[var(--fs-yellow)]/10 rounded-lg flex items-center justify-center">
                            <ShieldCheck size={20} className="text-[var(--fs-yellow)]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Trust Factor</span>
                            <span className="text-sm font-bold text-white uppercase">Verified Member</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <Link
                        href="/"
                        className="w-full bg-[var(--fs-yellow)] hover:bg-[var(--fs-yellow)]/90 text-black font-black text-xs h-12 uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(255,221,0,0.2)] hover:shadow-[0_6px_25px_rgba(255,221,0,0.3)] hover:-translate-y-0.5"
                    >
                        Go to Premium Dashboard <ArrowRight size={16} />
                    </Link>
                </div>

                <p className="mt-6 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    Transaction ID: RP-{Math.random().toString(36).substring(7).toUpperCase()}
                </p>
            </div>
        </div>
    );
}
