import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const root = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main reveal - set initial state
            gsap.set(".reveal-item", { y: 60, opacity: 0 });

            gsap.to(".reveal-item", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2
            });

            // Parallax
            gsap.to(".parallax-text", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5
                },
                y: -100,
                opacity: 0.5
            });

            // Hero Image Reveal
            gsap.set(".hero-visual", { scale: 0.95, opacity: 0 });
            gsap.to(".hero-visual", {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: 'power2.out',
                delay: 0.3
            });

            // Rag Cleaning Animation (Fast & Fluid)
            const ragTl = gsap.timeline({ delay: 0.3 });

            // 1. Hand Appears (Fast & Smooth)
            ragTl.fromTo(".rag-hand",
                { x: 2800, y: 300, opacity: 0, rotate: 45 },
                { x: 300, y: 50, opacity: 1, duration: 0.6, ease: "power2.out" }
            )
                // 2. Wipe Motion (Fast fluid rubbing)
                .to(".rag-hand", {
                    x: 230,
                    y: 0,
                    rotation: -15,
                    duration: 0.25,
                    ease: "sine.inOut"
                })
                .to(".rag-hand", {
                    x: 150,
                    y: 50,
                    rotation: 30,
                    duration: 0.25,
                    ease: "sine.inOut"
                })
                // 3. Exit (Quick flick away)
                .to(".rag-hand", {
                    x: 7000,
                    y: 5000,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in"
                });

            // Cartoon Shine Pop (Quick sparkle, NO text glow)
            ragTl.fromTo(".cartoon-shine",
                { scale: 0, rotation: 0, opacity: 0 },
                { scale: 1.4, rotation: 120, opacity: 1, duration: 0.4, ease: "back.out(3)" },
                "-=0.9" // Sync with wipe
            )
                .to(".cartoon-shine", {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3
                }, "-=0.2");
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden bg-brand-light">
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="reveal-item inline-flex items-center gap-3 bg-brand-green/10 text-brand-green px-5 py-2 rounded-full font-black text-[10px] tracking-[0.4em] uppercase mb-10 shadow-sm">
                    <Sparkles size={14} />
                    Innovation In Cleaning
                </div>


                <h1 ref={textRef} className="parallax-text text-[12vw] md:text-[160px] font-black tracking-[-0.06em] leading-[0.8] text-brand-dark mb-12 select-none relative z-20">
                    СОЗДАТЬ<br />
                    <span className="relative inline-block group">
                        <span className="text-brand-green italic relative z-10 glitch-text">ЧИСТОТУ</span>
                        {/* Cartoon Shine Effect (Star) */}
                        <div className="cartoon-shine absolute top-[-20%] right-[-10%] w-20 h-20 pointer-events-none z-30 opacity-0">
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
                                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
                            </svg>
                        </div>
                    </span> ВО ВСЕМ

                    {/* Rag Hand Animation Element */}
                    <img
                        src="/rag.png"
                        alt="Cleaning Rag"
                        className="rag-hand absolute w-64 h-64 object-contain pointer-events-none z-50 opacity-0"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />
                </h1>

                <div className="reveal-item flex flex-col md:flex-row items-center justify-center gap-12 mt-10 relative">

                    <p className="text-lg md:text-xl text-brand-dark/50 max-w-sm text-center md:text-left font-medium leading-tight relative z-20">
                        Первый технологический холдинг клининговых услуг в Казахстане. Стандарты ISO и эко-сертификация.
                    </p>

                    <div className="flex gap-6 relative">
                        <button className="btn-premium !px-10 !py-5 relative z-20">
                            Get Started
                        </button>


                        <div className="flex flex-col items-center gap-1 text-brand-dark/20 cursor-pointer group mt-2 relative z-10">
                            <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Scroll</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-32 w-full max-w-7xl aspect-[21/9] rounded-[60px] overflow-hidden shadow-2xl relative z-10 hero-visual group">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                    alt="Office"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-light/40 to-transparent" />
            </div>
        </section>
    );
};

export default Hero;
