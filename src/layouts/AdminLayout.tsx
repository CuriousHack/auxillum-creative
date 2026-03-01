import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, FolderOpen, Layers, MessageSquare,
    LogOut, Menu, X, Sparkles, Newspaper, FileText, Settings, Star, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open for explicit UX

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Overview', roles: ['admin', 'editor'] },
        { path: '/admin/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
        { path: '/admin/projects', icon: FolderOpen, label: 'Projects', roles: ['admin'] },
        { path: '/admin/services', icon: Layers, label: 'Services', roles: ['admin'] },
        { path: '/admin/blog', icon: Newspaper, label: 'Blog', roles: ['admin', 'editor'] },
        { path: '/admin/resources', icon: FileText, label: 'Resources', roles: ['admin'] },
        { path: '/admin/reviews', icon: Star, label: 'Reviews', roles: ['admin'] },
        { path: '/admin/messages', icon: MessageSquare, label: 'Messages', roles: ['admin'] }
    ];

    const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

    return (
        <div className="h-screen w-screen overflow-hidden bg-black text-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-50 h-[100dvh] bg-zinc-950 border-r border-[#29ABE2]/10 transition-all duration-500 ease-in-out flex flex-col shadow-2xl shadow-[#29ABE2]/5 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Logo Section */}
                <div className="h-24 flex items-center px-6 border-b border-[#29ABE2]/10 bg-black/40 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#29ABE2]/10 via-transparent to-transparent opacity-50 pointer-events-none" />

                    <Link to="/admin" className="flex items-center gap-4 group relative z-10 w-full">
                        <div className="w-10 h-10 min-w-[40px] bg-gradient-to-br from-[#29ABE2] to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#29ABE2]/40 group-hover:scale-105 transition-all duration-300">
                            <Sparkles className="text-black" size={20} />
                        </div>
                        <div className={`flex flex-col justify-center transition-all duration-300 transform origin-left ${isSidebarOpen ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-95 pointer-events-none hidden md:block md:w-0'}`}>
                            <span className="font-black tracking-tighter text-lg leading-none">
                                AUXIL<span className="text-[#29ABE2]">UM</span>
                            </span>
                            <span className="text-[10px] font-bold text-[#29ABE2] uppercase tracking-widest mt-1">Creative Media</span>
                        </div>
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden absolute right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors z-20"
                    >
                        <X size={18} />
                    </button>

                    {/* Desktop Toggle Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden md:flex absolute right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors z-20"
                        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    {/* Main Nav Header */}
                    <div className={`text-[10px] font-black text-white/30 uppercase tracking-widest mb-4 px-2 transition-all duration-300 ${!isSidebarOpen && 'md:opacity-0 hidden md:block'}`}>
                        Main Menu
                    </div>

                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                                className={`flex items-center h-[52px] rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-[#29ABE2]/15 to-transparent border border-[#29ABE2]/30 text-white shadow-lg shadow-[#29ABE2]/5'
                                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#29ABE2] shadow-[0_0_10px_#29ABE2] rounded-r-full" />
                                )}
                                <div className="min-w-[56px] flex items-center justify-center relative z-10">
                                    <item.icon size={20} className={`${isActive ? 'text-[#29ABE2]' : 'group-hover:scale-110 transition-transform duration-300 group-hover:text-[#29ABE2]/70'} drop-shadow-md`} />
                                </div>
                                <span className={`font-semibold text-sm transition-all duration-300 whitespace-nowrap overflow-hidden relative z-10 ${isSidebarOpen ? 'opacity-100 w-auto tracking-wide' : 'opacity-0 w-0'
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Profile & Logout Footer */}
                <div className="p-4 border-t border-[#29ABE2]/10 bg-black/40 flex flex-col gap-2">
                    {/* Profile Link */}
                    <Link
                        to="/admin/profile"
                        onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                        className={`flex items-center h-12 rounded-xl transition-all duration-300 group ${location.pathname === '/admin/profile'
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    >
                        <div className="min-w-[56px] flex items-center justify-center">
                            <Sparkles size={20} className={location.pathname === '/admin/profile' ? 'text-white' : 'group-hover:rotate-12 transition-transform'} />
                        </div>
                        <span className={`font-semibold text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'opacity-100 w-auto tracking-wide' : 'opacity-0 w-0 hidden md:block md:w-0'
                            }`}>
                            Admin Profile
                        </span>
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="flex items-center h-12 w-full rounded-xl transition-all duration-300 group text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                    >
                        <div className="min-w-[56px] flex items-center justify-center">
                            <LogOut size={20} className="group-hover:-translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className={`font-bold text-sm tracking-widest transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden md:block md:w-0'
                            }`}>
                            SIGN OUT
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#050505] h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-20 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-8 z-40">
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
