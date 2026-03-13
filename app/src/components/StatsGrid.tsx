import { useRef } from 'react';
import { useInView } from '../hooks/useInView';

const StatsGrid = () => {
    const [sectionRef, inView] = useInView();
    const containerRef = useRef<HTMLDivElement>(null);

    const stats = [
        { value: "5000", suffix: "", label: "СОТРУДНИКОВ В\nХОЛДИНГЕ" },
        { value: "19", suffix: "", label: "ЛЕТ НА РЫНКЕ\nКАЗАХСТАНА" },
        { value: "4500000", suffix: "", label: "М² В ЕЖЕДНЕВНОМ\nУПРАВЛЕНИИ" },
        { value: "27", suffix: "%", label: "ДОЛЯ РЫНКА В\nСЕГМЕНТЕ B2B" },
        { value: "500", suffix: "+", label: "ЕДИНИЦ\nСПЕЦТЕХНИКИ" },
        { value: "500", suffix: "+", label: "КОРПОРАТИВНЫХ\nКЛИЕНТОВ" },
    ];

    return (
        <section ref={sectionRef} className={`section-padding-compact bg-white relative ${inView ? 'in-view' : ''}`} id="stats">
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>
                <div className="mb-6 text-center reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <h2 className="text-[28px] md:text-5xl font-bold uppercase mb-4 text-brand-dark overflow-visible tracking-tight whitespace-nowrap inline-flex items-baseline justify-center gap-2 leading-none">
                        <span>ЦИФРЫ</span>
                        <span className="relative inline-flex items-baseline">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(143,198,64,0.2)]">IC GROUP</span>
                            </span>
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="stat-card group relative h-[120px] md:h-[140px] reveal-on-scroll"
                            style={{ animationDelay: `${0.08 + i * 0.06}s` }}
                        >
                            <div className="h-full rounded-[40px] p-6 md:p-10 transition-all duration-700 flex flex-col items-center justify-center text-center overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(131,182,67,0.15)] bg-white/50 backdrop-blur-md border border-brand-dark/[0.03] hover:border-brand-green/30 hover:-translate-y-3">
                                <div className="relative z-10 flex flex-col items-center space-y-4 w-full">
                                    <div className="relative flex items-center justify-center py-1 w-full">
                                        <div className="flex items-baseline justify-center gap-1 relative z-10">
                                            <span className="stat-number font-bold tracking-tighter leading-none text-3xl md:text-5xl text-brand-green">{Number(stat.value).toLocaleString()}</span>
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
        </section>
    );
};

export default StatsGrid;
