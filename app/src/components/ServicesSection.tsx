import { useInView } from '../hooks/useInView';

const ServicesSection = () => {
    const [sectionRef, inView] = useInView();
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

    return (
        <section ref={sectionRef} className={`py-3 md:py-10 bg-white relative overflow-hidden ${inView ? 'in-view' : ''}`} id="services">
            <div className="pointer-events-none absolute left-[6%] top-16 h-28 w-28 rounded-full bg-brand-green/7 blur-3xl animate-pulse-glow" />
            <div className="pointer-events-none absolute right-[8%] bottom-20 h-32 w-32 rounded-full bg-brand-dark/5 blur-3xl animate-bob-soft-alt" />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 relative z-30 mb-4 md:mb-6 text-center reveal-on-scroll" style={{ animationDelay: '0s' }}>
                <h2 className="section-header text-brand-dark mb-2 overflow-visible !text-2xl md:!text-4xl lg:!text-5xl">
                    <span className="services-title-word inline-block">НАШИ</span>{' '}
                    <span className="services-title-word inline-block">
                        <span className="relative inline-block">
                            <span className="relative inline-block overflow-hidden px-1 md:px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(143,198,64,0.2)]">УСЛУГИ</span>
                            </span>
                        </span>
                    </span>
                </h2>
                <p className="services-subtitle text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-brand-secondary">
                    СОЗДАЕМ ЧИСТОТУ ПО ВСЕМУ КАЗАХСТАНУ
                </p>
            </div>

            {/* 4 главных вида услуг — сетка */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4 md:mb-6">
                <div className="services-grid grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                    {mainServices.map((service, i) => (
                        <div
                            key={service.id}
                            className="service-card-item group relative rounded-[20px] md:rounded-[28px] bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-[3.8/5] reveal-on-scroll"
                            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                        >
                            <div className="relative flex-[0.7] md:flex-[0.85] min-h-0 overflow-hidden">
                                <div className="absolute inset-y-0 -left-1/3 z-20 w-1/3 bg-gradient-to-r from-transparent via-white/75 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${i % 2 === 0 ? 'animate-bob-soft' : 'animate-bob-soft-alt'}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40" />
                                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-white/90 text-[7px] md:text-[8px] font-bold tracking-[0.1em] uppercase text-brand-dark">
                                    {service.id}
                                </span>
                            </div>
                            <div className="shrink-0 px-2.5 md:px-3.5 py-2.5 md:py-3.5 flex flex-col gap-1 md:gap-1.5 border-t border-black/5 min-h-[55px] md:min-h-[80px]">
                                <h3 className="text-[9px] md:text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.12em] text-brand-dark leading-tight md:leading-snug">
                                    {service.title}
                                </h3>
                                <p className="text-[8px] md:text-[9.5px] lg:text-[10.5px] text-brand-dark/50 leading-tight line-clamp-2">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Специализированные услуги — карусель */}
            <div className="max-w-7xl mx-auto px-6 mb-2">
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-brand-dark/30 text-center mb-2 md:mb-4">
                    Дополнительные услуги
                </p>
            </div>
            {/* Marquee Section */}
            <div className="marquee-section relative w-full mb-6 md:mb-10">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="overflow-hidden pb-4 md:pb-6 reveal-on-scroll-right" style={{ animationDelay: '0.1s' }}>
                    <div className="animate-marquee select-none">
                        {allServices.map((service, i) => (
                            <div
                                key={`${service.id}-${i}`}
                                className="marquee-card-item flex-shrink-0 w-[160px] md:w-[220px] h-[210px] md:h-[280px] relative rounded-[18px] md:rounded-[26px] overflow-hidden group cursor-pointer bg-brand-dark mr-4 md:mr-5"
                            >
                                <div className="absolute inset-y-0 -left-1/3 z-20 w-1/3 bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className={`service-img w-full h-full object-cover opacity-100 transition-all duration-500 group-hover:scale-110 ${i % 2 === 0 ? 'animate-bob-soft' : 'animate-bob-soft-alt'}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                <div className="absolute bottom-3 left-3 max-w-[92%]">
                                    <h4 className="text-white font-bold uppercase text-[10px] md:text-xs leading-tight drop-shadow-md mb-1">
                                        {service.title}
                                    </h4>
                                    <p className="text-white/60 text-[9px] line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
