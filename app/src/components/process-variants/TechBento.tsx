import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calculator, CalendarCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TechBento = () => {
    const container = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".b-card", {
                scale: 0.9, opacity: 0, stagger: 0.1, duration: 1.2, ease: "back.out(1.7)",
                scrollTrigger: { trigger: ".b-grid", start: "top 85%" }
            });
            gsap.from(".b-brush", {
                scaleX: 0, opacity: 0, duration: 2, ease: "power2.out",
                scrollTrigger: { trigger: ".b-header", start: "top 80%" }
            });
        }, container);
        return () => ctx.revert();
    }, []);

    const steps = [
        { id: "01", title: "Технический аудит", desc: "Анализируем объект за 1 день. Поиск скрытых проблем.", icon: <Search size={28} />, span: "col-span-2 row-span-2" },
        { id: "02", title: "Прозрачная смета", desc: "Расчет ресурсов под ваши задачи.", icon: <Calculator size={28} />, span: "col-span-1 row-span-1" },
        { id: "03", title: "Запуск объекта", desc: "Вывод команды за 48 часов.", icon: <CalendarCheck size={28} />, span: "col-span-1 row-span-1" },
        { id: "04", title: "Контроль и KPI", desc: "Управление через приложение.", icon: <Sparkles size={28} />, span: "col-span-2 row-span-1" }
    ];

    return (
        <div ref={container} className="relative py-20 px-6">
            <div className="b-header text-center mb-24 flex flex-col items-center">
                <h2 className="section-header text-brand-dark relative z-10 transition-all duration-700">
                    МЫ СОЗДАЕМ <br />
                    <span className="relative inline-block mt-2">
                        <span className="relative z-10 text-brand-green">РЕЗУЛЬТАТ</span>
                        <div className="b-brush absolute bottom-[-10%] left-[-10%] right-[-10%] h-[120%] pointer-events-none z-0 opacity-40">
                            <img src="/щетка.png" alt="" className="w-full h-full object-contain" />
                        </div>
                    </span>
                </h2>
            </div>
            <div className="b-grid max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4">
                {steps.map((s, i) => (
                    <div key={i} className={`b-card relative bg-white border border-brand-dark/[0.08] rounded-[40px] p-8 md:p-10 shadow-sm hover:shadow-2xl transition-all duration-700 z-10 flex flex-col group ${s.span}`}>
                        <div className="absolute top-6 right-8 text-7xl font-black text-brand-dark/[0.03] group-hover:text-brand-green/20 transition-colors">{s.id}</div>
                        <div className="mb-10 w-16 h-16 bg-brand-light flex items-center justify-center rounded-2xl group-hover:bg-brand-green/10 transition-colors text-brand-green">{s.icon}</div>
                        <div className="mt-auto">
                            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-brand-dark mb-4 transition-colors group-hover:text-brand-green">{s.title}</h3>
                            <p className="text-xs text-brand-dark/40 font-medium leading-relaxed uppercase tracking-widest">{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
