import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calculator, CalendarCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const FloatingMinimal = () => {
    const container = useRef(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".m-step", {
                x: -100, opacity: 0, stagger: 0.1, duration: 1.5, ease: "power4.out",
                scrollTrigger: { trigger: ".m-grid", start: "top 80%" }
            });
            gsap.to(".m-icon", { y: -10, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        }, container);
        return () => ctx.revert();
    }, []);

    const steps = [
        { id: "01", title: "Технический аудит", desc: "Анализируем объект за 1 день.", icon: <Search size={28} /> },
        { id: "02", title: "Прозрачная смета", desc: "Расчет ресурсов под ваши задачи.", icon: <Calculator size={28} /> },
        { id: "03", title: "Быстрый запуск", desc: "Вывод команды за 48 часов.", icon: <CalendarCheck size={28} /> },
        { id: "04", title: "Идеальный контроль", desc: "Управление через приложение.", icon: <Sparkles size={28} /> }
    ];

    return (
        <div ref={container} className="relative py-20 px-6">
            <div className="m-grid max-w-7xl mx-auto space-y-12">
                {steps.map((s, i) => (
                    <div key={i} className="m-step flex flex-col md:flex-row items-center gap-12 group">
                        <div className="m-icon relative w-24 h-24 bg-brand-light border border-brand-dark/[0.05] rounded-[32px] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green/10 transition-colors duration-500 shadow-premium">
                            <span className="text-brand-green">{s.icon}</span>
                            <div className="absolute -inset-1 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-brand-green/20" />
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row items-center gap-8 border-b border-brand-dark/[0.05] pb-12 w-full">
                            <span className="text-7xl font-black text-brand-dark/[0.03] select-none group-hover:text-brand-green/10 transition-colors">{s.id}</span>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-brand-dark mb-4 transition-colors group-hover:text-brand-green">{s.title}</h3>
                                <p className="text-xs text-brand-dark/40 font-medium leading-relaxed uppercase tracking-widest max-w-md">{s.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
