import { useEffect, useRef, Fragment } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import StatsGrid from './components/StatsGrid';
import MapSection from './components/MapSection';
import PainSection from './components/PainSection';





import ProcessSection from './components/ProcessSection';
import QualityControl from './components/QualityControl';
import CasesSection from './components/CasesSection';
import ManifestoSection from './components/ManifestoSection';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import ContactsPage from './pages/ContactsPage';
import Footer from './components/Footer';
import Bubbles from './components/Bubbles';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small delay to ensure element is rendered
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}


function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </>
  );
}

function Home() {
  const mainRef = useRef(null);

  useEffect(() => {
    const refreshTrigger = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', refreshTrigger);
    setTimeout(refreshTrigger, 1000);

    const ctx = gsap.context(() => {
      // Global Smooth Fade Reveals for all sections
      const reveals = document.querySelectorAll('.reveal-section');
      reveals.forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
          }
        );
      });

      // Refresh ScrollTrigger on all layout changes
      ScrollTrigger.refresh();

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);

      return () => clearTimeout(refreshTimeout);
    }, mainRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
      window.removeEventListener('load', refreshTrigger);
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-brand-light relative selection:bg-brand-green/20">

      {/* Optimized Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Bubbles />

        {/* Background Blobs (Start Lower) */}
        <div data-speed="0.2" className="bg-blob absolute top-[20%] -left-20 w-[1000px] h-[1000px] bg-brand-green/10 rounded-full blur-[100px] will-change-transform" />
        <div data-speed="0.4" className="bg-blob absolute top-[60%] -right-40 w-[800px] h-[800px] bg-brand-dark/5 rounded-full blur-[80px] will-change-transform" />

        {/* Mid-layer Elements (Visible) */}
        <div data-speed="0.8" className="bg-blob absolute top-[40%] right-[20%] w-40 h-40 border-[3px] border-brand-green/30 rounded-full will-change-transform" />
        <div data-speed="0.6" className="bg-blob absolute top-[70%] left-[10%] w-60 h-60 bg-brand-green/5 rounded-[40px] rotate-12 will-change-transform" />

        {/* Foreground Floating Elements */}
        <div data-speed="1.2" className="bg-blob absolute top-[50%] left-[15%] w-24 h-24 border-2 border-brand-dark/10 rounded-full blur-[1px] will-change-transform" />
        <div data-speed="1.5" className="bg-blob absolute top-[80%] right-[10%] w-32 h-32 bg-brand-green/20 rounded-full mix-blend-multiply blur-xl will-change-transform" />
        <div data-speed="2.0" className="bg-blob absolute top-[90%] left-[30%] w-16 h-16 bg-brand-accent/60 rounded-lg rotate-45 shadow-lg will-change-transform" />
        {/* Extra small particles */}
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <ManifestoSection />


        {/* Marquee Clients - Dual Row */}
        <section className="py-12 md:py-16 border-y border-black/5 bg-white/50 backdrop-blur-md overflow-hidden relative flex flex-col gap-6 md:gap-10">

          {/* Row 1: Fast Left Scroll */}
          <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-20 items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
            {[1, 2, 3, 4].map((set) => (
              <Fragment key={`r1-${set}`}>
                <span className="text-brand-dark text-3xl md:text-5xl font-black tracking-tighter">SAMSUNG</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">✦</span>
                <span className="text-brand-dark/20 text-3xl md:text-5xl font-black tracking-tighter">AIR ASTANA</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">✦</span>
                <span className="text-brand-dark text-3xl md:text-5xl font-black tracking-tighter">HAYAT</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">✦</span>
                <span className="text-brand-dark/20 text-3xl md:text-5xl font-black tracking-tighter">BI GROUP</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">✦</span>
              </Fragment>
            ))}
          </div>

          {/* Row 2: Slower Right Scroll (Reverse) */}
          <div className="flex animate-marquee-reverse whitespace-nowrap gap-12 md:gap-20 items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
            {[1, 2, 3, 4].map((set) => (
              <Fragment key={`r2-${set}`}>
                <span className="text-brand-dark/20 text-3xl md:text-5xl font-black tracking-tighter">KASPI</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">Get Estimate</span>
                <span className="text-brand-dark text-3xl md:text-5xl font-black tracking-tighter">FORTE BANK</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">✦</span>
                <span className="text-brand-dark/20 text-3xl md:text-5xl font-black tracking-tighter">RITZ CARLTON</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">Start Now</span>
                <span className="text-brand-dark text-3xl md:text-5xl font-black tracking-tighter">EXPO 2017</span>
                <span className="text-brand-green/30 text-xl md:text-2xl font-black">✦</span>
              </Fragment>
            ))}
          </div>
        </section>

        <StatsGrid />

        {/* 2. Pain Points & Trigger Question (First solve the problem) */}
        <PainSection />

        {/* 3. Process (Easy Start / Together with IC) - Now the Solution */}
        <ProcessSection />

        {/* 4. Cases & Economic Effect */}
        <CasesSection />

        {/* 6. Control System (Quality) */}
        <section className="reveal-section">
          <QualityControl />
        </section>

        {/* 7. Map (Scale) */}
        <section className="reveal-section">
          <MapSection />
        </section>

        {/* 5. Strategy Evolution (Vision) - REMOVED */}

        <section id="philosophy" className="py-20 md:py-40 px-6 reveal-section">
          <div className="max-w-7xl mx-auto premium-card rounded-[40px] md:rounded-[80px] p-10 sm:p-20 md:p-32 relative overflow-hidden bg-white/40 mt-12 md:mt-32">
            <div className="relative z-10">
              <blockquote id="quote-text" className="text-[clamp(1.5rem,6vw,72px)] font-black tracking-tighter leading-[0.95] text-brand-dark mb-12 md:text-center italic animate-fade-in">
                “Каждое пространство должно <span className="text-brand-green underline decoration-4 decoration-brand-green/20 underline-offset-[12px]">дышать</span>.”
              </blockquote>
              <div className="quote-author flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-accent rounded-[24px] sm:rounded-[32px] flex items-center justify-center">
                  <img src="https://ic-group.kz/wp-content/uploads/2019/07/cropped-Ресурс-14@300x-50x48.png" alt="IC Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain brightness-0 opacity-10" loading="lazy" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-black text-xl sm:text-3xl text-brand-dark tracking-tighter">Лян Ларион Викторович</p>
                  <p className="text-[10px] sm:text-[12px] font-bold text-brand-dark/30 uppercase tracking-[0.4em]">Founder of IC Group</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-20 md:py-40 px-6 reveal-section text-center">
          <h2 className="text-[clamp(2.5rem,10vw,160px)] font-black tracking-tighter mb-12 sm:mb-16 leading-none">ДАВАЙТЕ<br /><span className="text-brand-green italic">ОБСУДИМ?</span></h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <button className="btn-premium w-full sm:w-auto !px-12 md:!px-16 !py-6 md:!py-8 !text-xl md:!text-2xl flex items-center justify-center gap-4 group">
              Estimate
              <ArrowUpRight size={28} />
            </button>
            <button className="btn-secondary w-full sm:w-auto !px-12 md:!px-16 !py-6 md:!py-8 !text-xl md:!text-2xl">Our App</button>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .animate-marquee-reverse { animation: marquee 30s linear infinite reverse; }
      `}</style>
    </div>
  );
}

export default App;
