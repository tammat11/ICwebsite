import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ShieldCheck, Zap, Sparkles, ArrowUpRight, Droplets, Mountain, Flower2, Bug, Settings, Snowflake, Coffee, Waves } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: "01",
        title: "Базовая Уборка",
        eng: "Basic Cleaning",
        desc: "Ежедневное поддержание чистоты помещений для комфортной рабочей среды.",
        time: "1.5-2 часа",
        features: ["Обеспыливание", "Влажная уборка", "Вынос мусора", "Санузлы"],
        icon: <Sparkles size={48} />,
        image: "/services/Базовая уборка.png"
    },
    {
        id: "02",
        title: "Поддерживающая",
        eng: "Maintenance",
        desc: "Регулярная уборка в течение дня для поддержания идеального порядка.",
        time: "6-8 часов",
        features: ["Ресепшн", "Переговорные", "Кухня", "Дежурство"],
        icon: <Clock size={48} />,
        image: "/services/Поддерживающася.png"
    },
    {
        id: "03",
        title: "Генеральная",
        eng: "Deep Cleaning",
        desc: "Глубокая очистка всех зон помещения с максимальной детализацией.",
        time: "12-24 часов",
        features: ["Химчистка", "Мойка окон", "Дезинфекция", "Сложные пятна"],
        icon: <ShieldCheck size={48} />,
        image: "/services/Генеральная.png"
    },
    {
        id: "04",
        title: "После Строя",
        eng: "Post Construction",
        desc: "Профессиональное удаление строительной пыли, мусора и следов ремонта.",
        time: "1-3 дня",
        features: ["Спецтехника", "Промышленный пылесос", "Роторная чистка", "Вывоз мусора"],
        icon: <Zap size={48} />,
        image: "/services/Послестрой.png"
    },
    {
        id: "05",
        title: "Мойка Витражей",
        eng: "Window Cleaning",
        desc: "Безопасная очистка стеклянных поверхностей и осветительных приборов на любой высоте.",
        time: "от 3 часов",
        features: ["Витражи", "Светильники", "Безопасность", "Чистота"],
        icon: <Droplets size={48} />,
        image: "/services/Мойка витражей.png"
    },
    {
        id: "06",
        title: "Высотные Работы",
        eng: "High-Altitude Works",
        desc: "Специализированные услуги на высоте с применением промышленного альпинизма.",
        time: "от 4 часов",
        features: ["Альпинизм", "Фасады", "Безопасность", "Сложный доступ"],
        icon: <Mountain size={48} />,
        image: "/services/Высотные работы.png"
    },
    {
        id: "07",
        title: "Флористы",
        eng: "Florists & Gardeners",
        desc: "Профессиональный уход за зелёными насаждениями внутри и вокруг здания.",
        time: "График",
        features: ["Растения", "Полив", "Уход", "Ландшафт"],
        icon: <Flower2 size={48} />,
        image: "/services/Флористы.png"
    },
    {
        id: "08",
        title: "Дезинсекция",
        eng: "Pest Control",
        desc: "Эффективная дезинсекция и дератизация с гарантированным результатом.",
        time: "от 2 часов",
        features: ["Грызуны", "Насекомые", "Гарантия", "Безопасно"],
        icon: <Bug size={48} />,
        image: "/services/обработка от насекомых.png"
    },
    {
        id: "09",
        title: "Инженерные Услуги",
        eng: "Engineering Services",
        desc: "Техническое обслуживание инженерных систем для бесперебойной работы объекта.",
        time: "24/7",
        features: ["ТО", "Ремонт", "Системы", "Мониторинг"],
        icon: <Settings size={48} />,
        image: "/services/инжерерные услуги.png"
    },
    {
        id: "10",
        title: "Уборка Снега",
        eng: "Snow Removal",
        desc: "Оперативная очистка территории от снега и наледи в зимний период.",
        time: "Срочно",
        features: ["Спецтехника", "Вывоз", "Чистота", "Оперативность"],
        icon: <Snowflake size={48} />,
        image: "/services/уборка снега.png"
    },
    {
        id: "11",
        title: "Кофеледи",
        eng: "Coffee-Lady",
        desc: "Обслуживание кофейных точек и поддержание чистоты барной зоны.",
        time: "График",
        features: ["Сервис", "Кофе", "Чистота", "Забота"],
        icon: <Coffee size={48} />,
        image: "/services/кофеледи.png"
    },
    {
        id: "12",
        title: "Химчистка",
        eng: "Dry Cleaning",
        desc: "Бережная чистка мебели, ковров и текстиля профессиональными средствами.",
        time: "от 4 часов",
        features: ["Мебель", "Ковры", "Текстиль", "Пятновыводка"],
        icon: <Waves size={48} />,
        image: "/services/химчистка.png"
    }
];

