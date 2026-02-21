import { useEffect, useState } from 'react';
import { Search, Trash2, Mail, Phone, Calendar, User, Briefcase, X, Eye, EyeOff, Reply, Send, Loader2, AlertTriangle } from 'lucide-react';
import { api, Message } from '../../services/api';

export default function Messages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Action Loading States
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Reply Form State
    const [replyData, setReplyData] = useState({ subject: '', message: '' });

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = await api.fetchMessages();
                setMessages(data);
            } catch (error) {
                console.error("Failed to load messages", error);
            } finally {
                setLoading(false);
            }
        };
        loadMessages();
    }, []);

    const handleMessageClick = async (msg: Message) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            try {
                await api.markMessageRead(msg.id);
                // Optimistic update
                setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
            } catch (error) {
                console.error("Failed to mark message as read", error);
            }
        }
    };

    const handleMarkUnread = async (e: React.MouseEvent, msg: Message) => {
        e.stopPropagation();
        try {
            await api.markMessageUnread(msg.id);
            setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: false } : m));
            if (selectedMessage?.id === msg.id) {
                setSelectedMessage(null); // Close modal if marking unread from there
            }
        } catch (error) {
            console.error("Failed to mark message as unread", error);
        }
    };

    const confirmDelete = (e: React.MouseEvent | null, id: number) => {
        if (e) e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const handleDelete = async () => {
        if (!deleteConfirmId) return;
        setIsDeleting(true);

        try {
            await api.deleteMessage(deleteConfirmId);
            setMessages(messages.filter(m => m.id !== deleteConfirmId));
            if (selectedMessage?.id === deleteConfirmId) {
                setSelectedMessage(null);
            }
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete message", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const openReplyModal = () => {
        if (selectedMessage) {
            setReplyData({
                subject: `Re: ${selectedMessage.subject}`,
                message: ''
            });
            setReplyModalOpen(true);
        }
    };

    const sendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSendingReply(true);
        // Simulate sending email
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Sending reply to ${selectedMessage?.email}:`, replyData);
        alert("Reply sent successfully!");
        setIsSendingReply(false);
        setReplyModalOpen(false);
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.service?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-white/50">Loading messages...</div>;
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black mb-2">Messages</h1>
                    <p className="text-white/50">Manage inquiries and feedback.</p>
                </div>
            </div>

            <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 bg-black/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#29ABE2] outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => handleMessageClick(msg)}
                            className={`group flex items-center gap-4 p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.02] ${!msg.isRead ? 'bg-[#29ABE2]/5 border-l-2 border-l-[#29ABE2]' : 'border-l-2 border-l-transparent'}`}
                        >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shrink-0 text-sm ${!msg.isRead ? 'bg-[#29ABE2] text-black' : 'bg-zinc-800 text-white/40'}`}>
                                {msg.name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                                <div className="col-span-3">
                                    <div className={`font-medium truncate ${!msg.isRead ? 'text-white' : 'text-white/70'}`}>
                                        {msg.name}
                                    </div>
                                    <div className="text-xs text-white/40 truncate">{msg.email}</div>
                                </div>
                                <div className="col-span-7">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {msg.service && (
                                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] uppercase font-bold text-white/60 tracking-wider">
                                                {msg.service}
                                            </span>
                                        )}
                                        <span className={`text-sm truncate ${!msg.isRead ? 'text-white font-medium' : 'text-white/60'}`}>
                                            {msg.subject}
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/40 truncate">
                                        {msg.message}
                                    </div>
                                </div>
                                <div className="col-span-2 text-right">
                                    <div className={`text-xs ${!msg.isRead ? 'text-[#29ABE2] font-bold' : 'text-white/40'}`}>
                                        {msg.date}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                                <button
                                    onClick={(e) => confirmDelete(e, msg.id)}
                                    className="p-2 text-white/40 hover:text-red-500 rounded hover:bg-red-500/10 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                                {msg.isRead && (
                                    <button
                                        onClick={(e) => handleMarkUnread(e, msg)}
                                        className="p-2 text-white/40 hover:text-[#29ABE2] rounded hover:bg-[#29ABE2]/10 transition-colors"
                                        title="Mark as Unread"
                                    >
                                        <EyeOff size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredMessages.length === 0 && (
                        <div className="p-12 text-center text-white/40 flex flex-col items-center">
                            <Mail size={48} className="mb-4 opacity-20" />
                            <p>No messages found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-zinc-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-[#29ABE2]" />
                                        {selectedMessage.date}
                                    </div>
                                    {selectedMessage.service && (
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={14} className="text-[#29ABE2]" />
                                            {selectedMessage.service}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Sender Info - Sticky */}
                        <div className="p-6 bg-black/20 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#29ABE2] text-black font-bold flex items-center justify-center text-lg">
                                    {selectedMessage.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white">{selectedMessage.name}</div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-white/50">
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={12} />
                                            <a href={`mailto:${selectedMessage.email}`} className="hover:text-[#29ABE2] transition-colors">{selectedMessage.email}</a>
                                        </div>
                                        {selectedMessage.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={12} />
                                                <a href={`tel:${selectedMessage.phone}`} className="hover:text-[#29ABE2] transition-colors">{selectedMessage.phone}</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 text-white/80 leading-relaxed whitespace-pre-wrap">
                            {selectedMessage.message}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex items-center justify-between gap-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => confirmDelete(null, selectedMessage.id)}
                                    className="px-4 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-medium transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button
                                    onClick={(e) => handleMarkUnread(e, selectedMessage)}
                                    className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-medium transition-colors flex items-center gap-2"
                                >
                                    <EyeOff size={16} /> Mark Unread
                                </button>
                            </div>
                            <button
                                onClick={openReplyModal}
                                className="px-6 py-2 rounded-lg bg-[#29ABE2] text-black font-bold hover:bg-white transition-colors flex items-center gap-2"
                            >
                                <Reply size={18} /> Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {replyModalOpen && selectedMessage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setReplyModalOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black mb-1">Reply to {selectedMessage.name}</h2>
                        <p className="text-white/50 text-sm mb-6">Send a response via email.</p>

                        <form onSubmit={sendReply} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">To</label>
                                <input
                                    type="text"
                                    disabled
                                    value={selectedMessage.email}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/60 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={replyData.subject}
                                    onChange={e => setReplyData({ ...replyData, subject: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={replyData.message}
                                    onChange={e => setReplyData({ ...replyData, message: e.target.value })}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#29ABE2] outline-none transition-colors resize-none"
                                    placeholder="Type your reply here..."
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setReplyModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-lg border border-white/10 font-bold hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSendingReply}
                                    className="flex-1 py-3 px-4 rounded-lg bg-[#29ABE2] text-black font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSendingReply ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Send Reply</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Delete Message?</h3>
                        <p className="text-white/50 text-center text-sm mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-3 px-4 rounded-lg border border-white/10 font-bold hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
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
