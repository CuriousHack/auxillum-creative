import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import UserModal from '../../components/admin/UserModal';
import {
    User as UserIcon, ShieldCheck,
    KeyRound, Loader2, Save, Plus, LogOut,
    CheckCircle2
} from 'lucide-react';

export default function Profile() {
    const { user, logout, isAdmin } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        email: user?.email || '',
    });

    // Security State
    const [securityView, setSecurityView] = useState<'form' | 'otp' | 'success'>('form');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [securityOtp, setSecurityOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.updateProfile(profileData);
            // In a real app, update context user here
        } catch (error) {
            console.error("Profile update failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChangeRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        setSubmitting(true);
        try {
            await api.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setSecurityView('otp');
        } catch (error) {
            console.error("Password change request failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifySecurityOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.verifyChangePassword({
                email: user?.email,
                otp: securityOtp.join('')
            });
            setSecurityView('success');
            setTimeout(() => {
                setSecurityView('form');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setSecurityOtp(['', '', '', '', '', '']);
            }, 3000);
        } catch (error) {
            console.error("Security OTP verification failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...securityOtp];
        newOtp[index] = value.slice(-1);
        setSecurityOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !securityOtp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">Profile Settings</h1>
                    <p className="text-white/40 font-medium">Manage your personal information and account security.</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                >
                    <LogOut size={18} /> Logout Session
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Personal Data */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 bg-[#29ABE2]/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-[#29ABE2]/10 rounded-2xl flex items-center justify-center text-[#29ABE2] border border-[#29ABE2]/20 shadow-inner">
                                <UserIcon size={24} />
                            </div>
                            <h2 className="text-xl font-black">Personal Information</h2>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-white/30 tracking-widest block ml-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.firstName}
                                        onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-white/30 tracking-widest block ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.lastName}
                                        onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-white/30 tracking-widest block ml-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.username}
                                        onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-white/30 tracking-widest block ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={profileData.email}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white/40 cursor-not-allowed outline-none font-medium"
                                    />
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest ml-1 flex items-center gap-1">
                                        <ShieldCheck size={10} /> Contact administrator to change email
                                    </p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-4 bg-[#29ABE2] text-black font-black rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#29ABE2]/10"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Profile</>}
                            </button>
                        </form>
                    </section>

                    {isAdmin && (
                        <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm group">
                            <div className="flex items-center justify-between gap-4 mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/60 border border-white/10">
                                        <Plus size={24} />
                                    </div>
                                    <h2 className="text-xl font-black">Add Team Member</h2>
                                </div>
                                <div className="px-3 py-1 bg-[#29ABE2]/10 text-[#29ABE2] text-[10px] font-black uppercase tracking-widest border border-[#29ABE2]/20 rounded-full">Admin Only</div>
                            </div>

                            <p className="text-white/40 text-sm mb-8 max-w-xl font-medium">
                                Invite new administrators or editors to the platform. Editors can manage blog content but lack administrative controls.
                            </p>

                            <button
                                onClick={() => setIsUserModalOpen(true)}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all"
                            >
                                <Plus size={20} /> Create New Account
                            </button>
                        </section>
                    )}
                </div>

                <UserModal
                    isOpen={isUserModalOpen}
                    onClose={() => setIsUserModalOpen(false)}
                    onSuccess={() => {
                        // Optionally refresh users list if we had one
                    }}
                />

                {/* Right Column: Security */}
                <div className="space-y-8">
                    <section className="bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-2 h-full bg-[#29ABE2]" />

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#29ABE2] border border-white/5">
                                <ShieldCheck size={24} />
                            </div>
                            <h2 className="text-xl font-black">Security</h2>
                        </div>

                        {securityView === 'form' && (
                            <form onSubmit={handlePasswordChangeRequest} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.currentPassword}
                                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest block ml-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#29ABE2] transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-black rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <><KeyRound size={20} /> Update Security</>}
                                </button>
                                <p className="text-[10px] font-medium text-white/20 text-center uppercase tracking-widest leading-relaxed">
                                    Requires 6-digit OTP verification <br /> to complete the process.
                                </p>
                            </form>
                        )}

                        {securityView === 'otp' && (
                            <form onSubmit={handleVerifySecurityOtp} className="space-y-8 py-6">
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-bold text-white">Security Verification</p>
                                    <p className="text-xs text-white/40 leading-relaxed">Enter the 6-digit code sent to your email to confirm the password change.</p>
                                </div>

                                <div className="flex justify-between gap-2 max-w-[240px] mx-auto">
                                    {securityOtp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => { otpRefs.current[i] = el; }}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                            className="w-8 h-10 bg-black/40 border border-white/10 rounded-lg text-center text-lg font-black text-white focus:border-[#29ABE2] outline-none"
                                        />
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={submitting || securityOtp.some(d => !d)}
                                        className="w-full py-4 bg-[#29ABE2] text-black font-black rounded-xl hover:bg-white transition-all shadow-xl shadow-[#29ABE2]/10 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'CONFIRM CHANGE'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSecurityView('form')}
                                        className="w-full text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                                    >
                                        Cancel Request
                                    </button>
                                </div>
                            </form>
                        )}

                        {securityView === 'success' && (
                            <div className="py-20 text-center space-y-6">
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl font-black text-white">Security Updated</p>
                                    <p className="text-sm text-white/40 font-medium">Your account is now more secure.</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
