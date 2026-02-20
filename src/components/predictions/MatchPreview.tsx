"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchPreviewProps {
    content: string;
}

export default function MatchPreview({ content }: MatchPreviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Default placeholder if content is empty or generic
    const displayContent = content || "Institutional node sync reveals a significant advantage. Market density is concentrating on high-probability outcomes. Detailed match dynamics show strong correlation between early pressure and final score output.";

    return (
        <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm overflow-hidden">
            <div
                className="bg-black/20 px-4 py-2 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-black/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-[var(--fs-yellow)] rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Preview</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-[var(--fs-yellow)] uppercase">
                    {isExpanded ? "Show less" : "Show full preview"}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </div>
            </div>

            <div className={cn(
                "p-6 transition-all duration-500 ease-in-out relative",
                isExpanded ? "max-h-[2000px] opacity-100" : "max-h-[120px] opacity-80 overflow-hidden"
            )}>
                <div className="text-[12px] md:text-[13px] text-white/80 leading-relaxed font-medium space-y-6">
                    {displayContent.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={idx === 0 ? "first-letter:text-3xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-[var(--fs-yellow)]" : ""}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                {!isExpanded && (
                    <div
                        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--fs-header)] to-transparent cursor-pointer"
                        onClick={() => setIsExpanded(true)}
                    />
                )}
            </div>
        </section>
    );
}
