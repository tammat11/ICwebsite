import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatsGrid = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { value: 3000, suffix: "+", label: "СОТРУДНИКОВ В\nХОЛДИНГЕ" },
        { value: 12, suffix: "", label: "ЛЕТ НА РЫНКЕ\nКАЗАХСТАНА" },
        { value: 1, suffix: "M+", label: "M² В ЕЖЕДНЕВНОМ\nУПРАВЛЕНИИ" },
        { value: 40, suffix: "%", label: "ДОЛЯ РЫНКА В\nСЕГМЕНТЕ B2B" },
        { value: 500, suffix: "+", label: "ЕДИНИЦ\nСПЕЦТЕХНИКИ" },
        { value: 250, suffix: "+", label: "КОРПОРАТИВНЫХ\nКЛИЕНТОВ" },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const targets = document.querySelectorAll(".stat-number");
            targets.forEach((target) => {
                const htmlTarget = target as HTMLElement;
                const endValue = parseFloat(htmlTarget.getAttribute("data-value") || "0");
                const isMillion = htmlTarget.nextElementSibling?.textContent?.includes("M");

                const obj = { val: 0 };
                gsap.to(obj, {
                    val: endValue,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: htmlTarget,
                        start: "top 98%",
                    },
                    onUpdate: () => {
                        if (isMillion) {
                            htmlTarget.innerText = obj.val.toFixed(0);
                        } else {
                            htmlTarget.innerText = Math.floor(obj.val).toLocaleString();
                        }
                    }
                });
            });

            gsap.from(".stat-card", {
                y: 40,
                opacity: 0,
                scale: 0.95,
                duration: 1,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 98%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-10 md:py-16 bg-white relative overflow-hidden" id="stats">
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>

                {/* Header */}
                <div className="mb-8 md:mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-green">Market Leadership</span>
                    </div>
                    <h2 className="text-[clamp(32px,9vw,115px)] font-[1000] uppercase tracking-tighter leading-[0.8] italic text-brand-dark">
                        ЦИФРЫ <br />
                        <span className="text-brand-green">НЕ ВРУТ</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-card group relative h-[120px] md:h-[180px]">
                            <div className="h-full bg-white border border-black/[0.04] rounded-[20px] md:rounded-[32px] p-3 md:p-6 transition-all duration-700 group-hover:border-brand-green/30 group-hover:-translate-y-2 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]">

                                {/* Main Content centered */}
                                <div className="relative z-10 flex flex-col items-center space-y-3">
                                    {/* Small Divider */}
                                    <div className="w-6 h-[2px] bg-brand-green/20 group-hover:w-12 transition-all duration-700 mx-auto" />

                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="stat-number text-3xl md:text-6xl font-[1000] tracking-tighter text-brand-dark italic leading-none" data-value={stat.value}>0</span>
                                        <span className="text-sm md:text-2xl font-black text-brand-green italic leading-none">{stat.suffix}</span>
                                    </div>
                                    <div className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-brand-dark/50 leading-tight whitespace-pre-line group-hover:text-brand-dark/70 transition-colors">
                                        {stat.label}
                                    </div>
                                </div>

                                {/* Corner Flare */}
                                <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-brand-green/0 group-hover:bg-brand-green transition-all duration-500 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsGrid;
