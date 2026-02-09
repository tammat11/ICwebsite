import { useEffect, useRef, Fragment } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import StatsGrid from './components/StatsGrid';
import GuaranteeSection from './components/GuaranteeSection';
import PainSection from './components/PainSection';





import ProcessSection from './components/ProcessSection';
import PhilosophySection from './components/PhilosophySection';
import QualityControl from './components/QualityControl';
import CasesSection from './components/CasesSection';
import ManifestoSection from './components/ManifestoSection';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import ContactsPage from './pages/ContactsPage';
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';
import AICalculator from './components/AICalculator';
import Bubbles from './components/Bubbles';
import { useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const [isCalcOpen, setCalcOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <Navbar onCalcOpen={() => setCalcOpen(true)} />
      <Routes location={location}>
        <Route path="/" element={<Home onCalcOpen={() => setCalcOpen(true)} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
      <AICalculator isOpen={isCalcOpen} onClose={() => setCalcOpen(false)} />
    </>
  );
}

function Home({ onCalcOpen }: { onCalcOpen: () => void }) {
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

      // Background Parallax
      const blobs = document.querySelectorAll('.bg-blob');
      blobs.forEach((blob) => {
        const speed = parseFloat(blob.getAttribute('data-speed') || '0.5');
        gsap.to(blob, {
          y: () => -ScrollTrigger.maxScroll(window) * (speed * 0.1),
          ease: "none",
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        });
      });

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

      <main className="relative z-10">
        <Hero onCalcOpen={onCalcOpen} />
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

        {/* 7. Guarantee (Trust) */}
        <section className="reveal-section">
          <GuaranteeSection />
        </section>

        {/* 5. Strategy Evolution (Vision) - REMOVED */}

        <PhilosophySection />

        <ContactSection />
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
