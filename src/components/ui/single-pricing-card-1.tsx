"use client";
import React from 'react';
import { PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './border-trail';

export function Pricing() {
    return (
        <section className="relative min-h-screen overflow-hidden py-24">
            <div id="pricing" className="container mx-auto w-full max-w-6xl space-y-5 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-xl space-y-5"
                >
                    <div className="flex justify-center">
                        <div className="rounded-lg border px-4 py-1 font-mono text-sm">Pricing</div>
                    </div>
                    <h2 className="mt-5 text-center text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl font-outfit">
                        Unlock Premium AI Predictions
                    </h2>
                    <p className="text-muted-foreground mt-5 text-center text-sm md:text-base leading-relaxed">
                        Gain access to high-probability value bets, deep AI match analysis, and exclusive insights designed to enhance your betting strategy.
                    </p>
                </motion.div>

                <div className="relative pt-12">
                    <div
                        className={cn(
                            'z--10 pointer-events-none absolute inset-0 size-full',
                            'bg-[linear-gradient(to_right,rgba(var(--foreground),.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--foreground),.05)_1px,transparent_1px)]',
                            'bg-[size:32px_32px]',
                            '[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]',
                        )}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                        className="mx-auto w-full max-w-2xl space-y-6"
                    >
                        <div className="grid md:grid-cols-2 bg-background/50 backdrop-blur-sm relative border rounded-2xl p-4 overflow-hidden">
                            <PlusIcon className="absolute -top-3 -left-3 size-6 text-muted-foreground/30" />
                            <PlusIcon className="absolute -top-3 -right-3 size-6 text-muted-foreground/30" />
                            <PlusIcon className="absolute -bottom-3 -left-3 size-6 text-muted-foreground/30" />
                            <PlusIcon className="absolute -right-3 -bottom-3 size-6 text-muted-foreground/30" />

                            <div className="w-full px-6 pt-8 pb-6 bg-background/30">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold font-outfit">Monthly Pro</h3>
                                        <div className="flex items-center gap-x-1">
                                            <span className="text-muted-foreground text-xs line-through">$14.99</span>
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">15% OFF</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-xs">Perfect for getting started with AI insights.</p>
                                </div>
                                <div className="mt-12 space-y-6">
                                    <div className="text-muted-foreground flex items-end gap-1 text-xl">
                                        <span className="text-lg font-medium">$</span>
                                        <span className="text-foreground -mb-1 text-5xl font-extrabold tracking-tighter md:text-6xl font-outfit">
                                            12.99
                                        </span>
                                        <span className="text-sm">/mo</span>
                                    </div>
                                    <Button className="w-full py-6 rounded-xl border-2" variant="outline" asChild>
                                        <a href="#">Join Pro Monthly</a>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative w-full rounded-xl border bg-card/40 px-6 pt-8 pb-6 shadow-2xl">
                                <BorderTrail
                                    style={{
                                        boxShadow:
                                            '0px 0px 60px 30px rgba(59, 130, 246, 0.3), 0 0 100px 60px rgba(16, 185, 129, 0.2)',
                                    }}
                                    size={120}
                                />
                                <div className="space-y-2 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold font-outfit text-brand-primary">Yearly Elite</h3>
                                        <div className="flex items-center gap-x-1">
                                            <span className="text-muted-foreground text-xs line-through">$179.99</span>
                                            <Badge className="bg-brand-primary text-[10px] px-1.5 py-0">35% OFF</Badge>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-xs">Our best value for consistent long-term success!</p>
                                </div>
                                <div className="mt-12 space-y-6 relative z-10">
                                    <div className="text-muted-foreground flex items-end gap-1 text-xl">
                                        <span className="text-lg font-medium">$</span>
                                        <span className="text-foreground -mb-1 text-5xl font-extrabold tracking-tighter md:text-6xl font-outfit">
                                            9.99
                                        </span>
                                        <span className="text-sm">/mo</span>
                                    </div>
                                    <Button className="w-full py-6 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white border-0 shadow-lg shadow-brand-primary/20" asChild>
                                        <a href="#">Try Yearly Elite</a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="text-muted-foreground flex items-center justify-center gap-x-3 text-sm pt-4">
                            <ShieldCheckIcon className="size-5 text-brand-secondary" />
                            <span className="font-medium tracking-tight">Full access to AI predictions + 24/7 Priority Support</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
