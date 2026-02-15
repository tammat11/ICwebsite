import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
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
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded-full mb-4 contact-reveal">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-brand-green">Ready to scale?</span>
                </div>

                <h2 className="text-[clamp(44px,8vw,95px)] font-semibold uppercase leading-[0.8] tracking-tighter mb-8 contact-reveal">
                    <span className="block text-black">Давайте</span>
                    <span className="block text-brand-green">обсудим?</span>
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 contact-reveal">
                    <button className="group relative flex items-center justify-center gap-3 md:gap-4 bg-brand-dark text-white px-6 md:px-12 py-4 md:py-6 rounded-full text-lg md:text-xl font-bold uppercase tracking-tighter overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-brand-secondary shadow-2xl">
                        <span className="relative z-10">Estimate Project</span>
                        <ArrowUpRight className="relative z-10 w-5 h-5 md:w-8 md:h-8 group-hover:rotate-45 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    <button className="group flex flex-col items-center gap-2 px-8 md:px-12 py-4 md:py-6 rounded-full border-2 border-black/5 hover:border-brand-secondary/50 transition-all duration-300">
                        <span className="text-[10px] font-medium text-black/40 uppercase tracking-[0.4em]">Our mobile app</span>
                        <span className="text-xl md:text-2xl font-bold text-brand-secondary tracking-tighter">Coming Soon</span>
                    </button>
                </div>

                <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-8 contact-reveal">
                    {[
                        { icon: <Phone size={20} />, label: "Phone", value: "+7 (771) 780-08-41", href: "tel:+77717800841" },
                        { icon: <Mail size={20} />, label: "Email", value: "info@ic-group.kz", href: "mailto:info@ic-group.kz" }
                    ].map((item, i) => (
                        <a key={i} href={item.href} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-secondary/10 transition-colors">
                                <div className="text-black group-hover:text-brand-secondary transition-colors">{item.icon}</div>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-medium text-black/30 uppercase tracking-widest">{item.label}</p>
                                <p className="text-base md:text-lg font-bold text-black uppercase tracking-tighter group-hover:text-brand-secondary transition-colors">{item.value}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
