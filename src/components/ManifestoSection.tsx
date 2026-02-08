import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ManifestoSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Floating Gradient Orbs
            gsap.to(".orb-1", {
                x: "20%", y: "20%", duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
            gsap.to(".orb-2", {
                x: "-20%", y: "-10%", duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut"
            });

            // 2. Clear Focus Reveal
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    end: "bottom 80%",
                    scrub: 1
                }
            });

            // Blur out -> Focus in effect
            tl.fromTo(".glass-text",
                { filter: "blur(10px)", opacity: 0.4, scale: 0.95 },
                { filter: "blur(0px)", opacity: 1, scale: 1, stagger: 0.2, duration: 1 }
            );

            // 3. Highlight Line Animation
            gsap.from(".highlight-bar", {
                width: 0,
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".highlight-bar",
                    start: "top 80%"
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-32 md:py-48 bg-[#111] text-white relative overflow-hidden" id="manifesto">

            {/* Background: Deep Graphite + Floating Orbs */}
            <div className="absolute inset-0 z-0 bg-[#0f0f0f]">
                <div className="orb-1 absolute top-0 right-0 w-[600px] h-[600px] bg-brand-green/20 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
                <div className="orb-2 absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
            </div>

            {/* Glass Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-6">

                {/* Header Tag */}
                <div className="mb-12 flex items-center gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md">
                        <Sparkles size={14} className="text-brand-green" />
                    </div>
                    <span className="text-xs font-mono tracking-[0.2em] uppercase text-white/60">Core Manifesto</span>
                </div>

                {/* Main Text Content */}
                <div className="space-y-2 md:space-y-4">

                    {/* Line 1 */}
                    <h2 className="glass-text text-3xl md:text-5xl font-medium text-white/60 tracking-tight">
                        Мы не просто убираем.
                    </h2>

                    {/* Line 2 - Big Impact */}
                    <div className="highlight-wrapper relative py-2">
                        <h2 className="glass-text text-[clamp(3rem,8vw,120px)] font-bold tracking-tighter text-white leading-[0.9]">
                            Мы создаем
                        </h2>
                    </div>

                    {/* Line 3 - Highlighted */}
                    <div className="relative inline-block glass-text">
                        <h2 className="text-[clamp(3rem,8vw,120px)] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-[0.9] relative z-10">
                            стандарты
                        </h2>
                        {/* Underline Bar */}
                        <div className="highlight-bar absolute bottom-2 left-0 h-3 md:h-6 bg-brand-green/80 -z-0 w-full rounded-sm" />
                    </div>

                    {/* Line 4 - Finish */}
                    <div className="glass-text mt-8 flex items-center gap-6">
                        <div className="h-px w-16 bg-white/20" />
                        <p className="text-lg md:text-2xl font-light text-white/50 italic font-serif">
                            которые меняют индустрию навсегда.
                        </p>
                    </div>

                </div>

                {/* Bottom Call to Action Hint */}
                <div className="mt-20 flex justify-end opacity-40 glass-text">
                    <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest cursor-pointer hover:text-brand-green transition-colors">
                        <span>Read Full Standard</span>
                        <ArrowRight size={16} />
                    </div>
                </div>

            </div>

        </section>
    );
};

export default ManifestoSection;
