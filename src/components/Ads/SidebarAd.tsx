"use client";

import React, { useState } from 'react';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';
import PricingModal from '@/components/pricing/PricingModal';

export default function SidebarAd() {
    const [pricingOpen, setPricingOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center py-4 px-2 w-full">
            <div className="relative w-full max-w-[200px] bg-gradient-to-b from-[#002233] to-[#00141e] border border-[var(--fs-yellow)]/30 rounded-xl p-4 shadow-xl overflow-hidden text-center group hover:border-[var(--fs-yellow)]/60 transition-all">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--fs-yellow)]/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="size-9 rounded-lg bg-[var(--fs-yellow)]/10 border border-[var(--fs-yellow)]/30 flex items-center justify-center text-[var(--fs-yellow)] mx-auto mb-3 shadow-[0_0_15px_rgba(255,221,0,0.15)]">
                    <Crown size={18} />
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--fs-yellow)] block mb-1">
                    PRO ANALYTICS
                </span>

                <h4 className="text-xs font-black uppercase text-white tracking-tight leading-tight mb-2">
                    RichPredict VIP
                </h4>

                <p className="text-[10px] text-white/60 leading-relaxed mb-3">
                    Unlock high-confidence AI predictions & exclusive value bets.
                </p>

                <button
                    onClick={() => setPricingOpen(true)}
                    className="w-full py-2 bg-[var(--fs-yellow)] hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider rounded-lg transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                    aria-label="Upgrade to VIP"
                >
                    <Sparkles size={12} />
                    <span>Join VIP</span>
                    <ArrowRight size={12} />
                </button>
            </div>
            <div className="text-[8px] font-medium text-white/30 uppercase tracking-widest mt-2 text-center select-none">
                Sponsored Access
            </div>

            <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
        </div>
    );
}
