import React from 'react';
import { Metadata } from 'next';
import { HelpCircle, ChevronDown, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions (FAQ)',
    description: 'Find answers to common questions about RichPredict AI football predictions, data accuracy, algorithm methodologies, and VIP subscriptions.',
    alternates: {
        canonical: 'https://richpredict.com/faq',
    },
};

const FAQS = [
    {
        q: 'How does RichPredict calculate sports match predictions?',
        a: 'Our predictions are generated through a proprietary ensemble architecture integrating statistical models, historical Head-to-Head records, tactical form metrics, offensive/defensive ratings, player fitness, and real-time market movements. Output is further validated by institutional analysts.'
    },
    {
        q: 'Are the football predictions free of charge?',
        a: 'Yes, RichPredict provides a comprehensive daily feed of free football predictions and match previews across major global leagues including the Premier League, Champions League, La Liga, and Serie A.'
    },
    {
        q: 'What is the VIP Premium membership?',
        a: 'VIP Premium unlocks exclusive high-confidence forecasts, deeper tactical market delta graphs, proprietary signals, and early access to high-value betting odds analysis.'
    },
    {
        q: 'Does RichPredict guarantee 100% win rate?',
        a: 'No sports forecasting platform can legitimately guarantee 100% certainty due to natural sports variance, injuries, and unexpected in-match events. We provide mathematically validated, high-probability projections aimed at long-term positive expectancy.'
    },
    {
        q: 'Which sports are covered on RichPredict?',
        a: 'While our primary emphasis is global Football (Soccer), our models also provide analytical previews and tips for Tennis, Basketball, Hockey, and other international sporting disciplines.'
    }
];

export default function FAQPage() {
    return (
        <div className="max-w-[960px] mx-auto px-4 py-12 text-white/90">
            <div className="mb-10 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--fs-yellow)] font-mono">
                    Knowledge Base
                </span>
                <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                    Frequently Asked Questions
                </h1>
                <p className="text-xs text-white/50">Everything you need to know about our predictions, models, and platform</p>
            </div>

            {/* Structured FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": FAQS.map(f => ({
                            "@type": "Question",
                            "name": f.q,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f.a
                            }
                        }))
                    })
                }}
            />

            <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 shadow-lg space-y-2">
                        <h2 className="text-sm font-black uppercase text-white tracking-wide flex items-start gap-2.5">
                            <span className="text-[var(--fs-yellow)] font-mono text-xs mt-0.5">0{idx + 1}.</span>
                            {faq.q}
                        </h2>
                        <p className="text-xs text-white/70 leading-relaxed pl-6">
                            {faq.a}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center p-8 bg-[var(--fs-header)] border border-white/5 rounded-xl space-y-3">
                <h3 className="text-sm font-black uppercase text-white">Still have questions?</h3>
                <p className="text-xs text-white/60">Our support team is always available to assist you with inquiries.</p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--fs-yellow)] text-black text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-400 transition-colors"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    );
}
