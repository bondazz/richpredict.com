import React from 'react';
import { XCircle, ArrowRight, RefreshCcw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function FailedPurchasePage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-[#00141e]">
            <div className="max-w-md w-full bg-[#051a24] border border-red-500/20 rounded-2xl p-8 text-center shadow-[0_0_100px_rgba(255,59,48,0.05)] relative overflow-hidden group">
                {/* Background Error Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full group-hover:bg-red-500/15 transition-all duration-700" />

                {/* Animated Error Icon */}
                <div className="relative mb-8 inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative size-20 bg-gradient-to-br from-[#ff3b30] to-[#800000] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,59,48,0.3)]">
                        <XCircle size={42} className="text-white" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter font-[Klapt]">
                        Payment Failed!
                    </h1>
                    <p className="text-[var(--fs-text-dim)] text-sm leading-relaxed">
                        Something went wrong during the checkout process. Your bank or payment provider might have declined the transaction. No funds were debited.
                    </p>
                </div>

                <div className="mt-10 space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-red-500/5 rounded-xl border border-red-500/10 text-left transition-colors hover:bg-red-500/10 group/item">
                        <div className="size-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <RefreshCcw size={20} className="text-red-500 group-hover/item:rotate-180 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">Recommended action</span>
                            <span className="text-sm font-bold text-white uppercase leading-none">Try again with a different card</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 text-left transition-colors hover:bg-white/[0.08]">
                        <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <HelpCircle size={20} className="text-white/60" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">Need assistance?</span>
                            <span className="text-sm font-bold text-white uppercase leading-none">contact@richpredict.com</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <Link
                        href="/"
                        className="w-full bg-white hover:bg-white/90 text-black font-black text-xs h-12 uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-0.5"
                    >
                        Return to Checkout <ArrowRight size={16} />
                    </Link>
                </div>

                <p className="mt-8 text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] italic">
                    RichPredict Security Protocol Active
                </p>
            </div>
        </div>
    );
}
