import React from 'react';
import { Metadata } from 'next';
import { Mail, MessageSquare, ShieldCheck, Clock, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us & Editorial Support',
    description: 'Get in touch with the RichPredict editorial team, analytics department, and customer support. We are here to assist with your sports predictions inquiries.',
    alternates: {
        canonical: 'https://richpredict.com/contact',
    },
};

export default function ContactPage() {
    return (
        <div className="max-w-[1240px] mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--fs-yellow)] font-mono">
                    Official Support & Inquiries
                </span>
                <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                    Contact RichPredict
                </h1>
                <p className="text-sm text-white/60 leading-relaxed">
                    Have questions about our AI sports predictions, subscription plans, partnership opportunities, or editorial feedback? Our dedicated team is available 24/7.
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
                        <p className="text-xs text-white/60">For general questions, subscriptions, and technical assistance:</p>
                        <a href="mailto:support@richpredict.com" className="text-xs font-bold text-[var(--fs-yellow)] hover:underline block font-mono">
                            support@richpredict.com
                        </a>
                    </div>

                    <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3 shadow-lg">
                        <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <MessageSquare size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase text-white tracking-wide">Partnership & Media</h2>
                        <p className="text-xs text-white/60">For advertising, business inquiries, and press releases:</p>
                        <a href="mailto:partners@richpredict.com" className="text-xs font-bold text-cyan-400 hover:underline block font-mono">
                            partners@richpredict.com
                        </a>
                    </div>

                    <div className="bg-[var(--fs-header)] border border-white/5 rounded-xl p-6 space-y-3 shadow-lg">
                        <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase text-white tracking-wide">Operational Hours</h2>
                        <p className="text-xs text-white/60">Analytical models update continuously. Support team responds within 2-4 hours.</p>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                            Systems Operational 24/7
                        </span>
                    </div>
                </div>

                {/* Interactive Contact Form (UI) */}
                <div className="lg:col-span-2 bg-[var(--fs-header)] border border-white/5 rounded-xl p-8 shadow-2xl">
                    <h2 className="text-lg font-black uppercase text-white tracking-tight mb-2">Send Us a Message</h2>
                    <p className="text-xs text-white/50 mb-6">Fill in the form below and an analyst or support specialist will review your inquiry.</p>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="contact-name" className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Your Name</label>
                                <input
                                    id="contact-name"
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
        </div>
    );
}
