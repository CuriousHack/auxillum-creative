import { useState, useEffect } from 'react';
import { X, Loader2, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react';
import { api, Project } from '../../services/api';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project?: Project | null;
    onSuccess: (project: Project) => void;
}

export default function ProjectModal({ isOpen, onClose, project, onSuccess }: ProjectModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'EVENT',
        year: new Date().getFullYear().toString(),
        imageType: 'url' as 'url' | 'upload',
        imageUrl: '',
        imageFile: null as File | null
    });

    // Reset or Populate form when modal opens/closes or project changes
    useEffect(() => {
        if (isOpen) {
            if (project) {
                setFormData({
                    title: project.title,
                    category: project.category,
                    year: project.year,
                    imageType: 'url', // Default to URL for existing
                    imageUrl: project.image,
                    imageFile: null
                });
            } else {
                setFormData({
                    title: '',
                    category: 'EVENT',
                    year: new Date().getFullYear().toString(),
                    imageType: 'url',
                    imageUrl: '',
                    imageFile: null
                });
            }
        }
    }, [isOpen, project]);

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

            let result: Project;
            if (project) {
                await api.updateProject(project.id, payload);
                // Optimistic return since API might mock
                result = {
                    ...project,
                    title: formData.title,
                    category: formData.category,
                    year: formData.year,
                    image: formData.imageType === 'url' ? formData.imageUrl : URL.createObjectURL(formData.imageFile!)
                };
            } else {
                result = await api.createProject(payload);
            }

            onSuccess(result);
            onClose();
        } catch (error) {
            console.error("Failed to save project", error);
            alert("Failed to save project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-black mb-1">{project ? 'Edit Project' : 'Add New Project'}</h2>
                <p className="text-white/50 text-sm mb-6">{project ? 'Update project details.' : 'Add a new project to your portfolio.'}</p>

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
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-lg border border-white/10 font-bold hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 rounded-lg bg-[#29ABE2] text-black font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (project ? 'Save Changes' : 'Create Project')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
