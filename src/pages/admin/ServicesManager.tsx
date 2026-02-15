import { useEffect, useState } from 'react';
import { Tv, Users, Film, Radio, Pencil, Trash2, Plus, X, Loader2, Megaphone, Smartphone, Monitor, Palette, AlertTriangle } from 'lucide-react';
import { api, Service } from '../../services/api';

export default function ServicesManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Delete Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        features: '',
        icon: 'Tv'
    });

    const iconMap: Record<string, any> = {
        Tv, Users, Film, Radio, Megaphone, Smartphone, Monitor, Palette
    };

    const availableIcons = Object.keys(iconMap);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await api.fetchServices();
                setServices(data);
            } catch (error) {
                console.error("Failed to load services", error);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, []);

    const openAddModal = () => {
        setEditingService(null);
        setFormData({ title: '', subtitle: '', description: '', features: '', icon: 'Tv' });
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            subtitle: service.subtitle,
            description: service.description,
            features: service.features.join(', '),
            icon: service.icon || 'Tv'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const serviceData = {
                title: formData.title,
                subtitle: formData.subtitle,
                description: formData.description,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
                icon: formData.icon
            };

            if (editingService) {
                // Update existing service
                await api.updateService(editingService.id, serviceData);
                setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s));
            } else {
                // Create new service
                const newService = await api.createService(serviceData);
                setServices([...services, newService]);
            }

            // Reset and close
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save service", error);
            alert("Failed to save service. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteService = async () => {
        if (!deleteConfirmId) return;
        setIsDeleting(true);
        try {
            await api.deleteService(deleteConfirmId);
            setServices(services.filter(s => s.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete service", error);
            alert("Failed to delete service.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Helper to get icon component
    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName] || Tv;
        return <IconComponent className="w-6 h-6 text-[#29ABE2]" />;
    };

    if (loading) {
        return <div className="p-8 text-center text-white/50">Loading services...</div>;
    }

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-2">Services</h1>
                    <p className="text-white/50">Manage your service offerings.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#29ABE2] text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Service
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 group hover:border-[#29ABE2]/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-[#29ABE2]/10">
                                {getIcon(service.icon)}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(service)}
                                    className="p-2 hover:bg-[#29ABE2]/10 hover:text-[#29ABE2] rounded transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmId(service.id)}
                                    className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                        <p className="text-xs font-bold text-[#29ABE2] tracking-widest mb-4">{service.subtitle.toUpperCase()}</p>
                        <p className="text-white/60 text-sm mb-6">{service.description}</p>

                        <div className="space-y-2">
                            {service.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                                    <div className="w-1 h-1 rounded-full bg-[#29ABE2]" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Service Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black mb-1">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                        <p className="text-white/50 text-sm mb-6">{editingService ? 'Update service details.' : 'Create a new service offering.'}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                    placeholder="e.g. Digital Marketing"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subtitle}
                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                    placeholder="e.g. VISIBILITY STRATEGY"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Icon</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {availableIcons.map((iconName) => {
                                        const IconComp = iconMap[iconName];
                                        const isSelected = formData.icon === iconName;
                                        return (
                                            <button
                                                key={iconName}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: iconName })}
                                                className={`p-3 rounded-lg border flex items-center justify-center transition-all ${isSelected
                                                        ? 'bg-[#29ABE2]/20 border-[#29ABE2] text-[#29ABE2]'
                                                        : 'bg-black border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                                    }`}
                                            >
                                                <IconComp size={24} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors resize-none"
                                    placeholder="Brief description of the service..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Features (Comma separated)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.features}
                                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                    placeholder="e.g. SEO, Social Media, Content Creation"
                                />
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
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingService ? 'Save Changes' : 'Create Service')}
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
                        <h3 className="text-xl font-bold text-center mb-2">Delete Service?</h3>
                        <p className="text-white/50 text-center text-sm mb-6">Are you sure you want to delete this service? This action cannot be undone.</p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-3 px-4 rounded-lg border border-white/10 font-bold hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteService}
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
