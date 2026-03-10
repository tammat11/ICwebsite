import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    interface Service {
        id: string;
        title: string;
        description: string;
        image: string;
    }

    const progressRef = useRef<HTMLDivElement>(null);

    const mainServices: Service[] = [
        {
            id: "01",
            title: "БАЗОВАЯ УБОРКА",
            description: "Ежедневное поддержание чистоты помещений для комфортной рабочей среды.",
            image: "https://images.unsplash.com/photo-1581578731548-c64695ce6952?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "02",
            title: "ПОДДЕРЖИВАЮЩАЯ УБОРКА",
            description: "Регулярная уборка в течение дня для поддержания идеального порядка.",
            image: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "03",
            title: "ГЕНЕРАЛЬНАЯ УБОРКА",
            description: "Глубокая очистка всех зон помещения с максимальной детализацией.",
            image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "04",
            title: "ПОСЛЕСТРОИТЕЛЬНАЯ УБОРКА",
            description: "Профессиональное удаление строительной пыли, мусора и следов ремонта.",
            image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800"
        },
    ];

    const specializedServices: Service[] = [
        {
            id: "05",
            title: "МОЙКА ВИТРАЖЕЙ И СВЕТИЛЬНИКОВ",
            description: "Безопасная очистка стеклянных поверхностей и осветительных приборов на любой высоте.",
            image: "https://images.unsplash.com/photo-1562234135-23c8801d9f0b?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "06",
            title: "ВЫСОТНЫЕ РАБОТЫ",
            description: "Специализированные услуги на высоте с применением промышленного альпинизма.",
            image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "07",
            title: "ФЛОРИСТЫ И САДОВНИКИ",
            description: "Профессиональный уход за зелёными насаждениями внутри и вокруг здания.",
            image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "08",
            title: "ОБРАБОТКА ОТ НАСЕКОМЫХ И ГРЫЗУНОВ",
            description: "Эффективная дезинсекция и дератизация с гарантированным результатом.",
            image: "https://images.unsplash.com/photo-1587349193181-42099309605d?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "09",
            title: "ИНЖЕНЕРНЫЕ УСЛУГИ",
            description: "Техническое обслуживание инженерных систем для бесперебойной работы объекта.",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "10",
            title: "УБОРКА СНЕГА",
            description: "Оперативная очистка территории от снега и наледи в зимний период.",
            image: "https://images.unsplash.com/photo-1418985991508-e473a24692c1?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "11",
            title: "КОФЕЛЕДИ",
            description: "Обслуживание кофейных точек и поддержание чистоты барной зоны.",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "12",
            title: "ХИМЧИСТКА",
            description: "Бережная чистка мебели, ковров и текстиля профессиональными средствами.",
            image: "https://images.unsplash.com/photo-1516055247702-090c4cb41d3c?auto=format&fit=crop&q=80&w=800"
        }
    ];

    const allServices = [...specializedServices, ...specializedServices, ...specializedServices];

    useEffect(() => {
        const slider = marqueeRef.current;
        const progressBar = progressRef.current;
        let animationId: number;

        const animate = () => {
            if (slider) {
                if (!isDragging.current) {
                    slider.scrollLeft += 0.5; // Auto-scroll speed

                    // Reset scroll for infinite loop
                    if (slider.scrollLeft >= (slider.scrollWidth / 2)) {
                        slider.scrollLeft = 0;
                    }
                }

                // Update Progress Bar
                if (progressBar) {
                    const maxScroll = slider.scrollWidth / 2;
                    const currentScroll = slider.scrollLeft % maxScroll;
                    const progress = (currentScroll / maxScroll) * 100;
                    progressBar.style.height = `${progress}%`;
                }
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        const ctx = gsap.context(() => {
            // Title Reveal
            gsap.from(".main-header-reveal", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%"
                }
            });

            // Cards Reveal
            gsap.from(".service-card-item", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".services-grid",
                    start: "top 85%"
                }
            });

        }, sectionRef);

        return () => {
            ctx.revert();
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <section ref={sectionRef} className="py-6 bg-white relative overflow-hidden" id="services">

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 relative z-30 mb-8 text-center">
                <div className="section-tag mb-4 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    <span>Наши компетенции</span>
                </div>
                <h2 className="section-header main-header-reveal text-brand-dark mb-4 overflow-visible">
                    НАШИ <br />
                    <span className="relative inline-block">
                        <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                            <span className="text-brand-green drop-shadow-[0_0_40px_rgba(131,182,67,0.2)]">УСЛУГИ</span>
                        </span>
                    </span>
                </h2>
                <p className="main-header-reveal text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-brand-dark/60">
                    СОЗДАЕМ ЧИСТОТУ ПО ВСЕМУ КАЗАХСТАНУ
                </p>
            </div>

            {/* Main Grid */}
            <div className="max-w-[1400px] mx-auto px-6 services-grid mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mainServices.map((service) => (
                        <div
                            key={service.id}
                            className={`service-card-item group relative h-[450px] overflow-hidden rounded-[25px] cursor-pointer bg-brand-dark shadow-2xl transition-transform duration-500 hover:-translate-y-2`}
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-xl font-bold text-white uppercase leading-tight mb-2 drop-shadow-md">
                                    {service.title}
                                </h3>

                                <p className="text-xs text-white/80 font-medium leading-snug line-clamp-3 mb-2">
                                    {service.description}
                                </p>

                                <div className="flex justify-end mt-4">
                                    <span className="text-brand-green text-3xl font-black">{service.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Secondary Header - More compact area */}
            <div className="max-w-[1400px] mx-auto px-6 mb-8 relative flex justify-center items-center opacity-60">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-[2px] h-32 bg-brand-dark/5 rounded-full overflow-hidden relative">
                        <div
                            ref={progressRef}
                            className="w-full absolute bottom-0 bg-gradient-to-t from-brand-green to-emerald-400 h-0 shadow-[0_0_10px_rgba(131,182,67,0.5)] transition-all duration-100 ease-linear"
                        />
                    </div>
                </div>
            </div>

            {/* Marquee Section */}
            <div className="relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div
                    ref={marqueeRef}
                    className="flex overflow-x-auto gap-4 px-6 no-scrollbar cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={(e) => {
                        isDragging.current = true;
                        const slider = marqueeRef.current;
                        if (!slider) return;
                        slider.style.cursor = 'grabbing';

                        const startX = e.pageX - slider.offsetLeft;
                        const scrollLeft = slider.scrollLeft;

                        const onMouseMove = (e: MouseEvent) => {
                            if (!isDragging.current) return;
                            e.preventDefault();
                            const x = e.pageX - slider.offsetLeft;
                            const walk = (x - startX) * 1.5;
                            slider.scrollLeft = scrollLeft - walk;
                        };

                        const onMouseUp = () => {
                            isDragging.current = false;
                            slider.style.cursor = 'grab';
                            window.removeEventListener('mousemove', onMouseMove);
                            window.removeEventListener('mouseup', onMouseUp);
                        };

                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                    }}
                >
                    {allServices.map((service, i) => (
                        <div
                            key={`${service.id}-${i}`}
                            className="flex-shrink-0 w-[220px] md:w-[260px] h-[300px] md:h-[350px] relative rounded-[15px] overflow-hidden group cursor-pointer bg-brand-dark"
                        >
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6 max-w-[90%]">
                                <h4 className="text-white font-bold uppercase text-base leading-tight drop-shadow-md mb-2">
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
        </section>
    );
};

export default ServicesSection;
