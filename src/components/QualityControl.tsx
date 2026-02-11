import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClipboardCheck, Camera, BarChart4, UserCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const QualityControl = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".quality-step", {
                x: -50,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 95%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
            gsap.from(".quality-image", {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const steps = [
        {
            title: "Ежедневный Чек-лист",
            desc: "Уборщица отмечает каждую зону в мобильном приложении. Нет галочки — нет оплаты.",
            icon: <ClipboardCheck size={24} className="text-brand-green" />
        },
        {
            title: "Фото-отчет «До/После»",
            desc: "Обязательная фиксация результата. Вы видите чистоту онлайн, не выходя из кабинета.",
            icon: <Camera size={24} className="text-brand-green" />
        },
        {
            title: "Персональный Менеджер",
            desc: "Закрепленный супервайзер на объекте. Решает вопросы за 15 минут.",
            icon: <UserCheck size={24} className="text-brand-green" />
        },
        {
            title: "KPI Дашборд",
            desc: "Ежемесячный отчет: уровень чистоты, расход материалов, оценка жильцов/арендаторов.",
            icon: <BarChart4 size={24} className="text-brand-green" />
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-brand-light relative overflow-hidden" id="quality">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Content */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 rounded-full mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Facility Standard</span>
                    </div>
                    <h2 className="text-[clamp(2.5rem,8vw,120px)] font-[1000] uppercase italic leading-[0.8] tracking-tighter text-brand-dark mb-12">
                        ИНЖЕНЕРИЯ <br />
                        <span className="text-[#7B85A7] drop-shadow-[0_0_40px_rgba(123,133,167,0.2)]">ЧИСТОТЫ</span> <br />
                        <span className="text-brand-green">НОВОГО УРОВНЯ</span>
                    </h2>

                    <div className="space-y-8">
                        {steps.map((step, i) => (
                            <div key={i} className="quality-step flex gap-6 group">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-brand-dark mb-2 group-hover:text-brand-green transition-colors">{step.title}</h3>
                                    <p className="text-gray-500 font-medium leading-normal text-sm max-w-sm">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Visual Mockup */}
                <div className="quality-image relative">
                    <div className="relative z-10 bg-white border border-gray-100 rounded-[40px] shadow-2xl p-6 md:p-10 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                        {/* Fake App Interface */}
                        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                            <div className="text-left">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Object Status</div>
                                <div className="text-2xl font-black text-brand-dark">98.5% Clean</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-100 text-brand-green flex items-center justify-center">
                                <ClipboardCheck size={20} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="h-2 w-24 bg-gray-200 rounded-full mb-2" />
                                        <div className="h-2 w-16 bg-gray-100 rounded-full" />
                                    </div>
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-green transition-colors">
                                Download Report PDF
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default QualityControl;
