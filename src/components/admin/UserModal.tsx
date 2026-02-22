import { useState } from 'react';
import { X, Mail, User, Lock, Shield, Loader2, Save } from 'lucide-react';
import { api } from '../../services/api';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserModal({ isOpen, onClose, onSuccess }: UserModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        role: 'editor' as 'admin' | 'editor'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createUser(formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create user', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.8)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="absolute top-0 right-0 p-32 bg-[#29ABE2]/5 blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative p-8 md:p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#29ABE2]/10 rounded-2xl flex items-center justify-center text-[#29ABE2] border border-[#29ABE2]/20 shadow-inner">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Create Account</h2>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Team Management</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                    placeholder="Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">Username</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={16} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                        placeholder="johndoe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={16} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                        placeholder="john@auxilium.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={16} />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">Account Role</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={16} />
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' })}
                                        className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="editor">Editor (Blog Only)</option>
                                        <option value="admin">Administrator (Full Access)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-4 bg-[#29ABE2] text-black font-black rounded-xl hover:bg-white transition-all shadow-xl shadow-[#29ABE2]/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Create User</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
