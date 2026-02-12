import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import StatsGrid from './components/StatsGrid';
import ServicesSection from './components/ServicesSection';
import ClientsMarquee from './components/ClientsMarquee';
import ProcessSection from './components/ProcessSection';
import PhilosophySection from './components/PhilosophySection';
import CasesSection from './components/CasesSection';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import ContactsPage from './pages/ContactsPage';
import NewsPage from './pages/NewsPage';
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';
import AICalculator from './components/AICalculator';
// Bubbles import removed
import { useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
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
        <Route path="/news" element={<NewsPage />} />
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
    window.addEventListener('resize', refreshTrigger);
    window.addEventListener('orientationchange', refreshTrigger);

    // Multiple refreshes to catch lazy-loaded content or layout shifts
    const timeouts = [
      setTimeout(refreshTrigger, 100),
      setTimeout(refreshTrigger, 500),
      setTimeout(refreshTrigger, 1000),
      setTimeout(refreshTrigger, 2000),
      setTimeout(refreshTrigger, 5000),
    ];

    const ctx = gsap.context(() => {
      // reveal-section logic
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

      ScrollTrigger.refresh();

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
      window.removeEventListener('resize', refreshTrigger);
      window.removeEventListener('orientationchange', refreshTrigger);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-white relative selection:bg-brand-green/20 overflow-x-hidden w-full">

      {/* Global background elements removed for maximum cleanliness and performance */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-white" />

      <main className="relative z-10 w-full overflow-x-hidden">
        <Hero onCalcOpen={onCalcOpen} />

        <StatsGrid />
        <ClientsMarquee />
        <ServicesSection />

        <ProcessSection />
        <CasesSection />


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
