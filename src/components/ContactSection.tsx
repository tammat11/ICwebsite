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

            // Entry animations
            gsap.from(".contact-reveal", {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 150%",
                    fastScrollEnd: true,
                    once: true
                }
            });

            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="contacts" className="relative py-12 md:py-16 bg-white overflow-hidden text-center transform-gpu">

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="section-tag mb-4 mx-auto justify-center contact-reveal">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    <span>Свяжитесь с нами</span>
                </div>

                <h2 className="section-header text-brand-dark mb-12 overflow-visible contact-reveal flex flex-col items-center">
                    <span className="block mb-2">ПОЛУЧИТЬ</span>
                    <span className="relative inline-block">
                        <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                            <span className="text-brand-green drop-shadow-[0_0_40px_rgba(131,182,67,0.2)]">КОНСУЛЬТАЦИЮ</span>
                        </span>
                    </span>
                </h2>

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
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Горячая линия</span>
                        <a href="tel:+77717656353" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">+7 771 765 6353</a>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Email</span>
                        <a href="mailto:office@ic-group.kz" className="text-xl md:text-2xl font-bold hover:text-brand-green transition-colors">office@ic-group.kz</a>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Главный офис</span>
                        <span className="text-xl md:text-2xl font-bold">Алматы, ул. Натарова, 12</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
