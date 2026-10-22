import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy & Data Protection',
    description: 'Learn how RichPredict collects, uses, and safeguards your personal data, analytics information, and cookies in compliance with international privacy standards.',
    alternates: {
        canonical: 'https://richpredict.com/privacy',
    },
};

export default function PrivacyPage() {
    return (
        <div className="max-w-[960px] mx-auto px-4 py-12 text-white/90">
            <div className="mb-10 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--fs-yellow)] font-mono">
                    Legal & Compliance
                </span>
                <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                    Privacy Policy
                </h1>
                <p className="text-xs text-white/50">Last updated: October 2026</p>
            </div>

            <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-8 md:p-12 space-y-8 text-xs leading-relaxed text-white/80 shadow-2xl">
                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <ShieldCheck className="text-[var(--fs-yellow)]" size={18} />
                        1. Introduction
                    </h2>
                    <p>
                        Welcome to RichPredict (accessible at <Link href="/" className="text-[var(--fs-yellow)] hover:underline">https://richpredict.com</Link>). We respect your privacy and are committed to protecting the personal data of our users. This Privacy Policy outlines our practices regarding data collection, usage, and protection when you interact with our website, sports analytics, and prediction features.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <Lock className="text-cyan-400" size={18} />
                        2. Information We Collect
                    </h2>
                    <ul className="list-disc list-inside space-y-1.5 pl-2 text-white/70">
                        <li><strong>Account Details:</strong> When you register or subscribe to premium forecasts, we may collect your email address and username.</li>
                        <li><strong>Usage Data:</strong> We collect non-personally identifiable diagnostic information such as browser type, operating system, pages visited, and timestamps to improve platform speed and usability.</li>
                        <li><strong>Cookies & Tracking:</strong> We utilize cookies solely for authentication state preservation and anonymized Google Analytics metrics to evaluate aggregated traffic trends.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <Eye className="text-emerald-400" size={18} />
                        3. How We Use Your Information
                    </h2>
                    <p>
                        Information gathered is utilized strictly to provide, maintain, and refine our predictive sports modeling services, deliver customer assistance, process subscriptions securely, and prevent fraudulent activity. We do not sell, rent, or trade your personal data to third-party brokers.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                        <FileText className="text-amber-400" size={18} />
                        4. Third-Party Service Providers
                    </h2>
                    <p>
                        We may engage trusted third-party service providers (such as Supabase for secure cloud storage and verified payment gateways) to perform functions on our behalf. These entities only have access to information necessary to perform their respective obligations and are strictly bound by confidentiality agreements.
                    </p>
                </section>

                <section className="space-y-3 pt-6 border-t border-white/5">
                    <h2 className="text-base font-black uppercase text-white tracking-wide">
                        5. Contacting Our Data Protection Officer
                    </h2>
                    <p>
                        If you have questions regarding this Privacy Policy, your personal rights, or wish to request data erasure under GDPR, please contact our privacy desk at <a href="mailto:privacy@richpredict.com" className="text-[var(--fs-yellow)] font-mono hover:underline">privacy@richpredict.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
