"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { insertBlogPost } from '@/lib/supabase';

export default function NewPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [form, setForm] = useState({
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
        tags: [] as string[],
        author: 'RichPredict AI'
    });

    // Handle Title to Slug auto-generation
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        setForm(prev => ({
            ...prev,
            title,
            slug,
            meta_title: title // Default SEO title to post title
        }));
    };

    // Smart Editor Toolbar Actions
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

        // Refocus and set cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, start + tag.length + selection.length);
        }, 0);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await insertBlogPost({
                ...form,
                published_at: form.published ? new Date().toISOString() : null
            });
            router.push('/admin/news');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Error saving post. Check console.');
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="text-xl font-black uppercase tracking-tight text-white">Create New Post</h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">RichPredict Editorial Suite</p>
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
                        disabled={loading}
                        className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,221,0,0.2)] disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'PUBLISHING...' : 'PUBLISH NOW'}
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
                                <span>{new Date().toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="uppercase font-black text-yellow-500">{form.category}</span>
                            </div>
                            <div
                                className="news-content-preview"
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
                                        placeholder="Enter a catchy headline..."
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
                                {/* Toolbar */}
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
                                {/* Textarea */}
                                <textarea
                                    ref={contentRef}
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Write your story here... HTML tags are supported for advanced formatting."
                                    className="flex-1 bg-transparent p-6 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Settings Section */}
                <div className="space-y-6">
                    {/* Publishing Settings */}
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

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Language</label>
                                <select
                                    value={form.language}
                                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                                >
                                    <option value="en">English (Global)</option>
                                    <option value="az">Azerbaijani</option>
                                    <option value="tr">Turkish</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={form.published}
                                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-yellow-500 focus:ring-offset-0 focus:ring-0"
                                />
                                <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Publish immediately</span>
                            </label>
                        </div>
                    </div>

                    {/* Media Settings */}
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <ImageIcon size={14} /> Main Image
                        </h2>
                        <input
                            type="text"
                            placeholder="Image URL (Unsplash or Supabase)..."
                            value={form.image_url}
                            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 transition-all font-mono"
                        />
                        {form.image_url && (
                            <img src={form.image_url} className="w-full aspect-video object-cover rounded-lg border border-white/10" alt="Thumbnail Preview" />
                        )}
                    </div>

                    {/* SEO Suite */}
                    <div className="bg-zinc-900 border border-yellow-500/20 p-6 rounded-2xl space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
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
                                <div className="text-[8px] mt-1 text-zinc-600 font-bold">{form.meta_title.length}/60 chars</div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={form.meta_description}
                                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 resize-none"
                                />
                                <div className="text-[8px] mt-1 text-zinc-600 font-bold">{form.meta_description.length}/160 chars</div>
                            </div>
                            <div className="bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10">
                                <p className="text-[9px] text-yellow-500/70 leading-relaxed italic">
                                    <AlertCircle size={10} className="inline mr-1 mb-0.5" />
                                    Tip: Use primary keywords in the first 60 characters of your title.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
