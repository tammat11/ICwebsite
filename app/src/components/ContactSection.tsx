import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = ({ onCalcOpen }: { onCalcOpen?: () => void }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const bigTextRef = useRef<HTMLSpanElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // GSAP quickTo for zero-rerender mouse tracking
            const gridXTo = gsap.quickTo(gridRef.current, "x", { duration: 0.5, ease: "power2.out" });
            const gridYTo = gsap.quickTo(gridRef.current, "y", { duration: 0.5, ease: "power2.out" });
            const bigTextXTo = gsap.quickTo(bigTextRef.current, "x", { duration: 0.8, ease: "power2.out" });
            // Setting initial center for the glow
            gsap.set(glowRef.current, { xPercent: -50, yPercent: -50 });
            const glowXTo = gsap.quickTo(glowRef.current, "x", { duration: 1, ease: "power2.out" });
            const glowYTo = gsap.quickTo(glowRef.current, "y", { duration: 1, ease: "power2.out" });

            const handleMouseMove = (e: MouseEvent) => {
                if (!sectionRef.current) return;
                const rect = sectionRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                gridXTo((x - 0.5) * 40);
                gridYTo((y - 0.5) * 40);
                bigTextXTo((x - 0.5) * -100);
                glowXTo(e.clientX - rect.left);
                glowYTo(e.clientY - rect.top);
            };

            window.addEventListener('mousemove', handleMouseMove);

            gsap.fromTo(".contact-reveal",
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.12,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                        once: true
                    }
                }
            );

            gsap.fromTo(".drone-anim",
                { x: 300, y: -200, opacity: 0, rotation: -15, scale: 0.5 },
                {
                    x: 0, y: 0, opacity: 1, rotation: 0, scale: 1,
                    duration: 1.5, ease: "back.out(1.2)", delay: 0.2,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        once: true
                    }
                }
            );

            // Decorative background removed

            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="contacts" className="relative py-12 md:py-16 bg-white text-center transform-gpu">

            {/* Decorative background removed */}

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="relative inline-flex flex-col items-center w-full max-w-4xl mx-auto mb-12 contact-reveal mt-8">
                    {/* Floating Drone Decor */}
                    <img 
                        src="/decor/decor1.png" 
                        alt="Дрон доставки" 
                        className="drone-anim absolute -top-8 right-0 md:-top-16 md:-right-16 w-32 md:w-[280px] h-auto object-contain drop-shadow-2xl pointer-events-none z-20" 
                    />
                    <h2 className="section-header text-brand-dark overflow-visible flex flex-col items-center relative z-10 w-full text-center">
                        <span className="block mb-2">ПОЛУЧИТЬ</span>
                        <span className="relative inline-block">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(131,182,67,0.2)]">КОНСУЛЬТАЦИЮ</span>
                            </span>
                        </span>
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 contact-reveal">
                    <button
                        onClick={onCalcOpen}
                        className="group relative inline-flex items-center gap-4 bg-brand-dark text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-green transition-all duration-500 overflow-hidden shadow-2xl"
                    >
                        <span className="relative z-10">Оставить заявку</span>
                    </button>
                </div>

                <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-8 contact-reveal">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Продажи</span>
                        <a href="tel:+77770087360" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">+7 777 008 73 60</a>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">HR</span>
                        <a href="tel:+77717802366" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">+7 771 780 2366</a>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Тендерный отдел</span>
                        <a href="tel:+77078083003" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">+7 707 808 3003</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
