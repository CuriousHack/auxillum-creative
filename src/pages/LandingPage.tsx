import { useState, useEffect } from 'react';
import {
  Menu, X, Instagram, Mail, Phone, MapPin, Send,
  Play, ArrowUpRight, Sparkles,
  Tv, Users, Film, Radio, ArrowRight, MousePointer2, Newspaper, Clock
} from 'lucide-react';
import { api, BlogPost } from '../services/api';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showPortal, setShowPortal] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await api.fetchBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error("Failed to fetch blog posts", error);
      }
    };
    loadBlogPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = ['home', 'about', 'services', 'work', 'insights', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setFeedbackMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setFeedbackMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFeedbackMessage(data.message || 'Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setTimeout(() => {
          setStatus('idle');
          setFeedbackMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setFeedbackMessage(data.message || 'Failed to send message. Please try again.');
        setTimeout(() => {
          setStatus('idle');
          setFeedbackMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setFeedbackMessage('An error occurred. Please try again later.');
      setTimeout(() => {
        setStatus('idle');
        setFeedbackMessage('');
      }, 5000);
    }
  };

  const services = [
    {
      icon: <Tv className="w-10 h-10" />,
      title: "ATL & Media Buying",
      subtitle: "Strategic Placement",
      description: "Mass reach through TV, Radio, and Digital Outdoor. Data-driven media planning for maximum impact.",
      features: ["Broadcast Media Planning", "Digital Out-Of-Home (DOOH)", "Cross-Platform Strategy", "Performance Analytics"]
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "BTL & Experiential",
      subtitle: "Direct Engagement",
      description: "Immersive brand experiences that create lasting connections through launches and activations.",
      features: ["Campaign Strategy & Launch", "Brand Activations", "Partnership Marketing", "Influencer Collaborations"]
    },
    {
      icon: <Film className="w-10 h-10" />,
      title: "Creative Content",
      subtitle: "Narrative-Driven",
      description: "Compelling visual storytelling that captures attention and builds emotional connections.",
      features: ["Digital & Social Campaigns", "Documentaries & Docuseries", "Brand Films", "Video Production"]
    },
    {
      icon: <Radio className="w-10 h-10" />,
      title: "Radio & Audio",
      subtitle: "Sound Strategy",
      description: "Audio content that resonates with listeners across all platforms and markets.",
      features: ["Radio Show Production", "Syndication & Distribution", "Podcast Production", "Audio Branding"]
    }
  ];

  const works = [
    { id: 1, title: "Shine with the Stars", category: "EVENT", year: "2023", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
    { id: 2, title: "The Twist with Shine", category: "RADIO", year: "2020", image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=800" },
    { id: 3, title: "KBS Documentary", category: "CONTENT", year: "2022", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800" },
    { id: 4, title: "MTN Campaign", category: "ATL", year: "2023", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" },
    { id: 5, title: "Maltina Activation", category: "BTL", year: "2022", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800" },
    { id: 6, title: "Techno Social", category: "CONTENT", year: "2023", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800" }
  ];

  const stats = [
    { number: "100+", label: "Projects Delivered" },
    { number: "50+", label: "Brands Served" },
    { number: "5+", label: "Years Experience" },
    { number: "10M+", label: "Audience Reach" }
  ];

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Custom Cursor */}
      <div
        className={`fixed w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-200 ${isHovering ? 'scale-[3] bg-white/30' : 'bg-white'}`}
        style={{ left: cursorPos.x - 12, top: cursorPos.y - 12 }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4' : 'py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="relative z-10">
              <span className="text-2xl lg:text-3xl font-black tracking-tighter">
                AUXIL<span className="text-[#29ABE2]">UM</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-12">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'services', label: 'Services' },
                { id: 'work', label: 'Work' },
                { id: 'insights', label: 'Insights' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative text-sm font-medium tracking-wide transition-colors hover:text-[#29ABE2] ${activeSection === item.id ? 'text-[#29ABE2]' : 'text-white/70'}`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {item.label.toUpperCase()}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#29ABE2]" />
                  )}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => setShowPortal(true)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                CLIENT PORTAL
              </button>
              <a
                href="#contact"
                className="group relative px-6 py-3 bg-[#29ABE2] text-black font-bold text-sm tracking-wide overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <span className="relative z-10">START PROJECT</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative z-10 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 bg-black transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {['home', 'about', 'services', 'work', 'insights', 'contact'].map((item, index) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-black tracking-tight hover:text-[#29ABE2] transition-colors"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item.toUpperCase()}
              </a>
            ))}
            <button
              onClick={() => { setShowPortal(true); setIsMenuOpen(false); }}
              className="mt-8 px-8 py-4 border-2 border-[#29ABE2] text-[#29ABE2] font-bold"
            >
              CLIENT PORTAL
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
            poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1920"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-702-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#29ABE2]/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#29ABE2]" />
            <span className="text-sm font-medium text-[#29ABE2]">CREATIVE MEDIA AGENCY</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[120px] font-black leading-[0.9] tracking-tighter mb-8">
            <span className="block">ILLUMINATING</span>
            <span className="block text-[#29ABE2]">BRANDS</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12">
            Full-Spectrum ATL & BTL Campaigns • Digital Content • Radio Syndication • Experiential Events
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#work"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-sm tracking-wide hover:bg-[#29ABE2] transition-colors"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              VIEW OUR WORK
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="group flex items-center gap-3 px-8 py-4 border-2 border-white/30 hover:border-[#29ABE2] hover:text-[#29ABE2] transition-colors font-bold text-sm tracking-wide"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Play className="w-4 h-4" />
              WATCH SHOWREEL
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-xs font-medium text-white/40 tracking-widest">SCROLL</span>
          <MousePointer2 className="w-5 h-5 text-[#29ABE2] animate-bounce" />
        </div>

        {/* Side Text */}
        <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
          <span className="text-xs font-medium tracking-[0.3em] text-white/30">CREATIVE MEDIA AGENCY — LAGOS, NIGERIA</span>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 border-y border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-[#29ABE2] mb-2">{stat.number}</div>
                <div className="text-sm text-white/50 font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#29ABE2] text-sm font-bold tracking-widest mb-4 block">ABOUT US</span>
              <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
                WE CREATE <span className="text-[#29ABE2]">EXPERIENCES</span> THAT MATTER
              </h2>
              <div className="space-y-6 text-white/60 text-lg">
                <p>
                  Founded by visionary <span className="text-white font-semibold">Shine Begho</span> on June 3rd, 2019,
                  Auxilum Creative Media is a full-spectrum creative powerhouse operating at the intersection
                  of Above-The-Line and Below-The-Line marketing.
                </p>
                <p>
                  We are narrative architects and campaign engineers, dedicated to building unforgettable
                  brand experiences in both digital and physical realms. Our mission is to illuminate
                  brands through innovative creative strategies.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#29ABE2] text-black font-bold text-sm"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  START A PROJECT <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                  alt="Auxilum Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-[#29ABE2] text-black p-8">
                <div className="text-6xl font-black">5+</div>
                <div className="font-bold mt-2">Years of Excellence</div>
              </div>

              {/* Accent Element */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-[#29ABE2]/30" />
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-32">
            <h3 className="text-2xl font-bold mb-12 text-center">OUR JOURNEY</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { year: '2019', title: 'Founded', desc: 'Auxilum Creative Media established by Shine Begho' },
                { year: '2020', title: 'Radio Launch', desc: '"The Twist with Shine" radio show goes live' },
                { year: '2021', title: 'Star Power', desc: '"Shine with the Stars" celebrity event premiere' },
                { year: '2022', title: 'Global Reach', desc: 'International partnership with KBS & EBS Korea' }
              ].map((item, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-white/10 hover:border-[#29ABE2] transition-colors group">
                  <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] bg-black border-2 border-white/30 group-hover:border-[#29ABE2] group-hover:bg-[#29ABE2] transition-colors" />
                  <div className="text-[#29ABE2] font-bold text-sm mb-2">{item.year}</div>
                  <div className="text-xl font-bold mb-2">{item.title}</div>
                  <div className="text-white/50 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="text-[#29ABE2] text-sm font-bold tracking-widest mb-4 block">WHAT WE DO</span>
            <h2 className="text-4xl md:text-6xl font-black">
              OUR <span className="text-[#29ABE2]">SERVICES</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 md:p-12 border border-white/10 hover:border-[#29ABE2]/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Number */}
                <div className="absolute top-8 right-8 text-6xl font-black text-white/5 group-hover:text-[#29ABE2]/10 transition-colors">
                  0{index + 1}
                </div>

                <div className="relative z-10">
                  <div className="text-[#29ABE2] mb-6">{service.icon}</div>
                  <div className="text-xs font-bold text-white/40 tracking-widest mb-2">{service.subtitle}</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/50 mb-6">{service.description}</p>

                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                        <span className="w-1 h-1 bg-[#29ABE2] rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a href="#contact" className="inline-flex items-center gap-2 mt-8 text-[#29ABE2] font-bold text-sm group-hover:gap-4 transition-all">
                    GET STARTED <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <span className="text-[#29ABE2] text-sm font-bold tracking-widest mb-4 block">PORTFOLIO</span>
              <h2 className="text-4xl md:text-6xl font-black">
                SELECTED <span className="text-[#29ABE2]">WORK</span>
              </h2>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-white/60 hover:text-[#29ABE2] transition-colors font-medium"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              VIEW ALL PROJECTS <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <div
                key={work.id}
                className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs font-bold text-[#29ABE2] tracking-widest">{work.category}</span>
                      <span className="text-xs text-white/40">{work.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{work.title}</h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-[#29ABE2] transition-colors">
                      VIEW PROJECT <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Marquee */}
      <section className="py-20 border-y border-white/10 overflow-hidden">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {['MTN', 'MALTINA', 'AIRTEL', 'TECHNO', 'KBS', 'DOMINO\'S', 'BELVEDERE', 'OVALTINE', 'MTN', 'MALTINA', 'AIRTEL', 'TECHNO'].map((client, index) => (
            <span key={index} className="text-4xl md:text-6xl font-black text-white/10 hover:text-[#29ABE2]/30 transition-colors cursor-default">
              {client}
            </span>
          ))}
        </div>
      </section>

      {/* Blog/Insights Section */}
      <section id="insights" className="py-32 bg-zinc-950/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <span className="text-[#29ABE2] text-sm font-bold tracking-widest mb-4 block">INSIGHTS</span>
              <h2 className="text-4xl md:text-6xl font-black">
                LATEST <span className="text-[#29ABE2]">ARTICLES</span>
              </h2>
            </div>
            <div className="flex gap-4">
              <p className="text-white/40 max-w-sm text-sm">
                Exploring the intersection of media, technology, and creative storytelling in West Africa.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group flex flex-col h-full bg-white/[0.02] border border-white/5 hover:border-[#29ABE2]/30 transition-all duration-500 overflow-hidden cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Post Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#29ABE2] text-black text-[10px] font-bold tracking-widest uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-4 text-xs text-white/40 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[#29ABE2]" />
                      {post.readTime}
                    </div>
                    <span>•</span>
                    <div>{post.date}</div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-[#29ABE2] transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-white/50 text-sm mb-8 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Newspaper size={12} className="text-[#29ABE2]" />
                      </div>
                      <span className="text-xs font-bold text-white/60 uppercase racking-wider">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#29ABE2] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      READ MORE <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              className="px-8 py-4 border-2 border-white/10 hover:border-[#29ABE2] hover:text-[#29ABE2] transition-all font-bold text-sm tracking-widest uppercase"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              BROWSE ALL INSIGHTS
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-[#29ABE2] text-sm font-bold tracking-widest mb-4 block">GET IN TOUCH</span>
              <h2 className="text-4xl md:text-6xl font-black mb-8">
                LET'S CREATE <span className="text-[#29ABE2]">SOMETHING</span> AMAZING
              </h2>
              <p className="text-white/50 text-lg mb-12">
                Ready to illuminate your brand? We're here to transform your vision into reality.
                Drop us a message and let's start building something extraordinary together.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#29ABE2]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#29ABE2]" />
                  </div>
                  <div>
                    <div className="text-sm text-white/40 mb-1">EMAIL</div>
                    <a href="mailto:Info@auxilumcm.com.ng" className="text-lg font-medium hover:text-[#29ABE2] transition-colors">
                      Info@auxilumcm.com.ng
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#29ABE2]/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#29ABE2]" />
                  </div>
                  <div>
                    <div className="text-sm text-white/40 mb-1">PHONE</div>
                    <a href="tel:+2348098274185" className="text-lg font-medium hover:text-[#29ABE2] transition-colors">
                      08098274185
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#29ABE2]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#29ABE2]" />
                  </div>
                  <div>
                    <div className="text-sm text-white/40 mb-1">LOCATION</div>
                    <div className="text-lg font-medium">Lagos, Nigeria</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#29ABE2]/10 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-[#29ABE2]" />
                  </div>
                  <div>
                    <div className="text-sm text-white/40 mb-1">INSTAGRAM</div>
                    <a href="https://instagram.com/auxilumcm" target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:text-[#29ABE2] transition-colors">
                      @auxilumcm
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-8">Send a Message</h3>

              {status !== 'idle' && feedbackMessage && (
                <div className={`mb-6 p-4 border ${status === 'success' ? 'bg-[#29ABE2]/10 border-[#29ABE2]/30 text-[#29ABE2]' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                  {feedbackMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/30 focus:border-[#29ABE2] outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/30 focus:border-[#29ABE2] outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/30 focus:border-[#29ABE2] outline-none transition-colors"
                  />
                </div>
                <div>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white/60 focus:border-[#29ABE2] outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-black">Select Service</option>
                    <option value="atl" className="bg-black">ATL & Media Buying</option>
                    <option value="btl" className="bg-black">BTL & Experiential</option>
                    <option value="content" className="bg-black">Creative Content</option>
                    <option value="radio" className="bg-black">Radio & Audio</option>
                    <option value="full" className="bg-black">Full Campaign</option>
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Tell us about your project *"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/30 focus:border-[#29ABE2] outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`w-full py-4 bg-[#29ABE2] text-black font-bold text-sm tracking-wide hover:bg-white transition-colors flex items-center justify-center gap-2 ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'} <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-black tracking-tighter">
              AUXIL<span className="text-[#29ABE2]">UM</span>
            </div>
            <div className="text-white/40 text-sm">
              © {new Date().getFullYear()} Auxilum Creative Media. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/auxilumcm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-[#29ABE2] hover:text-[#29ABE2] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:Info@auxilumcm.com.ng"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-[#29ABE2] hover:text-[#29ABE2] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Blog Details Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 overflow-hidden max-h-full flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/60 hover:text-white border border-white/10"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-video lg:aspect-[21/9]">
                <img
                  src={getImageUrl(selectedPost.image)}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12">
                  <span className="px-4 py-1.5 bg-[#29ABE2] text-black text-xs font-black tracking-[0.2em] uppercase rounded-sm">
                    {selectedPost.category}
                  </span>
                </div>
              </div>

              <div className="p-8 lg:p-12">
                <div className="mb-10">
                  <div className="flex items-center gap-6 text-white/40 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      {/* <User size={16} className="text-[#29ABE2]" /> */}
                      <span className="text-white font-bold tracking-wide uppercase">{selectedPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <Clock size={16} />
                      {selectedPost.readTime}
                    </div>
                    <div className="hidden sm:block font-medium">{selectedPost.date}</div>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                    {selectedPost.title}
                  </h2>

                  <div className="w-20 h-1.5 bg-[#29ABE2] mb-10" />
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-xl text-white/70 italic mb-10 border-l-4 border-white/10 pl-6 py-2">
                    {selectedPost.excerpt}
                  </p>

                  <div className="text-white/60 space-y-8 leading-[1.8] text-lg">
                    {selectedPost.content.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Footer Section in Modal */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">SHARE THIS INSIGHT</span>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-[#29ABE2] hover:text-[#29ABE2] transition-colors cursor-pointer">
                        <Instagram size={14} />
                      </div>
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-[#29ABE2] hover:text-[#29ABE2] transition-colors cursor-pointer">
                        <Mail size={14} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-8 py-3 bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-[#29ABE2] transition-colors"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    CLOSE POST
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Portal Modal */}
      {showPortal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setShowPortal(false)}>
          <div className="relative w-full max-w-md p-8 md:p-12 bg-zinc-950 border border-white/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPortal(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="text-3xl font-black mb-2">CLIENT PORTAL</div>
              <p className="text-white/50">Access your project materials</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Portal login - demo only'); setShowPortal(false); }} className="space-y-6">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/30 focus:border-[#29ABE2] outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/30 focus:border-[#29ABE2] outline-none"
              />
              <button type="submit" className="w-full py-4 bg-[#29ABE2] text-black font-bold">
                LOGIN
              </button>
            </form>

            <div className="mt-8 text-center">
              <a href="#contact" onClick={() => setShowPortal(false)} className="text-sm text-[#29ABE2] hover:underline">
                Request Portal Access
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Marquee Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        html {
          scroll-behavior: smooth;
          cursor: none;
        }
        a, button, input, textarea, select {
          cursor: none;
        }
      `}</style>
    </div>
  );
}
