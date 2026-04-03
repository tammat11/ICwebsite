import { Clock, ShieldCheck, Zap, Sparkles, Droplets, Mountain, Flower2, Bug, Settings, Snowflake, Coffee, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import SeoHead from '../components/SeoHead';

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

const ServicesPage = ({ onCalcOpen }: { onCalcOpen?: () => void }) => {
    const [rootRef, inView] = useInView();
    return (
        <div ref={rootRef} className={`min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20 ${inView ? 'in-view' : ''}`}>
            <SeoHead
                title="Услуги клининговой компании | IC Group"
                description="Услуги клининговой компании IC Group: клининг офисов, генеральная и послестроительная уборка, мойка витражей, химчистка и специализированный клининг для бизнеса."
                path="/services"
                keywords="услуги клининговой компании, клининг офисов, генеральная уборка, послестроительная уборка, мойка витражей, химчистка"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    serviceType: 'Профессиональный клининг для бизнеса',
                    provider: {
                        '@type': 'Organization',
                        name: 'IC Group',
                    },
                    areaServed: 'KZ',
                }}
            />
            <main className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-32 relative reveal-on-scroll" style={{ animationDelay: '0s' }}>
                        <span className="text-brand-green font-bold tracking-[0.4em] uppercase text-sm block mb-4">
                            Наша Экспертиза
                        </span>
                        <h1 className="page-title text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase text-black mix-blend-multiply opacity-[0.03] select-none pointer-events-none absolute top-0 left-0 -z-10 blur-sm">
                            Services
                        </h1>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-none mb-8 relative z-10 text-brand-dark">
                            Услуги <br />
                            <span className="text-brand-green">Для Бизнеса</span>
                        </h2>
                    </div>

                    {/* Services Grid */}
                    <div className="services-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
                        {services.map((s, i) => (
                            <div key={s.id} className="service-card group min-h-[220px] rounded-[24px] bg-white border border-black/5 hover:border-brand-green/30 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl p-6 flex flex-col justify-between reveal-on-scroll" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
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

                    <section className="mt-24 rounded-[32px] border border-black/6 bg-white p-8 md:p-12 shadow-[0_20px_60px_rgba(26,29,30,0.05)]">
                        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-brand-dark">
                            Какие услуги клининговой компании чаще всего заказывают
                        </h2>
                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                            <p className="text-base leading-relaxed text-brand-dark/60">
                                Для коммерческих объектов чаще всего требуются клининг офисов, ежедневная поддерживающая уборка, генеральная уборка и послестроительная уборка. Эти услуги формируют основу стабильной эксплуатации объекта и напрямую влияют на впечатление клиентов и сотрудников.
                            </p>
                            <p className="text-base leading-relaxed text-brand-dark/60">
                                Дополнительно бизнесу нужны специализированные работы: мойка витражей, химчистка, инженерное обслуживание, сезонная уборка снега и сервисные команды под конкретный формат объекта. Поэтому страница услуг помогает Google понимать, что IC Group — это не одна услуга, а полноценная клининговая компания.
                            </p>
                        </div>
                        <div className="mt-8 grid gap-3 md:grid-cols-3">
                            <Link to="/klining-ofisov" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                Клининг офисов
                            </Link>
                            <Link to="/kliningovaya-kompaniya-almaty" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                Клининг в Алматы
                            </Link>
                            <Link to="/kliningovaya-kompaniya-astana" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                Клининг в Астане
                            </Link>
                            <Link to="/generalnaya-uborka" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                Генеральная уборка
                            </Link>
                            <Link to="/poslestroitelnaya-uborka" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                После строительная уборка
                            </Link>
                            <Link to="/moyka-vitrazhey" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                Мойка витражей
                            </Link>
                            <Link to="/klining-ofisov-almaty" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                Клининг офисов Алматы
                            </Link>
                            <Link to="/klining-ofisov-astana" className="rounded-[20px] bg-[#f6f7f3] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:bg-brand-green hover:text-white">
                                Клининг офисов Астана
                            </Link>
                        </div>
                    </section>

                    {/* CTA Footer */}
                    <div className="mt-32 p-10 md:p-16 rounded-[2rem] bg-brand-green relative overflow-hidden text-center shadow-2xl reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8 leading-tight text-white max-w-3xl">
                                "Сложный" объект? <br />
                                <span className="text-brand-dark/40">Мы любим вызовы.</span>
                            </h2>
                            <button 
                                onClick={onCalcOpen}
                                className="bg-brand-dark text-white px-7 py-3.5 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl active:scale-95"
                            >
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
