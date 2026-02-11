import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Settings2, Building2, ShieldCheck, Coffee, Truck, Box, Droplets } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const services = [
        {
            title: "КОМПЛЕКСНАЯ УБОРКА",
            description: "Профессиональный клининг любой сложности: от ежедневной уборки офисов до спецработ после стройки.",
            icon: <Droplets className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1581578731548-c64695ce6952?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-brand-green/10"
        },
        {
            title: "ФАСАДНЫЙ И ВЫСОТНЫЙ СЕРВИС",
            description: "Мойка фасадов, витражей и окон на любой высоте. Промышленный альпинизм и чистка водостоков.",
            icon: <Building2 className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-blue-500/5"
        },
        {
            title: "ТЕХНИЧЕСКИЙ СЕРВИС",
            description: "Инженерное обслуживание, чистка кондиционеров, вентиляционных каналов и откачка септиков.",
            icon: <Settings2 className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1581094288338-2314dddb7edd?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-orange-500/5"
        },
        {
            title: "СПЕЦИАЛИЗИРОВАННАЯ ХИМЧИСТКА",
            description: "Роторная чистка твердых покрытий, химчистка мебели, ковроланов и перегородок.",
            icon: <Zap className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-purple-500/5"
        },
        {
            title: "ОБСЛУЖИВАНИЕ ТЕРРИТОРИИ",
            description: "Круглогодичный уход: вывоз снега, уборка мусора (ТБО), чистка крыш от наледи и усиление.",
            icon: <Truck className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1510563800743-aed236490d08?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-cyan-500/5"
        },
        {
            title: "ЭКОЛОГИЧЕСКАЯ БЕЗОПАСНОСТЬ",
            description: "Профессиональная дезинфекция, дезинсекция и дератизация для защиты вашего здоровья и бизнеса.",
            icon: <ShieldCheck className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-emerald-500/5"
        },
        {
            title: "СНАБЖЕНИЕ И МАТЕРИАЛЫ",
            description: "Комплексная поставка расходных материалов, средств гигиены и грязезащитных покрытий.",
            icon: <Box className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-indigo-500/5"
        },
        {
            title: "КОФЕ И КОРПОРАТИВНЫЙ СЕРВИС",
            description: "Услуги кофе-леди, поставка воды, бакалеи и флористическое оформление пространств.",
            icon: <Coffee className="w-8 h-8" />,
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200",
            accent: "bg-amber-500/5"
        }
    ];

    // Infinite feel
    const infiniteServices = [...services, ...services, ...services, ...services];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const totalItems = services.length;
        const getCardWidth = () => {
            const firstCard = scrollContainer.querySelector('.service-card-wrapper');
            return firstCard ? firstCard.getBoundingClientRect().width + 24 : (window.innerWidth > 768 ? 474 : 304);
        };

        const cardTotal = getCardWidth();
        const middleOffset = totalItems * 1.5 * cardTotal;

        scrollContainer.scrollLeft = middleOffset - (window.innerWidth / 2 - (cardTotal - 24) / 2);

        const ctx = gsap.context(() => {
            // 1. Cinematic Title Reveal
            const lines = gsap.utils.toArray<HTMLElement>(".services-title-line");
            lines.forEach((line, i) => {
                gsap.from(line, {
                    x: i === 0 ? -100 : 100,
                    skewX: i === 0 ? -20 : 20,
                    opacity: 0,
                    filter: "blur(20px)",
                    duration: 1.5,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: line,
                        start: "top 115%",
                    }
                });
            });

            // 2. Cards Reveal: Entire Row slides from right
            gsap.from(scrollRef.current, {
                x: 500,
                opacity: 0,
                duration: 1.8,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".service-cards-container",
                    start: "top 110%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-12 md:py-16 bg-white relative overflow-hidden" id="services">
            <div className="max-w-7xl mx-auto px-6 relative z-30 mb-8 md:mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-green">Our Capabilities</span>
                </div>
                <h2 className="text-[clamp(48px,9vw,115px)] font-[1000] uppercase italic leading-[0.8] tracking-tighter text-brand-dark overflow-visible">
                    <div className="services-title-line block">СТАНДАРТ</div>
                    <div className="services-title-line block text-brand-green">ПРЕВОСХОДСТВА</div>
                </h2>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="relative w-full group service-cards-container">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 py-6 md:py-10 snap-x snap-mandatory no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {infiniteServices.map((service, i) => (
                        <div
                            key={i}
                            className="service-card-wrapper flex-shrink-0 w-[280px] md:w-[420px] snap-center"
                        >
                            <div className="group/card relative overflow-hidden rounded-[24px] md:rounded-[40px] border border-black/[0.04] bg-brand-light h-[380px] md:h-[550px] transition-all duration-700 hover:border-brand-green/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] flex flex-col justify-end p-6 md:p-10 whitespace-normal">

                                {service.image && (
                                    <>
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover/card:opacity-50 transition-all duration-[1.5s] group-hover/card:scale-110"
                                        />
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-light via-brand-light/60 to-transparent" />
                                    </>
                                )}

                                <div className={`w-14 h-14 rounded-2xl md:w-20 md:h-20 md:rounded-3xl ${service.accent} flex items-center justify-center text-brand-green mb-5 md:mb-8 transition-all duration-700 group-hover/card:scale-110 group-hover/card:bg-brand-green group-hover/card:text-white relative z-20 shadow-sm`}>
                                    {service.icon}
                                </div>

                                <div className="space-y-4 relative z-20">
                                    <h3 className="text-2xl md:text-4xl font-[1000] uppercase tracking-tight text-brand-dark group-hover/card:text-brand-green transition-colors duration-500 leading-tight italic">
                                        {service.title}
                                    </h3>
                                    <p className="text-brand-dark/70 text-base md:text-lg font-bold leading-snug transition-colors duration-500 group-hover/card:text-brand-dark/90">
                                        {service.description}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Fade Side Masks */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
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

export default ServicesSection;
