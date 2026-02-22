import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronUp, Newspaper } from 'lucide-react';
import { BlogPost } from '@/lib/supabase';

interface Props {
    posts: BlogPost[];
}

export const RichPredictNews = ({ posts }: Props) => {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="sportName soccer overflow-hidden rounded-sm border border-white/5 shadow-2xl my-4 relative group/news">
            {/* Header - Perfect Height & Style Match with League Headers */}
            <div className="headerLeague__wrapper bg-gradient-to-b from-[#164e63] to-[#083344] border-t border-white/20 border-b border-black/40 shadow-lg relative z-10">
                <div className="wcl-header_HrElx py-2.5 px-3 flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                        {/* 1:1 Official Logo Integration */}
                        <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 160 100" fill="currentColor" className="w-full h-full">
                                <g className="text-white">
                                    <path d="M21.1 55.1C20.6 52.5 20.5 50 20.8 47.5L0.2 45.6C-0.2 49.9 0 54.2 0.8 58.6C1.6 63 2.9 67.2 4.7 71.1L23.4 62.4C22.4 60.1 21.6 57.7 21.1 55.1Z" />
                                    <path d="M27.6 68.8L11.7 82.1C16.4 87.7 22.3 92.2 28.9 95.3L37.6 76.6C33.8 74.7 30.3 72.1 27.6 68.8Z" />
                                    <path d="M55.1 78.9C52.5 79.4 49.9 79.5 47.5 79.2L45.7 99.8C50 100.2 54.3 100 58.7 99.2C60.1 98.9 61.6 98.6 63 98.3L57.6 78.3C56.8 78.5 55.9 78.7 55.1 78.9Z" />
                                    <path d="M44.9 21.1C48.4 20.5 52 20.5 55.3 21.1L64.2 2C57 0 49.2 -0.6 41.3 0.8C21.6 4.3 6.6 19 1.7 37.2L21.7 42.6C24.6 31.9 33.3 23.3 44.9 21.2Z" />
                                    <path d="M68.8 72.5L82.1 88.3C85.4 85.5 88.4 82.2 90.9 78.7L74 66.8C72.5 68.9 70.8 70.8 68.8 72.5Z" />
                                    <path d="M99.8 45.6L79.2 47.4C79.4 49.1 79.4 50.8 79.2 52.5L99.8 54.3C100.1 51.5 100.1 48.6 99.8 45.6Z" />
                                </g>
                                <path d="M73.3 0L54.1 41.3L137.2 0Z" fill="var(--fs-yellow)" />
                            </svg>
                        </div>
                        {/* Official Branding Text Style */}
                        <span className="text-[14px] md:text-[15px] font-black tracking-tighter text-white uppercase font-[Klapt] leading-none ml-[-6px] md:ml-[-8px] truncate drop-shadow-md">
                            RICH<span className="text-[var(--fs-yellow)]">PREDICT</span> <span className="font-sans text-[9px] md:text-[10px] text-white/40 ml-1 tracking-[0.2em] font-black italic">NEWS</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <ChevronUp className="text-white/40 w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* News Context with Overlay Gradient Edges */}
            <div className="relative bg-[var(--fs-header)] border-b border-black/10">
                {/* Horizontal Depth Overlay Decor */}
                <div className="absolute inset-0 pointer-events-none border-x border-white/5 z-20" />

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 p-4 gap-6 md:gap-0">
                    {posts.slice(0, 3).map((post) => (
                        <Link
                            key={post.id}
                            href={`/news/${post.slug}`}
                            className="group relative flex flex-col md:px-5 first:pl-0 last:pr-0"
                        >
                            {/* Card Image with Internal Overlay and Dual Border */}
                            <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-white/5 border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] mb-3">
                                {post.image_url ? (
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10 bg-gradient-to-br from-black/20 to-transparent">
                                        <Newspaper size={40} strokeWidth={1} />
                                    </div>
                                )}
                                {/* Overlay Shadow for Depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-90" />

                                {/* Inner "Overlay" Edge look */}
                                <div className="absolute inset-0 border border-white/[0.05] pointer-events-none rounded-sm" />

                                {/* Featured Tag style overlay */}
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--fs-yellow)] text-black text-[7px] font-black uppercase tracking-tighter rounded-sm shadow-xl z-20">
                                    TRENDING
                                </div>
                            </div>

                            {/* Title with brand-specific line height and color */}
                            <h3 className="text-[12px] md:text-[13.5px] font-bold text-white/95 leading-tight group-hover:text-[var(--fs-yellow)] transition-all duration-300 line-clamp-2 md:h-10">
                                {post.title}
                            </h3>

                            {/* Subtle metadata overlay */}
                            <div className="flex items-center gap-2 mt-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                <span className="w-4 h-[1px] bg-white/40" />
                                <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                                    MATCH_INSIGHT
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Section - Premium Styled */}
                <div className="p-4 border-t border-white/5 bg-black/20 flex justify-center mt-2">
                    <Link
                        href="/news"
                        className="group/btn px-8 py-2 text-[10px] font-black uppercase bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-md text-white/60 hover:text-white hover:border-[var(--fs-yellow)] transition-all tracking-[0.3em] flex items-center gap-3"
                    >
                        GO TO ALL NEWS
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--fs-yellow)] group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
