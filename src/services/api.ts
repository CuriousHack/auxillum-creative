// src/services/api.ts
import { showToast } from '../utils/toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DashboardStats {
    totalProjects: number;
    totalProjectsChange: string; // e.g., "+2 this month"
    activeServices: number;
    activeServicesChange: string; // e.g., "All active"
    newMessages: number;
    newMessagesChange: string; // e.g., "+5 unread"
    totalVisits: string; // e.g., "1.2k"
    totalVisitsChange: string; // e.g., "+12% vs last month"
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
    icon: string; // Store icon name as string
    features: string[];
    iconObj?: any; // Icon component reference (handled in component)
}

export interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    phone?: string;
    service?: string;
    isRead: boolean;
    // content?: string;
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    image: string;
    category: string;
    readTime: string;
}

// Helper to handle response
async function handleResponse<T>(response: Response, method?: string): Promise<T> {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const responseData = isJson ? await response.json() : null;

    if (!response.ok) {
        const errorMsg = responseData?.message || `HTTP error! Status: ${response.status}`;
        showToast(errorMsg, 'error');
        throw new Error(errorMsg);
    }

    // Backend now returns { message: string, data: T } or sometimes just { message: string }
    if (responseData && typeof responseData === 'object') {
        // Strategy: If it's a mutation (POST, PUT, DELETE), always show the message.
        if (method && ['POST', 'PUT', 'DELETE'].includes(method)) {
            if (responseData.message) showToast(responseData.message, 'success');
        }

        return (responseData.data !== undefined ? responseData.data : responseData) as T;
    }

    return responseData as T;
}

