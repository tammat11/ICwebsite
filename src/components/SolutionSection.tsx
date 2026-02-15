import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Dna, Activity, Zap, ArrowRight, Shield, Radio, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SolutionSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [cardOrder, setCardOrder] = useState([0, 1, 2]); // Initial order of card indices [bottom-to-top]
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Background Monolith Text Parallax
            gsap.to(".monolith-text", {
                yPercent: -15,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 120%",
                    end: "bottom top",
                    scrub: 1
                }
            });

            // 2. Title Reveal (Once)
            gsap.from(".vibe-header-anim", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 120%",
                    once: true
                }
            });

            // 3. Stacked Cards Entrance
            const cards = gsap.utils.toArray<HTMLElement>(".magnetic-card");
            const mm = gsap.matchMedia();

            mm.add({
                isMobile: "(max-width: 767px)",
                isDesktop: "(min-width: 768px)"
            }, (context) => {
                const { isMobile } = context.conditions as any;

                if (!isMobile) {
                    gsap.fromTo(cards,
                        { y: 150, opacity: 0, scale: 0.8, x: 0, rotate: 0 },
                        {
                            y: 0, opacity: 1, scale: 1,
                            x: (i) => [-380, 0, 380][i],
                            rotate: (i) => [-12, 0, 12][i],
                            stagger: 0.05,
                            duration: 0.8,
                            ease: "back.out(1.2)",
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top 120%",
                                once: true
                            }
                        }
                    );
                } else {
                    gsap.fromTo(cards,
                        { y: 150, opacity: 0, scale: 0.8 },
                        {
                            y: 0, opacity: 1, scale: 1,
                            stagger: 0.1,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top 100%",
                                once: true
                            }
                        }
                    );
                }
            });

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const data = [
        {
            id: "01",
            icon: <Cpu size={40} />,
            title: "IC OS",
            desc: "Цифровая операционная система управления объектом. Тотальный контроль процессов.",
            color: "text-brand-green",
            bg: "bg-white",
            glow: "rgba(131,182,67,0.5)"
        },
        {
            id: "02",
            icon: <Dna size={40} />,
            title: "NEURAL",
            desc: "Искусственный интеллект, предсказывающий износ и планирующий ресурсы.",
            color: "text-brand-secondary",
            bg: "bg-white",
            glow: "rgba(123,133,167,0.5)"
        },
        {
            id: "03",
            icon: <Activity size={40} />,
            title: "PULSE",
            desc: "Мгновенная реакция через IoT датчики и мобильные системы уведомлений.",
            color: "text-purple-500",
            bg: "bg-white",
            glow: "rgba(168,85,247,0.5)"
        }
    ];

    const shuffleCards = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        const currentOrder = [...cardOrder];
        const topIdx = currentOrder[currentOrder.length - 1];
        const cardElement = document.querySelector(`.card-index-${topIdx}`) as HTMLElement;

        if (cardElement) {
            // Kill any previous animations on this specific element just in case
            gsap.killTweensOf(cardElement);

            const tl = gsap.timeline({
                onComplete: () => {
                    const newOrder = [topIdx, ...currentOrder.slice(0, -1)];
                    // Sync state AFTER animation to avoid React render fighting GSAP
                    setCardOrder(newOrder);
                    gsap.set(cardElement, { clearProps: "all" });
                    setIsAnimating(false);
                }
            });

            // Fast, physical swing-out
            tl.to(cardElement, {
                x: 140,
                y: -30,
                rotate: 15,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            })
                // Change Z-index exactly when it's out of the deck
                .set(cardElement, { zIndex: 0 })
                // Snap back underneath
                .to(cardElement, {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 0.8,
                    duration: 0.4,
                    ease: "back.out(1.2)"
                });

            // Nudge reaction for other cards
            currentOrder.slice(0, -1).forEach((idx) => {
                const el = document.querySelector(`.card-index-${idx}`);
                if (el) {
                    gsap.killTweensOf(el);
                    gsap.to(el, {
                        y: "+=5",
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1,
                        ease: "sine.inOut"
                    });
                }
            });
        } else {
            setIsAnimating(false);
        }
    };

    return (
        <section ref={sectionRef} className="relative py-12 md:py-20 bg-brand-light overflow-hidden z-20" id="solution">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(123,133,167,0.08)_0%,transparent_100%)]" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
                <h2 className="monolith-text text-[25vw] font-[1000] text-black leading-none tracking-tighter uppercase">
                    HUB_SYS
                </h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full overflow-hidden">
                {/* 1. Header */}
                <div className="vibe-header-anim mb-20 md:mb-32 space-y-4 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-black/5 border border-black/5 rounded-full mb-6">
                        <Zap size={10} className="text-brand-secondary" />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-black/40">Facility Service Ecosystem</span>
                    </div>

                    <h2 className="text-[clamp(2.5rem,8vw,120px)] font-[1000] uppercase tracking-[-0.05em] leading-[0.8] text-brand-dark">
                        НАШЕ <br />
                        <span className="text-brand-green drop-shadow-[0_0_60px_rgba(131,182,67,0.4)]">РЕШЕНИЕ</span>
                    </h2>
                </div>

                {/* 2. Stacked Deck (Card Style) */}
                <div className="vibe-stack-container relative h-[450px] md:h-[550px] flex items-center justify-center overflow-visible">
                    {data.map((item, i) => {
                        const orderPos = cardOrder.indexOf(i);
                        const isTop = orderPos === cardOrder.length - 1;

                        // Refined mobile positioning to fit all screens
                        const mobileX = (orderPos - 1) * 10;
                        const mobileY = (orderPos - 1) * -8;
                        const mobileRotate = (orderPos - 1) * 2;
                        const mobileScale = 0.9 + (orderPos * 0.05);

                        return (
                            <div
                                key={item.id}
                                className={`magnetic-card absolute card-index-${i} w-[260px] md:w-[340px] aspect-[1/1.4] 
                                           ${!isAnimating ? 'md:transition-all md:duration-500 hover:!z-[100] md:hover:!rotate-0 md:hover:-translate-y-12 md:hover:scale-110' : ''} 
                                           group cursor-pointer pointer-events-auto`}
                                style={{
                                    zIndex: orderPos * 10,
                                    transform: typeof window !== 'undefined' && window.innerWidth < 768
                                        ? `translate(${mobileX}px, ${mobileY}px) rotate(${mobileRotate}deg) scale(${mobileScale})`
                                        : undefined,
                                }}
                                onClick={() => {
                                    if (window.innerWidth < 768 && isTop) {
                                        shuffleCards();
                                    }
                                }}
                            >
                                <div className={`h-full w-full ${item.bg} border border-black/5 rounded-[32px] md:rounded-[40px] p-6 md:p-12 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex flex-col justify-between md:transition-all md:duration-500 relative overflow-hidden ring-1 ring-black/5`}>
                                    <div className="glow-line absolute top-0 left-0 h-[3px] bg-brand-secondary w-0 md:transition-all md:duration-1000 group-hover:w-full shadow-[0_0_15px_#7B85A7]" />

                                    <div className="flex flex-col items-center text-center gap-6 md:gap-10">
                                        <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[22px] md:rounded-[30px] bg-black/[0.02] border border-black/5 flex items-center justify-center ${item.color} group-hover:bg-brand-secondary group-hover:text-white md:transition-all shadow-sm group-hover:shadow-brand-secondary/30 relative`}>
                                            <div className="scale-100 md:scale-125 group-hover:rotate-12 md:transition-transform md:duration-500">
                                                {item.icon}
                                            </div>
                                        </div>

                                        <div className="space-y-3 md:space-y-6">
                                            <h3 className="text-2xl md:text-5xl font-[1000] text-brand-dark uppercase tracking-tighter leading-none group-hover:text-brand-secondary md:transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-[10px] md:text-lg text-black/40 font-bold leading-tight group-hover:text-brand-dark md:transition-colors">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-black/5 pt-4 md:pt-8">
                                        <div className="hidden sm:flex gap-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                            <Shield size={16} className="text-black" />
                                            <Radio size={16} className="text-black" />
                                        </div>

                                        <div
                                            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-secondary text-white flex items-center justify-center shadow-[0_15px_30px_rgba(123,133,167,0.4)] md:transition-all md:duration-500 hover:scale-110 active:scale-95 group/btn relative overflow-hidden mx-auto sm:mx-0"
                                            onClick={(e) => {
                                                if (window.innerWidth < 768) {
                                                    e.stopPropagation();
                                                    shuffleCards();
                                                }
                                            }}
                                        >
                                            <ArrowRight size={24} className="relative z-10" />
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 md:transition-transform md:duration-300" />
                                            <div className="absolute inset-0 rounded-full border-4 border-brand-secondary animate-ping opacity-20 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20 flex justify-center">
                    <div className="px-8 py-3 bg-black/[0.02] border border-black/5 rounded-full flex items-center gap-4 group hover:border-brand-secondary transition-colors cursor-pointer shadow-sm">
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-black/30 group-hover:text-brand-secondary">Начинайте с нами!</span>
                        <ArrowDown size={14} className="text-black/30 group-hover:text-brand-secondary animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
