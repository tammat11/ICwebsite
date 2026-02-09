import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, TrendingDown, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CasesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".bg-parallax-cases", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2
                },
                x: -150,
                opacity: 0.05
            });

            // Case Card Sequential Animation
            gsap.utils.toArray<HTMLElement>(".case-card").forEach((card) => {
                gsap.from(card, {
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%"
                    }
                });

                // Parallax on image inside card
                gsap.from(card.querySelector("img"), {
                    scale: 1.2,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        scrub: true
                    }
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const cases = [
        {
            company: "Forte Bank",
            stat: "−22%",
            metric: "OPEX REDUCTION",
            title: "Build unified service standards",
            desc: "Централизация управления 45 объектами через единую цифровую платформу IC Group. Оптимизация затрат без потери качества.",
            category: "Financial Sector",
            icon: <TrendingDown className="text-brand-green" size={20} />,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "Air Astana",
            stat: "99.8%",
            metric: "SLA COMPLIANCE",
            title: "Automate quality reporting",
            desc: "Внедрение QR-мониторинга и фото-отчетности в реальном времени для крупнейшего авиаперевозчика региона.",
            category: "Aviation Tech",
            icon: <Zap className="text-blue-400" size={20} />,
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "Samsung",
            stat: "Zero",
            metric: "INCIDENT RATE",
            title: "Move product work forward",
            desc: "Поддержка чистоты и безопасности на производственных и офисных площадках Samsung по международным стандартам.",
            category: "Production",
            icon: <ShieldCheck className="text-purple-400" size={20} />,
            image: "https://images.unsplash.com/photo-1504384308090-c89e12bf9a51?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 md:py-40 bg-[#0a0a0a] text-white overflow-hidden relative" id="cases">

            {/* Background Narrative */}
            <div className="bg-parallax-cases absolute top-1/2 left-0 -translate-y-1/2 text-[18rem] font-black text-white opacity-[0.02] select-none whitespace-nowrap leading-none hidden lg:block pointer-events-none">
                SYSTEMS AND INTEGRATIONS
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Goal Title - Layered Impact Style (Selected) */}
                <div className="mb-32 relative">
                    <div className="absolute -top-20 -left-10 text-[clamp(8rem,25vw,350px)] font-black text-white/[0.03] select-none pointer-events-none italic">PROJECTS</div>
                    <h2 className="relative z-10 text-[clamp(4.5rem,12vw,180px)] font-black uppercase leading-[0.85] tracking-tighter">
                        <span className="text-white block mb-2 drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">Масштабируем</span>
                        <span className="inline-block bg-brand-green text-black px-6 md:px-10 py-3 transform -rotate-2 shadow-2xl">ваши цели</span>
                    </h2>
                </div>

                {/* Vertical Premium Showcase */}
                <div className="flex flex-col gap-40">
                    {cases.map((item, i) => (
                        <div
                            key={i}
                            className={`case-card group relative flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}
                        >
                            {/* 1. Media Area - Large Focus */}
                            <div className="w-full md:w-3/5 h-[400px] md:h-[600px] relative rounded-[40px] overflow-hidden">
                                <div className="absolute inset-0 bg-brand-dark/20 z-10" />
                                <img
                                    src={item.image}
                                    alt={item.company}
                                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                                />

                                {/* Overlay Stats */}
                                <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 bg-gradient-to-t from-black to-transparent">
                                    <div className="text-8xl md:text-[12rem] font-black text-white/10 italic leading-none absolute top-10 right-10">
                                        0{i + 1}
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-7xl md:text-9xl font-black text-brand-green tracking-tighter">
                                            {item.stat}
                                        </div>
                                        <div className="text-sm font-black uppercase tracking-[0.3em] text-white">
                                            {item.metric}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Content Area */}
                            <div className="w-full md:w-2/5 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-green">
                                        {item.company}
                                    </span>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase leading-[0.9] tracking-tighter">
                                    {item.title}
                                </h3>
                                <p className="text-xl text-white/40 font-medium leading-relaxed mb-10 max-w-md">
                                    {item.desc}
                                </p>

                                {/* Detail Button */}
                                <button className="group/btn relative inline-flex items-center gap-4 text-white text-xs font-black uppercase tracking-[0.5em] group-hover:text-brand-green transition-colors">
                                    <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-brand-green transition-colors">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </span>
                                    Explore Case Study
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CasesSection;
