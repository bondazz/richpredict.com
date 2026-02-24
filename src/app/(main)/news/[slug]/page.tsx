import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Calendar, ChevronLeft, User, Newspaper, Trophy, Zap, ArrowRight, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { supabase, BlogPost, getPredictions } from "@/lib/supabase";
import InnerAdBanner from "@/components/Ads/InnerAdBanner";
import SidebarAd from "@/components/Ads/SidebarAd";
import { cn } from "@/lib/utils";

const SPORTS_SLUGS = [
    'football', 'tennis', 'basketball', 'hockey', 'golf', 'baseball', 'snooker', 'volleyball',
    'am. football', 'darts', 'motorsport', 'aussie rules', 'esports', 'netball', 'badminton',
    'field hockey', 'pesäpallo', 'bandy', 'floorball', 'rugby league', 'beach soccer', 'futsal',
    'rugby union', 'beach volleyball', 'handball', 'table tennis', 'boxing', 'horse racing',
    'water polo', 'cricket', 'kabaddi', 'winter sports', 'cycling', 'mma'
];

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
    const lowerSlug = decodeURIComponent(slug).toLowerCase();

    // 1. Check if it's a Sport Listing Page
    if (SPORTS_SLUGS.includes(lowerSlug)) {
        const capitalized = lowerSlug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const url = `https://richpredict.com/news/${lowerSlug.replace(/ /g, '-')}`;
        return {
            title: `Latest ${capitalized} News & AI Predictions | RICHPREDICT`,
            description: `Stay ahead with RICHPREDICT Latest ${capitalized} Sports News. Expert analysis and high-accuracy predictions.`,
            alternates: { canonical: url },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        };
    }

    // 2. Otherwise it's an Article Page
    const post = await getBlogPost(slug);
    if (!post) return { title: 'Post Not Found' };

    const url = `https://richpredict.com/news/${slug}`;
    const authorName = "James Harrison";

    return {
        title: `${post.meta_title || post.title} | RichPredict News`,
        description: post.meta_description || post.excerpt,
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: url,
            images: [post.og_image_url || post.image_url || '/og-news.jpg'],
            type: 'article',
            publishedTime: post.published_at || post.created_at,
            authors: [authorName],
        }
    };
}

