const ServicesSection = () => {
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
        <section className="py-4 md:py-6 bg-white relative" id="services">

            {/* Decorative background removed */}

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 relative z-30 mb-5 md:mb-6 text-center">
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
            <div className="max-w-6xl mx-auto px-6 mb-4 md:mb-8">
                <div className="services-grid grid grid-cols-2 gap-4 md:gap-6">
                    {mainServices.map((service) => (
                        <div
                            key={service.id}
                            className="service-card-item group relative rounded-3xl bg-white border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="relative h-28 md:h-32 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 text-[9px] font-bold tracking-[0.18em] uppercase text-brand-dark">
                                    {service.id}
                                </span>
                            </div>
                            <div className="flex-1 px-3.5 md:px-4 py-3 md:py-4 flex flex-col gap-1.5 md:gap-2">
                                <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-[0.16em] text-brand-dark leading-snug">
                                    {service.title}
                                </h3>
                                <p className="text-[10px] md:text-[11px] text-brand-dark/60 leading-snug">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Специализированные услуги — карусель */}
            <div className="max-w-6xl mx-auto px-6 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark/40 text-center mb-4">
                    Специализированные услуги
                </p>
            </div>
            {/* Marquee Section */}
            <div className="marquee-section relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="overflow-x-auto pb-4 md:pb-6">
                    <div className="flex gap-4 md:gap-5 px-6 select-none">
                        {allServices.map((service, i) => (
                            <div
                                key={`${service.id}-${i}`}
                                className="marquee-card-item flex-shrink-0 w-[160px] md:w-[220px] h-[210px] md:h-[280px] relative rounded-[18px] md:rounded-[26px] overflow-hidden group cursor-pointer bg-brand-dark"
                            >
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="service-img w-full h-full object-cover opacity-100 transition-all duration-500 group-hover:scale-102"
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
