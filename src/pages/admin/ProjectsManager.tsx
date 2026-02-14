import { Plus, Search, MoreVertical, Pencil, Trash2, Link as LinkIcon } from 'lucide-react';

export default function ProjectsManager() {
    const projects = [
        { id: 1, title: "Shine with the Stars", category: "EVENT", year: "2023", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3" },
        { id: 2, title: "The Twist with Shine", category: "RADIO", year: "2020", image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0" },
        { id: 3, title: "KBS Documentary", category: "CONTENT", year: "2022", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728" },
        { id: 4, title: "MTN Campaign", category: "ATL", year: "2023", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-2">Projects</h1>
                    <p className="text-white/50">Manage your portfolio items.</p>
                </div>
                <button className="px-4 py-2 bg-[#29ABE2] text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2">
                    <Plus size={18} /> Add New Project
                </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#29ABE2] outline-none"
                        />
                    </div>
                    <div className="text-sm text-white/40">
                        {projects.length} results
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Project</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Year</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded bg-zinc-800 overflow-hidden shrink-0">
                                                <img src={`${project.image}?auto=format&fit=crop&w=100&q=80`} alt={project.title} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-white">{project.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-white/5 text-xs text-white/70 font-medium border border-white/10">
                                            {project.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white/50">{project.year}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-[#29ABE2]/10 hover:text-[#29ABE2] rounded"><LinkIcon size={16} /></button>
                                            <button className="p-2 hover:bg-[#29ABE2]/10 hover:text-[#29ABE2] rounded"><Pencil size={16} /></button>
                                            <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
