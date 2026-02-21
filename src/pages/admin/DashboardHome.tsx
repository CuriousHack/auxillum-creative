import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, MessageSquare, Layers, Users } from 'lucide-react';
import { api, DashboardStats } from '../../services/api';
import ProjectModal from '../../components/admin/ProjectModal';

export default function DashboardHome() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await api.fetchStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-white/50">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="p-8 text-center text-red-500/50">Failed to load dashboard data.</div>;
    }

    const statCards = [
        { label: 'Total Projects', value: stats.totalProjects, icon: <FolderOpen className="text-[#29ABE2]" />, change: stats.totalProjectsChange },
        { label: 'Active Services', value: stats.activeServices, icon: <Layers className="text-[#29ABE2]" />, change: stats.activeServicesChange },
        { label: 'New Messages', value: stats.newMessages, icon: <MessageSquare className="text-[#29ABE2]" />, change: stats.newMessagesChange },
        { label: 'Total Visits', value: stats.totalVisits, icon: <Users className="text-[#29ABE2]" />, change: stats.totalVisitsChange },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black mb-2">Dashboard Overview</h1>
                <p className="text-white/50">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
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
                        {stats?.recentActivity?.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                                <div className="w-2 h-2 rounded-full bg-[#29ABE2]" />
                                <div>
                                    <div className="text-sm font-medium text-white">{activity.description}</div>
                                    <div className="text-xs text-white/40">{activity.timestamp}</div>
                                </div>
                            </div>
                        )) || <p className="text-white/40 text-sm">No recent activity found.</p>}
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsProjectModalOpen(true)}
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left"
                        >
                            <FolderOpen className="mb-3 text-[#29ABE2]" size={24} />
                            <div className="font-bold text-sm">Add Project</div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/messages')}
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left"
                        >
                            <MessageSquare className="mb-3 text-[#29ABE2]" size={24} />
                            <div className="font-bold text-sm">View Messages</div>
                        </button>
                    </div>
                </div>
            </div>

            <ProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSuccess={() => {
                    // Refresh stats after adding a project
                    api.fetchStats().then(setStats);
                }}
            />
        </div>
    );
}
