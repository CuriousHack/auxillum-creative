import { useEffect, useState } from 'react';
import { Plus, Search, Newspaper, MoreVertical, Pencil, Trash2, X, Loader2, Image as ImageIcon, AlertTriangle, Calendar, User } from 'lucide-react';
import { api, BlogPost } from '../../services/api';
import BlogModal from '../../components/admin/BlogModal';

export default function BlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        return `${baseUrl}${path}`;
    };

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await api.fetchBlogPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to load blog posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleEdit = (post: BlogPost) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteConfirmId) return;
        setIsDeleting(true);
        try {
            await api.deleteBlogPost(deleteConfirmId);
            setPosts(posts.filter(p => p.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete post", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#29ABE2]" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-2">Blog Manager</h1>
                    <p className="text-white/50">Create and manage insights, articles, and news.</p>
                </div>
                <button
                    onClick={() => { setSelectedPost(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#29ABE2] text-black font-bold rounded-lg hover:bg-white transition-colors"
                >
                    <Plus size={20} /> Add New Post
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between bg-black/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-[#29ABE2] outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Posts Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest bg-black/40">
                                <th className="px-6 py-4 font-bold">Post Info</th>
                                <th className="px-6 py-4 font-bold">Meta</th>
                                <th className="px-6 py-4 font-bold">Category</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                                                {post.image ? (
                                                    <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Newspaper size={20} className="text-white/20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-white truncate max-w-[300px]">{post.title}</div>
                                                <div className="text-xs text-white/40 truncate max-w-[300px]">{post.excerpt}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-white/60">
                                                <User size={12} className="text-[#29ABE2]" /> {post.author}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-white/40">
                                                <Calendar size={12} /> {post.date}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 tracking-wider">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                title="Edit Post"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(post.id)}
                                                className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPosts.length === 0 && (
                        <div className="px-6 py-12 text-center text-white/40">
                            No posts found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <BlogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadPosts}
                post={selectedPost}
            />

            {/* Delete Confirmation Dialog */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Delete Post?</h3>
                        <p className="text-white/50 text-center text-sm mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-3 px-4 rounded-lg border border-white/10 font-bold hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
