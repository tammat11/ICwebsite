import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calculator, CalendarCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const VerticalRoad = () => {
    const container = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".v-path", { strokeDashoffset: -1000 }, {
                strokeDashoffset: 0, ease: "none",
                scrollTrigger: { trigger: ".v-zigzag", start: "top 60%", end: "bottom 30%", scrub: 1.5 }
            });
            gsap.from(".v-step", {
                y: 60, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out",
                scrollTrigger: { trigger: ".v-zigzag", start: "top 80%", toggleActions: "play none none none" }
            });
            gsap.from(".v-brush", {
                scaleX: 0, opacity: 0, duration: 2, ease: "power2.out",
                scrollTrigger: { trigger: ".v-header", start: "top 80%" }
            });
        }, container);
        return () => ctx.revert();
    }, []);

    const steps = [
        { id: "04", title: "Контроль", desc: "Управление через приложение.", icon: <Sparkles size={24} />, side: "right" },
        { id: "03", title: "Запуск", desc: "Вывод команды за 48 часов.", icon: <CalendarCheck size={24} />, side: "left" },
        { id: "02", title: "Смета", desc: "Прозрачный расчет за 4 часа.", icon: <Calculator size={24} />, side: "right" },
        { id: "01", title: "Аудит", desc: "Анализируем объект за 1 день.", icon: <Search size={24} />, side: "left" }
    ];

    return (
        <div ref={container} className="relative py-20 px-6">
            <div className="v-header text-center mb-32 flex flex-col items-center">
                <h2 className="section-header text-brand-dark relative z-10 transition-all duration-700">
                    ЛЕГКИЙ ПУТЬ <br />
                    <span className="relative inline-block mt-2">
                        <span className="relative z-10 text-brand-green">К РЕЗУЛЬТАТУ</span>
                        <div className="v-brush absolute bottom-[-10%] left-[-10%] right-[-10%] h-[120%] pointer-events-none z-0 opacity-40">
                            <img src="/щетка.png" alt="" className="w-full h-full object-contain" />
                        </div>
                    </span>
                </h2>
            </div>

            <div className="v-zigzag relative max-w-4xl mx-auto pb-20">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 hidden md:block z-0">
                    <svg className="w-full h-full" viewBox="0 0 40 1000" fill="none" preserveAspectRatio="none">
                        <path d="M20 1000 Q 10 900, 20 800 Q 30 700, 20 600 Q 10 500, 20 400 Q 30 300, 20 200 Q 10 100, 20 0" stroke="#1A1D1E" strokeWidth="1" strokeDasharray="10 10" opacity="0.08" />
                        <path className="v-path" d="M20 1000 Q 10 900, 20 800 Q 30 700, 20 600 Q 10 500, 20 400 Q 30 300, 20 200 Q 10 100, 20 0" stroke="#83B643" strokeWidth="3" strokeDasharray="1000" strokeDashoffset="-1000" />
                    </svg>
                </div>
                <div className="space-y-40">
                    {steps.map((s, i) => (
                        <div key={i} className={`v-step flex items-center justify-center relative ${s.side === 'left' ? 'md:justify-start' : 'md:justify-end'}`}>
                            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex w-16 h-16 bg-white border-2 border-brand-green/30 rounded-full items-center justify-center z-20 shadow-premium group cursor-default text-brand-green">{s.icon}</div>
                            <div className="w-full md:w-[44%] relative group bg-white p-8 md:p-10 rounded-[40px] border border-brand-dark/[0.04] shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                                <div className="flex items-center gap-6 mb-6">
                                    <span className="text-4xl md:text-5xl font-bold text-brand-dark/[0.03] group-hover:text-brand-green/20 transition-colors">{s.id}</span>
                                    <h3 className="text-xl md:text-2xl font-bold uppercase text-brand-dark tracking-tighter leading-none">{s.title}</h3>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-brand-dark/40 leading-relaxed uppercase tracking-[0.1em]">{s.desc}</p>
                                <div className="mt-8 w-12 h-1 bg-brand-green/20 rounded-full group-hover:w-full transition-all duration-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
