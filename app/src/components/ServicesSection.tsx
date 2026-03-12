import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    interface Service {
        id: string;
        title: string;
        description: string;
        image: string;
    }

    const mainServices: Service[] = [
        {
            id: "01",
            title: "БАЗОВАЯ УБОРКА",
            description: "Ежедневное поддержание чистоты помещений для комфортной рабочей среды.",
            image: "/services/base.png"
        },
        {
            id: "02",
            title: "ПОДДЕРЖИВАЮЩАЯ УБОРКА",
            description: "Регулярная уборка в течение дня для поддержания идеального порядка.",
            image: "/services/support.png"
        },
        {
            id: "03",
            title: "ГЕНЕРАЛЬНАЯ УБОРКА",
            description: "Глубокая очистка всех зон помещения с максимальной детализацией.",
            image: "/services/general.png"
        },
        {
            id: "04",
            title: "ПОСЛЕСТРОИТЕЛЬНАЯ УБОРКА",
            description: "Профессиональное удаление строительной пыли, мусора и следов ремонта.",
            image: "/services/after_construction.png"
        },
    ];

    const specializedServices: Service[] = [
        {
            id: "05",
            title: "МОЙКА ВИТРАЖЕЙ И СВЕТИЛЬНИКОВ",
            description: "Безопасная очистка стеклянных поверхностей и осветительных приборов на любой высоте.",
            image: "/services/Мойка витражей.png"
        },
        {
            id: "06",
            title: "ВЫСОТНЫЕ РАБОТЫ",
            description: "Специализированные услуги на высоте с применением промышленного альпинизма.",
            image: "/services/Высотные работы.png"
        },
        {
            id: "07",
            title: "ФЛОРИСТЫ И САДОВНИКИ",
            description: "Профессиональный уход за зелёными насаждениями внутри и вокруг здания.",
            image: "/services/Флористы.png"
        },
        {
            id: "08",
            title: "ОБРАБОТКА ОТ НАСЕКОМЫХ И ГРЫЗУНОВ",
            description: "Эффективная дезинсекция и дератизация с гарантированным результатом.",
            image: "/services/обработка от насекомых.png"
        },
        {
            id: "09",
            title: "ИНЖЕНЕРНЫЕ УСЛУГИ",
            description: "Техническое обслуживание инженерных систем для бесперебойной работы объекта.",
            image: "/services/инжерерные услуги.png"
        },
        {
            id: "10",
            title: "УБОРКА СНЕГА",
            description: "Оперативная очистка территории от снега и наледи в зимний период.",
            image: "/services/уборка снега.png"
        },
        {
            id: "11",
            title: "КОФЕЛЕДИ",
            description: "Обслуживание кофейных точек и поддержание чистоты барной зоны.",
            image: "/services/кофеледи.png"
        },
        {
            id: "12",
            title: "ХИМЧИСТКА",
            description: "Бережная чистка мебели, ковров и текстиля профессиональными средствами.",
            image: "/services/химчистка.png"
        }
    ];

    const allServices = [...specializedServices, ...specializedServices];

    useEffect(() => {
        const ctx = gsap.context(() => {

            // === HEADER: Clip-path sliding reveal ===
            gsap.fromTo(".services-tag",
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 110%" }
                }
            );

            gsap.fromTo(".services-title-word",
                { clipPath: "inset(100% 0% 0% 0%)", y: 60 },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    y: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "expo.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
                }
            );

            gsap.fromTo(".services-subtitle",
                { opacity: 0, letterSpacing: "0.8em" },
                {
                    opacity: 1, letterSpacing: "0.4em", duration: 1, ease: "power3.out", delay: 0.3,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
                }
            );

            // === CARDS: Each comes from a different direction ===
            const cards = gsap.utils.toArray<HTMLElement>(".service-card-item");
            const directions = [
                { x: -80, y: 60, rotate: -6 },
                { x: 0, y: 100, rotate: 0 },
                { x: 80, y: 60, rotate: 6 },
                { x: 0, y: 80, rotate: -3 },
            ];

            cards.forEach((card, i) => {
                const dir = directions[i % directions.length];
                gsap.fromTo(card,
                    { x: dir.x, y: dir.y, opacity: 0, rotate: dir.rotate, scale: 0.92 },
                    {
                        x: 0, y: 0, opacity: 1, rotate: 0, scale: 1,
                        duration: 0.4,
                        delay: i * 0.04,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: ".services-grid",
                            start: "top 85%",
                        }
                    }
                );
            });

            // === Медленное автодвижение карусели услуг влево ===
            if (marqueeRef.current) {
                gsap.to(marqueeRef.current, {
                    xPercent: -50,
                    duration: 60,
                    ease: "none",
                    repeat: -1,
                });
            }

            // === REFINED ARCHES ===
            // Decorative background removed

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-6 bg-white relative" id="services">

            {/* Decorative background removed */}

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 relative z-30 mb-8 text-center">
                <h2 className="section-header text-brand-dark mb-4 overflow-visible">
                    <span className="services-title-word inline-block">НАШИ</span>{' '}
                    <span className="services-title-word inline-block">
                        <span className="relative inline-block">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(143,198,64,0.2)]">УСЛУГИ</span>
                            </span>
                        </span>
                    </span>
                </h2>
                <p className="services-subtitle text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-brand-secondary">
                    СОЗДАЕМ ЧИСТОТУ ПО ВСЕМУ КАЗАХСТАНУ
                </p>
            </div>

            {/* 4 главных вида услуг */}
            <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-14">
                <div className="services-grid grid grid-cols-2 gap-4 md:gap-6">
                    {mainServices.map((service) => (
                        <div
                            key={service.id}
                            className="service-card-item group relative rounded-2xl md:rounded-3xl overflow-hidden bg-brand-dark aspect-[3/4] min-h-[200px] md:min-h-[280px]"
                        >
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <h3 className="text-white font-bold uppercase text-sm md:text-base leading-tight mb-1.5 md:mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-white/70 text-[10px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-3">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Специализированные услуги — карусель */}
            <div className="max-w-7xl mx-auto px-6 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark/40 text-center mb-4">
                    Специализированные услуги
                </p>
            </div>
            {/* Marquee Section */}
            <div className="marquee-section relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="overflow-x-auto pb-4 md:pb-6">
                    <div
                        ref={marqueeRef}
                        className="flex gap-3 md:gap-4 px-6 select-none will-change-transform"
                    >
                        {allServices.map((service, i) => (
                            <div
                                key={`${service.id}-${i}`}
                                className="marquee-card-item flex-shrink-0 w-[160px] md:w-[240px] h-[220px] md:h-[330px] relative rounded-[24px] md:rounded-[40px] overflow-hidden group cursor-pointer bg-brand-dark"
                            >
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="service-img w-full h-full object-cover opacity-100 transition-all duration-500 group-hover:scale-102"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                <div className="absolute bottom-4 left-4 max-w-[92%]">
                                    <h4 className="text-white font-bold uppercase text-sm md:text-base leading-tight drop-shadow-md mb-1.5 md:mb-2">
                                        {service.title}
                                    </h4>
                                    <p className="text-white/60 text-[10px] line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
