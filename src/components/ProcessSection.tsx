import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calculator, CalendarCheck, Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProcessSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Path drawing animation
            const path = document.querySelector(".process-path") as SVGPathElement;
            if (path) {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

                gsap.to(path, {
                    strokeDashoffset: 0,
                    scrollTrigger: {
                        trigger: ".process-steps-container",
                        start: "top 70%",
                        end: "bottom bottom",
                        scrub: 0.5,
                    }
                });
            }

            // Reveal steps nodes
            gsap.utils.toArray<HTMLElement>(".process-step-node").forEach((node) => {
                gsap.from(node, {
                    scale: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: node,
                        start: "top 90%",
                        once: true
                    }
                });
            });

            // Reveal cards on the sides
            gsap.from(".process-card-anim", {
                x: (i) => i % 2 === 0 ? -40 : 40,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: ".process-steps-container",
                    start: "top 75%",
                    once: true
                }
            });

            // Polishing Animation (Faster with Jitter)
            const polishTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".polish-trigger",
                    start: "top 80%",
                }
            });

            polishTl
                // 1. Quick Enter
                .fromTo(".polish-brush",
                    { x: -100, y: 50, rotate: -30, opacity: 0, scale: 0.9 },
                    { x: "-10%", y: 20, rotate: -10, opacity: 1, scale: 1.1, duration: 0.3, ease: "power2.out" }
                )
                // 2. Fast Sweep with Jitter (Rubbing effect)
                .to(".polish-brush", {
                    x: "115%",
                    y: 10,
                    rotate: 10,
                    duration: 0.7,
                    ease: "power1.inOut",
                    // Subtle organic jitter - reduced intensity
                    modifiers: {
                        y: gsap.utils.unitize((y) => parseFloat(y) + Math.sin(Date.now() * 0.1) * 1.5),
                        rotate: gsap.utils.unitize((r) => parseFloat(r) + Math.cos(Date.now() * 0.1) * 1)
                    }
                })
                // 3. Single Fast Shine (Blink)
                .to(".polish-shine", {
                    x: "250%",
                    duration: 0.6,
                    ease: "power3.inOut"
                }, "-=0.6")
                // 4. Quick Exit
                .to(".polish-brush", {
                    x: 400,
                    y: -100,
                    opacity: 0,
                    rotate: 25,
                    duration: 0.4,
                    ease: "power2.in"
                });

            // Sparkles pop at the climax
            gsap.fromTo(".polish-sparkle",
                { scale: 0, opacity: 0 },
                {
                    scale: (i) => 1.4 + i * 0.2,
                    opacity: 1,
                    rotate: 180,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "back.out(2)",
                    scrollTrigger: {
                        trigger: ".polish-trigger",
                        start: "top 65%",
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const steps = [
        {
            title: "Технический",
            subtitle: "Аудит",
            desc: "Аудит объекта за 24 часа. Считаем площади и износ.",
            icon: <Search size={22} />,
            time: "24h"
        },
        {
            title: "Коммерческий",
            subtitle: "Расчет",
            desc: "Прозрачная смета с детализацией ФОТ и налогов.",
            icon: <Calculator size={22} />,
            time: "48h"
        },
        {
            title: "Быстрый",
            subtitle: "Запуск",
            desc: "Подписание контракта и вывод персонала за 7 дней.",
            icon: <CalendarCheck size={22} />,
            time: "7 Days"
        },
        {
            title: "Полный",
            subtitle: "Контроль",
            desc: "QR-мониторинг и отчетность в вашем смартфоне.",
            icon: <Sparkles size={22} />,
            time: "Live"
        }
    ];

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-brand-light overflow-hidden" id="process">

            {/* Background Grid - Seamless transition via mask */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}>
                <div className="absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-12 md:mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/5 border border-brand-green/10 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7B85A7] animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-dark/40">Efficiency Path</span>
                    </div>
                    <h2 className="text-[clamp(3.2rem,11.5vw,120px)] font-[1000] uppercase italic leading-[0.8] tracking-tighter text-brand-dark overflow-visible">
                        ЛЕГКИЙ <span className="text-brand-green">ПУТЬ</span> <br />
                        <span className="relative inline-block polish-trigger">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-[#7B85A7] drop-shadow-[0_0_40px_rgba(123,133,167,0.2)]">К РЕЗУЛЬТАТУ</span>
                                <div className="polish-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full pointer-events-none z-10" />
                            </span>

                            {/* Polishing Brush Animation */}
                            <img
                                src="/brush_polish.png"
                                className="polish-brush absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 md:w-48 md:h-48 object-contain pointer-events-none z-20 opacity-0"
                                alt="Polishing Brush"
                            />

                            {/* Shine Sparkles */}
                            <div className="absolute inset-0 pointer-events-none overflow-visible">
                                <Sparkles className="polish-sparkle absolute top-0 left-1/4 text-brand-green opacity-0" size={32} />
                                <Sparkles className="polish-sparkle absolute bottom-0 left-1/2 text-brand-green opacity-0" size={24} />
                                <Sparkles className="polish-sparkle absolute top-1/2 left-3/4 text-brand-green opacity-0" size={40} />
                            </div>
                        </span>
                    </h2>
                </div>

                {/* Path Visual Container - Heavily Compacted Vertical Zigzag */}
                <div className="process-steps-container relative max-w-4xl mx-auto">

                    {/* SVG Path - Vertical Snake (Heavily Condensed) */}
                    <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-full h-[105%] pointer-events-none -mt-4">
                        <svg className="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                            {/* Background Guide Path */}
                            <path
                                d="M 50,0 Q 50,25 75,50 Q 100,75 50,100 Q 0,125 25,150 Q 50,175 50,200"
                                fill="none"
                                stroke="#83b643"
                                strokeWidth="0.3"
                                strokeDasharray="2,2"
                                opacity="0.1"
                            />
                            {/* Active Growing Path */}
                            <path
                                className="process-path"
                                d="M 50,0 Q 50,25 75,50 Q 100,75 50,100 Q 0,125 25,150 Q 50,175 50,200"
                                fill="none"
                                stroke="#83b643"
                                strokeWidth="0.8"
                                strokeLinecap="round"
                                style={{ filter: 'drop-shadow(0 0 8px rgba(131,182,67,0.4))' }}
                            />
                        </svg>
                    </div>

                    {/* Step Nodes - Tighter Spacing */}
                    <div className="relative space-y-12 md:space-y-16 pointer-events-none">
                        {steps.map((step, i) => (
                            <div key={i} className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                                {/* 1. Content Card - Taller and Slimmer */}
                                <div className="process-card-anim w-full md:w-[42%] pointer-events-auto">
                                    <div className="group p-6 md:p-8 bg-white border border-black/5 rounded-[32px] shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden min-h-[160px] flex flex-col justify-center">
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-100 group-hover:text-brand-green transition-all">
                                            {step.icon}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black text-brand-green bg-brand-green/5 px-2 py-0.5 rounded-full uppercase tracking-widest border border-brand-green/10">
                                                    Step 0{i + 1}
                                                </span>
                                                <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{step.time}</span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-black text-brand-dark uppercase tracking-tighter italic group-hover:text-brand-green transition-colors leading-[0.9]">
                                                {step.title} <br /> {step.subtitle}
                                            </h3>
                                            <p className="text-xs md:text-sm text-black/40 font-bold group-hover:text-black/70 transition-colors leading-snug">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Central Node */}
                                <div className="hidden md:flex w-[16%] items-center justify-center relative">
                                    <div className="process-step-node relative z-20">
                                        <div className="w-10 h-10 rounded-full bg-white border border-brand-green flex items-center justify-center text-brand-green shadow-sm shadow-brand-green/20">
                                            {step.icon}
                                        </div>
                                        <div className="absolute inset-0 rounded-full bg-brand-green/10 animate-ping -z-10" />
                                    </div>
                                </div>

                                {/* 3. Spacer */}
                                <div className="hidden md:block w-[42%]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Connect CTA - Compact */}
                <div className="mt-16 md:mt-20 flex justify-center">
                    <div className="px-8 py-4 rounded-[30px] bg-brand-dark text-white flex items-center gap-6 shadow-xl relative overflow-hidden group cursor-pointer hover:bg-[#7B85A7] transition-colors duration-500">
                        <div className="relative z-10 space-y-0.5">
                            <span className="text-[#7B85A7] text-[8px] font-black uppercase tracking-[0.4em] group-hover:text-white">Ready to Launch</span>
                            <h4 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">
                                Полная интеграция
                            </h4>
                        </div>
                        <div className="relative z-10 w-10 h-10 rounded-full bg-white text-brand-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProcessSection;
