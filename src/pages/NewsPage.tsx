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
        image: "office_leadership.png",
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
    // Animations removed to fix visibility issues
    useEffect(() => {
        // Static layout
    }, []);

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20">
            <Navbar alwaysVisible />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12 md:mb-16 relative">


                        <h2 className="text-[clamp(2.5rem,7vw,80px)] font-bold tracking-tighter leading-[0.9] text-brand-dark mb-4">
                            НОВОСТИ <br />
                            <span className="text-brand-green italic">И ПРОЕКТЫ</span>
                        </h2>

                        <p className="mt-6 text-lg md:text-xl text-brand-dark/50 max-w-2xl font-medium leading-relaxed italic">
                            Следите за развитием IC Group: новые проекты, технологии, достижения и важные события компании.
                        </p>
                    </div>

                    {/* News Grid */}
                    <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {newsArticles.map((article) => (
                            <div key={article.id} className="news-card group rounded-[32px] bg-white border border-black/[0.03] hover:shadow-glass hover:border-brand-green/30 transition-all duration-700 overflow-hidden flex flex-col relative">
                                {/* Image Overlay for Hover */}
                                <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/[0.02] transition-colors duration-700 pointer-events-none z-0" />

                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Tag */}
                                    <div className="absolute top-5 left-5">
                                        <span className="px-4 py-1.5 bg-brand-green text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                            {article.tag}
                                        </span>
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar size={14} className="text-brand-green" />
                                        <span className="text-[11px] font-medium text-brand-dark/60 uppercase tracking-wider">{article.date}</span>
                                        <span className="text-brand-dark/10">•</span>
                                        <span className="text-[11px] font-medium text-brand-dark/60 uppercase tracking-wider">{article.readTime}</span>
                                    </div>

                                    <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-green mb-3">
                                        {article.category}
                                    </div>

                                    <h3 className="text-2xl font-bold uppercase italic tracking-tighter text-brand-dark group-hover:text-brand-green transition-colors leading-[0.9] mb-4">
                                        {article.title}
                                    </h3>

                                    <p className="text-[14px] text-brand-dark/60 font-medium leading-relaxed mb-6 flex-1">
                                        {article.desc}
                                    </p>

                                    <div className="pt-5 border-t border-black/[0.05] flex items-center justify-between">
                                        <button className="flex items-center gap-3 group/btn">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark group-hover/btn:text-brand-green transition-colors">Читать статью</span>
                                            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover/btn:bg-brand-green group-hover/btn:text-white group-hover/btn:border-brand-green transition-all duration-500">
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Footer */}
                    <div className="mt-20 p-10 md:p-16 rounded-[3rem] bg-brand-green relative overflow-hidden text-center shadow-2xl shadow-brand-green/40">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6 leading-tight text-white drop-shadow-lg">
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
