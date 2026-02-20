"use client";

import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PremiumBlurProps {
    children: React.ReactNode;
    isPremium: boolean;
    hasAccess?: boolean;
    title?: string;
    description?: string;
}

export function PremiumBlur({
    children,
    isPremium,
    hasAccess = false,
    title = "Premium AI Analysis",
    description = "Get full access to our deep neural network analytics and win probabilities."
}: PremiumBlurProps) {
    if (!isPremium || hasAccess) {
        return <>{children}</>;
    }

    return (
        <div className="relative overflow-hidden rounded-3xl border border-brand-primary/20">
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-background/40 backdrop-blur-xl">
                <div className="bg-brand-primary/10 p-4 rounded-2xl mb-4 text-brand-primary border border-brand-primary/20">
                    <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-outfit mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm max-w-xs mb-8">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <Button className="flex-1 bg-brand-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-brand-primary/20">
                        Unlock Full Access
                    </Button>
                    <Button variant="outline" className="flex-1 border-2 font-bold h-12 rounded-xl">
                        View Plans
                    </Button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
                    <ShieldCheck className="w-4 h-4 text-brand-secondary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Elite Member Protection</span>
                </div>
            </div>
            <div className="blur-md pointer-events-none select-none select-none [&_*]:pointer-events-none">
                {children}
            </div>
        </div>
    );
}
