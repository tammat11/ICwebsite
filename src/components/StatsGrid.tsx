import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatsGrid = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { value: "3000", suffix: "+", label: "СОТРУДНИКОВ В\nХОЛДИНГЕ" },
        { value: "12", suffix: "", label: "ЛЕТ НА РЫНКЕ\nКАЗАХСТАНА" },
        { value: "1", suffix: "M+", label: "M² В ЕЖЕДНЕВНОМ\nУПРАВЛЕНИИ" },
        { value: "40", suffix: "%", label: "ДОЛЯ РЫНКА В\nСЕГМЕНТЕ B2B" },
        { value: "500", suffix: "+", label: "ЕДИНИЦ\nСПЕЦТЕХНИКИ" },
        { value: "250", suffix: "+", label: "КОРПОРАТИВНЫХ\nКЛИЕНТОВ" },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const targets = document.querySelectorAll(".stat-number");
            targets.forEach((target) => {
                const htmlTarget = target as HTMLElement;
                const endValue = parseFloat(htmlTarget.getAttribute("data-value") || "0");

                const obj = { val: 0 };
                gsap.to(obj, {
                    val: endValue,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: htmlTarget,
                        start: "top 90%",
                    },
                    onUpdate: () => {
                        htmlTarget.innerText = Math.floor(obj.val).toLocaleString();
                    }
                });
            });

            // Global Cards Reveal
            gsap.from(".stat-card", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 90%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding-compact bg-white relative overflow-hidden" id="stats">
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>

                {/* Header */}
                <div className="mb-6 md:mb-10 text-center">
                    <div className="section-tag">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        <span>Market Leadership</span>
                    </div>
                    <h2 className="section-header italic text-brand-dark">
                        ЦИФРЫ <span className="text-brand-green">IC GROUP</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="stat-card group relative h-[180px] md:h-[220px]"
                        >
                            <div className="h-full rounded-[32px] p-6 md:p-8 transition-all duration-700 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-md hover:shadow-2xl bg-white border border-brand-dark/5 hover:-translate-y-2">

                                {/* Background Accent */}
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl group-hover:bg-brand-green/10 transition-all duration-700" />

                                {/* Main Content centered */}
                                <div className="relative z-10 flex flex-col items-center space-y-4">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="stat-number font-bold tracking-tighter italic leading-none text-5xl md:text-6xl text-brand-green" data-value={stat.value}>0</span>
                                        <span className="font-bold italic leading-none text-3xl md:text-3xl text-brand-green">{stat.suffix}</span>
                                    </div>
                                    <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-dark/70 leading-relaxed whitespace-pre-line">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsGrid;
