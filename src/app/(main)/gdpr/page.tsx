import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, UserCheck, Trash2, Database, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'GDPR Compliance & Journalism Standards',
    description: 'RichPredict commitment to European General Data Protection Regulation (GDPR), editorial integrity, and journalistic standards in sports publishing.',
    alternates: {
        canonical: 'https://richpredict.com/gdpr',
    },
};

export default function GDPRPage() {
    return (
        <div className="max-w-[960px] mx-auto px-4 py-12 text-white/90">
            <div className="mb-10 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--fs-yellow)] font-mono">
                    Regulatory Compliance
                </span>
                <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                    GDPR & Journalism
                </h1>
                <p className="text-xs text-white/50">EU Regulation 2016/679 Compliance & Editorial Integrity</p>
            </div>

            <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-8 md:p-12 space-y-8 text-xs leading-relaxed text-white/80 shadow-2xl">
                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <ShieldCheck className="text-[var(--fs-yellow)]" size={18} />
                        1. Your Data Protection Rights Under GDPR
                    </h2>
                    <p>
                        Under the General Data Protection Regulation (GDPR), European Union residents possess comprehensive rights regarding their personal data, including:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-white/70">
                        <li><strong>Right of Access:</strong> Request copies of your personal information collected by RichPredict.</li>
                        <li><strong>Right to Rectification:</strong> Request correction of information you believe is inaccurate.</li>
                        <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of your personal records under certain conditions.</li>
                        <li><strong>Right to Restrict Processing:</strong> Request restrictions on processing your data under specific conditions.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <Database className="text-cyan-400" size={18} />
                        2. Journalistic Exemption & Public Interest
                    </h2>
                    <p>
                        In our sports news and editorial match coverage, RichPredict exercises recognized journalistic exemptions regarding the processing of public sports statistics, athlete performance metrics, team rosters, and historical game results that are in the public interest.
                    </p>
                </section>

                <section className="space-y-3 pt-6 border-t border-white/5">
                    <h2 className="text-base font-black uppercase text-white tracking-wide">
                        3. Exercising Your GDPR Rights
                    </h2>
                    <p>
                        To exercise any of your statutory rights, please submit a written request to <a href="mailto:dpo@richpredict.com" className="text-[var(--fs-yellow)] font-mono hover:underline">dpo@richpredict.com</a>. We respond to all verified inquiries within 30 calendar days.
                    </p>
                </section>
            </div>
        </div>
    );
}
