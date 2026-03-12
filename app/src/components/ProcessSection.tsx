import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calculator, CalendarCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProcessSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Cascade cards entrance
            gsap.from(".process-card-anim", {
                y: 80,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".process-grid",
                    start: "top 85%",
                }
            });

            // Decorative background removed
        }, containerRef);
        return () => ctx.revert();
    }, []);
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
        <section ref={containerRef} className="pt-4 pb-10 bg-white relative overflow-hidden" id="process">
            {/* Decorative background removed */}

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="section-header text-brand-dark">
                        ЛЕГКИЙ ПУТЬ <br />
                        <span className="text-brand-green">К РЕЗУЛЬТАТУ</span>
                    </h2>
                </div>

                {/* Horizontal Sequence - Line Removed */}
                <div className="relative">

                    <div className="process-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 relative z-10">
                        {steps.map((step, i) => (
                            <div key={i} className="process-card-anim group relative flex flex-col">

                                {/* Card Body */}
                                <div className="mt-8 relative bg-white border border-gray-100 rounded-[40px] p-8 md:p-10 h-full min-h-[300px] flex flex-col transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] hover:border-brand-green/30 group-hover:-translate-y-3">

                                    {/* Large Background ID */}
                                    <div className="absolute top-6 right-8 text-8xl font-black text-gray-50/80 group-hover:text-brand-green/[0.06] transition-colors duration-700 select-none italic">
                                        {step.id}
                                    </div>

                                    {/* Elevated Icon */}
                                    <div className="mb-10 w-20 h-20 bg-gray-50 rounded-[24px] flex items-center justify-center text-brand-dark shadow-sm transition-all duration-500 group-hover:bg-brand-green group-hover:text-white group-hover:shadow-[0_20px_40px_rgba(131,182,67,0.3)] group-hover:scale-110 group-hover:rotate-6">
                                        <div className="transform transition-transform duration-500 group-hover:scale-110">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-auto relative z-10">
                                        <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight text-brand-dark mb-3 md:mb-4 transition-colors duration-500 group-hover:text-brand-green leading-snug md:leading-none min-h-[2.5rem] md:min-h-[3rem] flex items-end">
                                            {step.title}
                                        </h3>
                                        <p className="text-[10px] md:text-xs font-medium text-gray-400 leading-snug md:leading-relaxed uppercase tracking-[0.18em] md:tracking-wider group-hover:text-gray-500 transition-colors">
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
