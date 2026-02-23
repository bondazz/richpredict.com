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
                isExpanded ? "max-h-[8000px] opacity-100" : "max-h-[280px] opacity-90 overflow-hidden"
            )}>
                <div
                    className="prose prose-invert max-w-none text-[13px] text-white/80 leading-relaxed font-medium 
                               [&>h2]:text-[var(--fs-yellow)] [&>h2]:text-lg [&>h2]:font-black [&>h2]:uppercase [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:tracking-tighter [&>h2]:border-b [&>h2]:border-white/5 [&>h2]:pb-2
                               [&>h3]:text-white [&>h3]:text-sm [&>h3]:font-black [&>h3]:uppercase [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:tracking-tight
                               [&>p]:mb-5 [&>p]:last:mb-0
                               [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:font-black [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:text-[var(--fs-yellow)] [&>p:first-of-type]:first-letter:mt-1"
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                />

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
