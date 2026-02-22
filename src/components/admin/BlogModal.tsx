import { useState, useEffect, useRef } from 'react';
import { X, Loader2, Image as ImageIcon, Link as LinkIcon, Plus, User, Tag } from 'lucide-react';
import { api, BlogPost } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    post?: BlogPost | null;
}

export default function BlogModal({ isOpen, onClose, onSuccess, post }: BlogModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageType, setImageType] = useState<'link' | 'upload'>('link');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: 'INSIGHTS',
        image: '',
        readTime: '5 min read'
    });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author,
                category: post.category,
                image: post.image,
                readTime: post.readTime
            });
            setPreviewUrl(post.image);
            setImageType(post.image?.startsWith('/uploads') ? 'upload' : 'link');
        } else {
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                author: user?.username || 'Admin',
                category: 'INSIGHTS',
                image: '',
                readTime: '5 min read'
            });
            setPreviewUrl('');
            setSelectedFile(null);
        }
    }, [post, isOpen]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSubmit = new FormData();
            dataToSubmit.append('title', formData.title);
            dataToSubmit.append('excerpt', formData.excerpt);
            dataToSubmit.append('content', formData.content);
            dataToSubmit.append('author', formData.author);
            dataToSubmit.append('category', formData.category);
            dataToSubmit.append('readTime', formData.readTime);

            if (imageType === 'upload' && selectedFile) {
                dataToSubmit.append('image', selectedFile);
            } else {
                dataToSubmit.append('image', formData.image);
            }

            if (post) {
                await api.updateBlogPost(post.id, dataToSubmit);
            } else {
                await api.createBlogPost(dataToSubmit);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save blog post:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-black mb-1">{post ? 'Edit Post' : 'Add New Post'}</h2>
                <p className="text-white/50 text-sm mb-8">Share insights and updates with your audience.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                placeholder="Post Title"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Author</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/10" />
                                <input
                                    type="text"
                                    disabled
                                    value={formData.author}
                                    className="w-full bg-white/5 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-white/40 cursor-not-allowed outline-none"
                                    placeholder="Author Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Category</label>
                            <div className="relative">
                                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors appearance-none"
                                >
                                    <option value="INSIGHTS">Insights</option>
                                    <option value="STRATEGY">Strategy</option>
                                    <option value="EXPERIENTIAL">Experiential</option>
                                    <option value="ATL">ATL</option>
                                    <option value="BTL">BTL</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Excerpt</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors resize-none text-sm"
                                placeholder="Short summary for the post card..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Content</label>
                            <textarea
                                required
                                rows={8}
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors resize-none font-mono text-sm"
                                placeholder="Main content of the post..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Post Cover Image</label>
                            <div className="flex bg-black p-1 rounded-xl border border-white/5 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setImageType('link')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${imageType === 'link' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                                >
                                    <LinkIcon size={16} /> Link
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageType('upload')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${imageType === 'upload' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                                >
                                    <ImageIcon size={16} /> Upload
                                </button>
                            </div>

                            {imageType === 'link' ? (
                                <input
                                    type="url"
                                    required
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#29ABE2]/50 transition-colors cursor-pointer group relative overflow-hidden h-40 flex flex-col items-center justify-center bg-black"
                                >
                                    {previewUrl && imageType === 'upload' ? (
                                        <>
                                            <img src={previewUrl.startsWith('http') || previewUrl.startsWith('blob') ? previewUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${previewUrl}`} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                            <div className="relative z-10 flex flex-col items-center">
                                                <Plus className="mb-2 text-white" size={32} />
                                                <p className="text-sm text-white font-bold drop-shadow-md">Change Image</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mx-auto mb-2 text-white/20 group-hover:text-[#29ABE2]" size={32} />
                                            <p className="text-sm text-white/40">Click to upload image</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 px-6 rounded-xl bg-[#29ABE2] text-black font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (post ? 'Update Post' : 'Create Post')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
