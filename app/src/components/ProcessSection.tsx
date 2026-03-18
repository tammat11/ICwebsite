import { useRef } from 'react';
import { Search, Calculator, CalendarCheck, Sparkles } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const ProcessSection = () => {
    const [sectionRef, inView] = useInView();
    const containerRef = useRef<HTMLDivElement>(null);
    const steps = [
        {
            id: "01",
            title: "Аудит",
            desc: "Анализируем объект за 1 день. Поиск скрытых проблем.",
            icon: <Search className="w-6 h-6" />
        },
        {
            id: "02",
            title: "Смета",
            desc: "Прозрачный расчет и подбор профессиональной химии.",
            icon: <Calculator className="w-6 h-6" />
        },
        {
            id: "03",
            title: "Запуск",
            desc: "Формирование команды и старт работ за 48 часов.",
            icon: <CalendarCheck className="w-6 h-6" />
        },
        {
            id: "04",
            title: "Контроль",
            desc: "Ежедневный цифровой чек-лист в вашем смартфоне.",
            icon: <Sparkles className="w-6 h-6" />
        }
    ];

    return (
        <section ref={sectionRef} className={`pt-4 pb-10 bg-white relative overflow-hidden ${inView ? 'in-view' : ''}`} id="process">
            <div className="pointer-events-none absolute left-[12%] top-10 h-20 w-20 rounded-full bg-brand-green/8 blur-3xl animate-pulse-glow" />
            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>

                {/* Header */}
                <div className="text-center mb-8 reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <h2 className="section-header text-brand-dark">
                        ЛЕГКИЙ ПУТЬ <br />
                        <span className="text-brand-green">К РЕЗУЛЬТАТУ</span>
                    </h2>
                </div>

                {/* Horizontal Sequence - Line Removed */}
                <div className="relative">

                    <div className="process-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 relative z-10">
                        {steps.map((step, i) => (
                            <div key={i} className="process-card-anim group relative flex flex-col reveal-on-scroll" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>

                                {/* Card Body */}
                                <div className={`mt-4 md:mt-6 relative bg-white border border-gray-100 rounded-[30px] md:rounded-[40px] p-6 md:p-8 h-full min-h-[220px] md:min-h-[260px] flex flex-col transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] hover:border-brand-green/30 group-hover:-translate-y-3 overflow-hidden ${i % 2 === 0 ? 'animate-bob-soft' : 'animate-bob-soft-alt'}`}>
                                    <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />

                                    {/* Large Background ID */}
                                    <div className="absolute top-1 right-3 md:top-4 md:right-6 text-5xl md:text-7xl font-black text-gray-50/80 group-hover:text-brand-green/[0.06] transition-colors duration-700 select-none italic">
                                        {step.id}
                                    </div>

                                    {/* Elevated Icon */}
                                    <div className="mb-6 md:mb-8 w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-[18px] md:rounded-[22px] flex items-center justify-center text-brand-dark shadow-sm transition-all duration-500 group-hover:bg-brand-green group-hover:text-white group-hover:shadow-[0_20px_40px_rgba(131,182,67,0.3)] group-hover:scale-110 group-hover:rotate-6">
                                        <div className="transform transition-transform duration-500 group-hover:scale-110">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-auto relative z-10 text-center">
                                        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-brand-dark mb-2 md:mb-3 transition-colors duration-500 group-hover:text-brand-green leading-snug md:leading-none min-h-[1.5rem] md:min-h-[2rem] flex items-center justify-center">
                                            {step.title}
                                        </h3>
                                        <p className="text-[9px] md:text-[10px] font-medium text-gray-400 leading-snug md:leading-relaxed uppercase tracking-[0.15em] md:tracking-normal group-hover:text-gray-500 transition-colors">
                                            {step.desc}
                                        </p>
                                    </div>

                                    {/* Dynamic Bottom Accent */}
                                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-brand-green origin-center scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-b-[40px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
