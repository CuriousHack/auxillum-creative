// src/services/api.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DashboardStats {
    totalProjects: number;
    activeServices: number;
    newMessages: number;
    totalVisits: string; // e.g., "1.2k"
    recentActivity: Array<{
        id: number;
        description: string;
        timestamp: string;
    }>;
}

export interface Project {
    id: number;
    title: string;
    category: string;
    year: string;
    image: string;
}

export interface Service {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    iconObj?: any; // Icon component reference (handled in component)
}

export interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    date: string;
    isRead: boolean;
    // content?: string;
}

// Helper to handle response
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

export const api = {
    fetchStats: async (): Promise<DashboardStats> => {
        try {
            const response = await fetch(`${API_URL}/stats`);
            return handleResponse<DashboardStats>(response);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            // Return mock data for development if API fails
            return {
                totalProjects: 12,
                activeServices: 4,
                newMessages: 25,
                totalVisits: '1.2k',
                recentActivity: [
                    { id: 1, description: 'New project "Summer Camp 2026" added', timestamp: '2 hours ago' },
                    { id: 2, description: 'Service "SEO Optimization" updated', timestamp: '5 hours ago' },
                    { id: 3, description: 'Message from John Doe received', timestamp: '1 day ago' },
                ]
            };
        }
    },

    fetchProjects: async (): Promise<Project[]> => {
        try {
            const response = await fetch(`${API_URL}/projects`);
            return handleResponse<Project[]>(response);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            // Return mock data
            return [
                { id: 1, title: "Shine with the Stars", category: "EVENT", year: "2023", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3" },
                { id: 2, title: "The Twist with Shine", category: "RADIO", year: "2020", image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0" },
                { id: 3, title: "KBS Documentary", category: "CONTENT", year: "2022", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728" },
                { id: 4, title: "MTN Campaign", category: "ATL", year: "2023", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3" },
            ];
        }
    },

    fetchServices: async (): Promise<Service[]> => {
        try {
            const response = await fetch(`${API_URL}/services`);
            return handleResponse<Service[]>(response);
        } catch (error) {
            console.error("Failed to fetch services:", error);
            // Return mock data
            return [
                {
                    id: 1,
                    title: "ATL & Media Buying",
                    subtitle: "Strategic Placement",
                    description: "Mass reach through TV, Radio, and Digital Outdoor. Data-driven media planning for maximum impact.",
                    features: ["Broadcast Media Planning", "Digital Out-Of-Home (DOOH)", "Cross-Platform Strategy", "Performance Analytics"]
                },
                {
                    id: 2,
                    title: "BTL & Experiential",
                    subtitle: "Direct Engagement",
                    description: "Immersive brand experiences that create lasting connections through launches and activations.",
                    features: ["Campaign Strategy & Launch", "Brand Activations", "Partnership Marketing", "Influencer Collaborations"]
                },
                {
                    id: 3,
                    title: "Creative Content",
                    subtitle: "Narrative-Driven",
                    description: "Compelling visual storytelling that captures attention and builds emotional connections.",
                    features: ["Digital & Social Campaigns", "Documentaries & Docuseries", "Brand Films", "Video Production"]
                },
                {
                    id: 4,
                    title: "Radio & Audio",
                    subtitle: "Sound Strategy",
                    description: "Audio content that resonates with listeners across all platforms and markets.",
                    features: ["Radio Show Production", "Syndication & Distribution", "Podcast Production", "Audio Branding"]
                }
            ];
        }
    },

    fetchMessages: async (): Promise<Message[]> => {
        try {
            const response = await fetch(`${API_URL}/contacts`);
            return handleResponse<Message[]>(response);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            // Return mock data
            return [
                { id: 1, name: "John Doe", email: "john@example.com", subject: "Partnership Inquiry", date: "2 mins ago", isRead: false },
                { id: 2, name: "Sarah Smith", email: "sarah@design.co", subject: "Project Quote Request", date: "1 hour ago", isRead: false },
                { id: 3, name: "Mike Johnson", email: "mike@techcorp.com", subject: "Re: Campaign Proposal", date: "Yesterday", isRead: true },
                { id: 4, name: "Emily Davis", email: "emily@startuplab.io", subject: "Consultation needed", date: "2 days ago", isRead: true },
                { id: 5, name: "David Wilson", email: "david@wilsongroup.com", subject: "Feedback on recent work", date: "3 days ago", isRead: true },
            ];
        }
    },

    createService: async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
        try {
            const response = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceData),
            });
            return handleResponse<Service>(response);
        } catch (error) {
            console.error("Failed to create service:", error);
            // Return mock created service
            return {
                id: Math.random(),
                ...serviceData
            };
        }
    }
};
