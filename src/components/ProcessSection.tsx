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
                        start: "top 100%",
                        // ⚙️ ADJUST HERE: "end" controls when the line finishes drawing. "bottom bottom" means when the bottom of the container hits the bottom of the screen.
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });
            }



            // Reveal cards on the sides
            gsap.from(".process-card-anim", {
                x: (i) => i % 2 === 0 ? -40 : 40,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: ".process-steps-container",
                    start: "top 90%",
                    once: true
                }
            });

            // Polishing Animation (Faster with Jitter)
            const polishTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".polish-trigger",
                    start: "top 90%",
                }
            });

            polishTl
                // 1. Quick Enter (Lowered position)
                .fromTo(".polish-brush",
                    { x: -100, y: 0, rotate: -30, opacity: 0, scale: 0.9 },
                    { x: "-10%", y: 15, rotate: -10, opacity: 1, scale: 1.1, duration: 0.3, ease: "power2.out" }
                )
                // 2. Fast Sweep (Lower horizontal path)
                .to(".polish-brush", {
                    x: () => {
                        const trigger = document.querySelector(".polish-trigger");
                        return trigger ? trigger.clientWidth + 150 : 1000;
                    },
                    y: 5,
                    rotate: 20,
                    duration: 1.4,
                    ease: "power2.inOut",
                    modifiers: {
                        y: gsap.utils.unitize((y) => parseFloat(y) + Math.sin(Date.now() * 0.2) * 1),
                        rotate: gsap.utils.unitize((r) => parseFloat(r) + Math.cos(Date.now() * 0.2) * 0.5)
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
                        start: "top 90%",
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
        <section ref={sectionRef} className="section-padding-compact bg-white relative overflow-hidden" id="process">

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-6 md:mb-10 text-center mx-auto">
                    <div className="section-tag">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        <span>Efficiency Path</span>
                    </div>
                    <h2 className="section-header text-brand-dark overflow-visible">
                        ЛЕГКИЙ <span className="text-brand-green">ПУТЬ</span> <br />
                        <span className="relative inline-block polish-trigger">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-[#7B85A7] drop-shadow-[0_0_40px_rgba(123,133,167,0.2)]">К РЕЗУЛЬТАТУ</span>
                                <div className="polish-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full pointer-events-none z-10" />
                            </span>

                            {/* Polishing Brush Animation */}
                            <img
                                src="brush.png"
                                className="polish-brush absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 md:w-48 md:h-48 object-contain pointer-events-none z-20 opacity-0"
                                alt="Polishing Brush"
                            />
                        </span>
                    </h2>
                </div>

                {/* Path Visual Container - Heavily Compacted Vertical Zigzag */}
                <div className="process-steps-container relative max-w-4xl mx-auto">

                    {/* SVG Path - Vertical Snake (Condensed) */}
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-full pointer-events-none -mt-4 opacity-50 md:opacity-100">
                        <svg className="w-full h-full" viewBox="0 0 100 400" preserveAspectRatio="none">
                            {/* Background Guide Path */}
                            <path
                                d="M 50,0 C 50,20 20,25 20,50 C 20,90 80,110 80,150 C 80,190 20,210 20,250 C 20,290 80,310 80,350 C 80,380 50,390 50,400"
                                fill="none"
                                stroke="#83b643"
                                strokeWidth="0.5"
                                strokeDasharray="4,4"
                                opacity="0.1"
                            />
                            {/* Active Growing Path */}
                            <path
                                className="process-path"
                                d="M 50,0 C 50,20 20,25 20,50 C 20,90 80,110 80,150 C 80,190 20,210 20,250 C 20,290 80,310 80,350 C 80,380 50,390 50,400"
                                fill="none"
                                stroke="#83b643"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                style={{ filter: 'drop-shadow(0 0 8px rgba(131,182,67,0.4))' }}
                            />
                        </svg>
                    </div>

                    {/* Step Nodes - Zigzag even on mobile */}
                    <div className="relative space-y-2 md:space-y-4 pointer-events-none flex flex-col">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className={`flex flex-row items-center justify-center gap-0 ${i % 2 === 1 ? 'flex-row-reverse' : 'flex-row'} w-full relative min-h-[90px] md:min-h-[110px]`}
                            >
                                {/* 1. Content Card */}
                                <div className={`process-card-anim w-[50%] max-w-[200px] md:max-w-none md:w-[42%] pointer-events-auto`}>
                                    <div className={`group p-3 md:p-4 bg-white border border-black/5 rounded-[16px] md:rounded-[24px] shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-center`}>
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-100 group-hover:text-brand-green transition-all">
                                            {step.icon}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-bold text-brand-green bg-brand-green/5 px-2 py-0.5 rounded-full uppercase tracking-widest border border-brand-green/10">
                                                    Step 0{i + 1}
                                                </span>
                                                <span className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{step.time}</span>
                                            </div>
                                            <h3 className="text-sm md:text-2xl font-bold text-brand-dark uppercase tracking-tighter group-hover:text-brand-green transition-colors leading-[0.9]">
                                                {step.title} <br /> {step.subtitle}
                                            </h3>
                                            <p className="text-[11px] md:text-sm text-black/50 font-bold group-hover:text-black/70 transition-colors leading-snug">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Spacer to maintain zigzag on layout */}
                                <div className="w-[50%] md:w-[42%]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Connect CTA - Compact */}
                <div className="mt-10 md:mt-16 flex justify-center">
                    <div className="px-6 py-3 md:px-8 md:py-4 rounded-[18px] md:rounded-[28px] bg-brand-dark text-white flex items-center gap-4 shadow-xl relative overflow-hidden group cursor-pointer hover:bg-brand-green transition-colors duration-500">
                        <div className="relative z-10 space-y-0.5">
                            <span className="text-[#7B85A7] text-[7px] font-bold uppercase tracking-[0.4em] group-hover:text-white/70">Ready to Launch</span>
                            <h4 className="text-lg md:text-xl font-extrabold tracking-tighter uppercase leading-none">
                                Полная интеграция
                            </h4>
                        </div>
                        <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-brand-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProcessSection;
