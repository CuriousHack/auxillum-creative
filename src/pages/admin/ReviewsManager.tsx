import { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Clock, Link as LinkIcon } from 'lucide-react';
import { api, Review } from '../../services/api';
import { showToast } from '../../utils/toast';

export default function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const data = await api.fetchReviews();
            setReviews(data);
        } catch (error) {
            console.error("Failed to load reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
        try {
            // Optimistic update
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
            await api.updateReviewStatus(id, status);
            showToast(`Review ${status} successfully.`, "success");
        } catch (error) {
            console.error("Failed to update status:", error);
            showToast("Failed to update the review status", "error");
            // Revert optimistic update on failure by reloading
            loadReviews();
        }
    };

    const copyReviewLink = () => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/submit-review`;
        navigator.clipboard.writeText(link);
        showToast("Review portal link copied to clipboard", "success");
    };

    if (loading) return <div className="p-8 text-center text-white/50">Loading reviews...</div>;

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    const resolvedReviews = reviews.filter(r => r.status !== 'pending');

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Reviews Manager</h1>
                    <p className="text-white/50">Moderate client testimonials before they appear on the landing page.</p>
                </div>

                <button
                    onClick={copyReviewLink}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#29ABE2]/50 text-white font-bold rounded-xl transition-all group"
                >
                    <LinkIcon size={18} className="text-[#29ABE2] group-hover:scale-110 transition-transform" />
                    Copy Submission Link
                </button>
            </div>

            {/* Pending Reviews */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clock size={20} className="text-orange-400" />
                    Pending Approval ({pendingReviews.length})
                </h2>

                {pendingReviews.length === 0 ? (
                    <div className="p-8 text-center bg-white/5 border border-white/10 rounded-3xl text-white/40 font-medium">
                        No pending reviews.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pendingReviews.map(review => (
                            <ReviewCard key={review.id} review={review} onUpdateStatus={handleUpdateStatus} />
                        ))}
                    </div>
                )}
            </div>

            <div className="h-px bg-white/10 my-8" />

            {/* Resolved Reviews */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white/60">
                    <CheckCircle2 size={20} />
                    Moderated Reviews
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-70">
                    {resolvedReviews.map(review => (
                        <ReviewCard key={review.id} review={review} onUpdateStatus={handleUpdateStatus} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ReviewCard({ review, onUpdateStatus }: { review: Review, onUpdateStatus: (id: number, status: 'approved' | 'rejected') => void }) {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm flex flex-col h-full relative overflow-hidden group">
            {review.status === 'approved' && <div className="absolute top-0 right-0 w-2 h-full bg-green-500/50" />}
            {review.status === 'rejected' && <div className="absolute top-0 right-0 w-2 h-full bg-red-500/50" />}

            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className={star <= review.rating ? "fill-orange-400 text-orange-400" : "text-white/20"} />
                    ))}
                </div>
                <div className="text-xs text-white/40">{review.date}</div>
            </div>

            <p className="text-lg text-white/90 mb-6 flex-grow">"{review.comment}"</p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div>
                    <div className="font-bold text-white group-hover:text-[#29ABE2] transition-colors">{review.name}</div>
                    <div className="text-xs text-white/50">{review.role}{review.company ? ` at ${review.company}` : ''}</div>
                </div>

                <div className="flex items-center gap-2">
                    {review.status !== 'approved' && (
                        <button
                            onClick={() => onUpdateStatus(review.id, 'approved')}
                            className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                            title="Approve Review"
                        >
                            <CheckCircle2 size={20} />
                        </button>
                    )}
                    {review.status !== 'rejected' && (
                        <button
                            onClick={() => onUpdateStatus(review.id, 'rejected')}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                            title="Reject/Hide Review"
                        >
                            <XCircle size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
