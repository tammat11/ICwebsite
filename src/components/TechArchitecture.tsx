import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building, Sparkles, ArrowRight, Factory, Construction, Cog } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: "01",
        title: "ЭКО-МЕНЕДЖМЕНТ",
        subtitle: "Офисы и БЦ",
        desc: "Системный подход к ежедневной чистоте. EU Ecolabel химия и полный AI-контроль.",
        icon: <Building size={80} strokeWidth={1} />,
        features: ["Био-химия 100%", "AI Мониторинг", "Green Standards"],
        color: "bg-[#F2F7F2]",
        accent: "text-brand-green",
        video: "https://cdn.dribbble.com/users/1770290/screenshots/6183149/bg_2.gif" // Placeholder for dynamic feel
    },
    {
        id: "02",
        title: "ГЛУБОКАЯ ЧИСТКА",
        subtitle: "Спец. работы",
        desc: "Реставрация камня и текстиля. Удаление пятен на молекулярном уровне.",
        icon: <Sparkles size={80} strokeWidth={1} />,
        features: ["Роторная чистка", "Кристаллизация", "Нано-защита"],
        color: "bg-[#F0F4FF]",
        accent: "text-blue-500",
        video: ""
    },
    {
        id: "03",
        title: "ПРОМЫШЛЕННЫЙ",
        subtitle: "Заводы и Склады",
        desc: "Экстремальный клининг. Альпинизм, очистка станков и обезжиривание цехов.",
        icon: <Factory size={80} strokeWidth={1} />,
        features: ["Пром-альпинизм", "Обезжиривание", "ISO 45001"],
        color: "bg-[#111]",
        accent: "text-white",
        dark: true,
        video: ""
    },
    {
        id: "04",
        title: "ПОСЛЕСТРОЙ",
        subtitle: "Ввод в эксплуатацию",
        desc: "Финальный штрих. Полное обеспыливание и подготовка объекта к открытию.",
        icon: <Construction size={80} strokeWidth={1} />,
        features: ["Обеспыливание", "Вывоз мусора", "White Glove"],
        color: "bg-[#FFF4E5]",
        accent: "text-orange-500",
        video: ""
    }
];

const TechArchitecture = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const rightSideRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Animate Card Switch (WOW Pop Effect)
        if (cardRef.current) {
            const tl = gsap.timeline();

            tl.fromTo(cardRef.current,
                {
                    rotationY: -10,
                    rotationX: 5,
                    opacity: 0.5,
                    scale: 0.95,
                    z: -100
                },
                {
                    rotationY: 0,
                    rotationX: 0,
                    opacity: 1,
                    scale: 1,
                    z: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.7)"
                }
            );
        }

        // Animate floating particles on switch
        gsap.fromTo(".tech-particle",
            { opacity: 0, scale: 0, x: 50 },
            { opacity: 0.6, scale: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "back.out(2)" }
        );

    }, [activeIdx]);

    return (
        <section ref={containerRef} className="py-24 md:py-40 bg-white relative overflow-hidden perspective-[2000px]">

            {/* Background Tech Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#1A1D1E 1px, transparent 1px), linear-gradient(90deg, #1A1D1E 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">

                <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">

                    {/* LEFT: Navigation (Control Panel) */}
                    <div className="lg:col-span-4 flex flex-col justify-center space-y-3 relative">
                        {/* Decorative Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-black/5 lg:block hidden" />

                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                onMouseEnter={() => setActiveIdx(idx)}
                                onClick={() => setActiveIdx(idx)}
                                className={`
                                    group cursor-pointer relative py-6 pl-16 pr-6 rounded-r-2xl transition-all duration-300 isolate
                                    ${activeIdx === idx ? 'scale-[1.05] translate-x-4' : 'hover:bg-gray-50 hover:translate-x-2'}
                                `}
                            >
                                {/* Active Indicator Dot */}
                                <div className={`absolute left-[30px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-500 ${activeIdx === idx ? 'bg-brand-green shadow-[0_0_15px_#83B643]' : 'bg-gray-200'}`} />

                                {/* Active Background Sweep */}
                                {activeIdx === idx && (
                                    <div className="absolute inset-0 bg-brand-dark -z-10 rounded-2xl shadow-xl shadow-brand-dark/20" />
                                )}

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-[10px] font-black tracking-[0.3em] mb-1 transition-colors duration-300 ${activeIdx === idx ? 'text-brand-green' : 'text-gray-400'}`}>
                                            SERVICE {service.id}
                                        </div>
                                        <div className={`text-xl font-bold uppercase tracking-tight transition-colors duration-300 ${activeIdx === idx ? 'text-white' : 'text-brand-dark'}`}>
                                            {service.title}
                                        </div>
                                    </div>
                                    {activeIdx === idx && (
                                        <ArrowRight size={20} className="text-brand-green animate-pulse" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Dynamic Visualization (WOW Card) */}
                    <div className="lg:col-span-8 relative h-[600px] lg:h-[700px] flex items-center perspective-[1000px]" ref={rightSideRef}>

                        {/* Floating elements behind */}
                        <div className="absolute top-[10%] right-[-5%] text-brand-dark/5 animate-spin-slow pointer-events-none">
                            <Cog size={300} strokeWidth={0.5} />
                        </div>

                        <div ref={cardRef} className="w-full relative transform-style-3d">
                            <div className={`
                                w-full min-h-[500px] rounded-[60px] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden transition-all duration-500 shadow-2xl
                                ${services[activeIdx].color}
                                border border-black/5
                            `}>
                                {/* Animated Background Glow */}
                                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/40 to-transparent opacity-50 blur-3xl pointer-events-none`} />

                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <div className={`
                                                w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-black/5 transition-all duration-500
                                                ${services[activeIdx].dark ? 'bg-white/10 text-brand-green blur-0' : 'bg-white text-brand-green'}
                                            `}>
                                                {services[activeIdx].icon}
                                            </div>

                                            <h3 className={`text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter mb-6 ${services[activeIdx].dark ? 'text-white' : 'text-brand-dark'}`}>
                                                {services[activeIdx].desc}
                                            </h3>
                                        </div>

                                        <div className="flex gap-3">
                                            {services[activeIdx].features.map((feat, i) => (
                                                <span key={i} className={`
                                                    tech-particle px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider
                                                    ${services[activeIdx].dark ? 'bg-white/20 text-white' : 'bg-white shadow-sm text-brand-dark'}
                                                `}>
                                                    {feat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Side of Card: Visual / Stats */}
                                    <div className="relative hidden md:flex items-center justify-center">
                                        <div className={`
                                            relative w-64 h-80 rounded-[40px] border-2 flex items-center justify-center overflow-hidden
                                            ${services[activeIdx].dark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white/40'}
                                        `}>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                                                <div className="w-px h-full bg-current" />
                                                <div className="absolute w-full h-px bg-current" />
                                            </div>
                                            <div className="relative z-10 text-center">
                                                <span className={`block text-6xl font-black ${services[activeIdx].dark ? 'text-white' : 'text-brand-dark'}`}>
                                                    {services[activeIdx].id}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-[0.4em] opacity-50">System Core</span>
                                            </div>

                                            {/* Orbiting Element */}
                                            <div className="absolute inset-0 animate-spin-slow">
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-green rounded-full shadow-[0_0_10px_#83B643]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <style>{`
                .animate-spin-slow { animation: spin 20s linear infinite; }
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
            `}</style>
        </section>
    );
};

export default TechArchitecture;
