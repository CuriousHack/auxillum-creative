import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FolderOpen, Layers, MessageSquare,
    LogOut, Menu, X, Sparkles, Newspaper
} from 'lucide-react';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
        { icon: <FolderOpen size={20} />, label: 'Projects', path: '/admin/projects' },
        { icon: <Layers size={20} />, label: 'Services', path: '/admin/services' },
        { icon: <MessageSquare size={20} />, label: 'Messages', path: '/admin/messages' },
        { icon: <Newspaper size={20} />, label: 'Blog', path: '/admin/blog' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-50 h-screen bg-zinc-950 border-r border-white/10 transition-all duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <Link to="/admin" className={`font-black tracking-tighter text-xl ${!isSidebarOpen && 'hidden md:block'}`}>
                        AUXIL<span className="text-[#29ABE2]">UM</span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden text-white/50 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-[#29ABE2]/10 text-[#29ABE2]'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span className={`${!isSidebarOpen && 'md:hidden'} whitespace-nowrap`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg w-full transition-colors">
                        <LogOut size={20} />
                        <span className={`${!isSidebarOpen && 'md:hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white/50 hover:text-white md:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#29ABE2]/20 flex items-center justify-center border border-[#29ABE2]/30">
                            <Sparkles size={14} className="text-[#29ABE2]" />
                        </div>
                        <span className="text-sm font-medium hidden sm:block">Admin User</span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8 overflow-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
