import { useState } from 'react';
import { Star, Send, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function SubmitReview() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        role: '',
        comment: ''
    });
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setStatus('error');
            setErrorMessage('Please select a rating.');
            return;
        }

        if (!formData.name || !formData.comment) {
            setStatus('error');
            setErrorMessage('Name and review comment are required.');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        try {
            await api.submitReview({
                ...formData,
                rating,
                status: 'pending',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });

            setStatus('success');
            setFormData({ name: '', company: '', role: '', comment: '' });
            setRating(0);
        } catch (error) {
            console.error('Failed to submit review:', error);
            setStatus('error');
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-[#29ABE2]/10 rounded-full flex items-center justify-center mx-auto text-[#29ABE2]">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black">Thank You!</h1>
                    <p className="text-white/60 text-lg">Your review has been successfully submitted and will be reviewed shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col p-6 lg:p-12 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">

            {/* Logo */}
            <div className="mb-12 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="text-[#29ABE2]" size={32} />
                </div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter">
                    AUXIL<span className="text-[#29ABE2]">UM</span>
                </h1>
                <p className="text-white/40 tracking-widest text-xs uppercase mt-2 font-bold">Client Review Portal</p>
            </div>

            <div className="w-full max-w-xl bg-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                {/* Accent Background Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#29ABE2]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <h2 className="text-2xl font-bold mb-2">Share Your Experience</h2>
                <p className="text-sm text-white/50 mb-8">We supercharge brands. Let us know how we did with yours.</p>

                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm font-medium">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {/* Rating Section */}
                    <div>
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Overall Rating <span className="text-[#29ABE2]">*</span></label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors ${(hoveredRating || rating) >= star
                                                ? 'fill-orange-400 text-orange-400'
                                                : 'text-white/20'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Full Name <span className="text-[#29ABE2]">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all"
                                placeholder="Jane Doe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Company / Brand</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all"
                                placeholder="TechCorp Inc."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Your Role</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all"
                                placeholder="Marketing Director"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Your Review <span className="text-[#29ABE2]">*</span></label>
                        <textarea
                            required
                            rows={5}
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#29ABE2] focus:ring-1 focus:ring-[#29ABE2] outline-none transition-all resize-none"
                            placeholder="Tell us about the project and results..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-[#29ABE2] text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                    >
                        {status === 'submitting' ? (
                            <><Loader2 className="animate-spin" size={20} /> Submitting...</>
                        ) : (
                            <>Submit Review <Send size={18} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
