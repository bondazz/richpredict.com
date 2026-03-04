"use client";

import React from 'react';
import { X, Check, Zap, Star, ShieldCheck, Trophy, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getSiteSettings } from '@/lib/supabase';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const { user, refreshSubscription } = useAuth();
    const [plans, setPlans] = React.useState<any[]>([]);
    const [plansLoading, setPlansLoading] = React.useState(true);

    React.useEffect(() => {
        const loadPlans = async () => {
            const data = await getSiteSettings('pricing_plans');
            if (data) {
                setPlans(data);
            } else {
                // Fallback
                setPlans([
                    { name: 'Daily Pass', price: '$4.99', period: '24 Hours', features: ['95%+ AI Predictions', 'VIP Access (24h)', 'Expert Analytics'] },
                    { name: 'Weekly Pass', price: '$14.99', period: '7 Days', features: ['95%+ AI Predictions', 'VIP Access (7d)', 'Expert Analytics'] },
                    { name: 'Monthly Pass', price: '$39.00', period: '30 Days', features: ['VIP Access (30d)', 'Expert Analytics', 'Priority Support'] }
                ]);
            }
            setPlansLoading(false);
        };
        if (isOpen) loadPlans();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubscribe = async (planName: string, price: string) => {
        if (!user) {
            toast.error('Please login first to subscribe!');
            return;
        }

        const tid = toast.loading('Redirecting to checkout...', { id: 'checkout' });

        try {
            const res = await fetch('/api/pay/passimpay/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planName, price, userId: user.id })
            });

            if (!res.ok) {
                const text = await res.text();
                try {
                    const errData = JSON.parse(text);
                    toast.error(errData.error || 'Payment creation failed!', { id: tid });
                } catch {
                    toast.error(`Server error: ${res.status}`, { id: tid });
                }
                return;
            }

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Payment creation failed!', { id: tid });
            }
        } catch (err: any) {
            toast.error('Network error during checkout.', { id: tid });
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-4xl bg-[#00141e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Info */}
                <div className="w-full md:w-1/3 bg-gradient-to-br from-[#164e63] to-[#083344] p-8 flex flex-col justify-center space-y-6">
                    <div className="w-12 h-12 bg-[var(--fs-yellow)] rounded-2xl flex items-center justify-center shadow-2xl">
                        <Trophy className="w-6 h-6 text-black" strokeWidth={3} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none font-[Klapt]">
                            GO <span className="text-[var(--fs-yellow)]">PREMIUM</span>
                        </h2>
                        <p className="text-[12px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                            Unlock the secrets of the most accurate sports algorithms.
                        </p>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-[var(--fs-yellow)]" size={18} />
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">SECURE PAYMENTS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="text-[var(--fs-yellow)]" size={18} />
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">INSTANT UNLOCK</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Plans */}
                <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#001e28]">
                    {plansLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col space-y-6 animate-pulse">
                                <div className="space-y-2">
                                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                                    <div className="h-8 w-3/4 bg-white/10 rounded" />
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="h-3 w-full bg-white/5 rounded" />
                                    <div className="h-3 w-5/6 bg-white/5 rounded" />
                                    <div className="h-3 w-4/6 bg-white/5 rounded" />
                                </div>
                                <div className="h-12 w-full bg-white/10 rounded-xl" />
                            </div>
                        ))
                    ) : plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col space-y-6 hover:border-[var(--fs-yellow)]/30 transition-all hover:bg-white/[0.07] group"
                        >
                            <div className="space-y-1">
                                <h3 className="text-xs font-black text-[var(--fs-yellow)] uppercase tracking-[0.2em]">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-white">{plan.price}</span>
                                    <span className="text-[10px] font-bold text-white/40 uppercase">/ {plan.period}</span>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1">
                                {plan.features.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Check size={14} className="text-[var(--fs-yellow)] shrink-0" />
                                        <span className="text-[10px] font-bold text-white/60 uppercase truncate">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan.name, plan.price)}
                                className="w-full bg-white/5 hover:bg-[var(--fs-yellow)] text-white hover:text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group-hover:bg-[var(--fs-yellow)] group-hover:text-black shadow-lg"
                            >
                                SELECT {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
