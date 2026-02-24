"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, CheckCircle, XCircle, Calendar, Tag } from 'lucide-react';
import { getBlogPosts, BlogPost, supabase } from '@/lib/supabase';

export default function NewsAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const data = await getBlogPosts(100);
        setPosts(data);
        setLoading(false);
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">RichPredict News</h1>
                    <p className="text-zinc-500 text-sm">Manage your blog posts and site news.</p>
                </div>
                <Link
                    href="/admin/news/new"
                    className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-tighter hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,221,0,0.15)]"
                >
                    <Plus size={18} />
                    Create New Post
                </Link>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                    <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Posts</div>
                    <div className="text-2xl font-black text-white">{posts.length}</div>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-green-500">
                    <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Published</div>
                    <div className="text-2xl font-black">{posts.filter(p => p.published).length}</div>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-yellow-500">
                    <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Drafts</div>
                    <div className="text-2xl font-black">{posts.filter(p => !p.published).length}</div>
                </div>
            </div>

            {/* Search and Table */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or category..."
                            className="w-full bg-black border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                <th className="px-6 py-4">Title & Info</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">Loading posts...</td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">No posts found.</td>
                                </tr>
                            ) : filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">{post.title}</span>
                                            <span className="text-[10px] text-zinc-500 font-mono">/{post.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded border border-white/5 w-fit">
                                            <Tag size={10} className="text-yellow-500" />
                                            <span className="text-[10px] font-black text-white/70 uppercase tracking-tighter">
                                                {post.category?.toLowerCase() === 'match preview' ? 'Football' : (post.category || 'General')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.published ? (
                                            <div className="flex items-center gap-1.5 text-green-500">
                                                <CheckCircle size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Published</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-yellow-500">
                                                <XCircle size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Draft</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Calendar size={14} />
                                            <span className="text-[10px] font-bold">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-zinc-500">
                                            <Link
                                                href={`/admin/news/edit/${post.id}`}
                                                className="p-2 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                                                title="Edit Post"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this post?')) {
                                                        const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
                                                        if (error) alert('Delete failed');
                                                        else fetchPosts();
                                                    }
                                                }}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