const ServicesPage = () => {
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

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20">
            <main className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-32 relative">
                        <span className="text-brand-green font-bold tracking-[0.4em] uppercase text-sm block mb-4">
                            Наша Экспертиза
                        </span>
                        <h1 className="page-title text-[15vw] leading-[0.8] font-bold tracking-tighter uppercase text-black mix-blend-multiply opacity-[0.03] select-none pointer-events-none absolute top-0 left-0 -z-10 blur-sm">
                            Services
                        </h1>
                        <h2 className="text-5xl md:text-8xl font-bold uppercase leading-none mb-8 relative z-10 text-brand-dark">
                            Услуги <br />
                            <span className="text-brand-green">Для Бизнеса</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-brand-dark/40 max-w-2xl font-medium leading-relaxed">
                            Мы не просто моем полы. Мы создаем экосистему чистоты, которая работает на репутацию вашего бренда 24/7.
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {services.map((s) => (
                            <div key={s.id} className="service-card group p-6 md:p-8 rounded-[30px] md:rounded-[40px] bg-white border border-black/5 hover:bg-brand-green hover:border-transparent transition-all duration-500 relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-brand-green/20">

                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex justify-between items-start mb-8 md:mb-14 relative z-10">
                                    <span className="text-[clamp(4rem,15vw,6rem)] font-bold text-black/[0.03] group-hover:text-white/20 transition-colors select-none leading-none">
                                        {s.id}
                                    </span>
                                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-black/[0.03] flex items-center justify-center text-brand-green group-hover:bg-white group-hover:text-brand-green transition-colors duration-500 border border-black/5 shrink-0 shadow-sm">
                                        <div className="scale-75 md:scale-100 flex items-center justify-center">
                                            {s.icon}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-[clamp(1.75rem,8vw,3rem)] font-bold uppercase mb-3 leading-[0.9] text-brand-dark group-hover:text-white transition-colors">
                                        {s.title}
                                    </h3>
                                    <span className="block text-xs font-bold tracking-[0.2em] text-black/20 mb-8 group-hover:text-white/60 uppercase">
                                        {s.eng}
                                    </span>

                                    <p className="text-lg md:text-xl text-black/50 mb-10 group-hover:text-white font-medium leading-relaxed max-w-md">
                                        {s.desc}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-2 mb-10">
                                        {s.features.map((f, fk) => (
                                            <div key={fk} className="flex items-center gap-3 text-black/40 group-hover:text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors min-w-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-green group-hover:bg-white transition-colors shrink-0" />
                                                <span className="truncate sm:whitespace-normal">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-black/5 group-hover:border-white/20 flex justify-between items-end gap-4">
                                        <div className="flex flex-col gap-1 text-black/20 group-hover:text-white font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                                            <span>Время выполнения</span>
                                            <span className="text-base md:text-lg text-brand-dark group-hover:text-white">{s.time}</span>
                                        </div>
                                        <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/10 bg-black/[0.02] flex items-center justify-center group-hover:bg-white group-hover:text-brand-dark transition-all scale-100 group-hover:scale-110 shrink-0 shadow-sm">
                                            <ArrowUpRight size={20} className="md:w-6 md:h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Footer */}
                    <div className="mt-32 p-12 md:p-24 rounded-[3rem] bg-brand-green relative overflow-hidden text-center shadow-2xl shadow-brand-green/40">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-7xl font-bold uppercase mb-8 leading-tight text-white drop-shadow-lg">
                                "Сложный" объект? <br />
                                <span className="text-brand-dark/20">Мы любим вызовы.</span>
                            </h2>
                            <button className="bg-brand-dark text-white px-12 py-6 rounded-2xl text-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
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
