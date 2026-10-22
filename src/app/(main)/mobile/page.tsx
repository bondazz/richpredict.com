import React from 'react';
import { Metadata } from 'next';
import { Smartphone, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'RichPredict Mobile Web App (PWA)',
    description: 'Access RichPredict AI sports predictions directly on your mobile device. Fast, responsive, and optimized for iOS and Android.',
    alternates: {
        canonical: 'https://richpredict.com/mobile',
    },
};

export default function MobilePage() {
    return (
        <div className="max-w-[800px] mx-auto px-4 py-12 text-white/90">
            <div className="mb-8 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--fs-yellow)] font-mono">
                    Any Device, Anywhere
                </span>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                    RichPredict Mobile Web App
                </h1>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                    Enjoy lightning-fast AI match predictions, live probabilities, and instant stats directly on your smartphone browser.
                </p>
            </div>

            <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-8 space-y-6 text-xs text-white/70 leading-relaxed shadow-xl text-center">
                <div className="size-16 rounded-2xl bg-[var(--fs-yellow)]/10 text-[var(--fs-yellow)] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,221,0,0.1)]">
                    <Smartphone size={32} />
                </div>
                <h2 className="text-base font-black uppercase text-white">No Download Required</h2>
                <p className="max-w-lg mx-auto">
                    RichPredict is engineered as a lightweight Progressive Web App (PWA). You don&apos;t need to download bulky application files from the store. Simply add our site to your mobile home screen for an app-like experience with instant push loading.
                </p>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--fs-yellow)] text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-yellow-400 transition-transform active:scale-95 shadow-xl"
                    >
                        Go to Live Predictions <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
