import { Tv, Users, Film, Radio, Pencil, Trash2, Plus } from 'lucide-react';

export default function ServicesManager() {
    const services = [
        {
            id: 1,
            icon: <Tv className="w-6 h-6 text-[#29ABE2]" />,
            title: "ATL & Media Buying",
            subtitle: "Strategic Placement",
            description: "Mass reach through TV, Radio, and Digital Outdoor. Data-driven media planning for maximum impact.",
            features: ["Broadcast Media Planning", "Digital Out-Of-Home (DOOH)", "Cross-Platform Strategy", "Performance Analytics"]
        },
        {
            id: 2,
            icon: <Users className="w-6 h-6 text-[#29ABE2]" />,
            title: "BTL & Experiential",
            subtitle: "Direct Engagement",
            description: "Immersive brand experiences that create lasting connections through launches and activations.",
            features: ["Campaign Strategy & Launch", "Brand Activations", "Partnership Marketing", "Influencer Collaborations"]
        },
        {
            id: 3,
            icon: <Film className="w-6 h-6 text-[#29ABE2]" />,
            title: "Creative Content",
            subtitle: "Narrative-Driven",
            description: "Compelling visual storytelling that captures attention and builds emotional connections.",
            features: ["Digital & Social Campaigns", "Documentaries & Docuseries", "Brand Films", "Video Production"]
        },
        {
            id: 4,
            icon: <Radio className="w-6 h-6 text-[#29ABE2]" />,
            title: "Radio & Audio",
            subtitle: "Sound Strategy",
            description: "Audio content that resonates with listeners across all platforms and markets.",
            features: ["Radio Show Production", "Syndication & Distribution", "Podcast Production", "Audio Branding"]
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black mb-2">Services</h1>
                    <p className="text-white/50">Manage your service offerings.</p>
                </div>
                <button className="px-4 py-2 bg-[#29ABE2] text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2">
                    <Plus size={18} /> Add New Service
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 group hover:border-[#29ABE2]/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-[#29ABE2]/10">
                                {service.icon}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-[#29ABE2]/10 hover:text-[#29ABE2] rounded transition-colors">
                                    <Pencil size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                        <p className="text-xs font-bold text-[#29ABE2] tracking-widest mb-4">{service.subtitle.toUpperCase()}</p>
                        <p className="text-white/60 text-sm mb-6">{service.description}</p>

                        <div className="space-y-2">
                            {service.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                                    <div className="w-1 h-1 rounded-full bg-[#29ABE2]" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
