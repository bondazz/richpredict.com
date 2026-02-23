import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Calendar, Share2, ChevronLeft, User, Newspaper, Trophy, Zap, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { supabase, BlogPost, Prediction, getPredictions } from "@/lib/supabase";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import SidebarAd from "@/components/Ads/SidebarAd";

interface Props {
    params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !data) return null;
    return data as BlogPost;
}

async function getMostReadNews(): Promise<BlogPost[]> {
    const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(5);
    return (data as BlogPost[]) || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.meta_title || post.title} | RichPredict News`,
        description: post.meta_description || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.og_image_url || post.image_url || '/og-news.jpg'],
            type: 'article',
            publishedTime: post.published_at || post.created_at,
            authors: [post.author || 'RichPredict AI'],
        }
    };
}

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params;

    const [post, predictions, mostRead] = await Promise.all([
        getBlogPost(slug),
        getPredictions(10, 'Football'),
        getMostReadNews()
    ]);

    if (!post) notFound();

    return (
        <article className="min-h-screen bg-[#00141e] text-white font-sans pb-20">
            {/* SEO Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "image": post.image_url,
                        "datePublished": post.published_at || post.created_at,
                        "author": { "@type": "Person", "name": post.author || "RichPredict AI" }
                    })
                }}
            />

            {/* Top Navigation */}
            <div className="bg-[#0b1f27] border-b border-white/5 py-3 sticky top-0 z-40">
                <div className="max-w-[1240px] mx-auto w-full px-2 flex items-center justify-between">
                    <Link href="/news" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                        <ChevronLeft size={16} /> BACK TO NEWS
                    </Link>
                    <div className="flex gap-4">
                        <Share2 size={16} className="text-zinc-500 cursor-pointer hover:text-white" />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="max-w-[1240px] mx-auto w-full px-2 py-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">

                {/* Center Content Column */}
                <div className="space-y-6 bg-[#051a24] p-5 md:p-8 rounded-xl border border-white/5 shadow-2xl h-fit">

                    {/* 1. H1 Header (Reduced size) */}
                    <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight text-white mb-4">
                        {post.title}
                    </h1>

                    {/* 2. Meta Info: Author and Date */}
                    <div className="flex flex-wrap items-center gap-6 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">
                        <div className="flex items-center gap-2">
                            <User size={13} className="text-red-500" />
                            <span className="text-white/60">{post.author || 'RichPredict AI'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-red-500" />
                            <span className="text-white/60">
                                {new Date(post.published_at || post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={13} className="text-red-500" />
                            <span className="text-white/60">{post.reading_time || 5} MIN READ</span>
                        </div>
                    </div>

                    {/* 3. Featured Image + Alt Text (Non-bulky, White text) */}
                    <div className="space-y-3 mb-8">
                        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl bg-black border border-white/5 shadow-lg">
                            {post.image_url ? (
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover opacity-90"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/5">
                                    <Newspaper size={40} strokeWidth={1} />
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-red-600/90 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm backdrop-blur-sm">
                                    {post.category || 'FOOTBALL'}
                                </span>
                            </div>
                        </div>
                        {/* Shorter, White Alt Text underneath */}
                        <p className="text-[10px] md:text-xs text-white/60 italic leading-snug px-1">
                            {post.excerpt ? `Featured info: ${post.excerpt.split('. ')[0]}.` : 'Visual assets for RichPredict Match Intelligence.'}
                        </p>
                    </div>

                    <div className="py-2">
                        <InnerAdBanner />
                    </div>

                    {/* 4. Highly Readable Content Area */}
                    <div className="rich-text-wrapper overflow-hidden border-t border-white/5 pt-8">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .rich-text-area {
                                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                                color: #e2e8f0; /* slate-200 - even more readable */
                                font-size: 18px;
                                line-height: 1.8;
                            }
                            .rich-text-area h2 {
                                font-size: 28px;
                                font-weight: 900;
                                text-transform: uppercase;
                                letter-spacing: -0.04em;
                                color: #ffffff;
                                margin-top: 40px;
                                margin-bottom: 20px;
                                line-height: 1.2;
                            }
                            .rich-text-area h3 {
                                font-size: 20px;
                                font-weight: 800;
                                text-transform: uppercase;
                                color: #ffffff;
                                margin-top: 30px;
                                margin-bottom: 15px;
                            }
                            .rich-text-area p {
                                margin-bottom: 28px;
                            }
                            .rich-text-area b, .rich-text-area strong {
                                color: #ffffff;
                                font-weight: 900;
                            }
                            .rich-text-area a {
                                color: #ff3b30; /* flashscore red */
                                text-decoration: underline;
                                font-weight: 700;
                                transition: color 0.2s;
                            }
                            .rich-text-area a:hover {
                                color: #ffffff;
                                text-decoration-thickness: 2px;
                            }
                            .rich-text-area blockquote {
                                border-left: 4px solid #ff3b30;
                                background: rgba(255, 255, 255, 0.02);
                                padding: 20px 28px;
                                border-radius: 8px;
                                font-style: italic;
                                margin: 32px 0;
                                color: #ffffff;
                                line-height: 1.6;
                            }
                            .rich-text-area ul {
                                list-style-type: square;
                                padding-left: 20px;
                                margin-bottom: 28px;
                            }
                            .rich-text-area li {
                                margin-bottom: 12px;
                            }
                            .rich-text-area img {
                                border-radius: 12px;
                                margin: 40px 0;
                                border: 1px solid rgba(255, 255, 255, 0.05);
                                width: 100%;
                                height: auto;
                            }
                        ` }} />
                        <div
                            className="rich-text-area"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>

                {/* Right Sidebar - Exactly like Home Page */}
                <aside className="hidden lg:flex flex-col space-y-6">
                    {/* VIP PREMIUM CARD */}
                    <div className="bg-[#001e28] border border-[var(--fs-yellow)]/20 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--fs-yellow)]/10 rounded-full blur-[60px]" />
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-[var(--fs-yellow)] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,221,0,0.2)]">
                                <Trophy className="w-6 h-6 text-black" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white font-[Klapt]">
                                    VIP <span className="text-[var(--fs-yellow)]">PREMIUM</span>
                                </h3>
                            </div>
                            <p className="text-[11px] font-bold text-white/50 leading-relaxed font-sans">
                                Get 95%+ accurate AI predictions and exclusive analytics.
                            </p>
                            <button className="w-full bg-[var(--fs-yellow)] text-black py-3 rounded-lg text-[11px] font-[Klapt] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                UNLOCK ACCESS <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    <SidebarAd />

                    {/* Most Read Sidebar */}
                    <div className="space-y-6 bg-[#051a24] p-5 rounded-xl border border-white/5 shadow-xl">
                        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2 px-1">
                            <Zap size={14} className="text-red-500 fill-red-500" /> Most Read
                        </h3>
                        <div className="space-y-6">
                            {mostRead.map((item) => (
                                <Link key={item.id} href={`/news/${item.slug}`} className="flex gap-3 group items-start border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                    <div className="w-[100px] h-[60px] shrink-0 overflow-hidden rounded-lg bg-black">
                                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                    <h4 className="text-[12px] font-black leading-tight group-hover:underline group-hover:text-white transition-all text-white/70 italic line-clamp-3">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Signal_Probability Section */}
                    <div className="space-y-4 px-1">
                        <h3 className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 italic font-sans px-2">
                            <Zap className="w-3 h-3 text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" /> Signal_Probability
                        </h3>
                        <div className="bg-[#051a24]/40 p-3 rounded-xl border border-white/5 space-y-4">
                            {predictions.slice(0, 5).map((p, i) => (
                                <div key={i} className="space-y-1.5 px-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase text-white/60 truncate max-w-[120px]">{p.home_team}</span>
                                        <span className="text-[var(--fs-yellow)] font-bold font-mono text-[10px]">{p.confidence || '74%'}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[var(--fs-yellow)] shadow-[0_0_8px_rgba(255,228,56,0.3)]" style={{ width: p.confidence || '74%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
        </article>
    );
}