export default async function NewsDynamicPage({ params }: Props) {
    const { slug } = await params;
    const lowerSlug = decodeURIComponent(slug).toLowerCase().replace(/-/g, ' ');

    // --- CASE A: SPORT LISTING PAGE ---
    if (SPORTS_SLUGS.includes(lowerSlug)) {
        const capitalizedSport = lowerSlug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        const { data: newsData } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .or(lowerSlug === 'football'
                ? `category.ilike.%football%,category.ilike.%match preview%`
                : `category.ilike.%${lowerSlug}%`)
            .order('published_at', { ascending: false })
            .limit(20);

        const news = (newsData as BlogPost[]) || [];
        const predictions = await getPredictions(10, lowerSlug === 'football' ? 'Football' : 'Tennis');

        const topNews = news[0];
        const subTopNews = news.slice(1, 4);
        const mostRead = news.slice(4, 9);
        const moreNews = news.slice(9, 20);

        const popularSports = ['football', 'tennis', 'basketball', 'hockey', 'golf', 'baseball', 'snooker', 'volleyball'];

        return (
            <div className="flex flex-col min-h-screen bg-[#00141e] text-white font-sans">
                {/* News Category Bar */}
                <div className="bg-[#0b1f27] border-b border-white/5 py-3 overflow-x-auto scrollbar-hide">
                    <div className="max-w-[1240px] mx-auto w-full px-4 flex items-center gap-6 min-w-max">
                        <Link href="/news" className="text-[11px] font-bold uppercase tracking-tight text-white/60 border-transparent hover:text-white pb-1 border-b-2">
                            ALL NEWS
                        </Link>
                        {popularSports.map((cat) => (
                            <Link
                                key={cat}
                                href={`/news/${cat}`}
                                className={cn(
                                    "text-[11px] font-bold uppercase tracking-tight transition-all pb-1 border-b-2",
                                    cat === lowerSlug ? "text-white border-red-500" : "text-white/60 border-transparent hover:text-white"
                                )}
                            >
                                {cat.toUpperCase()}
                            </Link>
                        ))}
                    </div>
                </div>

                <main className="max-w-[1240px] mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                    <div className="space-y-8">
                        <section className="bg-[#051a24] rounded-xl overflow-hidden shadow-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white/90 font-outfit">
                                    Latest {capitalizedSport} News & Predictions
                                </h2>
                            </div>

                            <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2">
                                Top Stories
                            </h2>

                            {topNews ? (
                                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 mb-10 group cursor-pointer">
                                    <Link href={`/news/${topNews.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black">
                                        <img src={topNews.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={topNews.title} />
                                    </Link>
                                    <div className="flex flex-col justify-center">
                                        <Link href={`/news/${topNews.slug}`}>
                                            <h2 className="text-xl md:text-3xl font-black leading-[1.1] group-hover:text-white transition-colors uppercase font-outfit">
                                                {topNews.title}
                                            </h2>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center italic text-white/20 uppercase tracking-widest text-[10px]">No {lowerSlug} news available at the moment.</div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {subTopNews.map((item) => (
                                    <Link key={item.id} href={`/news/${item.slug}`} className="group space-y-3">
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black border border-white/5">
                                            <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                            <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black/80 to-transparent">
                                                <div className="text-[8px] font-black text-white/60 uppercase tracking-widest flex flex-col font-sans">
                                                    <span className="text-red-500 leading-none mb-1">{capitalizedSport.toUpperCase()}</span>
                                                    <span className="leading-none">INSIDER</span>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-[13px] font-bold leading-tight group-hover:text-white transition-colors font-outfit">
                                            {item.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-5 bg-red-500 rounded-full" />
                                <h2 className="text-lg font-bold uppercase tracking-tight font-outfit">More {capitalizedSport} Stories</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {moreNews.map((item) => (
                                    <Link key={item.id} href={`/news/${item.slug}`} className="flex gap-4 group cursor-pointer bg-[#051a24] p-3 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-all">
                                        <div className="w-[140px] h-[85px] shrink-0 overflow-hidden rounded-lg relative bg-black">
                                            <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-sans" alt="" />
                                        </div>
                                        <div className="flex flex-col justify-center space-y-1">
                                            <h3 className="text-[14px] font-bold leading-tight group-hover:text-red-500 transition-colors line-clamp-2 italic font-outfit">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest font-sans">
                                                <span className="text-red-500/60">{capitalizedSport.toUpperCase()}</span>
                                                <span className="text-[10px] font-black text-white/70 uppercase tracking-tighter">
                                                    • {item.category?.toLowerCase() === 'match preview' ? 'Football' : (item.category || 'General')}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="hidden lg:flex flex-col space-y-6">
                        <SidebarAd />
                    </aside>
                </main>
            </div>
        );
    }

    // --- CASE B: ARTICLE DETAIL PAGE ---
    const [post, predictions, mostRead] = await Promise.all([
        getBlogPost(slug),
        getPredictions(10, 'Football'),
        getMostReadNews()
    ]);

    if (!post) notFound();

    const getSportLabel = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('football') || cat.includes('match preview')) return 'Football';

        const found = SPORTS_SLUGS.find(s => cat.includes(s));
        if (found) return found.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        return 'Football';
    };

    const sportLabel = getSportLabel(post.category || 'Football');
    const sportSlug = sportLabel.toLowerCase().replace(/ /g, '-');
    const authorName = "James Harrison";

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": `RichPredict News`,
                "item": `https://richpredict.com/news`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": `${sportLabel} News`,
                "item": `https://richpredict.com/news/${sportSlug}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://richpredict.com/news/${slug}`
            }
        ]
    };

    return (
        <article className="min-h-screen bg-[#00141e] text-white font-sans pb-20">
            {/* SEO Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "image": post.image_url,
                        "datePublished": post.published_at || post.created_at,
                        "author": { "@type": "Person", "name": authorName },
                        "publisher": {
                            "@type": "Organization",
                            "name": "RichPredict",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://richpredict.com/logo.png"
                            }
                        }
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <div className="bg-[#0b1f27] border-b border-white/5 py-6">
                <div className="max-w-[1240px] mx-auto w-full px-4">
                    <nav className="flex items-center flex-wrap gap-x-3 gap-y-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest overflow-hidden">
                        <Link href="/news" className="text-white hover:text-[var(--fs-yellow)] transition-colors whitespace-nowrap">
                            RichPredict News
                        </Link>
                        <ChevronRight size={12} className="text-[var(--fs-yellow)] shrink-0" strokeWidth={4} />
                        <Link href={`/news/${sportSlug}`} className="text-white hover:text-[var(--fs-yellow)] transition-colors whitespace-nowrap">
                            {sportLabel} News
                        </Link>
                        <ChevronRight size={12} className="text-[var(--fs-yellow)] shrink-0" strokeWidth={4} />
                        <span className="text-white/40 truncate font-bold">{post.title}</span>
                    </nav>
                </div>
            </div>

            <main className="max-w-[1240px] mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                <div className="bg-[#051a24] p-5 md:p-10 rounded-xl border border-white/5 shadow-2xl h-fit overflow-hidden">
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-[1.05] text-white mb-6 font-outfit">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-10 pb-6 border-b border-white/5 font-outfit">
                        <div className="flex items-center gap-2.5">
                            <div className="size-7 overflow-hidden rounded-full border border-white/10 ring-2 ring-white/5">
                                <img src={`https://i.pravatar.cc/150?u=${authorName}`} alt={authorName} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-white/70">{authorName}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Calendar size={14} className="text-[var(--fs-yellow)]" strokeWidth={2.5} />
                            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Clock size={14} className="text-[var(--fs-yellow)]" strokeWidth={2.5} />
                            <span>{post.reading_time || 5} MIN READ</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-black border border-white/5 shadow-2xl">
                            {post.image_url ? (
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/5">
                                    <Newspaper size={60} strokeWidth={1} />
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-red-600/90 text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-md backdrop-blur-md shadow-lg">
                                    MATCH PREVIEW
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rich-text-wrapper overflow-hidden border-t border-white/5 pt-8">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .rich-text-area { font-family: 'Outfit', sans-serif; color: #e2e8f0; font-size: 18px; line-height: 1.8; }
                            .rich-text-area h2 { font-size: 28px; font-weight: 900; text-transform: uppercase; color: #ffffff; margin-top: 40px; margin-bottom: 20px; }
                            .rich-text-area p { margin-bottom: 28px; }
                            .rich-text-area b, .rich-text-area strong { color: #ffffff; font-weight: 900; }
                            .rich-text-area a { color: #ff3b30; text-decoration: underline; font-weight: 700; }
                            .rich-text-area blockquote { border-left: 4px solid #ff3b30; background: rgba(255, 255, 255, 0.02); padding: 20px 28px; border-radius: 8px; font-style: italic; margin: 32px 0; color: #ffffff; }
                        ` }} />
                        <div className="rich-text-area" dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>

                <aside className="hidden lg:flex flex-col space-y-6 shrink-0">
                    <SidebarAd />
                    <div className="space-y-6 bg-[#051a24] p-5 rounded-xl border border-white/5 shadow-xl">
                        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2 font-outfit">
                            <Zap size={14} className="text-red-500 fill-red-500" /> Most Read
                        </h3>
                        <div className="space-y-6">
                            {mostRead.map((item) => (
                                <Link key={item.id} href={`/news/${item.slug}`} className="flex gap-3 group items-start border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                    <div className="w-[100px] h-[60px] shrink-0 overflow-hidden rounded-lg bg-black">
                                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                    <h4 className="text-[12px] font-black leading-tight group-hover:underline group-hover:text-white transition-all text-white/70 italic line-clamp-3 font-outfit">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
        </article>
    );
}
