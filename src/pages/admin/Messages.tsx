import { useEffect, useState } from 'react';
import { Search, Trash2, MoreVertical } from 'lucide-react';
import { api, Message } from '../../services/api';

export default function Messages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="p-8 text-center text-white/50">Loading messages...</div>;
    }

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
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
                            className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#29ABE2] outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-white/40 hover:text-white rounded hover:bg-white/5">
                            <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-white/40 hover:text-white rounded hover:bg-white/5">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto">
                    {messages?.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors ${!msg.isRead ? 'bg-[#29ABE2]/5' : ''}`}
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-[#29ABE2] font-bold shrink-0">
                                {msg.name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center">
                                <div className={`col-span-3 font-medium truncate ${!msg.isRead ? 'text-white' : 'text-white/60'}`}>
                                    {msg.name}
                                </div>
                                <div className={`col-span-7 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 truncate ${!msg.isRead ? 'text-white' : 'text-white/60'}`}>
                                    <span className="font-medium">{msg.subject}</span>
                                    <span className="hidden md:inline text-white/20">-</span>
                                    <span className="text-sm text-white/40 truncate">
                                        {msg.message}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right text-xs text-white/40">
                                    {msg.date}
                                </div>
                            </div>
                        </div>
                    )) || <div className="p-8 text-center text-white/40">No messages found.</div>}
                </div>
            </div>
        </div>
    );
}
