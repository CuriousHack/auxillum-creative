import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
    Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,
    ArrowLeft, ShieldCheck, KeyRound, Sparkles
} from 'lucide-react';

type AuthView = 'login' | 'forgot-password' | 'verify-otp' | 'reset-password' | 'success';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState<AuthView>('login');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const from = location.state?.from?.pathname || '/admin';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.login({ email, password });
            login(response.token, response.user);
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.forgotPassword(email);
            setView('verify-otp');
        } catch (error) {
            console.error("Forgot password failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.verifyOTP(email, otp.join(''));
            setView('reset-password');
        } catch (error) {
            console.error("OTP verification failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await api.resetPassword({ email, otp: otp.join(''), newPassword });
            setView('success');
            setTimeout(() => setView('login'), 3000);
        } catch (error) {
            console.error("Reset password failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#29ABE2]/10 blur-[120px] rounded-full" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-2xl">
                        <Sparkles className="text-[#29ABE2]" size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        {view === 'login' && 'ADMIN PORTAL'}
                        {view === 'forgot-password' && 'RESET ACCESS'}
                        {view === 'verify-otp' && 'VERIFICATION'}
                        {view === 'reset-password' && 'NEW PASSWORD'}
                        {view === 'success' && 'ACCESS RESTORED!'}
                    </h1>
                    <p className="text-white/40 text-sm font-medium">
                        {view === 'login' && 'Welcome back, enter your credentials.'}
                        {view === 'forgot-password' && 'We\'ll send a security code to your email.'}
                        {view === 'verify-otp' && `Enter the 6-digit code sent to ${email}`}
                        {view === 'reset-password' && 'Secure your account with a new password.'}
                        {view === 'success' && 'You will be redirected to login shortly.'}
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-zinc-950/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@auxilium.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-[#29ABE2] outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot-password')}
                                        className="text-[10px] font-bold text-[#29ABE2] hover:text-white uppercase tracking-wider transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-white/10 focus:border-[#29ABE2] outline-none transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#29ABE2] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg active:shadow-none disabled:opacity-50 disabled:translate-y-0"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>SIGN IN <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>
                    )}

                    {view === 'forgot-password' && (
                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-1">Verify Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 focus-within:text-[#29ABE2] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#29ABE2] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#29ABE2] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'SEND CODE'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="flex items-center justify-center gap-2 text-white/40 font-bold text-xs hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={14} /> Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {view === 'verify-otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => otpRefs.current[i] = el}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-black text-white focus:border-[#29ABE2] outline-none transition-all"
                                    />
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || otp.some(d => !d)}
                                    className="w-full bg-[#29ABE2] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'VERIFY CODE'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('forgot-password')}
                                    className="flex items-center justify-center gap-2 text-white/40 font-bold text-xs hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={14} /> Change Email
                                </button>
                            </div>
                        </form>
                    )}

                    {view === 'reset-password' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-1">New Password</label>
                                    <div className="relative group">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#29ABE2] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#29ABE2] transition-colors" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#29ABE2] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#29ABE2] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'UPDATE PASSWORD'}
                            </button>
                        </form>
                    )}

                    {view === 'success' && (
                        <div className="py-8 text-center bg-black/40 rounded-3xl border border-white/5">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <ShieldCheck size={32} />
                            </div>
                            <p className="text-white font-bold text-lg mb-2">Password Updated!</p>
                            <p className="text-white/40 text-sm">You can now use your new password to sign in.</p>
                        </div>
                    )}
                </div>

                {/* Footer Credits */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-white/20 tracking-[0.3em] uppercase">
                        Auxilium Creative Media • Secure Access
                    </p>
                </div>
            </div>
        </div>
    );
}
