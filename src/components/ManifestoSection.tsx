import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ManifestoSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".reveal-manifesto", {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-brand-light overflow-hidden flex flex-col items-center justify-center">

            <div className="max-w-7xl mx-auto px-6 w-full text-center">

                {/* 1. Header Info- Styled with new brand-secondary */}
                <div className="reveal-manifesto mb-12 flex items-center justify-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-secondary">Philosophy</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-secondary">Cleaning Standards</span>
                </div>

                {/* 2. Main Slogan - High Impact & Robust Layout */}
                <div className="flex flex-col items-center gap-2 md:gap-4">
                    <div className="overflow-hidden">
                        <h2 className="reveal-manifesto text-[clamp(2.5rem,8vw,120px)] font-[1000] text-brand-dark leading-[0.9] tracking-tighter uppercase">
                            МЫ СОЗДАЕМ
                        </h2>
                    </div>

                    <div className="overflow-hidden">
                        <h2 className="reveal-manifesto text-[clamp(2.5rem,8vw,120px)] font-[1000] text-brand-green leading-[0.8] tracking-[-0.05em] uppercase italic px-4">
                            СТАНДАРТЫ
                        </h2>
                    </div>

                    <div className="overflow-hidden">
                        <h2 className="reveal-manifesto text-[clamp(2.5rem,8vw,120px)] font-[1000] text-brand-dark leading-[0.9] tracking-tighter uppercase shadow-text">
                            ЧИСТОТЫ<span className="text-brand-secondary"></span>
                        </h2>
                    </div>
                </div>

                {/* 3. The Impact Statement */}
                <div className="mt-20 md:mt-32 reveal-manifesto">
                    <p className="text-xl md:text-3xl font-[1000] text-brand-dark/20 uppercase tracking-tighter leading-[0.8]">
                        КОТОРЫЕ МЕНЯЮТ ИНДУСТРИЮ <br />
                        <span className="text-brand-secondary drop-shadow-[0_0_30px_rgba(123,133,167,0.3)]">КАЗАХСТАНА ЕЖЕДНЕВНО.</span>
                    </p>
                </div>

                {/* 4. Footer Decor */}
                <div className="mt-20 reveal-manifesto flex items-center justify-center gap-10 opacity-5">
                    <span className="text-[8px] font-black uppercase tracking-[1em]">ICG_SYS_2025</span>
                </div>

            </div>

            {/* Aesthetic Side Details */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none hidden lg:block">
                <span className="text-[15vh] font-black uppercase tracking-tighter [writing-mode:vertical-lr] rotate-180">INTEGRITY</span>
            </div>

        </section>
    );
};

export default ManifestoSection;
