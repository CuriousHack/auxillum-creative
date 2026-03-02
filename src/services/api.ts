import { showToast } from '../utils/toast';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export type UserRole = 'admin' | 'editor';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    profileImage?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface DashboardStats {
    totalProjects: number;
    totalProjectsChange: string;
    activeServices: number;
    activeServicesChange: string;
    newMessages: number;
    newMessagesChange: string;
    totalVisits: string;
    totalVisitsChange: string;
    recentActivity: { id: number; description: string; timestamp: string }[];
}

export interface Message {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    subject: string;
    message: string;
    date: string;
    isRead: boolean;
}

export interface Service {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    icon?: string;
}

export interface Project {
    id: number;
    title: string;
    category: string;
    year: string;
    image: string;
    link?: string;
    fileUrl?: string;
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    image: string;
    readTime: string;
}

export interface Resource {
    id: number;
    key: string;
    name: string;
    path: string;
    type?: string;
}

export interface Review {
    id: number;
    name: string;
    company: string;
    role: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
}

export interface SiteSettings {
    mission: string;
    vision: string;
    founder?: {
        name: string;
        role: string;
        about: string;
        image: string;
        features: string[];
    };
    hero?: {
        title: string;
        subtitle: string;
        backgroundImage: string;
    };
    logo?: {
        url: string;
        showDesktop: boolean;
        showMobile: boolean;
    };
    aboutImage?: string;
    stats?: {
        number: string;
        label: string;
    }[];
    clientRoster?: {
        type: 'text' | 'image';
        value: string;
    }[];
}

// Helper to get auth headers
const getHeaders = (isFormData = false) => {
    const token = localStorage.getItem('token');
    return {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

async function handleResponse<T>(response: Response, method?: string): Promise<T> {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const responseData = isJson ? await response.json() : null;

    if (!response.ok) {
        const errorMsg = responseData?.message || `HTTP error! Status: ${response.status}`;
        showToast(errorMsg, 'error');
        throw new Error(errorMsg);
    }

    if (responseData && typeof responseData === 'object') {
        if (method && ['POST', 'PUT', 'DELETE'].includes(method)) {
            if (responseData.message) showToast(responseData.message, 'success');
        }
        return (responseData.data !== undefined ? responseData.data : responseData) as T;
    }

    return responseData as T;
}

// Ensure settings data with JSON strings are cleanly parsed to objects across the app
const parseSettings = (data: any): SiteSettings => {
    const safeParse = (val: any, defaultVal: any) => {
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return defaultVal; }
        }
        return val || defaultVal;
    };
    return {
        ...data,
        founder: safeParse(data.founder, { name: '', role: '', about: '', image: '', features: [] }),
        hero: safeParse(data.hero, { title: '', subtitle: '', backgroundImage: '' }),
        logo: safeParse(data.logo, { url: '', showDesktop: false, showMobile: false }),
        stats: safeParse(data.stats, []),
        clientRoster: safeParse(data.clientRoster, [])
    };
};

