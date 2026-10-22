import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Impressum & Legal Notice',
    description: 'Legal disclosure and corporate publisher information for RichPredict.',
    alternates: {
        canonical: 'https://richpredict.com/impressum',
    },
};

export default function ImpressumPage() {
    return (
        <div className="max-w-[800px] mx-auto px-4 py-12 text-white/90">
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">Impressum</h1>
                <p className="text-xs text-white/50">Information in accordance with digital media and publisher standards.</p>
            </div>

            <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-8 space-y-6 text-xs text-white/70 leading-relaxed shadow-xl">
                <div>
                    <h2 className="text-sm font-black uppercase text-white mb-1">Platform Operator</h2>
                    <p>RichPredict Digital Analytics Media Network</p>
                    <p>Online Sports Forecasting & Statistical Informatics</p>
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase text-white mb-1">Contact</h2>
                    <p>General Inquiries: <a href="mailto:info@richpredict.com" className="text-[var(--fs-yellow)] font-mono">info@richpredict.com</a></p>
                    <p>Technical & API Support: <a href="mailto:support@richpredict.com" className="text-[var(--fs-yellow)] font-mono">support@richpredict.com</a></p>
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase text-white mb-1">Editorial Accountability</h2>
                    <p>Content published reflects algorithmic statistical evaluations and verified sports analytics. For editorial questions or corrections, please contact our desk via our <Link href="/contact" className="text-[var(--fs-yellow)] underline">contact page</Link>.</p>
                </div>
            </div>
        </div>
    );
}
