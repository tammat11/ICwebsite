import { useEffect, useRef, Fragment } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoSection from './components/BentoSection';
import ComparisonSlider from './components/ComparisonSlider';
import StatsGrid from './components/StatsGrid';
import MapSection from './components/MapSection';
import AICalculator from './components/AICalculator';
import AutomationSection from './components/AutomationSection';
import TeamSection from './components/TeamSection';
import WhySection from './components/WhySection';
import TextRevealSection from './components/TextRevealSection';
import Services from './components/Services';
import ServicesPage from './pages/ServicesPage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Linkedin, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
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
      // Global Smooth Fade Reveals
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 30 });

        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
            once: true
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        });
      });

      // Enhanced Global Parallax (Faster Upward Movement)
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-speed") || "1");

        // Reset transform to avoid conflicts
        gsap.set(el, { y: 0 });

        gsap.to(el, {
          y: () => {
            // Move UP significantly based on speed. 
            // speed * viewport * 1.5 ensures they travel further than the scroll distance
            return -(speed * window.innerHeight * 1.5);
          },
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0
          }
        });
      });
    }, mainRef);

    return () => {
      ctx.revert();
      window.removeEventListener('load', refreshTrigger);
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-brand-light relative selection:bg-brand-green/20">
      {/* Optimized Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-[0.05]" />

        {/* Background Blobs (Start Lower) */}
        <div data-speed="0.2" className="absolute top-[20%] -left-20 w-[1000px] h-[1000px] bg-brand-green/10 rounded-full blur-[100px]" />
        <div data-speed="0.4" className="absolute top-[60%] -right-40 w-[800px] h-[800px] bg-brand-dark/5 rounded-full blur-[80px]" />

        {/* Mid-layer Elements (Visible) */}
        <div data-speed="0.8" className="absolute top-[40%] right-[20%] w-40 h-40 border-[3px] border-brand-green/30 rounded-full" />
        <div data-speed="0.6" className="absolute top-[70%] left-[10%] w-60 h-60 bg-brand-green/5 rounded-[40px] rotate-12" />

        {/* Foreground Floating Elements (Start from bottom mostly) */}
        <div data-speed="1.2" className="absolute top-[50%] left-[15%] w-24 h-24 border-2 border-brand-dark/10 rounded-full blur-[1px]" />
        <div data-speed="1.5" className="absolute top-[80%] right-[10%] w-32 h-32 bg-brand-green/20 rounded-full mix-blend-multiply blur-xl" />
        <div data-speed="2.0" className="absolute top-[90%] left-[30%] w-16 h-16 bg-brand-accent/60 rounded-lg rotate-45 shadow-lg" />
        <div data-speed="1.1" className="absolute top-[30%] right-[40%] text-9xl font-black text-brand-dark/5 select-none z-0">IC</div>

        {/* Extra small particles (All over but lower start) */}
        <div data-speed="1.8" className="absolute top-[85%] left-[40%] w-4 h-4 bg-brand-green rounded-full" />
        <div data-speed="2.5" className="absolute top-[45%] right-[5%] w-6 h-6 border border-brand-dark/20 rotate-45" />
        <div data-speed="2.2" className="absolute top-[75%] right-[25%] w-3 h-3 bg-brand-dark/40 rounded-full" />
        <div data-speed="1.6" className="absolute top-[95%] left-[5%] w-8 h-8 border-2 border-brand-green/40 rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero />


        {/* Marquee Clients - Dual Row */}
        <section className="py-16 border-y border-black/5 bg-white/50 backdrop-blur-md overflow-hidden relative flex flex-col gap-10">

          {/* Row 1: Fast Left Scroll */}
          <div className="flex animate-marquee whitespace-nowrap gap-20 items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
            {[1, 2, 3, 4].map((set) => (
              <Fragment key={`r1-${set}`}>
                <span className="text-brand-dark text-5xl font-black tracking-tighter">SAMSUNG</span>
                <span className="text-brand-green/30 text-2xl font-black">✦</span>
                <span className="text-brand-dark/20 text-5xl font-black tracking-tighter">AIR ASTANA</span>
                <span className="text-brand-green/30 text-2xl font-black">✦</span>
                <span className="text-brand-dark text-5xl font-black tracking-tighter">HAYAT</span>
                <span className="text-brand-green/30 text-2xl font-black">✦</span>
                <span className="text-brand-dark/20 text-5xl font-black tracking-tighter">BI GROUP</span>
                <span className="text-brand-green/30 text-2xl font-black">✦</span>
              </Fragment>
            ))}
          </div>

          {/* Row 2: Slower Right Scroll (Reverse) */}
          <div className="flex animate-marquee-reverse whitespace-nowrap gap-20 items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
            {[1, 2, 3, 4].map((set) => (
              <Fragment key={`r2-${set}`}>
                <span className="text-brand-dark/20 text-5xl font-black tracking-tighter">KASPI</span>
                <span className="text-brand-green/30 text-2xl font-black">Get Estimate</span>
                <span className="text-brand-dark text-5xl font-black tracking-tighter">FORTE BANK</span>
                <span className="text-brand-green/30 text-2xl font-black">✦</span>
                <span className="text-brand-dark/20 text-5xl font-black tracking-tighter">RITZ CARLTON</span>
                <span className="text-brand-green/30 text-2xl font-black">Start Now</span>
                <span className="text-brand-dark text-5xl font-black tracking-tighter">EXPO 2017</span>
                <span className="text-brand-green/30 text-2xl font-black">✦</span>
              </Fragment>
            ))}
          </div>
        </section>

        <StatsGrid />

        <MapSection />

        {/* Feature Bento Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="mb-12 reveal">
            <span className="text-brand-green text-[11px] font-black tracking-[0.6em] uppercase block mb-6 px-1">Systems</span>
            <h2 className="text-6xl md:text-[120px] font-black tracking-tighter text-brand-dark mb-4 leading-[0.8]">ЭКОСИСТЕМА <br /> <span className="text-brand-green italic">ЧИСТОТЫ</span></h2>
          </div>
          <BentoSection />
        </section>

        <WhySection />

        <AutomationSection />
        <ComparisonSlider />
        <AICalculator />


        <TextRevealSection />

        <TeamSection />
        <Services />

        <section id="philosophy" className="py-40 px-6 reveal">
          <div className="max-w-7xl mx-auto premium-card rounded-[80px] p-20 md:p-32 relative overflow-hidden bg-white/40 mt-32">
            <div className="relative z-10">
              <blockquote className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] text-brand-dark mb-16 italic">
                “Каждое пространство должно <span className="text-brand-green underline decoration-4 decoration-brand-green/20 underline-offset-[12px]">дышать</span>.”
              </blockquote>
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-brand-accent rounded-[32px] flex items-center justify-center">
                  <img src="https://ic-group.kz/wp-content/uploads/2019/07/cropped-Ресурс-14@300x-50x48.png" alt="IC Logo" className="w-10 h-10 object-contain brightness-0 opacity-10" />
                </div>
                <div>
                  <p className="font-black text-3xl text-brand-dark tracking-tighter">Лян Ларион Викторович</p>
                  <p className="text-[12px] font-bold text-brand-dark/30 uppercase tracking-[0.4em]">Founder of IC Group</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-40 px-6 reveal text-center">
          <h2 className="text-[10vw] font-black tracking-tighter mb-16 leading-none">ДАВАЙТЕ<br /><span className="text-brand-green italic">ОБСУДИМ?</span></h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <button className="btn-premium !px-16 !py-8 !text-2xl flex items-center gap-4 group">
              Estimate
              <ArrowUpRight size={28} />
            </button>
            <button className="btn-secondary !px-16 !py-8 !text-2xl">Our App</button>
          </div>
        </section>
      </main>

      <footer className="py-32 px-12 bg-white border-t border-black/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_10px_#83B643]" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-brand-dark text-left">IC GROUP</span>
            </div>
            <p className="text-xl font-medium text-brand-dark/40 max-w-sm leading-tight text-left">Системные решения в области клининга и технического обслуживания.</p>

            <div className="flex gap-6">
              <div className="p-3 rounded-2xl border border-black/5 hover:border-brand-green transition-colors cursor-pointer group text-left">
                <Instagram size={24} className="text-brand-dark/20 group-hover:text-brand-green transition-colors" />
              </div>
              <div className="p-3 rounded-2xl border border-black/5 hover:border-brand-green transition-colors cursor-pointer group text-left">
                <Linkedin size={24} className="text-brand-dark/20 group-hover:text-brand-green transition-colors" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green text-left">Sectors</h4>
              <div className="flex flex-col gap-3 text-lg font-bold text-brand-dark/40 text-left">
                <a href="#" className="hover:text-brand-dark transition-colors">Commercial</a>
                <a href="#" className="hover:text-brand-dark transition-colors">Industrial</a>
                <a href="#" className="hover:text-brand-dark transition-colors">Retail</a>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green text-left">Contact</h4>
              <div className="flex flex-col gap-3 text-lg font-bold text-brand-dark/40 text-left">
                <p>+7 (771) 780-08-41</p>
                <p>office@ic-group.kz</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-black/5 flex justify-between items-center opacity-30 text-[10px] font-black tracking-widest uppercase text-left">
          <p>© 2026 IC Group Holding.</p>
          <p>Engineered for excellence</p>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .animate-marquee-reverse { animation: marquee 30s linear infinite reverse; }
      `}</style>
    </div>
  );
}

export default App;
