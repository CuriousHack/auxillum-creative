import { FolderOpen, MessageSquare, Layers, Users } from 'lucide-react';

export default function DashboardHome() {
    const stats = [
        { label: 'Total Projects', value: '12', icon: <FolderOpen className="text-[#29ABE2]" />, change: '+2 this month' },
        { label: 'Active Services', value: '4', icon: <Layers className="text-[#29ABE2]" />, change: 'All active' },
        { label: 'New Messages', value: '25', icon: <MessageSquare className="text-[#29ABE2]" />, change: '+5 unread' },
        { label: 'Total Visits', value: '1.2k', icon: <Users className="text-[#29ABE2]" />, change: '+12% vs last month' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black mb-2">Dashboard Overview</h1>
                <p className="text-white/50">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#29ABE2]/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-[#29ABE2]/10">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-medium text-[#29ABE2] bg-[#29ABE2]/5 px-2 py-1 rounded">
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-white/50">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                                <div className="w-2 h-2 rounded-full bg-[#29ABE2]" />
                                <div>
                                    <div className="text-sm font-medium text-white">New project "Summer Camp 2026" added</div>
                                    <div className="text-xs text-white/40">2 hours ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left">
                            <FolderOpen className="mb-3 text-[#29ABE2]" size={24} />
                            <div className="font-bold text-sm">Add Project</div>
                        </button>
                        <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left">
                            <MessageSquare className="mb-3 text-[#29ABE2]" size={24} />
                            <div className="font-bold text-sm">View Messages</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
