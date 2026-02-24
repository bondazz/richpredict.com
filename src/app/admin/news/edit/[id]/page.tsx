"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    Image as ImageIcon,
    Globe,
    Eye,
    Code,
    Bold,
    Italic,
    Link as LinkIcon,
    List,
    Quote,
    Settings,
    Tag,
    Share2,
    Calendar,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase, BlogPost, updateBlogPost } from '@/lib/supabase';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [form, setForm] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image_url: '',
        category: 'Football',
        published: true,
        language: 'en',
        meta_title: '',
        meta_description: '',
        tags: [],
        author: 'RichPredict AI'
    });

    // Fetch existing post data
    useEffect(() => {
        async function fetchPost() {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) {
                    setForm(data);
                }
            } catch (err) {
                console.error('Fetch post failed:', err);
                alert('Could not load post data.');
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Don't auto-update slug on edit unless user wants to, 
        // but we'll keep the logic if you want to regenerate it.
        setForm(prev => ({
            ...prev,
            title,
            meta_title: title
        }));
    };

    const insertTag = (tag: string, endTag?: string) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        const selection = text.substring(start, end);

        const newContent = before + tag + selection + (endTag || tag.replace('<', '</')) + after;
        setForm(prev => ({ ...prev, content: newContent }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, start + tag.length + selection.length);
        }, 0);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateBlogPost(id, {
                ...form,
                published_at: form.published && !form.published_at ? new Date().toISOString() : form.published_at
            });
            router.push('/admin/news');
        } catch (error) {
            console.error('Update failed:', error);
            alert('Error updating post.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Post Data...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-30 py-4 border-b border-white/5 mx-[-1rem] px-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/news"
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-white">Edit Post</h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Editing: {form.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${previewMode ? 'bg-white text-black' : 'bg-white/5 text-white hover:bg-white/10'
                            }`}
                    >
                        {previewMode ? <Code size={16} /> : <Eye size={16} />}
                        {previewMode ? 'Edit Mode' : 'Live Preview'}
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,221,0,0.2)] disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'SAVING...' : 'UPDATE POST'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    {previewMode ? (
                        <div className="bg-[#00141e] border border-white/5 p-8 rounded-2xl min-h-[600px] prose prose-invert prose-yellow max-w-none">
                            <h1 className="text-4xl font-black mb-6">{form.title || 'Post Title Preview'}</h1>
                            <div className="flex items-center gap-4 text-zinc-500 text-xs mb-8 border-b border-white/5 pb-4">
                                <span>{new Date(form.published_at || new Date()).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="uppercase font-black text-yellow-500">{form.category}</span>
                            </div>
                            <div
                                className="news-content-preview text-zinc-300 leading-relaxed text-lg"
                                dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-zinc-500 italic">No content yet...</p>' }}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Title & Slug */}
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Post Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={handleTitleChange}
                                        placeholder="Enter headline..."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-yellow-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500 bg-black/20 p-2 rounded-lg border border-white/5">
                                    <span className="text-[10px] font-mono">URL: /news/</span>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        className="bg-transparent border-none focus:outline-none text-[10px] font-mono w-full text-zinc-300"
                                    />
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                                <div className="p-3 bg-white/[0.03] border-b border-white/5 flex flex-wrap gap-2">
                                    <button onClick={() => insertTag('<strong>', '</strong>')} type="button" className="p-2 hover:bg-white/10 rounded text-zinc-400" title="Bold"><Bold size={16} /></button>
                                    <button onClick={() => insertTag('<em>', '</em>')} type="button" className="p-2 hover:bg-white/10 rounded text-zinc-400" title="Italic"><Italic size={16} /></button>
                                    <button onClick={() => insertTag('<a href="#">', '</a>')} type="button" className="p-2 hover:bg-white/10 rounded text-zinc-400" title="Link"><LinkIcon size={16} /></button>
                                    <div className="w-[1px] h-6 bg-white/10 mx-1" />
                                    <button onClick={() => insertTag('<h2>', '</h2>')} type="button" className="p-2 hover:bg-white/10 rounded text-zinc-400 font-bold">H2</button>
                                    <button onClick={() => insertTag('<h3>', '</h3>')} type="button" className="p-2 hover:bg-white/10 rounded text-zinc-400 font-bold">H3</button>
                                    <button onClick={() => insertTag('<blockquote>', '</blockquote>')} type="button" className="p-2 hover:bg-white/10 rounded text-zinc-400"><Quote size={16} /></button>
                                    <button onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} type="button" className="p-2 hover:bg-white/10 rounded text-zinc-400"><List size={16} /></button>
                                </div>
                                <textarea
                                    ref={contentRef}
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="flex-1 bg-transparent p-6 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Settings Section */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black uppercase tracking-widest text-white">Publishing Stat</h2>
                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${form.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {form.published ? 'LIVE' : 'DRAFT'}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                                >
                                    <optgroup label="Popular Sports">
                                        <option>Football</option>
                                        <option>Tennis</option>
                                        <option>Basketball</option>
                                        <option>Hockey</option>
                                        <option>Golf</option>
                                        <option>Baseball</option>
                                        <option>Snooker</option>
                                        <option>Volleyball</option>
                                    </optgroup>
                                    <optgroup label="All Sports">
                                        <option>Am. Football</option>
                                        <option>Darts</option>
                                        <option>Motorsport</option>
                                        <option>Aussie Rules</option>
                                        <option>Esports</option>
                                        <option>Netball</option>
                                        <option>Badminton</option>
                                        <option>Field Hockey</option>
                                        <option>Pesäpallo</option>
                                        <option>Bandy</option>
                                        <option>Floorball</option>
                                        <option>Rugby League</option>
                                        <option>Beach Soccer</option>
                                        <option>Futsal</option>
                                        <option>Rugby Union</option>
                                        <option>Beach Volleyball</option>
                                        <option>Handball</option>
                                        <option>Table Tennis</option>
                                        <option>Boxing</option>
                                        <option>Horse Racing</option>
                                        <option>Water Polo</option>
                                        <option>Cricket</option>
                                        <option>Kabaddi</option>
                                        <option>Winter Sports</option>
                                        <option>Cycling</option>
                                        <option>MMA</option>
                                    </optgroup>
                                </select>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={form.published}
                                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-yellow-500 focus:ring-offset-0 focus:ring-0"
                                />
                                <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Published</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <ImageIcon size={14} /> Main Image
                        </h2>
                        <input
                            type="text"
                            value={form.image_url}
                            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 transition-all font-mono"
                        />
                        {form.image_url && (
                            <img src={form.image_url} className="w-full aspect-video object-cover rounded-lg border border-white/10" alt="Thumbnail Preview" />
                        )}
                    </div>

                    <div className="bg-zinc-900 border border-yellow-500/20 p-6 rounded-2xl space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-yellow-500 flex items-center gap-2">
                            <Settings size={14} /> SEO Optimization
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Meta Title</label>
                                <input
                                    type="text"
                                    value={form.meta_title}
                                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={form.meta_description}
                                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
