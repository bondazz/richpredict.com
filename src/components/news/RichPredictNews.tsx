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
        <div className="sportName soccer overflow-hidden rounded-sm border border-white/5 shadow-xl my-4 relative">
            {/* Header - EXACT League Header Height Match (38px) */}
            <div className="headerLeague__wrapper bg-gradient-to-b from-[#164e63] to-[#083344] border-t border-white/20 border-b border-black/40 shadow-lg relative z-10 h-[38px]">
                <div className="wcl-header_HrElx flex items-center justify-between h-full px-3 py-0">
                    <div className="flex items-center min-w-0">
                        {/* Shrunk Logo to match League Icon size */}
                        <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center shrink-0">
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
                        {/* Adjusted Text and White News Label */}
                        <span className="text-[11px] md:text-[12px] font-black tracking-tighter text-white uppercase font-[Klapt] leading-none ml-1.5 truncate drop-shadow-sm">
                            RICH<span className="text-[var(--fs-yellow)]">PREDICT</span> <span className="font-sans text-[9px] text-white ml-2 tracking-widest font-black italic">NEWS</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <ChevronUp className="text-white/40 w-4 h-4 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* News Context */}
            <div className="relative bg-[var(--fs-header)] border-b border-black/10">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-white/10 md:divide-y-0 md:divide-x p-4 gap-4 md:gap-0">
                    {posts.slice(0, 3).map((post) => (
                        <Link
                            key={post.id}
                            href={`/news/${post.slug}`}
                            className="group relative flex flex-row md:flex-col items-center md:items-start md:px-5 first:pl-0 last:pr-0 pt-4 first:pt-0 md:pt-0"
                        >
                            {/* IMAGE - Responsive Layout (Large on desktop, Small on mobile) */}
                            <div className="relative w-[100px] md:w-full aspect-[16/9] overflow-hidden rounded-lg bg-white/5 border border-white/10 shadow-lg mb-0 md:mb-3 shrink-0">
                                {post.image_url ? (
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/5 bg-gradient-to-br from-black/20 to-transparent">
                                        <Newspaper size={30} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                                <div className="absolute top-1 right-1 px-1 py-0.5 bg-[var(--fs-yellow)] text-black text-[6px] font-black uppercase tracking-tighter rounded-sm z-20 shadow-lg">
                                    TRENDING
                                </div>
                            </div>

                            {/* TEXT CONTENT */}
                            <div className="flex-1 ml-4 md:ml-0 flex flex-col justify-center">
                                <h3 className="text-[11px] md:text-[12px] font-bold text-white/90 leading-tight group-hover:text-[var(--fs-yellow)] transition-colors line-clamp-3 md:line-clamp-2 md:h-10">
                                    {post.title}
                                </h3>

                                <div className="flex items-center gap-2 mt-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <span className="w-4 h-[1px] bg-white/30" />
                                    <span className="text-[7px] font-black text-white uppercase tracking-widest">MATCH_INSIGHT</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Simplified Centered SEO Link */}
                <div className="py-4 flex justify-center border-t border-white/5">
                    <Link
                        href="/news"
                        title="Go to RichPredict News"
                        className="text-[10px] font-bold text-white/40 hover:text-white transition-all duration-300 flex items-center gap-1 group/more"
                    >
                        <span className="underline underline-offset-4 decoration-white/0 group-hover/more:decoration-white transition-all">Go to News</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
