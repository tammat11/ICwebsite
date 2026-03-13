import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatsGrid = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { value: "5000", suffix: "", label: "СОТРУДНИКОВ В\nХОЛДИНГЕ" },
        { value: "19", suffix: "", label: "ЛЕТ НА РЫНКЕ\nКАЗАХСТАНА" },
        { value: "4500000", suffix: "", label: "М² В ЕЖЕДНЕВНОМ\nУПРАВЛЕНИИ" },
        { value: "27", suffix: "%", label: "ДОЛЯ РЫНКА В\nСЕГМЕНТЕ B2B" },
        { value: "500", suffix: "+", label: "ЕДИНИЦ\nСПЕЦТЕХНИКИ" },
        { value: "500", suffix: "+", label: "КОРПОРАТИВНЫХ\nКЛИЕНТОВ" },
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
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: htmlTarget,
                        start: "top 95%",
                    },
                    onUpdate: () => {
                        htmlTarget.innerText = Math.floor(obj.val).toLocaleString();
                    }
                });
            });



            // Global Cards Reveal
            gsap.from(".stat-card", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 95%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding-compact bg-white relative overflow-hidden" id="stats">
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>

                {/* Header */}
                <div className="mb-6 text-center">
                    <h2 className="section-header text-brand-dark overflow-visible">
                        ЦИФРЫ <br className="md:hidden" />
                        <span className="relative inline-block">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(131,182,67,0.2)]">IC GROUP</span>
                            </span>
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="stat-card group relative h-[140px] md:h-[160px]"
                        >
                            <div className="h-full rounded-[40px] p-6 md:p-8 transition-all duration-700 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-md hover:shadow-2xl bg-white border border-brand-dark/5 hover:-translate-y-2">

                                {/* Background Accent */}
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl group-hover:bg-brand-green/10 transition-all duration-700" />

                                {/* Main Content centered */}
                                <div className="relative z-10 flex flex-col items-center space-y-4 w-full">
                                    <div className="relative flex items-center justify-center py-2 w-full">

                                        <div className="flex items-baseline justify-center gap-1 relative z-10">
                                            <span className="stat-number font-bold tracking-tighter leading-none text-5xl md:text-6xl text-brand-green" data-value={stat.value}>0</span>
                                            <span className="font-bold leading-none text-3xl md:text-3xl text-brand-green">{stat.suffix}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs md:text-sm font-semibold uppercase tracking-widest text-brand-dark/70 leading-relaxed whitespace-pre-line z-10 text-center">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default StatsGrid;
