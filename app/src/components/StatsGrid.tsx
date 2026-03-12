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
            const targets = gsap.utils.toArray(".stat-number");
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
            gsap.fromTo(".stat-card",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                    }
                }
            );
            // === REFINED ARCHES: smooth vertical entrance ===
            // Arches removed

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding-compact bg-white relative" id="stats">

            {/* ── Premium Decorative Background (Stitched style) ── */}

            {/* Arches removed */}
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>

                {/* Header */}
                <div className="mb-6 text-center">
                    <h2 className="text-[28px] md:text-5xl font-bold uppercase mb-4 text-brand-dark overflow-visible contact-reveal relative z-10 w-full text-center tracking-tight whitespace-nowrap inline-flex items-baseline justify-center gap-2 leading-none">
                        <span>ЦИФРЫ</span>
                        <span className="relative inline-flex items-baseline">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(131,182,67,0.2)]">IC GROUP</span>
                            </span>
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="stat-card group relative h-[120px] md:h-[140px]"
                        >
                            <div className="h-full rounded-[40px] p-6 md:p-10 transition-all duration-700 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(131,182,67,0.15)] bg-white/50 backdrop-blur-md border border-brand-dark/[0.03] hover:border-brand-green/30 hover:-translate-y-3 group">

                                {/* Main Content centered */}
                                <div className="relative z-10 flex flex-col items-center space-y-4 w-full">
                                    <div className="relative flex items-center justify-center py-1 w-full">
                                        <div className="flex items-baseline justify-center gap-1 relative z-10">
                                            <span className="stat-number font-bold tracking-tighter leading-none text-3xl md:text-5xl text-brand-dark" data-value={stat.value}>0</span>
                                            <span className="font-bold leading-none text-2xl md:text-3xl text-brand-green">{stat.suffix}</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-brand-secondary/60 leading-relaxed whitespace-pre-line z-10 text-center">
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
