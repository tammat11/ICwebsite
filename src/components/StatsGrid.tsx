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
        { value: 17, suffix: "", label: "ФИЛИАЛОВ ПО\nКАЗАХСТАНУ" },
        { value: 250, suffix: "+", label: "КОРПОРАТИВНЫХ\nКЛИЕНТОВ" },
        { value: 98, suffix: "%", label: "RETENTION RATE\n(ЛОЯЛЬНОСТЬ)" },
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
                        start: "top 95%",
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
                    start: "top 85%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-brand-light relative overflow-hidden" id="stats">
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-card group relative h-[220px] md:h-[260px]">
                            <div className="h-full bg-white border border-black/[0.04] rounded-[32px] p-8 md:p-10 transition-all duration-700 group-hover:border-brand-green/30 group-hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]">

                                {/* Background Accent Number */}
                                <div className="absolute -top-4 -right-4 text-[100px] md:text-[140px] font-[1000] text-black/[0.02] leading-none select-none tracking-tighter transition-colors duration-700">
                                    {i + 1}
                                </div>

                                {/* Top Segment: Divider */}
                                <div className="w-8 h-[2px] bg-brand-green/20 group-hover:w-full transition-all duration-700 origin-left z-10" />

                                {/* Main Content */}
                                <div className="relative z-10 flex flex-col space-y-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="stat-number text-5xl md:text-7xl font-[1000] tracking-tighter text-brand-dark italic leading-none" data-value={stat.value}>0</span>
                                        <span className="text-xl md:text-2xl font-black text-brand-green italic leading-none">{stat.suffix}</span>
                                    </div>
                                    <div className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-brand-dark/30 leading-tight whitespace-pre-line group-hover:text-brand-dark/70 transition-colors">
                                        {stat.label}
                                    </div>
                                </div>

                                {/* Corner Flare */}
                                <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-brand-green/0 group-hover:bg-brand-green transition-all duration-500 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsGrid;
