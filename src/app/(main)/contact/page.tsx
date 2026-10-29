import React from 'react';
import { Metadata } from 'next';
import { Mail, MessageSquare, ShieldCheck, Clock, Send, HelpCircle, Globe, Trophy } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us, Editorial Desk & Customer Support',
    description: 'Get in touch with the RichPredict editorial team, AI sports analytics department, and 24/7 customer support for football predictions, VIP memberships, and partnerships.',
    alternates: {
        canonical: 'https://richpredict.com/contact',
    },
    openGraph: {
        title: 'Contact RichPredict Editorial & Support Team',
        description: 'Reach out to RichPredict for AI sports predictions inquiries, VIP account support, and media partnerships.',
        url: 'https://richpredict.com/contact',
        type: 'website',
    },
};

export default function ContactPage() {
    return (
        <div className="max-w-[1240px] mx-auto px-4 py-12 space-y-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            '@context': 'https://schema.org',
                            '@type': 'ContactPage',
                            name: 'Contact RichPredict Support & Editorial Team',
                            description: 'Official contact page for RichPredict AI sports predictions, customer support, editorial inquiries, and advertising partnerships.',
                            url: 'https://richpredict.com/contact',
                            mainEntity: {
                                '@type': 'Organization',
                                name: 'RichPredict',
                                url: 'https://richpredict.com',
                                email: 'support@richpredict.com',
                                contactPoint: [
                                    {
                                        '@type': 'ContactPoint',
                                        contactType: 'customer support',
                                        email: 'support@richpredict.com',
                                        availableLanguage: ['English'],
                                    },
                                    {
                                        '@type': 'ContactPoint',
                                        contactType: 'sales',
                                        email: 'partners@richpredict.com',
                                        availableLanguage: ['English'],
                                    },
                                ],
                            },
                        },
                        {
                            '@context': 'https://schema.org',
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://richpredict.com' },
                                { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://richpredict.com/contact' },
                            ],
                        },
                    ]),
                }}
            />

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--fs-yellow)] font-mono">
                    Official Support &amp; Editorial Inquiries
                </span>
                <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                    Contact RichPredict
                </h1>
                <p className="text-sm text-white/65 leading-relaxed">
                    Have questions about our mathematical <Link href="/predictions" className="text-[var(--fs-yellow)] hover:underline">football predictions</Link>, <Link href="/vip" className="text-[var(--fs-yellow)] hover:underline">VIP Premium memberships</Link>, partnership opportunities, or editorial match previews? Our dedicated analysts and support specialists are available 24/7.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information Cards */}
                <div className="space-y-4">
                    <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3 shadow-lg">
                        <div className="size-10 rounded-lg bg-[var(--fs-yellow)]/10 flex items-center justify-center text-[var(--fs-yellow)]">
                            <Mail size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase text-white tracking-wide">Direct Email Support</h2>
                        <p className="text-xs text-white/60 leading-relaxed">
                            For general questions, account verification, <Link href="/vip" className="text-[var(--fs-yellow)] hover:underline">VIP subscriptions</Link>, and technical assistance:
                        </p>
                        <a href="mailto:support@richpredict.com" className="text-xs font-bold text-[var(--fs-yellow)] hover:underline block font-mono">
                            support@richpredict.com
                        </a>
                    </div>

                    <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3 shadow-lg">
                        <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <MessageSquare size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase text-white tracking-wide">Partnership &amp; Media</h2>
                        <p className="text-xs text-white/60 leading-relaxed">
                            For <Link href="/advertise" className="text-cyan-400 hover:underline">advertising campaigns</Link>, B2B data feeds, business inquiries, and press releases:
                        </p>
                        <a href="mailto:partners@richpredict.com" className="text-xs font-bold text-cyan-400 hover:underline block font-mono">
                            partners@richpredict.com
                        </a>
                    </div>

                    <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3 shadow-lg">
                        <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase text-white tracking-wide">Operational Hours &amp; SLA</h2>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Our RP-GPT analytical models update match probabilities continuously across 160+ countries. Our support desk responds to all inquiries within 2–4 hours.
                        </p>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                            Systems Operational 24/7
                        </span>
                    </div>
                </div>

                {/* Interactive Contact Form (UI) */}
                <div className="lg:col-span-2 bg-[var(--fs-header)] border border-white/5 rounded-xl p-8 shadow-2xl space-y-6">
                    <div>
                        <h2 className="text-lg font-black uppercase text-white tracking-tight mb-2">Send Us a Message</h2>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Fill in the form below and an editorial analyst or customer support specialist will review your inquiry and reply via email.
                        </p>
                    </div>

                    <form action="mailto:support@richpredict.com" method="post" encType="text/plain" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="contact-name" className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Your Name</label>
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="e.g. Alex Smith"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[var(--fs-yellow)] focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="contact-email" className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Email Address</label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="alex@example.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[var(--fs-yellow)] focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="contact-subject" className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Subject / Inquiry Topic</label>
                            <input
                                id="contact-subject"
                                name="subject"
                                type="text"
                                placeholder="Match Prediction Feedback / Premium Account Support"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[var(--fs-yellow)] focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="contact-message" className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Your Message</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                rows={5}
                                placeholder="Write your message here with as much detail as possible..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-[var(--fs-yellow)] focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-[var(--fs-yellow)] hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-lg transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
                            >
                                <Send size={14} /> Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Editorial Departments & Quick Resources */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-2.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Trophy size={15} className="text-[var(--fs-yellow)]" />
                        Sports Analytics &amp; Editorial Desk
                    </h2>
                    <p className="text-xs text-white/60 leading-relaxed">
                        Our quantitative sports analysts cover daily fixtures across <Link href="/football" className="text-[var(--fs-yellow)] hover:underline">Football</Link>, <Link href="/tennis" className="text-[var(--fs-yellow)] hover:underline">Tennis</Link>, <Link href="/basketball" className="text-[var(--fs-yellow)] hover:underline">Basketball</Link>, and <Link href="/hockey" className="text-[var(--fs-yellow)] hover:underline">Ice Hockey</Link>, plus tactical articles in our <Link href="/news" className="text-[var(--fs-yellow)] hover:underline">Sports News</Link> section.
                    </p>
                </div>

                <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-2.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <HelpCircle size={15} className="text-[var(--fs-yellow)]" />
                        Help Center &amp; Methodology FAQ
                    </h2>
                    <p className="text-xs text-white/60 leading-relaxed">
                        Looking for immediate answers on how our xG probability models work or how to manage your subscription? Visit our <Link href="/faq" className="text-[var(--fs-yellow)] hover:underline">Frequently Asked Questions (FAQ)</Link> and <Link href="/mobile" className="text-[var(--fs-yellow)] hover:underline">Mobile Web App</Link> guide.
                    </p>
                </div>

                <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-2.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <ShieldCheck size={15} className="text-[var(--fs-yellow)]" />
                        Legal, Privacy &amp; Compliance
                    </h2>
                    <p className="text-xs text-white/60 leading-relaxed">
                        Review our corporate disclosure and regulatory policies on our <Link href="/impressum" className="text-[var(--fs-yellow)] hover:underline">Impressum</Link>, <Link href="/privacy" className="text-[var(--fs-yellow)] hover:underline">Privacy Policy</Link>, <Link href="/gdpr" className="text-[var(--fs-yellow)] hover:underline">GDPR &amp; Journalism</Link>, and <Link href="/terms" className="text-[var(--fs-yellow)] hover:underline">Terms of Use</Link> pages.
                    </p>
                </div>
            </section>
        </div>
    );
}
