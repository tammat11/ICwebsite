import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Zap, Users, BarChart3, Settings2, Globe2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WhyUs = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const reasons = [
        {
            title: "Лидерство на Рынке",
            description: "№1 в B2B сегменте Казахстана с долей рынка 40%",
            icon: <Globe2 className="w-8 h-8" />,
            image: "/office_leadership.png",
            accent: "bg-brand-green/10"
        },
        {
            title: "Технологии Контроля",
            description: "Собственное мобильное приложение для мониторинга качества 24/7",
            icon: <Zap className="w-8 h-8" />,
            accent: "bg-blue-500/5"
        },
        {
            title: "Профессиональная Команда",
            description: "3000+ подготовленных сотрудников, прошедших сертификацию",
            icon: <Users className="w-8 h-8" />,
            accent: "bg-purple-500/5"
        },
        {
            title: "Ресурсная Мощность",
            description: "Собственный парк из 500+ единиц профессиональной спецтехники",
            icon: <Settings2 className="w-8 h-8" />,
            image: "/cleaning_tech.png",
            accent: "bg-orange-500/5"
        },
        {
            title: "Прозрачная Аналитика",
            description: "KPI-дашборды и детальные отчеты по каждому объекту в PowerBI",
            icon: <BarChart3 className="w-8 h-8" />,
            accent: "bg-brand-green/10"
        },
        {
            title: "Гарантия Качества",
            description: "Многоуровневый аудит и персональный менеджер для каждого клиента",
            icon: <ShieldCheck className="w-8 h-8" />,
            accent: "bg-emerald-500/5"
        }
    ];

    // Increased repetition for a truly infinite feel
    const infiniteReasons = [...reasons, ...reasons, ...reasons, ...reasons, ...reasons];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const totalItems = reasons.length;
        const getCardWidth = () => {
            const firstCard = scrollContainer.querySelector('.why-card-wrapper');
            return firstCard ? firstCard.getBoundingClientRect().width + 24 : (window.innerWidth > 768 ? 474 : window.innerWidth * 0.85 + 24);
        };

        // Initialize to middle for infinite effect
        const cardTotal = getCardWidth();
        const middleOffset = totalItems * 2 * cardTotal;

        // Center the card in the viewport
        scrollContainer.scrollLeft = middleOffset - (window.innerWidth / 2 - (cardTotal - 24) / 2);

        const ctx = gsap.context(() => {
            gsap.from(".why-big-title", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 100%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);



    return (
        <section ref={sectionRef} className="py-24 md:py-40 bg-white relative overflow-hidden" id="why-us">
            <div className="max-w-7xl mx-auto px-6 relative z-30 mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 rounded-full mb-8">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Why IC Group</span>
                </div>
                <h2 className="why-big-title text-[clamp(2.5rem,8vw,100px)] font-[1000] uppercase italic leading-[0.9] tracking-tighter text-brand-dark">
                    СТАНДАРТ <br />
                    <span className="text-brand-green">ПРЕВОСХОДСТВА</span>
                </h2>
            </div>

            {/* Horizontal Scroll Area - Full Width with Snap Center */}
            <div className="relative w-full group">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 py-10 snap-x snap-mandatory no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {infiniteReasons.map((reason, i) => (
                        <div
                            key={i}
                            className="why-card-wrapper flex-shrink-0 w-[65vw] md:w-[450px] snap-center"
                        >
                            <div className="group/card relative overflow-hidden rounded-[32px] border border-black/[0.04] bg-brand-light h-[320px] md:h-[620px] transition-all duration-700 hover:border-brand-green/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col justify-between p-6 md:p-14 whitespace-normal">
                                <div className={`w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-3xl ${reason.accent} flex items-center justify-center text-brand-green mb-4 md:mb-8 transition-all duration-700 group-hover/card:scale-110 group-hover/card:bg-brand-green group-hover/card:text-white relative z-20`}>
                                    {reason.icon}
                                </div>

                                <div className="space-y-2 md:space-y-4 relative z-20">
                                    <h3 className="text-xl md:text-4xl font-[1000] uppercase tracking-tight text-brand-dark group-hover/card:text-brand-green transition-colors duration-500 leading-tight italic">
                                        {reason.title}
                                    </h3>
                                    <p className="text-brand-dark/40 text-[10px] md:text-xl font-bold leading-tight md:leading-relaxed transition-colors duration-500 group-hover/card:text-brand-dark/70">
                                        {reason.description}
                                    </p>
                                </div>

                                {reason.image && (
                                    <>
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-light via-brand-light/40 to-transparent" />
                                        <img
                                            src={reason.image}
                                            alt={reason.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover/card:opacity-30 transition-all duration-1000 group-hover/card:scale-110"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fade Side Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
            </div>

            {/* Bottom Status Tag */}
            <div className="flex flex-col items-center mt-12 px-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-dark/20 italic">Прокрутите для ознакомления</p>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default WhyUs;
