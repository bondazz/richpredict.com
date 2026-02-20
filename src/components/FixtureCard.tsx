"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface FixtureCardProps {
    match: {
        id: string;
        league: string;
        homeTeam: string;
        awayTeam: string;
        homeLogo: string;
        awayLogo: string;
        time: string;
        date: string;
        prediction: {
            type: string;
            probability: number;
        };
        isPremium: boolean;
    };
}

export default function FixtureCard({ match }: FixtureCardProps) {
    return (
        <div className={cn(
            "group relative bg-card/40 border rounded-2xl p-5 hover:border-brand-primary/50 transition-all duration-300",
            match.isPremium && "border-brand-primary/20"
        )}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {match.league}
                </span>
                <div className="flex items-center gap-2">
                    {match.isPremium && (
                        <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 flex gap-1 items-center px-1.5 py-0">
                            <Lock className="w-2.5 h-2.5" />
                            ELITE
                        </Badge>
                    )}
                    <span className="text-xs font-medium text-muted-foreground">{match.time}</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="relative w-14 h-14 bg-background border rounded-full p-2.5 group-hover:scale-110 transition-transform">
                        <Image src={match.homeLogo} alt={match.homeTeam} fill className="object-contain p-2" />
                    </div>
                    <span className="text-sm font-bold font-outfit text-center line-clamp-1">{match.homeTeam}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-muted-foreground px-2 py-1 bg-muted rounded-lg">VS</span>
                </div>

                <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="relative w-14 h-14 bg-background border rounded-full p-2.5 group-hover:scale-110 transition-transform">
                        <Image src={match.awayLogo} alt={match.awayTeam} fill className="object-contain p-2" />
                    </div>
                    <span className="text-sm font-bold font-outfit text-center line-clamp-1">{match.awayTeam}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">AI Tip</span>
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-brand-secondary fill-brand-secondary" />
                        <span className="text-sm font-bold text-foreground">{match.prediction.type}</span>
                        <span className="text-xs font-bold text-brand-secondary">{match.prediction.probability}%</span>
                    </div>
                </div>

                <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 group/btn" asChild>
                    <Link href={`/predictions/${match.id}`}>
                        <span className="text-xs font-bold">Analysis</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </Button>
            </div>

            {match.isPremium && (
                <div className="absolute inset-0 bg-background/5 backdrop-blur-[2px] pointer-events-none rounded-2xl" />
            )}
        </div>
    );
}