export const api = {
    // --- Dashboard & Analytics ---
    fetchStats: async (): Promise<DashboardStats> => {
        try {
            const response = await fetch(`${API_URL}/analytics/stats`);
            return handleResponse<DashboardStats>(response);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
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

    // --- Messages Management ---
    fetchMessages: async (): Promise<Message[]> => {
        try {
            const response = await fetch(`${API_URL}/contacts`, { headers: getHeaders() });
            return handleResponse<Message[]>(response);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            return [
                { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 8900", service: "Partnership", subject: "Partnership Inquiry", message: "Interested in a partnership.", date: "2 mins ago", isRead: false },
                { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1 987 654 3210", service: "Media Strategy", subject: "Quote Request", message: "Need a quote for media strategy.", date: "1 hour ago", isRead: true },
            ];
        }
    },

    markMessageRead: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/contacts/${id}/read`, { method: 'PUT', headers: getHeaders() });
        return handleResponse<void>(response, 'PUT');
    },

    markMessageUnread: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/contacts/${id}/unread`, { method: 'PUT', headers: getHeaders() });
        return handleResponse<void>(response, 'PUT');
    },

    deleteMessage: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE', headers: getHeaders() });
        return handleResponse<void>(response, 'DELETE');
    },

    // --- Services Management ---
    fetchServices: async (): Promise<Service[]> => {
        try {
            const response = await fetch(`${API_URL}/services`);
            return handleResponse<Service[]>(response);
        } catch (error) {
            console.error("Failed to fetch services:", error);
            return [
                { id: 1, title: 'Media Strategy', subtitle: 'Strategic Planning', description: 'Comprehensive planning and execution...', features: ['Market Research', 'Media Buying'], icon: 'Target' },
                { id: 2, title: 'Experiential Marketing', subtitle: 'Brand Experience', description: 'Immersive brand experiences...', features: ['Event Planning', 'Activations'], icon: 'Zap' },
            ];
        }
    },

    createService: async (data: FormData | Partial<Service>): Promise<Service> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_URL}/services`, {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            headers: getHeaders(isFormData)
        });
        return handleResponse<Service>(response, 'POST');
    },

    updateService: async (id: number, data: FormData | Partial<Service>): Promise<Service> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: 'PUT',
            body: isFormData ? data : JSON.stringify(data),
            headers: getHeaders(isFormData)
        });
        return handleResponse<Service>(response, 'PUT');
    },

    deleteService: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE', headers: getHeaders() });
        return handleResponse<void>(response, 'DELETE');
    },

    // --- Projects Management ---
    fetchProjects: async (): Promise<Project[]> => {
        try {
            const response = await fetch(`${API_URL}/projects`);
            return handleResponse<Project[]>(response);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            return [];
        }
    },

    createProject: async (data: FormData | Partial<Project>): Promise<Project> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            headers: getHeaders(isFormData)
        });
        return handleResponse<Project>(response, 'POST');
    },

    updateProject: async (id: number, data: FormData | Partial<Project>): Promise<Project> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            body: isFormData ? data : JSON.stringify(data),
            headers: getHeaders(isFormData)
        });
        return handleResponse<Project>(response, 'PUT');
    },

    deleteProject: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: getHeaders() });
        return handleResponse<void>(response, 'DELETE');
    },

    // --- Blog Management ---
    fetchBlogPosts: async (): Promise<BlogPost[]> => {
        try {
            const response = await fetch(`${API_URL}/blog`);
            return handleResponse<BlogPost[]>(response);
        } catch (error) {
            console.error("Failed to fetch blog posts:", error);
            return [
                { id: 1, title: 'The Future of Digital Content in Africa', excerpt: 'How streaming and creators are changing the landscape...', content: 'Full content here...', author: 'Admin', date: 'Oct 12, 2025', category: 'STRATEGY', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', readTime: '5 min read' },
                { id: 2, title: 'The Impact of AI on Creative Media', excerpt: 'How AI is influencing creative decisions...', content: 'Full content...', author: 'Editor', date: 'Oct 15, 2025', category: 'INSIGHTS', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80', readTime: '5 min read' },
            ];
        }
    },

    createBlogPost: async (data: FormData | Partial<BlogPost>): Promise<BlogPost> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_URL}/blog`, {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            headers: getHeaders(isFormData)
        });
        return handleResponse<BlogPost>(response, 'POST');
    },

    updateBlogPost: async (id: number, data: FormData | Partial<BlogPost>): Promise<BlogPost> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_URL}/blog/${id}`, {
            method: 'PUT',
            body: isFormData ? data : JSON.stringify(data),
            headers: getHeaders(isFormData)
        });
        return handleResponse<BlogPost>(response, 'PUT');
    },

    deleteBlogPost: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/blog/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse<void>(response, 'DELETE');
    },

    // --- Settings Management ---
    fetchSettings: async (): Promise<SiteSettings> => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            const data = await handleResponse<any>(response);
            return parseSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            const founderData = localStorage.getItem('site_founder');
            const mockSettings: SiteSettings = {
                mission: localStorage.getItem('site_mission') || "To authentically amplify African narratives through innovative creative media, bridging local cultural intelligence with global production standards.",
                vision: localStorage.getItem('site_vision') || "To be the premier creative powerhouse out of Africa, setting the global benchmark for culturally resonant storytelling and brand experiences.",
                founder: founderData ? JSON.parse(founderData) : {
                    name: "Samson Aderotimi",
                    role: "Founder & Chief Creative Officer",
                    about: "With over a decade navigating the vibrant intersections of media, advertising, and cultural production in West Africa, Samson established Auxilum to be a catalyst for authentic storytelling. His vision is rooted in the belief that African narratives, when amplified with global production standards, have the power to shift perspectives and drive immense value for brands.",
                    image: "/mock-images/founder.jpg",
                    features: [
                        "10+ Years in Creative Media",
                        "Award-winning Campaigns",
                        "Cultural Innovation Leader"
                    ]
                },
                hero: {
                    title: "AMPLIFYING AFRICAN NARRATIVES",
                    subtitle: "We are a full-service creative agency building culturally resonant brands through innovative storytelling and immersive digital experiences.",
                    backgroundImage: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80"
                },
                logo: {
                    url: "",
                    showDesktop: false,
                    showMobile: false
                },
                aboutImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
                stats: [
                    { number: "100+", label: "Projects Delivered" },
                    { number: "50+", label: "Brands Served" },
                    { number: "5+", label: "Years Experience" },
                    { number: "10M+", label: "Audience Reach" }
                ],
                clientRoster: [
                    { type: 'text', value: 'MTN' },
                    { type: 'text', value: 'MALTINA' },
                    { type: 'text', value: 'AIRTEL' },
                    { type: 'text', value: 'TECHNO' },
                    { type: 'text', value: 'KBS' },
                    { type: 'text', value: "DOMINO'S" },
                    { type: 'text', value: 'BELVEDERE' },
                    { type: 'text', value: 'OVALTINE' }
                ]
            };
            return mockSettings;
        }
    },

    updateSettings: async (data: SiteSettings | FormData): Promise<SiteSettings> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: getHeaders(isFormData),
            body: isFormData ? data : JSON.stringify(data)
        });
        const updatedData = await handleResponse<any>(response, 'PUT');
        return parseSettings(updatedData);
    },

    // --- Reviews Management ---
    fetchReviews: async (): Promise<Review[]> => {
        try {
            const response = await fetch(`${API_URL}/reviews`, { headers: getHeaders() });
            return handleResponse<Review[]>(response);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            return [
                { id: 1, name: "Sarah Jenkins", company: "TechCorp", role: "CMO", rating: 5, comment: "Auxilum transformed our brand presence with their amazing creativity.", status: "approved", date: "Oct 10, 2025" },
                { id: 2, name: "David Osei", company: "RetailPlus", role: "Director", rating: 4, comment: "Great execution on our BTL campaign.", status: "pending", date: "Oct 15, 2025" }
            ];
        }
    },

    fetchApprovedReviews: async (): Promise<Review[]> => {
        try {
            const response = await fetch(`${API_URL}/reviews/approved`);
            return handleResponse<Review[]>(response);
        } catch (error) {
            console.error("Failed to fetch approved reviews:", error);
            return [
                { id: 1, name: "Sarah Jenkins", company: "TechCorp", role: "CMO", rating: 5, comment: "Auxilum transformed our brand presence with their amazing creativity.", status: "approved", date: "Oct 10, 2025" }
            ];
        }
    },

    submitReview: async (data: Partial<Review>): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse<{ message: string }>(response, 'POST');
    },

    updateReviewStatus: async (id: number, status: 'approved' | 'rejected'): Promise<Review> => {
        const response = await fetch(`${API_URL}/reviews/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        return handleResponse<Review>(response, 'PUT');
    },

    // --- Authentication ---
    login: async (credentials: any): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return handleResponse<AuthResponse>(response, 'POST');
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return handleResponse<{ message: string }>(response, 'POST');
    },

    verifyOTP: async (email: string, otp: string): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        return handleResponse<{ message: string }>(response, 'POST');
    },

    resetPassword: async (data: any): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse<{ message: string }>(response, 'POST');
    },

    // --- User Profile & Security ---
    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse<User>(response, 'PUT');
    },

    changePassword: async (data: any): Promise<{ message: string }> => {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse<{ message: string }>(response, 'POST');
    },

    verifyChangePassword: async (data: any): Promise<void> => {
        const response = await fetch(`${API_URL}/auth/verify-change-password`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse<void>(response, 'POST');
    },

    // --- Admin User Management ---
    createUser: async (data: any): Promise<User> => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse<User>(response, 'POST');
    },

    fetchUsers: async (): Promise<User[]> => {
        const response = await fetch(`${API_URL}/users`, {
            headers: getHeaders()
        });
        return handleResponse<User[]>(response);
    },

    // --- Resources Management ---
    fetchResource: async (key: string): Promise<Resource> => {
        const response = await fetch(`${API_URL}/resources/${key}`);
        return handleResponse<Resource>(response);
    },

    fetchAllResources: async (): Promise<Resource[]> => {
        const response = await fetch(`${API_URL}/resources`, { headers: getHeaders() });
        return handleResponse<Resource[]>(response);
    },

    upsertResource: async (data: FormData): Promise<Resource> => {
        const response = await fetch(`${API_URL}/resources`, {
            method: 'POST',
            body: data,
            headers: getHeaders(true)
        });
        return handleResponse<Resource>(response, 'POST');
    }
};
