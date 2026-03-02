import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Target, Eye, Upload } from 'lucide-react';
import { api, SiteSettings } from '../../services/api';
import { showToast } from '../../utils/toast';

export default function SettingsManager() {
    const [settings, setSettings] = useState<SiteSettings>({
        mission: '',
        vision: '',
        founder: { name: '', role: '', about: '', image: '', features: [] },
        hero: { title: '', subtitle: '', backgroundImage: '' },
        aboutImage: '',
        stats: [],
        clientRoster: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [heroImagePreview, setHeroImagePreview] = useState<string>('');

    const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
    const [aboutImagePreview, setAboutImagePreview] = useState<string>('');

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    // clientRoster files state (index mapping)
    const [rosterFiles, setRosterFiles] = useState<{ [key: number]: File }>({});

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await api.fetchSettings();
            setSettings({
                ...data,
                founder: data.founder || { name: '', role: '', about: '', image: '', features: [] },
                hero: data.hero || { title: '', subtitle: '', backgroundImage: '' },
                logo: data.logo || { url: '', showDesktop: false, showMobile: false },
                aboutImage: data.aboutImage || '',
                stats: data.stats || [],
                clientRoster: data.clientRoster || []
            });
            if (data.founder?.image) {
                setImagePreview(data.founder.image);
            }
            if (data.hero?.backgroundImage) {
                setHeroImagePreview(data.hero.backgroundImage);
            }
            if (data.logo?.url) {
                setLogoPreview(data.logo.url);
            }
            if (data.aboutImage) {
                setAboutImagePreview(data.aboutImage);
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('mission', settings.mission);
            formData.append('vision', settings.vision);

            const founderDataStr = JSON.stringify({
                ...settings.founder,
                image: undefined
            });
            formData.append('founder', founderDataStr);

            if (imageFile) {
                formData.append('founderImage', imageFile);
            } else if (settings.founder?.image) {
                formData.append('founderImageURL', settings.founder.image);
            }

            // Hero
            const heroDataStr = JSON.stringify({
                ...settings.hero,
                backgroundImage: undefined
            });
            formData.append('hero', heroDataStr);
            if (heroImageFile) {
                formData.append('heroImage', heroImageFile);
            } else if (settings.hero?.backgroundImage) {
                formData.append('heroImageURL', settings.hero.backgroundImage);
            }

            // About Image
            if (aboutImageFile) {
                formData.append('aboutImage', aboutImageFile);
            } else if (settings.aboutImage) {
                formData.append('aboutImageURL', settings.aboutImage);
            }

            // Logo
            const logoDataStr = JSON.stringify({
                ...settings.logo,
                url: undefined
            });
            formData.append('logo', logoDataStr);
            if (logoFile) {
                formData.append('logoImage', logoFile);
            } else if (settings.logo?.url) {
                formData.append('logoImageURL', settings.logo.url);
            }

            // Stats
            formData.append('stats', JSON.stringify(settings.stats));

            // Client Roster
            const rosterDataStr = JSON.stringify(settings.clientRoster);
            formData.append('clientRoster', rosterDataStr);
            Object.entries(rosterFiles).forEach(([index, file]) => {
                formData.append(`clientRoster_image_${index}`, file);
            });

            const updatedSettings = await api.updateSettings(formData);

            setSettings({
                ...updatedSettings,
                founder: updatedSettings.founder || { name: '', role: '', about: '', image: '', features: [] },
                hero: updatedSettings.hero || { title: '', subtitle: '', backgroundImage: '' },
                logo: updatedSettings.logo || { url: '', showDesktop: false, showMobile: false },
                aboutImage: updatedSettings.aboutImage || '',
                stats: updatedSettings.stats || [],
                clientRoster: updatedSettings.clientRoster || []
            });

            // Clear temporary file states so the UI previews uses the newly returned DB URLs
            setImageFile(null);
            setHeroImageFile(null);
            setAboutImageFile(null);
            setLogoFile(null);
            setRosterFiles({});

            showToast("Settings saved successfully", "success");
        } catch (error) {
            console.error("Failed to save settings:", error);
            showToast("Failed to save settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleFounderChange = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            founder: {
                ...prev.founder!,
                [field]: value
            }
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            handleFounderChange('image', url);
        }
    };

    const addFeature = () => {
        setSettings(prev => ({
            ...prev,
            founder: {
                ...prev.founder!,
                features: [...prev.founder!.features, '']
            }
        }));
    };

    const updateFeature = (index: number, value: string) => {
        setSettings(prev => {
            const newFeatures = [...prev.founder!.features];
            newFeatures[index] = value;
            return {
                ...prev,
                founder: { ...prev.founder!, features: newFeatures }
            };
        });
    };

    const removeFeature = (index: number) => {
        setSettings(prev => {
            const newFeatures = [...prev.founder!.features];
            newFeatures.splice(index, 1);
            return {
                ...prev,
                founder: { ...prev.founder!, features: newFeatures }
            };
        });
    };

    // Hero Helpers
    const handleHeroChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, hero: { ...prev.hero!, [field]: value } }));
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroImageFile(file);
            const url = URL.createObjectURL(file);
            setHeroImagePreview(url);
            handleHeroChange('backgroundImage', url);
        }
    };

    // Logo Helpers
    const handleLogoChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, logo: { ...prev.logo!, [field]: value } }));
    };

    const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const url = URL.createObjectURL(file);
            setLogoPreview(url);
            handleLogoChange('url', url);
        }
    };

    // About Helper
    const handleAboutImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAboutImageFile(file);
            const url = URL.createObjectURL(file);
            setAboutImagePreview(url);
            setSettings(prev => ({ ...prev, aboutImage: url }));
        }
    };

    // Stats Helpers
    const addStat = () => {
        setSettings(prev => ({ ...prev, stats: [...(prev.stats || []), { number: '', label: '' }] }));
    };
    const updateStat = (index: number, field: 'number' | 'label', value: string) => {
        setSettings(prev => {
            const newStats = [...(prev.stats || [])];
            newStats[index] = { ...newStats[index], [field]: value };
            return { ...prev, stats: newStats };
        });
    };
    const removeStat = (index: number) => {
        setSettings(prev => {
            const newStats = [...(prev.stats || [])];
            newStats.splice(index, 1);
            return { ...prev, stats: newStats };
        });
    };

    // Client Roster Helpers
    const addClient = () => {
        setSettings(prev => ({ ...prev, clientRoster: [...(prev.clientRoster || []), { type: 'text', value: '' }] }));
    };
    const updateClientType = (index: number, type: 'text' | 'image') => {
        setSettings(prev => {
            const newRoster = [...(prev.clientRoster || [])];
            newRoster[index] = { type, value: '' };
            return { ...prev, clientRoster: newRoster };
        });
    };
    const updateClientText = (index: number, value: string) => {
        setSettings(prev => {
            const newRoster = [...(prev.clientRoster || [])];
            newRoster[index] = { ...newRoster[index], value };
            return { ...prev, clientRoster: newRoster };
        });
    };
    const handleClientFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRosterFiles(prev => ({ ...prev, [index]: file }));
            const url = URL.createObjectURL(file);
            setSettings(prev => {
                const newRoster = [...(prev.clientRoster || [])];
                newRoster[index] = { ...newRoster[index], value: url };
                return { ...prev, clientRoster: newRoster };
            });
        }
    };
    const removeClient = (index: number) => {
        setSettings(prev => {
            const newRoster = [...(prev.clientRoster || [])];
            newRoster.splice(index, 1);
            return { ...prev, clientRoster: newRoster };
        });
        setRosterFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[index];
            return newFiles;
        });
    };

    if (loading) return <div className="p-8 text-center text-white/50">Loading settings...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Site Settings</h1>
                <p className="text-white/50">Manage your agency's core Mission and Vision statements.</p>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-10 backdrop-blur-sm relative overflow-hidden group max-w-screen-2xl">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-[#29ABE2]/10 rounded-2xl flex items-center justify-center text-[#29ABE2] border border-[#29ABE2]/20 shadow-inner">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Main Configuration</h2>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Manage your site content globally</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="relative z-10">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

                        {/* ---------- Mission & Vision ---------- */}
                        <div className="bg-black/20 p-6 md:p-8 rounded-3xl border border-white/5 space-y-8">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
                                <Target className="text-[#29ABE2]" size={20} />
                                Brand Identity
                            </h3>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                                    <Target size={14} className="text-[#29ABE2]" />
                                    Our Mission
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={settings.mission}
                                    onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all resize-none"
                                    placeholder="To illuminate brands..."
                                />
                                <p className="text-xs text-white/30 mt-2">This text will be prominently displayed on your landing page.</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                                    <Eye size={14} className="text-[#29ABE2]" />
                                    Our Vision
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={settings.vision}
                                    onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all resize-none"
                                    placeholder="To be the leading visionary force..."
                                />
                                <p className="text-xs text-white/30 mt-2">Sharing your long-term vision with potential clients.</p>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Site Logo Configuration</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="text-white h-32">
                                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-white/5 transition-colors group relative overflow-hidden">
                                            <div className="flex flex-col items-center justify-center relative z-10 p-2 text-center">
                                                <Upload className="w-6 h-6 mb-2 text-[#29ABE2] group-hover:scale-110 transition-transform" />
                                                <span className="text-xs font-bold text-white/60">Upload Logo</span>
                                            </div>
                                            {logoPreview && (
                                                <div className="absolute inset-0 z-0 bg-black/80 flex items-center justify-center p-2">
                                                    <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoImageChange} />
                                        </label>
                                    </div>
                                    <div className="flex flex-col gap-4 justify-center bg-black/20 p-4 rounded-xl border border-white/5">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">Show in Desktop</span>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.logo?.showDesktop || false}
                                                    onChange={(e) => handleLogoChange('showDesktop', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#29ABE2]"></div>
                                            </div>
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">Show in Mobile</span>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.logo?.showMobile || false}
                                                    onChange={(e) => handleLogoChange('showMobile', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#29ABE2]"></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <p className="text-xs text-white/30 mt-3 leading-relaxed">If mobile/desktop options are turned off, the default stylized text will be shown instead. Will always be visibly attached to form emails.</p>
                            </div>
                        </div>

                        {/* ---------- Hero Section ---------- */}
                        <div className="bg-black/20 p-6 md:p-8 rounded-3xl border border-white/5 xl:col-span-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#29ABE2]/10 rounded-2xl flex items-center justify-center text-[#29ABE2] border border-[#29ABE2]/20 shadow-inner">
                                    <Eye size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Hero Section</h2>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Update the massive welcome screen</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 mb-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Hero Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={settings.hero?.title}
                                            onChange={(e) => handleHeroChange('title', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all"
                                            placeholder="AMPLIFYING AFRICAN NARRATIVES"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Hero Subtitle</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={settings.hero?.subtitle}
                                            onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all resize-none"
                                            placeholder="We are a full-service creative agency..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Hero Background Image</label>
                                    <div className="mt-2 text-white h-full min-h-[200px]">
                                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-white/5 transition-colors group relative overflow-hidden">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10 p-4 text-center">
                                                <Upload className="w-8 h-8 mb-3 text-[#29ABE2] group-hover:scale-110 transition-transform" />
                                                <p className="mb-2 text-sm text-white/60"><span className="font-bold text-white">Click to upload</span> hero image</p>
                                            </div>
                                            {heroImagePreview && (
                                                <div className="absolute inset-0 z-0">
                                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                                                    <img src={heroImagePreview} alt="Hero Preview" className="w-full h-full object-cover opacity-60" />
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ---------- About Section Image ---------- */}
                        <div className="bg-black/20 p-6 md:p-8 rounded-3xl border border-white/5 xl:col-span-1 h-full flex flex-col">
                            <h2 className="text-xl font-black uppercase tracking-tight mb-6 pb-4 border-b border-white/10">About Image</h2>
                            <div className="text-white flex-1 min-h-[200px]">
                                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-white/5 transition-colors group relative overflow-hidden">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10 p-4 text-center">
                                        <Upload className="w-8 h-8 mb-3 text-[#29ABE2] group-hover:scale-110 transition-transform" />
                                        <p className="mb-2 text-sm text-white/60"><span className="font-bold text-white">Click to upload</span> about image</p>
                                    </div>
                                    {aboutImagePreview && (
                                        <div className="absolute inset-0 z-0">
                                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                                            <img src={aboutImagePreview} alt="About Preview" className="w-full h-full object-cover opacity-60" />
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAboutImageChange} />
                                </label>
                            </div>
                        </div>

                        {/* ---------- Statistics ---------- */}
                        <div className="bg-black/20 p-6 md:p-8 rounded-3xl border border-white/5 xl:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Company Statistics</h2>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Impact numbers on the landing page</p>
                                </div>
                                <button type="button" onClick={addStat} className="px-4 py-2 bg-[#29ABE2]/10 text-[#29ABE2] border border-[#29ABE2]/30 hover:bg-[#29ABE2] hover:text-black transition-all text-xs font-bold tracking-widest uppercase rounded-lg">
                                    + Add Stat
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {settings.stats?.map((stat, i) => (
                                    <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5 relative group">
                                        <button type="button" onClick={() => removeStat(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold shadow-lg">X</button>
                                        <input
                                            type="text"
                                            value={stat.number}
                                            onChange={(e) => updateStat(i, 'number', e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 pb-1 mb-2 text-white text-2xl font-black focus:border-[#29ABE2] outline-none text-center"
                                            placeholder="100+"
                                        />
                                        <input
                                            type="text"
                                            value={stat.label}
                                            onChange={(e) => updateStat(i, 'label', e.target.value)}
                                            className="w-full bg-transparent text-white/40 text-xs font-bold uppercase tracking-widest focus:text-[#29ABE2] outline-none text-center"
                                            placeholder="Projects Delivered"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ---------- Client Roster Marquee ---------- */}
                        <div className="bg-black/20 p-6 md:p-8 rounded-3xl border border-white/5 xl:col-span-1">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Client Roster Marquee</h2>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Scrolling clients on the landing page</p>
                                </div>
                                <button type="button" onClick={addClient} className="px-4 py-2 bg-[#29ABE2]/10 text-[#29ABE2] border border-[#29ABE2]/30 hover:bg-[#29ABE2] hover:text-black transition-all text-xs font-bold tracking-widest uppercase rounded-lg">
                                    + Add Client
                                </button>
                            </div>
                            <div className="space-y-3">
                                {settings.clientRoster?.map((client, i) => (
                                    <div key={i} className="flex gap-4 items-center bg-black/20 p-3 rounded-xl border border-white/5">
                                        <select
                                            value={client.type}
                                            onChange={(e) => updateClientType(i, e.target.value as 'text' | 'image')}
                                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none w-28"
                                        >
                                            <option value="text">Text Name</option>
                                            <option value="image">Logo Image</option>
                                        </select>

                                        {client.type === 'text' ? (
                                            <input
                                                type="text"
                                                value={client.value}
                                                onChange={(e) => updateClientText(i, e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:border-[#29ABE2] outline-none text-sm"
                                                placeholder="Ex: MTN"
                                            />
                                        ) : (
                                            <div className="flex-1 flex gap-4 items-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleClientFileChange(i, e)}
                                                    className="text-xs text-white/50 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#29ABE2]/20 file:text-[#29ABE2] hover:file:bg-[#29ABE2]/30 transition-colors"
                                                />
                                                {client.value && <img src={client.value} alt="Preview" className="h-8 w-auto object-contain bg-white/5 p-1 rounded" />}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => removeClient(i)}
                                            className="p-2 text-red-500/50 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                                        >
                                            <span className="sr-only">Remove</span>
                                            ⊗
                                        </button>
                                    </div>
                                ))}
                                {settings.clientRoster?.length === 0 && (
                                    <div className="text-white/20 text-sm italic">No clients added yet.</div>
                                )}
                            </div>
                        </div>

                        {/* ---------- Founder Section ---------- */}
                        <div className="bg-black/20 p-6 md:p-8 rounded-3xl border border-white/5 xl:col-span-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#29ABE2]/10 rounded-2xl flex items-center justify-center text-[#29ABE2] border border-[#29ABE2]/20 shadow-inner">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Founder & Leadership</h2>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Update leadership details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={settings.founder?.name}
                                            onChange={(e) => handleFounderChange('name', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all"
                                            placeholder="Shine Begho"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Role Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={settings.founder?.role}
                                            onChange={(e) => handleFounderChange('role', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all"
                                            placeholder="Founder & Creative Director"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Founder Image</label>
                                    <div className="mt-2 text-white">
                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-white/5 transition-colors group relative overflow-hidden">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10 p-4 text-center">
                                                <Upload className="w-8 h-8 mb-3 text-[#29ABE2] group-hover:scale-110 transition-transform" />
                                                <p className="mb-2 text-sm text-white/60"><span className="font-bold text-white">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-white/40">PNG, JPG or WEBP (MAX. 2MB)</p>
                                            </div>
                                            {imagePreview && (
                                                <div className="absolute inset-0 z-0">
                                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">About / Bio</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={settings.founder?.about}
                                    onChange={(e) => handleFounderChange('about', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all resize-none"
                                    placeholder="Write a brief bio..."
                                />
                            </div>

                            {/* Founder Key Features */}
                            <div className="mt-8">
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Key Stats / Features</label>
                                <div className="space-y-3 mb-4">
                                    {settings.founder?.features?.map((feat, i) => (
                                        <div key={i} className="flex gap-4 items-center bg-black/20 p-2 rounded-xl border border-white/5">
                                            <input
                                                type="text"
                                                value={feat}
                                                onChange={(e) => updateFeature(i, e.target.value)}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 focus:border-[#29ABE2] outline-none text-sm"
                                                placeholder="Ex: 10+ Years in Creative Media"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(i)}
                                                className="p-2 text-red-500/50 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                                            >
                                                <span className="sr-only">Remove</span>
                                                ⊗
                                            </button>
                                        </div>
                                    ))}
                                    {settings.founder?.features?.length === 0 && (
                                        <div className="text-white/20 text-sm italic">No features added yet.</div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30 transition-colors text-sm font-bold uppercase tracking-wider rounded-lg"
                                >
                                    + Add Feature
                                </button>
                            </div>
                        </div> {/* Closes Founder section */}
                    </div> {/* Closes Grid container */}

                    {/* Submit Actions */}
                    <div className="pt-8 mt-8 border-t border-white/10 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-4 bg-[#29ABE2] text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
