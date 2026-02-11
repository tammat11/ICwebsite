import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowUpRight, TrendingUp, Award, Rocket, Building2, Cpu, Users } from 'lucide-react';
import Navbar from '../components/Navbar';

gsap.registerPlugin(ScrollTrigger);

const newsArticles = [
    {
        id: "01",
        title: "Открытие нового офиса в Астане",
        date: "15 Февраля 2026",
        category: "Расширение",
        desc: "IC Group расширяет географию присутствия. Новый региональный офис позволит обслуживать более 100 объектов в столице и повысить качество сервиса для клиентов в северном регионе.",
        image: "/office_leadership.png",
        tag: "Новое",
        icon: <Rocket size={48} />,
        readTime: "3 мин"
    },
    {
        id: "02",
        title: "Запуск мобильного приложения IC Control",
        date: "8 Февраля 2026",
        category: "Технологии",
        desc: "Собственная разработка для мониторинга качества клининга в режиме реального времени. Приложение использует AI для анализа фотоотчетов и автоматического контроля качества уборки.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800",
        tag: "Инновации",
        icon: <Cpu size={48} />,
        readTime: "5 мин"
    },
    {
        id: "03",
        title: "Лучший работодатель года в сфере услуг",
        date: "25 Января 2026",
        category: "Достижения",
        desc: "IC Group получил национальную премию за создание лучших условий труда и развитие персонала. Более 3000 сотрудников компании получают полный социальный пакет и возможности карьерного роста.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
        tag: "Награда",
        icon: <Award size={48} />,
        readTime: "4 мин"
    },
    {
        id: "04",
        title: "Контракт с крупнейшим ТРЦ Алматы",
        date: "18 Января 2026",
        category: "Партнерство",
        desc: "Подписан долгосрочный контракт на комплексное обслуживание торгового центра площадью 150,000 м². Проект включает ежедневную уборку, техническое обслуживание и управление отходами.",
        image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80&w=800",
        tag: "Проект",
        icon: <Building2 size={48} />,
        readTime: "6 мин"
    },
    {
        id: "05",
        title: "Программа обучения для 500 новых сотрудников",
        date: "10 Января 2026",
        category: "Образование",
        desc: "Запущена масштабная программа профессиональной подготовки клининг-операторов. Обучение включает теоретические курсы, практические занятия и сертификацию по международным стандартам.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
        tag: "Обучение",
        icon: <Users size={48} />,
        readTime: "4 мин"
    },
    {
        id: "06",
        title: "Внедрение экологичных технологий уборки",
        date: "5 Января 2026",
        category: "Экология",
        desc: "IC Group переходит на использование биоразлагаемых чистящих средств и энергоэффективного оборудования. Новая инициатива позволит снизить углеродный след компании на 40%.",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
        tag: "Эко",
        icon: <TrendingUp size={48} />,
        readTime: "5 мин"
    }
];

const NewsPage = () => {
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

        gsap.from(".news-card", {
            y: 60,
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".news-grid",
                start: "top 120%",
                once: true
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20">
            <Navbar alwaysVisible />

            <main className="pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-20 relative">
                        <span className="text-brand-green font-black tracking-[0.4em] uppercase text-xs block mb-3">
                            Latest Updates
                        </span>
                        <h1 className="page-title text-[12vw] leading-[0.8] font-black tracking-tighter uppercase text-black mix-blend-multiply opacity-[0.03] select-none pointer-events-none absolute top-0 left-0 -z-10 blur-sm">
                            News
                        </h1>
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 relative z-10 text-brand-dark">
                            Новости <br />
                            <span className="text-brand-green italic">И Проекты</span>
                        </h2>
                        <p className="text-lg md:text-xl text-brand-dark/40 max-w-2xl font-medium leading-relaxed">
                            Следите за развитием IC Group: новые проекты, технологии, достижения и важные события компании.
                        </p>
                    </div>

                    {/* News Grid */}
                    <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {newsArticles.map((article) => (
                            <div key={article.id} className="news-card group rounded-[32px] bg-white border border-black/5 hover:shadow-2xl hover:border-brand-green/30 transition-all duration-700 overflow-hidden flex flex-col">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover grayscale-[30%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Tag */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-brand-green text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-xl">
                                            {article.tag}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className="absolute bottom-4 right-4">
                                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-75">
                                            {article.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar size={12} className="text-brand-green" />
                                        <span className="text-[10px] font-bold text-black/40">{article.date}</span>
                                        <span className="text-black/20">•</span>
                                        <span className="text-[10px] font-bold text-black/40">{article.readTime}</span>
                                    </div>

                                    <div className="text-[8px] font-black uppercase tracking-[0.4em] text-brand-green mb-2">
                                        {article.category}
                                    </div>

                                    <h3 className="text-xl font-black uppercase italic tracking-tight text-brand-dark group-hover:text-brand-green transition-colors leading-tight mb-3">
                                        {article.title}
                                    </h3>

                                    <p className="text-xs text-brand-dark/70 font-bold leading-relaxed mb-4 flex-1">
                                        {article.desc}
                                    </p>

                                    <button className="group/btn flex items-center gap-2 text-brand-dark hover:text-brand-green transition-colors pt-3 border-t border-black/5">
                                        <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover/btn:bg-brand-green group-hover/btn:text-white group-hover/btn:border-brand-green transition-all duration-500 group-hover/btn:rotate-45">
                                            <ArrowUpRight size={16} />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Читать</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Footer */}
                    <div className="mt-20 p-10 md:p-16 rounded-[3rem] bg-brand-green relative overflow-hidden text-center shadow-2xl shadow-brand-green/40">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 leading-tight text-white drop-shadow-lg">
                                Хотите узнать больше? <br />
                                <span className="text-brand-dark/20">Подпишитесь на рассылку.</span>
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
                                <input
                                    type="email"
                                    placeholder="Ваш email"
                                    className="flex-1 px-6 py-4 rounded-2xl text-base font-bold bg-white/20 backdrop-blur-md border-2 border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all"
                                />
                                <button className="bg-brand-dark text-white px-8 py-4 rounded-2xl text-base font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl whitespace-nowrap">
                                    Подписаться
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default NewsPage;
