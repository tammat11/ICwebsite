import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calculator, CalendarCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalFlow = () => {
    const container = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".h-card", {
                y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: ".h-grid", start: "top 85%" }
            });
            gsap.fromTo(".h-line", { scaleX: 0 }, {
                scaleX: 1, ease: "none",
                scrollTrigger: { trigger: ".h-grid", start: "top center", end: "bottom center", scrub: 1 }
            });
        }, container);
        return () => ctx.revert();
    }, []);

    const steps = [
        { id: "01", title: "Тех-аудит", desc: "Анализируем объект за 1 день.", icon: <Search size={28} /> },
        { id: "02", title: "Смета", desc: "Прозрачный расчет за 4 часа.", icon: <Calculator size={28} /> },
        { id: "03", title: "Запуск", desc: "Вывод команды за 48 часов.", icon: <CalendarCheck size={28} /> },
        { id: "04", title: "Контроль", desc: "Управление через приложение.", icon: <Sparkles size={28} /> }
    ];

    return (
        <div ref={container} className="relative py-20 px-6">
            <div className="h-grid relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="hidden lg:block absolute top-[50px] left-[10%] right-[10%] h-[2px] bg-brand-dark/[0.03] z-0">
                    <div className="h-line h-full bg-brand-green origin-left scale-x-0" />
                </div>
                {steps.map((s, i) => (
                    <div key={i} className="h-card group relative bg-white border border-brand-dark/[0.08] rounded-[40px] p-10 h-full min-h-[320px] shadow-sm hover:shadow-2xl transition-all duration-700 z-10 flex flex-col group">
                        <div className="absolute top-6 right-8 text-7xl font-black text-brand-dark/[0.03] group-hover:text-brand-green/20 transition-colors">{s.id}</div>
                        <div className="mb-12 w-16 h-16 bg-brand-light flex items-center justify-center rounded-2xl group-hover:bg-brand-green/10 transition-colors text-brand-green">{s.icon}</div>
                        <div className="mt-auto">
                            <h3 className="text-xl font-bold uppercase tracking-tight text-brand-dark mb-4 transition-colors group-hover:text-brand-green">{s.title}</h3>
                            <p className="text-xs text-brand-dark/40 font-medium leading-relaxed uppercase tracking-widest">{s.desc}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-brand-green origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    </div>
                ))}
            </div>
        </div>
    );
};
