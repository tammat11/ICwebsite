import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Clock, ShieldCheck, Zap, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: "01",
        title: "Базовая Уборка",
        eng: "Basic Cleaning",
        desc: "Комплексная уборка до или после рабочего дня. Идеально для небольших офисов.",
        time: "1.5-2 часа",
        features: ["Обеспыливание", "Влажная уборка", "Вынос мусора", "Санузлы"],
        icon: <Sparkles size={48} />
    },
    {
        id: "02",
        title: "Поддерживающая",
        eng: "Maintenance",
        desc: "Чистота в режиме нон-стоп. Специалист находится на объекте весь день.",
        time: "6-8 часов",
        features: ["Ресепшн", "Переговорные", "Кухня", "Дежурство"],
        icon: <Clock size={48} />
    },
    {
        id: "03",
        title: "Генеральная",
        eng: "Deep Cleaning",
        desc: "Глубокая очистка каждые 3-6 месяцев. Дотянемся до каждого уголка.",
        time: "12-24 часов",
        features: ["Химчистка", "Мойка окон", "Дезинфекция", "Сложные пятна"],
        icon: <ShieldCheck size={48} />
    },
    {
        id: "04",
        title: "После Строя",
        eng: "Post Construction",
        desc: "Ликвидация последствий ремонта. Вывозим мусор, удаляем цемент и краску.",
        time: "1-3 дня",
        features: ["Спецтехника", "Промышленный пылесос", "Роторная чистка", "Вывоз мусора"],
        icon: <Zap size={48} />
    }
];

const ServicesPage = () => {
    useEffect(() => {

        // Title parallax
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
        <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-green/30">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 mix-blend-difference">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-dark transition-colors">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                            Назад
                        </span>
                    </Link>
                    <div className="font-black text-xl tracking-tighter">IC GROUP</div>
                </div>
            </header>

            <main className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-32 relative">
                        <span className="text-brand-green font-black tracking-[0.4em] uppercase text-sm block mb-4">
                            Our Expertise
                        </span>
                        <h1 className="page-title text-[15vw] leading-[0.8] font-black tracking-tighter uppercase text-white mix-blend-overlay opacity-50 select-none pointer-events-none absolute top-0 left-0 -z-10 blur-sm">
                            Services
                        </h1>
                        <h2 className="text-6xl md:text-9xl font-black uppercase leading-none mb-8 relative z-10">
                            Услуги <br />
                            <span className="text-brand-green italic">Для Бизнеса</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-white/50 max-w-2xl font-medium leading-relaxed">
                            Мы не просто моем полы. Мы создаем экосистему чистоты, которая работает на репутацию вашего бренда 24/7.
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="services-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((s) => (
                            <div key={s.id} className="service-card group p-10 md:p-14 rounded-[40px] bg-[#1a1a1a] border border-white/5 hover:bg-brand-green hover:border-transparent transition-all duration-500 relative overflow-hidden shadow-2xl">

                                {/* Hover Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex justify-between items-start mb-14 relative z-10">
                                    <span className="text-8xl font-black text-white/20 group-hover:text-white/40 transition-colors select-none">
                                        {s.id}
                                    </span>
                                    <div className="w-20 h-20 rounded-3xl bg-black/20 flex items-center justify-center text-brand-green group-hover:bg-white group-hover:text-brand-green transition-colors duration-500 backdrop-blur-sm border border-white/5">
                                        {s.icon}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-4xl md:text-5xl font-black uppercase mb-3 leading-[0.9] text-white group-hover:text-white transition-colors">
                                        {s.title}
                                    </h3>
                                    <span className="block text-sm font-bold tracking-[0.2em] text-white/30 mb-8 group-hover:text-white/60 uppercase">
                                        {s.eng}
                                    </span>

                                    <p className="text-xl text-white/60 mb-10 group-hover:text-white font-medium leading-relaxed max-w-md">
                                        {s.desc}
                                    </p>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-10">
                                        {s.features.map((f, fk) => (
                                            <div key={fk} className="flex items-center gap-3 text-white/40 group-hover:text-white/90 text-xs font-bold uppercase tracking-wider transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-green group-hover:bg-white transition-colors" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-white/5 group-hover:border-white/20 flex justify-between items-end">
                                        <div className="flex flex-col gap-1 text-white/30 group-hover:text-white font-bold uppercase tracking-widest text-[10px]">
                                            <span>Время выполнения</span>
                                            <span className="text-lg text-white group-hover:text-white">{s.time}</span>
                                        </div>
                                        <button className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-brand-dark transition-all scale-100 group-hover:scale-110">
                                            <ArrowUpRight size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Footer */}
                    <div className="mt-32 p-12 md:p-24 rounded-[3rem] bg-brand-green relative overflow-hidden text-center">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-7xl font-black uppercase mb-8 leading-tight">
                                Сложный объект? <br />
                                <span className="text-white/30">Мы любим вызовы.</span>
                            </h2>
                            <button className="bg-brand-dark text-white px-12 py-6 rounded-2xl text-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform">
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
