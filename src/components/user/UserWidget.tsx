"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Loader2, Trophy, Clock, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PricingModal from '../pricing/PricingModal';

export default function UserWidget() {
    const { user, signOut, subscription, setAuthModalOpen, isLoading } = useAuth();
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [isPricingOpen, setPricingOpen] = useState(false);

    useEffect(() => {
        if (subscription?.expires_at && subscription.status === 'active') {
            const interval = setInterval(() => {
                const expiry = new Date(subscription.expires_at).getTime();
                const now = new Date().getTime();
                const diff = expiry - now;

                if (diff <= 0) {
                    setTimeLeft("EXPIRED");
                    clearInterval(interval);
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    if (days > 0) {
                        setTimeLeft(`${days}d ${hours}h`);
                    } else {
                        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                    }
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [subscription]);

    if (isLoading) {
        return (
            <div className="bg-[#00141e] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center space-y-3 min-h-[180px]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--fs-yellow)]" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Loading session...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-[#001e28] border border-white/5 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--fs-yellow)]/5 rounded-full blur-3xl group-hover:bg-[var(--fs-yellow)]/10 transition-colors" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white/40" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase text-white font-[Klapt]">MY ACCOUNT</h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Login to unlock premium</p>
                    </div>
                    <button
                        onClick={() => setAuthModalOpen(true)}
                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        LOGIN / SIGNUP
                    </button>
                </div>
            </div>
        );
    }

    const isPremiumActive = subscription?.status === 'active';

    return (
        <div className="space-y-4">
            <div className="bg-[#001e28] border border-white/5 rounded-xl p-5 shadow-2xl relative overflow-hidden group">
                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#164e63] to-[#083344] flex items-center justify-center border border-white/10 shrink-0">
                        <span className="text-white font-black text-sm uppercase">
                            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black text-white uppercase truncate font-[Klapt]">
                            {user.user_metadata?.full_name || 'Anonymous User'}
                        </h4>
                        <p className="text-[9px] font-bold text-white/40 truncate uppercase tracking-tighter">
                            {user.email}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="p-2 text-white/20 hover:text-red-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>

                {/* Subscription Status */}
                <div className="space-y-3">
                    <div className={cn(
                        "p-3 rounded-lg flex flex-col items-center gap-2 border transition-all",
                        isPremiumActive
                            ? "bg-[#0c4a6e]/20 border-[var(--fs-yellow)]/30 group-hover:border-[var(--fs-yellow)]/50 shadow-[0_4px_15px_rgba(255,221,0,0.05)]"
                            : "bg-white/5 border-white/10"
                    )}>
                        <div className="flex items-center gap-2">
                            <Star size={14} className={isPremiumActive ? "text-[var(--fs-yellow)]" : "text-white/20"} />
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                isPremiumActive ? "text-[var(--fs-yellow)]" : "text-white/20"
                            )}>
                                {isPremiumActive ? 'PREMIUM ACCESS' : 'FREE PLAN'}
                            </span>
                        </div>

                        {isPremiumActive && timeLeft && (
                            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                                <Clock size={10} className="text-blue-400" />
                                <span className="text-[10px] font-mono text-blue-400 font-bold tracking-tight">
                                    {timeLeft}
                                </span>
                            </div>
                        )}
                    </div>

                    {!isPremiumActive && (
                        <button
                            onClick={() => setPricingOpen(true)}
                            className="w-full bg-[var(--fs-yellow)] text-black py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,221,0,0.1)]"
                        >
                            UPGRADE NOW <Zap size={12} fill="currentColor" />
                        </button>
                    )}

                    {isPremiumActive && (
                        <div className="flex justify-center">
                            <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                                Verified Pro Predictor
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
        </div>
    );
}
