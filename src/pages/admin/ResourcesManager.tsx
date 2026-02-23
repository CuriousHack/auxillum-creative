import { useState, useEffect } from 'react';
import { FileText, Upload, Check, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { api, Resource } from '../../services/api';

export default function ResourcesManager() {
    const [prDocument, setPrDocument] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const loadResource = async () => {
            try {
                const data = await api.fetchResource('pr_document');
                setPrDocument(data);
            } catch (error) {
                console.error("Failed to load PR document resource", error);
            } finally {
                setLoading(false);
            }
        };
        loadResource();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('key', 'pr_document');
            formData.append('name', 'PR Downloadable Document');
            formData.append('file', file);

            const result = await api.upsertResource(formData);
            setPrDocument(result);
            setFile(null);
        } catch (error) {
            console.error("Failed to upload resource", error);
            alert("Failed to upload document. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-white/50">Loading resources...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Resources Management</h1>
                <p className="text-white/50">Manage dynamic assets and downloadable documents for the landing page.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PR Document Section */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#29ABE2]/10 rounded-2xl flex items-center justify-center text-[#29ABE2] border border-[#29ABE2]/20 shadow-inner">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black">PR Downloadable Document</h2>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Key: pr_document</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {prDocument ? (
                            <div className="bg-black/40 border border-[#29ABE2]/20 rounded-2xl p-6 flex items-center justify-between group/file">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                                        <Check className="text-[#29ABE2]" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white mb-0.5">{prDocument.name}</p>
                                        <p className="text-[10px] text-white/20 font-medium uppercase tracking-widest">Last Updated: {new Date(prDocument.path.split('-')[1]?.split('.')[0] || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <a
                                    href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${prDocument.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-[#29ABE2]/10 text-white/40 hover:text-[#29ABE2] rounded-lg transition-colors"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        ) : (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex items-center gap-4">
                                <AlertCircle className="text-orange-500" size={24} />
                                <p className="text-sm text-orange-200/70 font-medium">No PR document has been uploaded yet. Users won't be able to download anything.</p>
                            </div>
                        )}

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="relative">
                                <label className="block text-xs font-black uppercase text-white/30 tracking-widest mb-3 ml-1">Upload New Document</label>
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-[#29ABE2]/50 transition-all bg-black/20 group/upload relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <Upload className="w-8 h-8 mx-auto mb-4 text-white/20 group-hover/upload:text-[#29ABE2] transition-colors" />
                                    {file ? (
                                        <div className="text-[#29ABE2] font-bold">{file.name}</div>
                                    ) : (
                                        <div className="text-white/40 text-sm">
                                            Click or drag PDF/Word document here
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !file}
                                className="w-full py-4 bg-[#29ABE2] text-black font-black rounded-xl hover:bg-white transition-all shadow-xl shadow-[#29ABE2]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? <Loader2 className="animate-spin" size={20} /> : <><Upload size={20} /> Update PR Document</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Card */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Check className="text-[#29ABE2]" size={18} />
                            How it works
                        </h3>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li>• Uploading a new document automatically replaces the previous one.</li>
                            <li>• The "Download PR" button on the landing page will always point to the latest version.</li>
                            <li>• Supported formats: PDF, Microsoft Word (.doc, .docx).</li>
                            <li>• Maximum file size: 20MB.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
