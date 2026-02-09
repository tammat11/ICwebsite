import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, Mail, Phone, MessageSquare } from 'lucide-react';

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
                    start: "top 80%",
                    fastScrollEnd: true
                }
            });

            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="contacts" className="relative py-40 md:py-64 bg-white overflow-hidden text-center transform-gpu">
            {/* Optimized Interactive Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
                <div ref={gridRef} className="absolute inset-0 will-change-transform"
                    style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            {/* Optimized Moving Text */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none overflow-hidden">
                <span ref={bigTextRef} className="text-[clamp(10rem,35vw,600px)] font-[1000] text-black italic opacity-[0.02] leading-none uppercase tracking-tighter whitespace-nowrap will-change-transform">
                    LET'S TALK • LET'S TALK
                </span>
            </div>

            {/* Optimized Dynamic Glow */}
            <div ref={glowRef} className="absolute w-[600px] h-[600px] bg-brand-green/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 border border-brand-green/20 mb-12 contact-reveal">
                    <MessageSquare size={14} className="text-brand-green" />
                    <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Ready to scale?</span>
                </div>

                <h2 className="text-[clamp(3.5rem,12vw,180px)] font-[1000] uppercase leading-[0.8] tracking-[-0.08em] mb-20 contact-reveal">
                    <span className="block text-black">Давайте</span>
                    <span className="block text-brand-green italic">обсудим?</span>
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 contact-reveal">
                    <button className="group relative flex items-center justify-center gap-4 bg-black text-white px-16 py-8 rounded-full text-2xl font-black uppercase tracking-tighter overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-brand-green shadow-2xl">
                        <span className="relative z-10">Estimate Project</span>
                        <ArrowUpRight size={32} className="relative z-10 group-hover:rotate-45 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    <button className="group flex flex-col items-center gap-2 px-12 py-6 rounded-full border-2 border-black/5 hover:border-brand-green/50 transition-all duration-300">
                        <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em]">Our mobile app</span>
                        <span className="text-2xl font-black text-black">Coming Soon</span>
                    </button>
                </div>

                <div className="mt-32 flex flex-wrap justify-center gap-x-16 gap-y-8 contact-reveal">
                    {[
                        { icon: <Phone size={20} />, label: "Phone", value: "+7 (771) 780-08-41", href: "tel:+77717800841" },
                        { icon: <Mail size={20} />, label: "Email", value: "info@ic-group.kz", href: "mailto:info@ic-group.kz" }
                    ].map((item, i) => (
                        <a key={i} href={item.href} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-green/10 transition-colors">
                                <div className="text-black group-hover:text-brand-green transition-colors">{item.icon}</div>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{item.label}</p>
                                <p className="text-lg font-black text-black uppercase tracking-tighter">{item.value}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
