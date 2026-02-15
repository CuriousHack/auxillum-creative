import { useEffect, useState } from 'react';
import { Plus, Search, FolderKanban, MoreVertical, Pencil, Trash2, X, Loader2, Image as ImageIcon, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { api, Project } from '../../services/api';

export default function ProjectsManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Delete Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'EVENT',
        year: new Date().getFullYear().toString(),
        imageType: 'url' as 'url' | 'upload',
        imageUrl: '',
        imageFile: null as File | null
    });

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await api.fetchProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    const openAddModal = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            category: 'EVENT',
            year: new Date().getFullYear().toString(),
            imageType: 'url',
            imageUrl: '',
            imageFile: null
        });
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            category: project.category,
            year: project.year,
            imageType: 'url', // Default to URL for existing, user can change
            imageUrl: project.image,
            imageFile: null
        });
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, imageFile: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let payload: any;
            const isUpload = formData.imageType === 'upload' && formData.imageFile;

            if (isUpload) {
                const data = new FormData();
                data.append('title', formData.title);
                data.append('category', formData.category);
                data.append('year', formData.year);
                if (formData.imageFile) {
                    data.append('image', formData.imageFile);
                }
                payload = data;
            } else {
                payload = {
                    title: formData.title,
                    category: formData.category,
                    year: formData.year,
                    image: formData.imageUrl
                };
            }

            if (editingProject) {
                await api.updateProject(editingProject.id, payload);
                // Optimistic update for simple fields (image usually requires server response for URL)
                setProjects(projects.map(p => p.id === editingProject.id ? {
                    ...p,
                    title: formData.title,
                    category: formData.category,
                    year: formData.year,
                    image: formData.imageType === 'url' ? formData.imageUrl : URL.createObjectURL(formData.imageFile!) // Temporary blob for preview
                } : p));
            } else {
                const newProject = await api.createProject(payload);
                setProjects([...projects, newProject]);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save project", error);
            alert("Failed to save project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!deleteConfirmId) return;
        setIsDeleting(true);
        try {
            await api.deleteProject(deleteConfirmId);
            setProjects(projects.filter(p => p.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete project", error);
            alert("Failed to delete project.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-white/50">Loading projects...</div>;
    }

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-2">Projects</h1>
                    <p className="text-white/50">Manage your portfolio projects.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#29ABE2] text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Project
                </button>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-xl border border-white/5">
                <Search className="w-5 h-5 text-white/40 ml-2" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20"
                />
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/40 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Project</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Year</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                                                    }}
                                                />
                                            </div>
                                            <span className="font-medium">{project.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-[#29ABE2]/10 text-[#29ABE2] text-xs font-bold">
                                            {project.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white/60">{project.year}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(project)}
                                                className="p-2 hover:bg-[#29ABE2]/10 hover:text-[#29ABE2] rounded transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(project.id)}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProjects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/40">
                                        No projects found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black mb-1">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                        <p className="text-white/50 text-sm mb-6">{editingProject ? 'Update project details.' : 'Add a new project to your portfolio.'}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                    placeholder="e.g. Summer Campaign"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors appearance-none"
                                    >
                                        <option value="EVENT">EVENT</option>
                                        <option value="RADIO">RADIO</option>
                                        <option value="CONTENT">CONTENT</option>
                                        <option value="ATL">ATL</option>
                                        <option value="BTL">BTL</option>
                                        <option value="DIGITAL">DIGITAL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Year</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                        placeholder="e.g. 2024"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Project Image</label>

                                <div className="flex bg-black border border-white/10 rounded-lg p-1 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, imageType: 'url' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-bold transition-colors ${formData.imageType === 'url' ? 'bg-[#29ABE2] text-black' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <LinkIcon size={14} /> External URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, imageType: 'upload' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-bold transition-colors ${formData.imageType === 'upload' ? 'bg-[#29ABE2] text-black' : 'text-white/40 hover:text-white'}`}
                                    >
                                        <ImageIcon size={14} /> Upload Image
                                    </button>
                                </div>

                                {formData.imageType === 'url' ? (
                                    <input
                                        type="url"
                                        required
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                        placeholder="https://..."
                                    />
                                ) : (
                                    <div className="border border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#29ABE2]/50 transition-colors bg-white/5 relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {formData.imageFile ? (
                                            <div className="text-sm">
                                                <div className="text-[#29ABE2] font-bold mb-1">Selected: {formData.imageFile.name}</div>
                                                <div className="text-white/40">Click to change</div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-white/40">
                                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <span className="font-bold block text-white/60">Click to Upload</span>
                                                <span>or drag and drop</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Preview */}
                                {(formData.imageUrl || formData.imageFile) && (
                                    <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-white/10 bg-black/50">
                                        <img
                                            src={formData.imageType === 'url' ? formData.imageUrl : (formData.imageFile ? URL.createObjectURL(formData.imageFile) : '')}
                                            alt="Preview"
                                            className="w-full h-full object-cover opacity-80"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 text-white/60 text-[10px] uppercase font-bold rounded">Preview</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-lg border border-white/10 font-bold hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-4 rounded-lg bg-[#29ABE2] text-black font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingProject ? 'Save Changes' : 'Create Project')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Delete Project?</h3>
                        <p className="text-white/50 text-center text-sm mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-3 px-4 rounded-lg border border-white/10 font-bold hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProject}
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
