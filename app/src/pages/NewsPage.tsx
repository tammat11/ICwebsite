import { useEffect, useState } from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useInView } from '../hooks/useInView';

interface NewsArticle {
    id: string;
    title: string;
    date: string;
    category: string;
    desc: string;
    image: string;
    tag: string;
    readTime: string;
}

interface NewsPageProps {
    onCalcOpen?: () => void;
}

const NewsPage = ({ onCalcOpen }: NewsPageProps) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [rootRef, inView] = useInView();

    useEffect(() => {
        fetch('/api/news')
            .then(res => res.json())
            .then(data => setArticles(Array.isArray(data) ? data : []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div ref={rootRef} className={`min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20 ${inView ? 'in-view' : ''}`}>
            <Navbar alwaysVisible />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12 md:mb-16 relative reveal-on-scroll" style={{ animationDelay: '0s' }}>
                        <h2 className="text-[clamp(2.5rem,7vw,80px)] font-bold tracking-tighter leading-[0.9] text-brand-dark mb-4">
                            НОВОСТИ <br />
                            <span className="text-brand-green">И ПРОЕКТЫ</span>
                        </h2>

                        <p className="mt-6 text-lg md:text-xl text-brand-dark/50 max-w-2xl font-medium leading-relaxed">
                            Следите за развитием IC Group: новые проекты, технологии, достижения и важные события компании.
                        </p>
                    </div>

                    {/* News Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 md:py-32">
                            <div className="w-10 h-10 border-2 border-brand-green border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm font-medium text-brand-dark/50 uppercase tracking-wider">Загрузка...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-24 md:py-32 rounded-[32px] bg-white/50 border border-black/[0.04]">
                            <p className="text-xl md:text-2xl font-bold text-brand-dark/40 mb-2">Пока нет новостей</p>
                            <p className="text-sm text-brand-dark/30 max-w-md mx-auto">Новости и проекты появятся здесь после публикации в админ-панели.</p>
                        </div>
                    ) : (
                    <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {articles.map((article, i) => (
                            <div key={article.id} className="news-card group rounded-[32px] bg-white border border-black/[0.03] hover:shadow-glass hover:border-brand-green/30 transition-all duration-700 overflow-hidden flex flex-col relative reveal-on-scroll" style={{ animationDelay: `${0.08 + i * 0.06}s` }}>
                                {/* Image Overlay for Hover */}
                                <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/[0.02] transition-colors duration-700 pointer-events-none z-0" />

                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/90 group-hover:via-black/30" />

                                    {/* Tag */}
                                    <div className="absolute top-5 left-5">
                                        <span className="px-4 py-1.5 bg-brand-secondary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
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

                                    <h3 className="text-2xl font-bold uppercase tracking-tighter text-brand-dark group-hover:text-brand-green transition-colors leading-[0.9] mb-4">
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
                    )}

                    {/* CTA Footer - Оставить заявку */}
                    <div className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-brand-green relative overflow-hidden text-center shadow-2xl reveal-on-scroll" style={{ animationDelay: '0.15s' }}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6 leading-tight text-white">
                                Хотите узнать больше? <br />
                                <span className="text-brand-dark/30">Оставьте заявку</span>
                            </h2>
                            <button
                                type="button"
                                onClick={() => onCalcOpen?.()}
                                className="bg-brand-dark text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                            >
                                Оставить заявку
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default NewsPage;
