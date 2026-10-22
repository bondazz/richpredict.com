import React from 'react';
import { Metadata } from 'next';
import { FileCheck, AlertTriangle, ShieldAlert, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Use & Sports Analytics Disclaimer',
    description: 'Read the terms of service, conditions of use, and analytical forecasting disclaimers applicable to all users of RichPredict.',
    alternates: {
        canonical: 'https://richpredict.com/terms',
    },
};

export default function TermsPage() {
    return (
        <div className="max-w-[960px] mx-auto px-4 py-12 text-white/90">
            <div className="mb-10 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--fs-yellow)] font-mono">
                    User Agreement
                </span>
                <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                    Terms of Use
                </h1>
                <p className="text-xs text-white/50">Effective date: October 2026</p>
            </div>

            <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-8 md:p-12 space-y-8 text-xs leading-relaxed text-white/80 shadow-2xl">
                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <FileCheck className="text-[var(--fs-yellow)]" size={18} />
                        1. Acceptance of Terms
                    </h2>
                    <p>
                        By visiting, registering, or accessing content on <Link href="/" className="text-[var(--fs-yellow)] hover:underline">RichPredict.com</Link>, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <AlertTriangle className="text-amber-400" size={18} />
                        2. Analytical Forecasts & Sports Disclaimer
                    </h2>
                    <p>
                        All forecasts, win probabilities, odds comparisons, and AI match previews provided by RichPredict are solely for **informational and entertainment purposes**. Sports results inherently involve random variance. RichPredict does not operate as a gambling operator, bookmaker, or licensed financial advisor.
                    </p>
                    <p className="bg-black/40 border border-white/10 rounded-lg p-4 text-[11px] text-amber-200/90 font-medium">
                        We provide probability-based statistical models, not guaranteed commercial outcomes. Users are exclusively responsible for their own sports wagering decisions and must comply with legal gambling ages and laws within their respective jurisdictions.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <Award className="text-cyan-400" size={18} />
                        3. Intellectual Property Rights
                    </h2>
                    <p>
                        All proprietary neural network algorithms, predictive data representations, visual stylesheets, and editorial previews on this site are the intellectual property of RichPredict. Automated scraping, data harvesting, or commercial redistribution of our predictions without prior written consent is strictly prohibited.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <ShieldAlert className="text-rose-400" size={18} />
                        4. Limitation of Liability
                    </h2>
                    <p>
                        Under no circumstances shall RichPredict or its analysts be held liable for any financial losses, damages, or claims arising out of the use or inability to use the forecasting materials provided on this platform.
                    </p>
                </section>
            </div>
        </div>
    );
}
