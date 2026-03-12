import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ShieldCheck, Zap, Sparkles, ArrowUpRight, Droplets, Mountain, Flower2, Bug, Settings, Snowflake, Coffee, Waves } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: "01",
        title: "Базовая Уборка",
        desc: "Ежедневное поддержание чистоты помещений для комфортной рабочей среды.",
        image: "/services/base.png",
        icon: <Sparkles size={32} />
    },
    {
        id: "02",
        title: "Поддерживающая",
        desc: "Регулярная уборка в течение дня для поддержания идеального порядка.",
        image: "/services/support.png",
        icon: <Clock size={32} />
    },
    {
        id: "03",
        title: "Генеральная",
        desc: "Глубокая очистка всех зон помещения с максимальной детализацией.",
        image: "/services/general.png",
        icon: <ShieldCheck size={32} />
    },
    {
        id: "04",
        title: "После Строя",
        desc: "Профессиональное удаление строительной пыли, мусора и следов ремонта.",
        image: "/services/after_construction.png",
        icon: <Zap size={32} />
    },
    {
        id: "05",
        title: "Мойка Витражей",
        desc: "Безопасная очистка стеклянных поверхностей и осветительных приборов.",
        image: "/services/Мойка витражей.png",
        icon: <Droplets size={32} />
    },
    {
        id: "06",
        title: "Высотные Работы",
        desc: "Специализированные услуги на высоте с применением промышленного альпинизма.",
        image: "/services/Высотные работы.png",
        icon: <Mountain size={32} />
    },
    {
        id: "07",
        title: "Флористы",
        desc: "Профессиональный уход за зелёными насаждениями внутри и вокруг здания.",
        image: "/services/Флористы.png",
        icon: <Flower2 size={32} />
    },
    {
        id: "08",
        title: "Дезинсекция",
        desc: "Эффективная дезинсекция и дератизация с гарантированным результатом.",
        image: "/services/обработка от насекомых.png",
        icon: <Bug size={32} />
    },
    {
        id: "09",
        title: "Инженерные Услуги",
        desc: "Техническое обслуживание инженерных систем объекта.",
        image: "/services/инжерерные услуги.png",
        icon: <Settings size={32} />
    },
    {
        id: "10",
        title: "Уборка Снега",
        desc: "Оперативная очистка территории от снега и наледи в зимний период.",
        image: "/services/уборка снега.png",
        icon: <Snowflake size={32} />
    },
    {
        id: "11",
        title: "Кофеледи",
        desc: "Обслуживание кофейных точек и поддержание чистоты барной зоны.",
        image: "/services/кофеледи.png",
        icon: <Coffee size={32} />
    },
    {
        id: "12",
        title: "Химчистка",
        desc: "Бережная чистка мебели, ковров и текстиля профессиональными средствами.",
        image: "/services/химчистка.png",
        icon: <Waves size={32} />
    }
];

const ServicesPage = () => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.to(".page-title", {
            y: 100,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".services-hero-reveal",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                }
            );
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20">
            <main className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-32 relative">
                        <span className="services-hero-reveal text-brand-green font-bold tracking-[0.4em] uppercase text-sm block mb-4">
                            Наша Экспертиза
                        </span>
                        <h1 className="page-title text-[15vw] leading-[0.8] font-bold tracking-tighter uppercase text-black mix-blend-multiply opacity-[0.03] select-none pointer-events-none absolute top-0 left-0 -z-10 blur-sm">
                            Services
                        </h1>
                        <h2 className="services-hero-reveal text-5xl md:text-8xl font-bold uppercase leading-none mb-8 relative z-10 text-brand-dark">
                            Услуги <br />
                            <span className="text-brand-green">Для Бизнеса</span>
                        </h2>
                    </div>

                    {/* Services Grid */}
                    <div className="services-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
                        {services.map((s) => (
                            <div key={s.id} className="service-card group min-h-[220px] rounded-[24px] bg-white border border-black/5 hover:border-brand-green/30 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green transition-colors duration-500 group-hover:bg-brand-green group-hover:text-white">
                                        {s.icon}
                                    </div>
                                    <span className="text-3xl font-bold text-black/[0.05] transition-colors select-none">
                                        {s.id}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-base md:text-lg font-bold uppercase mb-1 md:mb-2 leading-snug md:leading-tight text-brand-dark group-hover:text-brand-green transition-colors">
                                        {s.title}
                                    </h3>
                                    <p className="text-xs text-black/60 font-medium leading-relaxed line-clamp-3">
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Footer */}
                    <div className="mt-32 p-10 md:p-16 rounded-[2rem] bg-brand-green relative overflow-hidden text-center shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8 leading-tight text-white max-w-3xl">
                                "Сложный" объект? <br />
                                <span className="text-brand-dark/40">Мы любим вызовы.</span>
                            </h2>
                            <button className="bg-brand-dark text-white px-10 py-5 rounded-xl text-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                                Рассчитать смету
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ServicesPage;
