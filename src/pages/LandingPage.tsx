import { useState, useEffect } from 'react';
import {
  Menu, X, Instagram, Mail, Phone, MapPin, Send,
  Play, ArrowUpRight, Sparkles,
  Tv, Users, Film, Radio, ArrowRight, MousePointer2, Newspaper, Clock,
  Target, Zap, Palette, Mic2, Megaphone, Video, Share2, Globe, Layout, Camera, Monitor, Music,
  FileDown, ShieldCheck, Lightbulb, Star, Eye
} from 'lucide-react';
import { api, BlogPost, Service, Project, Resource, SiteSettings, Review } from '../services/api';

const iconMap: Record<string, any> = {
  Tv, Users, Film, Radio, Target, Zap, Palette, Mic2,
  Megaphone, Video, Share2, Globe, Layout, Camera, Monitor, Music
};

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
  const [services, setServices] = useState<Service[]>([]);
  const [works, setWorks] = useState<Project[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [prDocument, setPrDocument] = useState<Resource | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({ mission: '', vision: '' });
  const [reviews, setReviews] = useState<Review[]>([]);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    let normalizedPath = path.replace(/\\/g, '/');
    if (normalizedPath.startsWith('http')) return normalizedPath;

    const baseUrl = (import.meta as any).env?.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
    return `${baseUrl}${normalizedPath}`;
  };

  const handleDownload = async (fileUrl: string, customTitle?: string) => {
    try {
      const url = getImageUrl(fileUrl);
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const extension = fileUrl.split('.').pop() || 'pdf';
      const fileName = customTitle ? `${customTitle.replace(/\s+/g, '_')}.${extension}` : (fileUrl.split('/').pop() || `download.${extension}`);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download failed, opening fallback.", error);
      window.open(getImageUrl(fileUrl), '_blank');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [posts, fetchedServices, fetchedProjects, fetchedPR, fetchedSettings, fetchedReviews] = await Promise.all([
          api.fetchBlogPosts(),
          api.fetchServices(),
          api.fetchProjects(),
          api.fetchResource('pr_document').catch(() => null),
          api.fetchSettings().catch(() => ({ mission: '', vision: '' })),
          api.fetchApprovedReviews().catch(() => [])
        ]);
        setBlogPosts(posts);
        setServices(fetchedServices);
        setWorks(fetchedProjects);
        setPrDocument(fetchedPR);
        setSettings(fetchedSettings);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Failed to fetch landing page data", error);
      }
    };
    loadData();
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
      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
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

  const heroTitleWords = settings.hero?.title?.split(' ') || ['AMPLIFYING', 'AFRICAN', 'NARRATIVES'];
  const heroLastWord = heroTitleWords.length > 1 ? heroTitleWords.pop() : '';
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Custom Cursor */}
      <div
        className={`fixed w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-200 ${isHovering ? 'scale-[3] bg-white/30' : 'bg-white'}`}
        style={{ left: cursorPos.x - 12, top: cursorPos.y - 12 }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isMenuOpen ? 'bg-black py-4' : scrolled ? 'bg-black/90 backdrop-blur-xl py-4' : 'py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="relative z-10 flex items-center">
              {settings.logo?.url && (
                <img
                  src={getImageUrl(settings.logo.url)}
                  alt="Site Logo"
                  className={`max-h-10 lg:max-h-12 w-auto object-contain ${settings.logo.showMobile && settings.logo.showDesktop ? 'block' :
                      settings.logo.showMobile ? 'block lg:hidden' :
                        settings.logo.showDesktop ? 'hidden lg:block' : 'hidden'
                    }`}
                />
              )}
              <span className={`text-2xl lg:text-3xl font-black tracking-tighter ${!settings.logo?.url || (!settings.logo.showMobile && !settings.logo.showDesktop) ? 'block' :
                  !settings.logo.showMobile ? 'block lg:hidden' :
                    !settings.logo.showDesktop ? 'hidden lg:block' : 'hidden'
                }`}>
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
              className="lg:hidden relative z-50 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
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

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          {settings.hero?.backgroundImage ? (
            <img
              src={getImageUrl(settings.hero.backgroundImage)}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
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
          )}
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

          <h1 className="text-5xl md:text-7xl lg:text-[120px] font-black leading-[0.9] tracking-tighter mb-8 max-w-6xl mx-auto uppercase">
            {heroTitleWords.length > 0 && <span className="block">{heroTitleWords.join(' ')}</span>}
            {heroLastWord && <span className="block text-[#29ABE2]">{heroLastWord}</span>}
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12">
            {settings.hero?.subtitle || "We are a full-service creative agency building culturally resonant brands through innovative storytelling and immersive digital experiences."}
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
            {prDocument && (
              <a
                href={getImageUrl(prDocument.path)}
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(prDocument.path, 'Auxilum_PR_Document');
                }}
                target="_blank"
                className="group flex items-center gap-3 px-8 py-4 bg-[#29ABE2]/10 border-2 border-[#29ABE2]/30 hover:bg-[#29ABE2] hover:text-black transition-all font-bold text-sm tracking-wide"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <FileDown className="w-4 h-4" />
                DOWNLOAD PR
              </a>
            )}
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

      {/* Statistics Bar */}
      <section className="relative py-16 border-y border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(settings.stats || []).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-[#29ABE2] mb-2">{stat.number}</div>
                <div className="text-sm text-white/50 font-medium tracking-wide uppercase">{stat.label}</div>
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
                  src={settings.aboutImage ? getImageUrl(settings.aboutImage) : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"}
                  alt="About Auxilum"
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

      {/* Leadership / Founder Section */}
      {settings.founder && settings.founder.name && (
        <section className="py-32 bg-black relative border-y border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
              {/* Image & Stats Container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#29ABE2]/20 to-purple-600/20 blur-3xl -z-10 group-hover:from-[#29ABE2]/30 group-hover:to-purple-600/30 transition-all duration-700 rounded-full" />
                <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10">
                  <img
                    src={settings.founder.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"}
                    alt={settings.founder.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 scale-100 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Content Container */}
              <div>
                <span className="flex items-center gap-2 text-[#29ABE2] text-sm font-bold tracking-widest mb-6 uppercase">
                  <Sparkles size={16} /> Leadership
                </span>

                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4">
                  {settings.founder.name.split(' ')[0]} <span className="text-white/40">{settings.founder.name.split(' ').slice(1).join(' ')}</span>
                </h2>

                <div className="inline-block px-4 py-2 bg-[#29ABE2]/10 border border-[#29ABE2]/30 rounded-full text-[#29ABE2] text-sm font-bold uppercase tracking-widest mb-8">
                  {settings.founder.role}
                </div>

                <div className="space-y-6 text-xl md:text-2xl font-light leading-relaxed text-white/70">
                  <p>{settings.founder.about}</p>
                </div>

                {settings.founder.features && settings.founder.features.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-white/10 space-y-4">
                    {settings.founder.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#29ABE2]" />
                        <div className="text-lg font-medium text-white">{feat}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision Section */}

      <section className="py-32 bg-black border-t border-white/10 relative overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#29ABE2]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#29ABE2]/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="flex items-center justify-center gap-2 text-[#29ABE2] text-sm font-bold tracking-widest mb-4 uppercase">
              <Sparkles size={16} /> Our Guiding Light
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter">
              WHERE WE ARE <span className="text-[#29ABE2] relative whitespace-nowrap">GOING
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#29ABE2]/30 rounded-full" />
              </span>
            </h2>
          </div>

          <div className={`grid gap-8 lg:gap-12 ${settings.vision ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'}`}>

            {/* Mission Card */}
            <div
              className="relative group p-10 md:p-14 bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] hover:border-[#29ABE2]/30 transition-all duration-500 overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#29ABE2]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#29ABE2]/20 transition-colors duration-500 pointer-events-none" />

              <div className="flex flex-col h-full relative z-10">
                <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-[#29ABE2] mb-8 shadow-inner shadow-[#29ABE2]/10 group-hover:scale-110 transition-transform duration-500">
                  <Target size={32} />
                </div>

                <h3 className="text-3xl lg:text-4xl font-black mb-6 flex items-center gap-4">
                  OUR MISSION
                  <div className="h-px bg-white/10 flex-grow" />
                </h3>

                <p className="text-xl md:text-2xl font-light leading-relaxed text-white/70">
                  {settings.mission || "We are narrative architects and campaign engineers, dedicated to building unforgettable brand experiences in both digital and physical realms. Our mission is to illuminate brands through innovative creative strategies."}
                </p>
              </div>
            </div>

            {/* Vision Card */}
            {settings.vision && (
              <div
                className="relative group p-10 md:p-14 bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] hover:border-[#29ABE2]/30 transition-all duration-500 overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-[#29ABE2]/10 transition-colors duration-500 pointer-events-none" />

                <div className="flex flex-col h-full relative z-10">
                  <div className="w-16 h-16 bg-[#29ABE2]/10 border border-[#29ABE2]/20 rounded-2xl flex items-center justify-center text-[#29ABE2] mb-8 shadow-[0_0_30px_rgba(41,171,226,0.15)] group-hover:scale-110 transition-transform duration-500">
                    <Eye size={32} />
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-black mb-6 flex items-center gap-4">
                    OUR VISION
                    <div className="h-px bg-white/10 flex-grow" />
                  </h3>

                  <p className="text-xl md:text-2xl font-light leading-relaxed text-white/70">
                    {settings.vision}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-black/50 border-y border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[#29ABE2] text-sm font-bold tracking-widest mb-4 block">OUR DNA</span>
            <h2 className="text-3xl md:text-5xl font-black">
              CORE <span className="text-[#29ABE2]">VALUES</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { icon: ShieldCheck, title: 'Authenticity', desc: 'True to our roots and bold in our expression.' },
              { icon: Globe, title: 'Cultural Intelligence', desc: 'Deep understanding of local nuances and global trends.' },
              { icon: Lightbulb, title: 'Creativity', desc: 'Innovating beyond the ordinary.' },
              { icon: Target, title: 'Impact', desc: 'Delivering measurable results that matter.' },
              { icon: Users, title: 'Collaboration', desc: 'Building success through synergy and partnership.' }
            ].map((value, index) => (
              <div
                key={index}
                className="group p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#29ABE2]/30 transition-all text-center flex flex-col items-center"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="w-16 h-16 rounded-full bg-[#29ABE2]/10 flex items-center justify-center mb-6 text-[#29ABE2] group-hover:scale-110 group-hover:bg-[#29ABE2] group-hover:text-black transition-all">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                <p className="text-sm text-white/50">{value.desc}</p>
              </div>
            ))}
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
            {services.map((service, index) => {
              const Icon = iconMap[service.icon || 'Sparkles'] || Sparkles;
              return (
                <div
                  key={service.id}
                  className="group relative p-8 md:p-12 border border-white/10 hover:border-[#29ABE2]/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {/* Number */}
                  <div className="absolute top-8 right-8 text-6xl font-black text-white/5 group-hover:text-[#29ABE2]/10 transition-colors">
                    0{index + 1}
                  </div>

                  <div className="relative z-10">
                    <div className="text-[#29ABE2] mb-6">
                      <Icon className="w-10 h-10" />
                    </div>
                    {/* <div className="text-xs font-bold text-white/40 tracking-widest mb-2 uppercase">Core Service</div> */}
                    <p className="text-xs font-bold text-[#29ABE2] tracking-widest mb-4">{service.subtitle.toUpperCase()}</p>

                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h3>
                    <p className="text-white/50 mb-6">{service.description}</p>

                    <div className="space-y-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                          <div className="w-1 h-1 rounded-full bg-[#29ABE2]" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <a href="#contact" className="inline-flex items-center gap-2 mt-8 text-[#29ABE2] font-bold text-sm group-hover:gap-4 transition-all">
                      GET STARTED <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
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
                onClick={() => {
                  if (work.fileUrl) {
                    handleDownload(work.fileUrl, `${work.title}_Presentation`);
                  } else if (work.link) {
                    window.open(work.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                className={`group relative aspect-[4/3] overflow-hidden ${work.link || work.fileUrl ? 'cursor-pointer' : 'cursor-default'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={getImageUrl(work.image)}
                  alt={work.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs font-bold text-[#29ABE2] tracking-widest uppercase">{work.category}</span>
                      <span className="text-xs text-white/40">{work.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{work.title}</h3>
                    {(work.link || work.fileUrl) && (
                      <div className="flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-[#29ABE2] transition-colors">
                        {work.fileUrl ? 'VIEW ATTACHMENT' : 'VIEW PROJECT'} <ArrowUpRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Marquee */}
      <section className="py-20 border-y border-white/10 overflow-hidden">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap px-4">
          {(settings.clientRoster && settings.clientRoster.length > 0 ? [...settings.clientRoster, ...settings.clientRoster, ...settings.clientRoster] : []).map((client, index) => (
            <div key={`${index}`} className="flex-shrink-0 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
              {client.type === 'image' ? (
                <img src={getImageUrl(client.value)} alt="Client Logo" className="h-12 md:h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              ) : (
                <span className="text-4xl md:text-6xl font-black text-white hover:text-[#29ABE2] transition-colors cursor-default uppercase">
                  {client.value}
                </span>
              )}
            </div>
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
                    <div className="text-lg font-medium">5, Peace Close, Ashela Estate Ogombe, Lagos, Nigeria.</div>
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

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-24 bg-zinc-950/50 border-t border-white/10 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="text-[#29ABE2] text-sm font-bold tracking-widest mb-4 block">CLIENT EXPERIENCES</span>
              <h2 className="text-3xl md:text-5xl font-black">
                WHAT THEY <span className="text-[#29ABE2]">SAY</span>
              </h2>
            </div>

            <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory custom-scrollbar">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="min-w-[320px] md:min-w-[400px] snap-center bg-white/[0.02] border border-white/5 hover:border-[#29ABE2]/30 p-8 flex flex-col group transition-colors"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={star <= review.rating ? "fill-[#29ABE2] text-[#29ABE2]" : "text-white/20"} />
                    ))}
                  </div>
                  <p className="text-white/70 text-lg mb-8 italic flex-grow">"{review.comment}"</p>
                  <div className="mt-auto">
                    <div className="font-bold text-white tracking-wide uppercase">{review.name}</div>
                    <div className="text-xs text-[#29ABE2] font-medium tracking-widest uppercase mt-1">
                      {review.role}{review.company ? ` - ${review.company}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