export const api = {
    fetchStats: async (): Promise<DashboardStats> => {
        try {
            const response = await fetch(`${API_URL}/analytics/stats`);
            return handleResponse<DashboardStats>(response);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            // Return mock data for development if API fails
            return {
                totalProjects: 120,
                totalProjectsChange: "+2 this month",
                activeServices: 4,
                activeServicesChange: "All active",
                newMessages: 25,
                newMessagesChange: "+5 unread",
                totalVisits: '1.2k',
                totalVisitsChange: "+12% vs last month",
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
                    icon: "tv",
                    description: "Mass reach through TV, Radio, and Digital Outdoor. Data-driven media planning for maximum impact.",
                    features: ["Broadcast Media Planning", "Digital Out-Of-Home (DOOH)", "Cross-Platform Strategy", "Performance Analytics"]
                },
                {
                    id: 2,
                    title: "BTL & Experiential",
                    subtitle: "Direct Engagement",
                    icon: "target",
                    description: "Immersive brand experiences that create lasting connections through launches and activations.",
                    features: ["Campaign Strategy & Launch", "Brand Activations", "Partnership Marketing", "Influencer Collaborations"]
                },
                {
                    id: 3,
                    title: "Creative Content",
                    subtitle: "Narrative-Driven",
                    icon: "film",
                    description: "Compelling storytelling across formats that captivates audiences and elevates brands.",
                    features: ["Digital & Social Campaigns", "Documentaries & Docuseries", "Brand Films", "Video Production"]
                },
                {
                    id: 4,
                    title: "Radio & Audio",
                    subtitle: "Sound Strategy",
                    icon: "headphones",
                    description: "Audio content that resonates with listeners across all platforms and markets.",
                    features: ["Radio Show Production", "Syndication & Distribution", "Podcast Production", "Audio Branding"]
                }
            ];
        }
    },

    fetchMessages: async (): Promise<Message[]> => {
        try {
            const response = await fetch(`${API_URL}/contacts`);
            console.log(response);
            return handleResponse<Message[]>(response);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            // Return mock data
            return [
                { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 8900", service: "Partnership", subject: "Partnership Inquiry", message: "Interested in a partnership.", date: "2 mins ago", isRead: false },
                { id: 2, name: "Sarah Smith", email: "sarah@design.co", phone: "+1 987 654 3210", service: "Web Design", subject: "Project Quote Request", message: "Can you provide a quote for a new website?", date: "1 hour ago", isRead: false },
                { id: 3, name: "Mike Johnson", email: "mike@techcorp.com", phone: "", service: "Campaign", subject: "Re: Campaign Proposal", message: "The proposal looks good, let's proceed.", date: "Yesterday", isRead: true },
                { id: 4, name: "Emily Davis", email: "emily@startuplab.io", phone: "+1 555 123 4567", service: "Consultation", subject: "Consultation needed", message: "I'd like to schedule a consultation.", date: "2 days ago", isRead: true },
                { id: 5, name: "David Wilson", email: "david@wilsongroup.com", phone: "", service: "General", subject: "Feedback on recent work", message: "Great job on the latest campaign!", date: "3 days ago", isRead: true },
            ];
        }
    },

    fetchBlogPosts: async (): Promise<BlogPost[]> => {
        try {
            const response = await fetch(`${API_URL}/blog`);
            return handleResponse<BlogPost[]>(response);
        } catch (error) {
            console.error("Failed to fetch blog posts:", error);
            // Return mock data
            return [
                {
                    id: 1,
                    title: "The Future of Digital Content in Nigeria",
                    excerpt: "How storytelling is evolving in the age of rapid digital transformation.",
                    content: "The digital landscape in Nigeria is undergoing a massive shift...",
                    author: "Shine Begho",
                    date: "May 15, 2024",
                    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
                    category: "INSIGHTS",
                    readTime: "5 min read"
                },
                {
                    id: 2,
                    title: "Strategic Media Buying: A Data-Driven Approach",
                    excerpt: "Why data is the most important asset in your advertising toolkit.",
                    content: "In today's competitive market, simply having a presence isn't enough...",
                    author: "Admin",
                    date: "June 2, 2024",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
                    category: "STRATEGY",
                    readTime: "8 min read"
                },
                {
                    id: 3,
                    title: "Experiential Marketing: Beyond the Screen",
                    excerpt: "Creating lasting brand connections through physical activations.",
                    content: "While digital is powerful, physical engagement creates unique bonds...",
                    author: "Creative Team",
                    date: "June 10, 2024",
                    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
                    category: "EXPERIENTIAL",
                    readTime: "6 min read"
                }
            ];
        }
    },

    createBlogPost: async (postData: FormData | Partial<BlogPost>): Promise<BlogPost> => {
        try {
            const isFormData = postData instanceof FormData;
            const headers: Record<string, string> = {};
            if (!isFormData) headers['Content-Type'] = 'application/json';

            const response = await fetch(`${API_URL}/blog`, {
                method: 'POST',
                headers,
                body: isFormData ? postData : JSON.stringify(postData),
            });
            return handleResponse<BlogPost>(response, 'POST');
        } catch (error) {
            console.error("Failed to create blog post:", error);
            return { id: Math.random(), ...postData } as BlogPost;
        }
    },

    updateBlogPost: async (id: number, postData: FormData | Partial<BlogPost>): Promise<BlogPost> => {
        try {
            const isFormData = postData instanceof FormData;
            const headers: Record<string, string> = {};
            if (!isFormData) headers['Content-Type'] = 'application/json';

            const response = await fetch(`${API_URL}/blog/${id}`, {
                method: 'PUT',
                headers,
                body: isFormData ? postData : JSON.stringify(postData),
            });
            return handleResponse<BlogPost>(response, 'PUT');
        } catch (error) {
            console.error("Failed to update blog post:", error);
            return { id, ...postData } as BlogPost;
        }
    },

    deleteBlogPost: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/blog/${id}`, { method: 'DELETE' });
            await handleResponse<void>(response, 'DELETE');
        } catch (error) {
            console.error("Failed to delete blog post:", error);
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
            return handleResponse<Service>(response, 'POST');
        } catch (error) {
            console.error("Failed to create service:", error);
            // Return mock created service
            return {
                id: Math.random(),
                ...serviceData
            };
        }
    },

    updateService: async (id: number, serviceData: Partial<Service>): Promise<Service> => {
        try {
            const response = await fetch(`${API_URL}/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceData),
            });
            return handleResponse<Service>(response, 'PUT');
        } catch (error) {
            console.error("Failed to update service:", error);
            // Mock success
            return {
                id,
                title: serviceData.title || 'Updated Service',
                subtitle: serviceData.subtitle || 'Updated Subtitle',
                description: serviceData.description || 'Updated Description',
                features: serviceData.features || [],
                icon: serviceData.icon || 'Tv'
            } as Service;
        }
    },

    deleteService: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/services/${id}`, {
                method: 'DELETE',
            });
            await handleResponse<void>(response, 'DELETE');
        } catch (error) {
            console.error("Failed to delete service:", error);
            // Mock success (no-op)
        }
    },

    createProject: async (projectData: FormData | Partial<Project>): Promise<Project> => {
        try {
            const isFormData = projectData instanceof FormData;
            const headers: Record<string, string> = {};
            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers,
                body: isFormData ? projectData : JSON.stringify(projectData),
            });
            return handleResponse<Project>(response, 'POST');
        } catch (error) {
            console.error("Failed to create project:", error);
            // Mock response
            return {
                id: Math.random(),
                title: 'New Project',
                category: 'Uncategorized',
                year: new Date().getFullYear().toString(),
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', // Placeholder
                ...(projectData instanceof FormData ? {} : projectData)
            } as Project;
        }
    },

    updateProject: async (id: number, projectData: FormData | Partial<Project>): Promise<Project> => {
        try {
            const isFormData = projectData instanceof FormData;
            const headers: Record<string, string> = {};
            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${API_URL}/projects/${id}`, {
                method: 'PUT',
                headers,
                body: isFormData ? projectData : JSON.stringify(projectData),
            });
            return handleResponse<Project>(response, 'PUT');
        } catch (error) {
            console.error("Failed to update project:", error);
            // Mock response
            return {
                id,
                title: 'Updated Project',
                category: 'Uncategorized',
                year: '2024',
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
                ...(projectData instanceof FormData ? {} : projectData)
            } as Project;
        }
    },

    deleteProject: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE',
            });
            await handleResponse<void>(response, 'DELETE');
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    },

    markMessageRead: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}/read`, { method: 'PUT' });
            await handleResponse<void>(response, 'PUT');
        } catch (error) {
            console.error("Failed to mark message as read:", error);
        }
    },

    markMessageUnread: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}/unread`, { method: 'PUT' });
            await handleResponse<void>(response, 'PUT');
        } catch (error) {
            console.error("Failed to mark message as unread:", error);
        }
    },

    deleteMessage: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
            await handleResponse<void>(response, 'DELETE');
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    }
};
