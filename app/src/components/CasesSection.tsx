import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, TrendingDown, Zap } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import newsData from '../data/news.json';

interface NewsArticle {
    id: string;
    title: string;
    date: string;
    category: string;
    desc: string;
    image: string;
    tag: string;
    readTime: string;
    company?: string;
    stat?: string;
    metric?: string;
    imagePositionX?: number;
    imagePositionY?: number;
}

const normalizeImagePositionValue = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 50;
    return Math.min(100, Math.max(0, value));
};

const getImageObjectPosition = (article: NewsArticle) =>
    `${normalizeImagePositionValue(article.imagePositionX)}% ${normalizeImagePositionValue(article.imagePositionY)}%`;

const CasesSection = () => {
    const [sectionRef, inView] = useInView();
    const [cases, setCases] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const filteredCases = (newsData as NewsArticle[]).filter(item => item.category === 'Кейсы');
        if (filteredCases.length > 0) {
            setCases(filteredCases);
        } else {
            // Fallback to initial data if json is empty
            setCases([
                {
                    id: "default-1",
                    company: "AO «Kaspi Bank»",
                    stat: "Kaspi Bank",
                    metric: "ЦЕНТРАЛИЗАЦИЯ",
                    title: "Организовали централизованный закуп услуг клининга по всему Казахстану.",
                    desc: "Упростили управление процессом клининга — стали единым поставщиком услуг по стране. Стандартизировали качество уборки во всех филиалах.",
                    category: "Кейсы",
                    tag: "Banking",
                    image: "/cases/kaspi.jpeg",
                    date: "12.03.2026",
                    readTime: "3 мин"
                },
                {
                    id: "default-2",
                    company: "НК «Астана ЭКСПО-2017»",
                    stat: "500 клинеров",
                    metric: "ЗАПУСК ПРОЕКТА",
                    title: "Наняли 500 клинеров и наладили производственные процессы за 3 дня.",
                    desc: "Запустили объект за 3 дня за счет региональной представленности и объемов производства.",
                    category: "Кейсы",
                    tag: "Public Sector",
                    image: "/cases/казхром.jpg",
                    date: "12.03.2026",
                    readTime: "3 мин"
                },
                {
                    id: "default-3",
                    company: "АО «ТНК Казхром»",
                    stat: "5 млн ₸",
                    metric: "ЭКОНОМИЯ В МЕСЯЦ",
                    title: "Сэкономили 5 млн ₸ ежемесячно.",
                    desc: "Сократили фонд оплаты труда на 28% и сэкономили 5 млн тенге в месяц за счет автоматизации процессов.",
                    category: "Кейсы",
                    tag: "Industrial",
                    image: "/cases/экспо.jpg",
                    date: "12.03.2026",
                    readTime: "3 мин"
                }
            ]);
        }
    }, []);

    const getIcon = (tag?: string) => {
        if (tag?.includes('Banking')) return <ShieldCheck size={20} />;
        if (tag?.includes('Sector')) return <Zap size={20} />;
        return <TrendingDown size={20} />;
    };

    return (
        <section ref={sectionRef} className={`py-8 md:py-12 bg-brand-light overflow-hidden relative ${inView ? 'in-view' : ''}`} id="cases">
            <div className="pointer-events-none absolute left-[10%] top-14 h-24 w-24 rounded-full bg-brand-green/8 blur-3xl animate-bob-soft" />
            <div className="pointer-events-none absolute right-[6%] bottom-12 h-28 w-28 rounded-full bg-brand-dark/6 blur-3xl animate-pulse-glow" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-8 md:mb-12 text-center reveal-on-scroll" style={{ animationDelay: '0s' }}>
                    <div className="section-tag">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        <span>Наши результаты</span>
                    </div>
                    <h2 className="section-header text-brand-dark overflow-visible">
                        РЕАЛЬНЫЕ <br />
                        <span className="relative inline-block">
                            <span className="relative inline-block overflow-hidden px-2 rounded-xl">
                                <span className="text-brand-green drop-shadow-[0_0_40px_rgba(131,182,67,0.2)]">КЕЙСЫ</span>
                            </span>
                        </span>
                    </h2>
                </div>

                {/* Vertical Cases */}
                <div className="space-y-8 md:space-y-12">
                    {cases.map((item, i) => (
                        <Link 
                            key={item.id} 
                            to="/news" 
                            className={`group flex flex-col md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-12 items-center py-2 md:py-4 reveal-on-scroll`}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 shrink-0">
                                <div className="relative h-[180px] md:h-[280px] rounded-[20px] md:rounded-[32px] overflow-hidden border border-black/[0.05] shadow-sm group-hover:shadow-2xl transition-all duration-700">
                                    <div className="absolute inset-y-0 -left-1/3 z-20 w-1/3 bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-0 group-hover:opacity-100 sheen-pass" />
                                    <div className="case-image-inner w-full h-full opacity-90 group-hover:opacity-100 transition-all duration-[1500ms]">
                                        <img
                                            src={item.image}
                                            alt={item.company || item.title}
                                            className={`w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110 ${i % 2 === 0 ? 'animate-bob-soft' : 'animate-bob-soft-alt'}`}
                                            style={{ objectPosition: getImageObjectPosition(item) }}
                                        />
                                    </div>
                                    {/* Subtle gradients for text readability (bottom-left focus) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent w-2/3 opacity-70 pointer-events-none" />

                                    {/* Company Label Floating */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className={`px-3 py-1.5 ${i === 1 ? 'bg-brand-secondary/90' : 'bg-brand-green/90'} backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg border border-white/20 ${i % 2 === 0 ? 'animate-bob-soft' : 'animate-bob-soft-alt'}`}>
                                            {item.company || item.title}
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="w-11 h-11 rounded-full bg-white/12 backdrop-blur-md border border-white/15 text-white flex items-center justify-center animate-pulse-glow">
                                            {getIcon(item.tag)}
                                        </div>
                                    </div>

                                    {/* Fast Stat Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1.5 z-20 text-left">
                                        <div className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-none drop-shadow-md">
                                            {item.stat || item.title}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-px bg-white/60" />
                                            <div className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">{item.metric || 'Результат'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 space-y-3 md:space-y-4 pl-0 md:pl-2 text-left">
                                <div className="space-y-3">
                                    <div className="text-[8px] font-semibold uppercase tracking-[0.3em] text-brand-green flex items-center gap-2">
                                        <div className="w-6 h-px bg-brand-green" /> {item.category}
                                    </div>
                                    <h3 className="text-lg md:text-2xl font-bold uppercase tracking-tight text-brand-dark group-hover:text-brand-green transition-colors duration-500 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-brand-dark/70 font-medium leading-snug">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className="group/btn flex items-center gap-6 pt-6 text-brand-dark hover:text-brand-green transition-colors">
                                    <div className="w-12 h-12 rounded-full border border-black/[0.1] flex items-center justify-center group-hover/btn:bg-brand-green group-hover/btn:text-white group-hover/btn:border-brand-green transition-all duration-500 group-hover/btn:rotate-45 shadow-sm">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.3em]">Посмотреть кейс</div>
                                        <div className="text-[8px] font-semibold text-black/20 uppercase tracking-widest">Читать методологию</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom Action */}
                    <Link to="/news" className="mt-12 md:mt-20 pt-8 md:pt-12 flex flex-col items-center relative">
                    {/* Decorative line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-brand-dark/20 to-transparent" />

                    <div className="px-10 md:px-14 py-5 md:py-6 bg-brand-dark text-white rounded-full font-bold text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:shadow-[0_20px_40px_rgba(131,182,67,0.3)] hover:bg-brand-green transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group flex items-center gap-4">
                        Смотреть все проекты
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-brand-dark transition-all duration-300 transform group-hover:translate-x-1">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-dark/30">
                        500+ клиентов по всему Казахстану
                    </p>
                </Link>
            </div>
        </section>
    );
};

export default CasesSection;
