import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, FolderOpen, Layers, MessageSquare,
    LogOut, Menu, X, Sparkles, Newspaper
} from 'lucide-react';

export default function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Overview', roles: ['admin', 'editor'] },
        { path: '/admin/projects', icon: FolderOpen, label: 'Projects', roles: ['admin'] },
        { path: '/admin/services', icon: Layers, label: 'Services', roles: ['admin'] },
        { path: '/admin/blog', icon: Newspaper, label: 'Blog', roles: ['admin', 'editor'] },
        { path: '/admin/messages', icon: MessageSquare, label: 'Messages', roles: ['admin'] },
        { path: '/admin/profile', icon: Sparkles, label: 'Profile', roles: ['admin', 'editor'] },
    ];

    const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-50 h-screen bg-zinc-950 border-r border-white/10 transition-all duration-500 ease-in-out flex flex-col ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-white/5 bg-black/20">
                    <Link to="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-[#29ABE2] rounded-xl flex items-center justify-center shadow-lg shadow-[#29ABE2]/20 group-hover:scale-110 transition-transform">
                            <Sparkles className="text-black" size={20} />
                        </div>
                        <span className={`font-black tracking-tighter text-xl transition-all duration-300 ${!isSidebarOpen && 'md:opacity-0 md:pointer-events-none'}`}>
                            AUXIL<span className="text-[#29ABE2]">UM</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden ml-auto text-white/40 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-8 space-y-1 overflow-y-auto custom-scrollbar">
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                                className={`flex items-center h-12 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-[#29ABE2] text-black shadow-lg shadow-[#29ABE2]/20'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className="min-w-[56px] flex items-center justify-center">
                                    <item.icon size={22} className={isActive ? 'text-black' : 'group-hover:scale-110 transition-transform'} />
                                </div>
                                <span className={`font-bold transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Integration Info/Logout */}
                <div className="p-4 border-t border-white/5 space-y-2 bg-black/20">
                    <button
                        onClick={logout}
                        className={`flex items-center h-12 w-full rounded-xl transition-all duration-300 group text-red-500/60 hover:text-red-500 hover:bg-red-500/5`}
                    >
                        <div className="min-w-[56px] flex items-center justify-center">
                            <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className={`font-black text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                            }`}>
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-white/40 hover:text-[#29ABE2] transition-colors p-2 hover:bg-white/5 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="h-6 w-px bg-white/10 hidden sm:block mx-2" />
                        <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest hidden sm:block">
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-sm font-black text-white">
                                {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                            </span>
                            <span className="text-[10px] font-bold text-[#29ABE2] uppercase tracking-tighter">
                                {user?.role || 'System Admin'}
                            </span>
                        </div>
                        <Link to="/admin/profile" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group hover:border-[#29ABE2]/50 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#29ABE2] to-blue-600 flex items-center justify-center text-black font-black text-xs shadow-inner">
                                {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'U'}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto custom-scrollbar relative">
                    <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
