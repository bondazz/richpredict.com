import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Calendar, Newspaper, Zap, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { supabase, BlogPost, getPredictions, getBlogPosts } from "@/lib/supabase";
import SidebarAd from "@/components/Ads/SidebarAd";
import { cn, generateSEOSlug } from "@/lib/utils";

export const revalidate = 3600;

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
        .limit(1)
        .maybeSingle();

    if (error || !data) return null;
    return data as BlogPost;
}

async function getMostReadNews(): Promise<BlogPost[]> {
    const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);
    return (data as BlogPost[]) || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const lowerSlug = decodeURIComponent(slug).toLowerCase().replace(/-/g, ' ');

    if (SPORTS_SLUGS.includes(lowerSlug)) {
        const capitalized = lowerSlug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const url = `https://richpredict.com/news/${lowerSlug.replace(/ /g, '-')}`;
        return {
            title: `Latest ${capitalized} News & AI Match Previews`,
            description: `Stay ahead with RichPredict ${capitalized} sports news, tactical analysis, and high-accuracy AI match predictions.`,
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

    const post = await getBlogPost(slug);
    if (!post) {
        return {
            title: 'Article Not Found',
            robots: { index: false, follow: false },
        };
    }

    const url = `https://richpredict.com/news/${slug}`;
    const authorName = "James Harrison";

    return {
        title: post.meta_title || post.title,
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
            .order('created_at', { ascending: false })
            .limit(20);

        let news = (newsData as BlogPost[]) || [];
        if (news.length === 0) {
            news = await getBlogPosts(12);
        }

        const topNews = news[0];
        const subTopNews = news.slice(1, 4);
        const moreNews = news.slice(4, 16);

        const popularSports = ['football', 'tennis', 'basketball', 'hockey', 'golf', 'baseball', 'snooker', 'volleyball'];

        return (
            <div className="flex flex-col min-h-screen bg-[#00141e] text-white font-sans">
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
                                <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white/90 font-outfit">
                                    Latest {capitalizedSport} News &amp; Match Previews
                                </h1>
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
                                            <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
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
                                            <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-sans" alt={item.title} />
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
        getPredictions(8, 'Football'),
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.meta_description || post.excerpt,
                        "image": post.image_url,
                        "datePublished": post.published_at || post.created_at,
                        "dateModified": post.updated_at || post.published_at || post.created_at,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://richpredict.com/news/${slug}`
                        },
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
                                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                                    </div>
                                    <h4 className="text-[12px] font-black leading-tight group-hover:underline group-hover:text-white transition-all text-white/70 italic line-clamp-3 font-outfit">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {predictions.length > 0 && (
                        <div className="space-y-4 bg-[#051a24] p-5 rounded-xl border border-white/5 shadow-xl">
                            <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] italic flex items-center gap-2 font-outfit">
                                <Zap size={14} className="text-[var(--fs-yellow)] fill-[var(--fs-yellow)]" /> Featured Match Previews
                            </h3>
                            <div className="space-y-2.5">
                                {predictions.map((p) => {
                                    const mSlug = generateSEOSlug(p.home_team, p.away_team, p.slug);
                                    return (
                                        <Link
                                            key={p.id}
                                            href={`/predictions/${mSlug}`}
                                            className="flex items-center justify-between text-[11px] font-bold text-white/80 hover:text-[var(--fs-yellow)] transition-colors py-1 border-b border-white/5 last:border-0"
                                        >
                                            <span className="truncate pr-2">{p.home_team} vs {p.away_team}</span>
                                            <span className="text-[10px] font-mono text-[var(--fs-yellow)] shrink-0">{p.confidence || '75%'}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </article>
    );
}
