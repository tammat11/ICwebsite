import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calculator, CalendarCheck, Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProcessSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const finalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".tunnel-card");
            const finalLines = gsap.utils.toArray<HTMLElement>(".final-step-line");

            // 1. PINNED TUNNEL TIMELINE
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=550%", // Increased for sequential final steps
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Initial setup
            gsap.set(cards, {
                scale: 0, opacity: 0, xPercent: -50, yPercent: -50, left: "50%", top: "50%", perspective: 2000
            });
            gsap.set(finalRef.current, { opacity: 0 });
            gsap.set(finalLines, { opacity: 0, y: 10 });

            // Phase 1: Entrance Title Zooms Out
            tl.to(titleRef.current, {
                scale: 8, opacity: 0, filter: "blur(40px)", duration: 2, ease: "power2.in"
            }, 0);

            // Phase 2: Cards Explosion (Slightly MORE COMPACT than before)
            const positions = [
                { x: "-34%", y: "-32%", rot: -8 }, // Top Left
                { x: "34%", y: "-32%", rot: 6 },  // Top Right
                { x: "-30%", y: "32%", rot: -5 },  // Bottom Left
                { x: "30%", y: "35%", rot: 10 }   // Bottom Right
            ];

            cards.forEach((card, i) => {
                // Entry to readable positions
                tl.to(card, {
                    scale: 0.9,
                    opacity: 1,
                    xPercent: -50 + parseInt(positions[i].x),
                    yPercent: -50 + parseInt(positions[i].y),
                    rotate: positions[i].rot,
                    duration: 1.5,
                    ease: "back.out(1.2)"
                }, 0.5 + i * 0.2);

                // Exit: Fly past camera
                tl.to(card, {
                    scale: 4,
                    opacity: 0,
                    xPercent: -50 + (parseInt(positions[i].x) * 4),
                    yPercent: -50 + (parseInt(positions[i].y) * 4),
                    filter: "blur(20px)",
                    duration: 2,
                    ease: "power2.in"
                }, 3.5 + i * 0.15);
            });

            // Phase 3: Reveal "Вместе с IC" & Final Route
            tl.to(finalRef.current, {
                opacity: 1,
                duration: 1
            }, 5.5);

            // Animate the route progress line
            tl.to("#final-mini-path", {
                scaleX: 1,
                duration: 1.5,
                ease: "power2.inOut"
            }, 5.5);

            // Sequential Summary Steps on the Route
            finalLines.forEach((line, i) => {
                tl.to(line, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }, 5.8 + i * 0.3);
            });

            // BG grid distortion
            tl.to(".tunnel-bg-decoration", { scale: 2.5, opacity: 0.1, rotate: 15, duration: 8, ease: "none" }, 0);

        }, sectionRef);

        ScrollTrigger.refresh();
        return () => ctx.revert();
    }, []);

    const steps = [
        { title: "Technical", subtitle: "Audit", desc: "Аудит объекта за 24 часа. Считаем площади и износ.", icon: <Search size={32} /> },
        { title: "Commercial", subtitle: "Log", desc: "Прозрачная смета с детализацией ФОТ и налогов.", icon: <Calculator size={32} /> },
        { title: "Rapid", subtitle: "Launch", desc: "Запуск объекта и вывод персонала за 7 дней.", icon: <CalendarCheck size={32} /> },
        { title: "Full", subtitle: "Control", desc: "QR-мониторинг и отчетность в вашем смартфоне.", icon: <Sparkles size={32} /> }
    ];

    return (
        <section ref={sectionRef} className="h-screen w-full bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center translate-z-0" id="process">

            <div className="tunnel-bg-decoration absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#83b643 1.5px, transparent 1.5px)', backgroundSize: '100px 100px' }} />

            <div className="relative w-full h-full flex items-center justify-center">

                {/* 1. Entrance Title */}
                <h2 ref={titleRef} className="absolute z-20 text-[clamp(4.5rem,22vw,350px)] font-black uppercase leading-none tracking-tighter text-white italic text-center will-change-transform">
                    EASY <br /> <span className="text-brand-green">START</span>
                </h2>

                {/* 2. Step Cards */}
                <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
                    {steps.map((step, i) => (
                        <div key={i} className="tunnel-card absolute w-[280px] md:w-[400px] pointer-events-auto">
                            <div className="bg-[#111]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] md:rounded-[70px] p-8 md:p-14 shadow-[0_40px_120px_rgba(0,0,0,0.6)] hover:bg-[#161616] hover:border-brand-green/30 transition-all duration-700 group overflow-hidden ring-1 ring-white/5">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-12">
                                        {step.icon}
                                    </div>
                                    <div className="text-8xl font-black text-white/[0.03] italic leading-none select-none">0{i + 1}</div>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white leading-[0.85] uppercase tracking-tighter mb-6 italic">{step.title} <br /> <span className="text-brand-green">{step.subtitle}</span></h3>
                                <p className="text-white/40 font-medium leading-relaxed text-sm md:text-base">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Final State: Route Visualization + Title */}
                <div ref={finalRef} className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none px-6">

                    {/* The Route (Horizontal Timeline) */}
                    <div className="w-full max-w-5xl relative mb-24 mt-20">
                        {/* Progressive Route Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 overflow-hidden">
                            <div id="final-mini-path" className="absolute top-0 left-0 h-full bg-brand-green w-full scale-x-0 origin-left" />
                        </div>

                        {/* Route Points */}
                        <div className="flex justify-between items-center relative z-10">
                            {steps.map((step, i) => (
                                <div key={i} className="final-step-line flex flex-col items-center gap-4 group">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 absolute -top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                        Step 0{i + 1}
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-[#111] border-2 border-brand-green flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-white/50">
                                            {step.title}
                                        </span>
                                        <span className="text-[8px] font-black uppercase tracking-tighter text-brand-green italic">
                                            {step.subtitle}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Main Title */}
                    <h1 className="text-[clamp(3rem,11.5vw,170px)] font-black uppercase tracking-tighter italic leading-none text-center transform-gpu">
                        <span className="text-white">Вместе</span> <span className="text-white italic">с</span> <span className="text-brand-green">IC</span>
                    </h1>

                    {/* Final Status */}
                    <div className="mt-16 flex items-center gap-4 py-4 px-10 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-sm transition-all hover:border-brand-green/30">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse shadow-[0_0_10px_#83b643]" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-white/50 leading-none">
                            System integration complete
                        </span>
                    </div>
                </div>

                <div className="absolute top-12 right-12 text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] text-right">SYNC_v7.5</div>
            </div>
        </section>
    );
};

export default ProcessSection;
