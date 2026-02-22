import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronUp } from 'lucide-react';
import { BlogPost } from '@/lib/supabase';

interface Props {
    posts: BlogPost[];
}

export const RichPredictNews = ({ posts }: Props) => {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="bg-[#00141e] rounded-sm border border-white/5 overflow-hidden shadow-2xl my-3">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-black/20 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
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
                    <h2 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-1.5">
                        Rich<span className="text-[var(--fs-yellow)]">Predict</span> News
                    </h2>
                </div>
                <ChevronUp className="text-white/40 w-4 h-4" />
            </div>

            {/* News Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {posts.slice(0, 3).map((post) => (
                    <Link
                        key={post.id}
                        href={`/news/${post.slug}`}
                        className="group flex flex-col gap-3"
                    >
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-white/5">
                            {post.image_url ? (
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/5">
                                    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
                                        <path d="M21 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H21C22.1046 21 23 20.1046 23 19V5C23 3.89543 22.1046 3 21 3ZM21 19H3V5H21V19ZM17 8H14V11H17V8ZM17 13H14V16H17V13ZM12 8H7V11H12V8ZM12 13H7V16H12V13Z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-xs md:text-[13px] font-bold text-white/90 leading-snug group-hover:text-white transition-colors line-clamp-3">
                            {post.title}
                        </h3>
                    </Link>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/5 flex justify-center">
                <Link
                    href="/news"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-white/60 hover:text-white transition-colors group"
                >
                    Go to News
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
