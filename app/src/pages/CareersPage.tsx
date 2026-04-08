import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { ArrowUpRight, Briefcase, HardHat, Users, Star, Clock, GraduationCap } from 'lucide-react';
import ApplicationModal from '../components/ApplicationModal';
import { useInView } from '../hooks/useInView';
import SeoHead from '../components/SeoHead';

const CareersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState<string>('Office');
    const [root, inView] = useInView();

    const openModal = (cat: string) => {
        setCategory(cat);
        setIsModalOpen(true);
    };

    return (
        <div ref={root} className={`min-h-screen bg-brand-light selection:bg-brand-green/20 ${inView ? 'in-view' : ''}`}>
            <SeoHead
                title="Вакансии в клининговой компании | IC Group"
                description="Работа в клининговой компании IC Group: вакансии в офисе, клининге и партнерских направлениях. Карьера и обучение сотрудников в Казахстане."
                path="/careers"
                keywords="вакансии клининговая компания, работа клининг, работа в клининге, вакансии IC Group"
            />
            <main className="pt-24 sm:pt-32 pb-20 px-6">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto mb-16 md:mb-32 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />

                    <span className="career-subtitle text-brand-green text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase block mb-6 max-w-4xl reveal-on-scroll" style={{ animationDelay: '0.1s' }}>
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-brand-dark leading-[0.9] mb-8">
                        <div className="overflow-hidden"><span className="career-title-line block reveal-on-scroll" style={{ animationDelay: '0.2s' }}>СТАНЬ ЧАСТЬЮ</span></div>
                        <div className="overflow-hidden"><span className="career-title-line block text-brand-green uppercase reveal-on-scroll" style={{ animationDelay: '0.35s' }}>КОМАНДЫ ЛИДЕРОВ</span></div>
                    </h1>
                    <p className="career-subtitle text-lg md:text-xl text-brand-dark/50 max-w-2xl font-medium reveal-on-scroll" style={{ animationDelay: '0.8s' }}>
                        Мы расширяем сеть и ищем тех, кто готов расти вместе с нами: надёжных партнёров по клинингу, талантливых специалистов в бэк-офис и ответственных операторов уборки для работы на объектах по всей стране.
                    </p>
                </div>

                {/* Main Directions */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 cards-container mb-32">

                    <div className="career-card reveal-on-scroll group relative p-6 md:p-8 rounded-[32px] bg-[#111] border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 [animation-delay:600ms]">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Briefcase size={160} className="text-white" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between cursor-default">
                            <div>
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white">
                                    <Users size={28} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4 uppercase">ОФИС</h2>
                                <p className="text-white/60 text-xs md:text-sm mb-6 leading-relaxed">
                                    Для тех, кто хочет управлять процессами, развивать продажи, внедрять IT-решения и строить стратегию.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {['Менеджмент', 'Маркетинг', 'HR и Рекрутинг', 'IT Разработка', 'Финансы'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white font-medium text-[12px]">
                                            <div className="w-1 h-1 rounded-full bg-brand-green" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link to="/interview" className="btn-secondary w-full flex items-center justify-center gap-2 !bg-white !text-brand-dark hover:!bg-brand-green hover:!text-white border-none py-4 text-xs font-bold uppercase tracking-wider">
                                Отправить резюме <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>

                    <div className="career-card reveal-on-scroll group relative p-6 md:p-8 rounded-[32px] bg-white border border-brand-dark/10 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 [animation-delay:800ms] hover:bg-brand-green hover:border-brand-green group/card">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <HardHat size={160} className="text-brand-dark group-hover/card:text-white" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between cursor-default">
                            <div>
                                <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8 text-brand-green group-hover/card:bg-white/20 group-hover/card:text-white">
                                    <Star size={28} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-dark mb-4 uppercase group-hover/card:text-white">КЛИНИНГ</h2>
                                <p className="text-brand-dark/60 text-xs md:text-sm mb-6 leading-relaxed group-hover/card:text-white/90">
                                    Стабильная работа для операторов на объектах. Достойная оплата, удобный график и униформа.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {['Операторы уборки', 'Супервайзеры', 'Технические специалисты', 'Альпинисты', 'Разнорабочие'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-brand-dark font-medium text-[12px] group-hover/card:text-white">
                                            <div className="w-1 h-1 rounded-full bg-brand-green group-hover/card:bg-white" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => openModal('Cleaning')} className="btn-secondary w-full flex items-center justify-center gap-2 !bg-brand-dark !text-white hover:!bg-white hover:!text-brand-green border-none py-4 text-xs font-bold uppercase tracking-wider group-hover/card:!bg-white group-hover/card:!text-brand-green">
                                    Заполнить анкету <ArrowUpRight size={16} />
                                </button>
                                <Link to="/training/sanitary" className="w-full flex items-center justify-center gap-2 bg-transparent border border-brand-dark/10 group-hover/card:border-white/20 text-brand-dark/60 group-hover/card:text-white hover:bg-brand-dark/5 group-hover/card:hover:bg-white/10 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all">
                                    <GraduationCap size={14} /> Обучающий курс
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="career-card reveal-on-scroll group relative p-6 md:p-8 rounded-[32px] bg-white border border-brand-dark/10 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 [animation-delay:1000ms]">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={160} className="text-brand-dark" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between cursor-default">
                            <div>
                                <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8 text-brand-green">
                                    <Star size={28} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-brand-dark mb-4 uppercase">ПАРТНЕРСТВО</h2>
                                <p className="text-brand-dark/60 text-xs md:text-sm mb-6 leading-relaxed">
                                    Для предпринимателей и компаний, готовых масштабировать бизнес вместе с лидером рынка.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {['B2B сотрудничество', 'Совместные проекты'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-brand-dark font-medium text-[12px]">
                                            <div className="w-1 h-1 rounded-full bg-brand-green" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => openModal('Partnership')} className="btn-secondary w-full flex items-center justify-center gap-2 !bg-brand-dark !text-white hover:!bg-brand-green hover:!text-white border-none py-4 text-xs font-bold uppercase tracking-wider">
                                Стать партнером <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-7xl mx-auto mb-32">
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-12 text-center">ПОЧЕМУ МЫ?</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Users, title: "Лидеры рынка", desc: "крупнейшая клининговая компания в Казахстане, 27% доли рынка в корпоративном сегменте" },
                            { icon: Clock, title: "Сильная культура", desc: "Мы строим работу на принципе эффективной корпоративной культуры, чтобы дети и внуки наших сотрудников с честью продолжали это развитие." },
                            { icon: Star, title: "Точка роста", desc: "Десятки примеров роста с оператора по уборке до партнера компании. Возможности обучения, горизонтального и вертикального роста." }
                        ].map((b, i) => (
                            <div key={i} className="bg-white p-8 rounded-[30px] border border-brand-dark/5 flex flex-col items-center text-center hover:border-brand-green/30 transition-colors">
                                <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-6">
                                    <b.icon size={24} />
                                </div>
                                <h4 className="font-bold text-lg mb-3">{b.title}</h4>
                                <p className="text-sm text-brand-dark/50 font-medium">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category={category} />

            <Footer />
        </div>
    );
};

export default CareersPage;
