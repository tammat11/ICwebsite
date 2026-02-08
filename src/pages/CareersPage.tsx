import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowUpRight, Briefcase, HardHat, Users, Star, Clock, MapPin } from 'lucide-react';
import ApplicationModal from '../components/ApplicationModal';

const CareersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState<string>('Office');
    const root = useRef<HTMLDivElement>(null);

    const openModal = (cat: string) => {
        setCategory(cat);
        setIsModalOpen(true);
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Initial hide to prevent flash
            gsap.set(".career-title-line, .career-subtitle, .career-card", { opacity: 0, y: 50 });

            // Header Animation - Line by Line
            gsap.to(".career-title-line", {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2
            });

            gsap.to(".career-subtitle", {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.8,
                ease: "power2.out"
            });

            // Cards Animation - Simple Fade In
            gsap.to(".career-card", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.6,
                clearProps: "all"
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={root} className="min-h-screen bg-brand-light selection:bg-brand-green/20">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-6">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto mb-16 md:mb-32 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />

                    <span className="career-subtitle text-brand-green text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase block mb-6">
                        Присоединяйся к нам
                    </span>
                    <h1 className="text-[clamp(2.5rem,10vw,100px)] font-black tracking-tighter text-brand-dark leading-[0.9] mb-8">
                        <div className="overflow-hidden"><span className="career-title-line block">СТАНЬ ЧАСТЬЮ</span></div>
                        <div className="overflow-hidden"><span className="career-title-line block text-brand-green italic uppercase">КОМАНДЫ ЛИДЕРОВ</span></div>
                    </h1>
                    <p className="career-subtitle text-lg md:text-xl text-brand-dark/50 max-w-2xl font-medium">
                        Мы ищем талантливых людей, готовых расти и развиваться вместе с крупнейшей клининговой компанией Казахстана.
                    </p>
                </div>

                {/* Main Directions */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 cards-container mb-32">

                    {/* Office Card */}
                    <div className="career-card group relative p-10 md:p-14 rounded-[50px] bg-[#111] border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Briefcase size={200} className="text-white" />
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-between cursor-default">
                            <div>
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 text-white">
                                    <Users size={32} />
                                </div>
                                <h2 className="text-4xl font-black tracking-tight text-white mb-6">ОФИС</h2>
                                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                                    Для тех, кто хочет управлять процессами, развивать продажи, внедрять IT-решения и строить стратегию.
                                </p>
                                <ul className="space-y-4 mb-10">
                                    {['Менеджмент и управление', 'Продажи и Маркетинг', 'HR и Рекрутинг', 'IT и Разработка', 'Финансы и Бухгалтерия'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white font-bold text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={() => openModal('Office')} className="btn-secondary w-full flex items-center justify-center gap-2 !bg-white !text-brand-dark hover:!bg-brand-green hover:!text-white border-none shadow-lg">
                                Отправить резюме <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Production Card */}
                    <div className="career-card group relative p-10 md:p-14 rounded-[50px] bg-brand-green text-white overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <HardHat size={200} />
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-between cursor-default">
                            <div>
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-10 text-white">
                                    <Star size={32} />
                                </div>
                                <h2 className="text-4xl font-black tracking-tight text-white mb-6">ПРОИЗВОДСТВО</h2>
                                <p className="text-white/50 text-lg mb-8 leading-relaxed">
                                    Стабильная работа для специалистов на объектах. Достойная оплата, удобный график и униформа.
                                </p>
                                <ul className="space-y-4 mb-10">
                                    {['Клинеры и Операторы', 'Супервайзеры объектов', 'Технические специалисты', 'Альпинисты', 'Разнорабочие'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-white font-bold text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={() => openModal('Production')} className="btn-secondary w-full flex items-center justify-center gap-2 !bg-white !text-brand-green hover:!bg-brand-dark hover:!text-white border-none shadow-lg">
                                Заполнить анкету <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-7xl mx-auto mb-32">
                    <h3 className="text-3xl font-black tracking-tight text-brand-dark mb-12 text-center">ПОЧЕМУ МЫ?</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Clock, title: "Стабильность", desc: "Своевременные выплаты и официальное трудоустройство." },
                            { icon: Star, title: "Карьера", desc: "Возможность роста от клинера до руководителя региона." },
                            { icon: MapPin, title: "Масштаб", desc: "Работа в любой точке Казахстана и крупных объектах." }
                        ].map((b, i) => (
                            <div key={i} className="bg-white p-8 rounded-[30px] border border-brand-dark/5 flex flex-col items-center text-center hover:border-brand-green/30 transition-colors">
                                <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-6">
                                    <b.icon size={24} />
                                </div>
                                <h4 className="font-black text-lg mb-3">{b.title}</h4>
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
