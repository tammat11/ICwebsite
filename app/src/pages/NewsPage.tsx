import { useEffect, useState } from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useInView } from '../hooks/useInView';
import newsData from '../data/news.json';
import SeoHead from '../components/SeoHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { buildBreadcrumbSchema, SITE_URL } from '../utils/seo';

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

const BROKEN_GITHUB_UPLOAD_PREFIXES = [
    'https://raw.githubusercontent.com/tammat11/ICwebsite/main/uploads/',
    'https://raw.githubusercontent.com/tammat11/ICwebsite/master/uploads/',
];

const normalizeImageUrl = (image?: string) => {
    if (!image) return '';

    const brokenPrefix = BROKEN_GITHUB_UPLOAD_PREFIXES.find(prefix => image.startsWith(prefix));
    if (brokenPrefix) {
        return image.replace(brokenPrefix, '/uploads/');
    }

    return image;
};

const NewsPage = ({ onCalcOpen }: NewsPageProps) => {
    const [articles] = useState<NewsArticle[]>(newsData as NewsArticle[]);
    const [loading] = useState(false);
    const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedArticles(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const [rootRef, inView] = useInView();
    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Главная', path: '/' },
        { name: 'Новости', path: '/news' },
    ]);
    const newsCollectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Новости и кейсы IC Group',
        url: `${SITE_URL}/news`,
        hasPart: articles.slice(0, 12).map((article) => ({
            '@type': 'Article',
            headline: article.title,
            description: article.desc,
            datePublished: article.date,
            image: normalizeImageUrl(article.image).startsWith('http')
                ? normalizeImageUrl(article.image)
                : `${SITE_URL}${normalizeImageUrl(article.image)}`,
            author: {
                '@id': `${SITE_URL}#organization`,
            },
        })),
    };

    return (
        <div ref={rootRef} className={`min-h-screen bg-brand-light text-brand-dark selection:bg-brand-green/20 ${inView ? 'in-view' : ''}`}>
            <SeoHead
                title="Новости и кейсы клининговой компании | IC Group"
                description="Новости, проекты и кейсы клининговой компании IC Group. Реальные результаты, новые объекты и развитие профессионального клининга в Казахстане."
                path="/news"
                keywords="новости клининговой компании, кейсы клининг, проекты IC Group, профессиональный клининг Казахстан"
                schema={[breadcrumbSchema, newsCollectionSchema]}
            />
            <Navbar alwaysVisible />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumbs items={[{ label: 'Новости' }]} />
                    {/* Hero Section */}
                    <div className="mb-12 md:mb-16 relative reveal-on-scroll" style={{ animationDelay: '0s' }}>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-brand-dark mb-4">
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
                                        src={normalizeImageUrl(article.image)}
                                        alt={`${article.title} — новости клининговой компании IC Group`}
                                        className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-1000"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-all duration-500" />

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
                                    </div>

                                    <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-green mb-3">
                                        {article.category}
                                    </div>

                                    <h3 className="text-2xl font-bold uppercase tracking-tighter text-brand-dark group-hover:text-brand-green transition-colors leading-[0.9] mb-4">
                                        {article.title}
                                    </h3>

                                    <div className="flex-1">
                                        <p className={`text-[14px] text-brand-dark/60 font-medium leading-relaxed mb-4 transition-all duration-500 ${expandedArticles.has(article.id) ? '' : 'line-clamp-4'}`}>
                                            {article.desc}
                                        </p>
                                        {article.desc.length > 180 && (
                                            <button 
                                                onClick={() => toggleExpand(article.id)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-brand-green hover:text-brand-dark transition-colors mb-4"
                                            >
                                                {expandedArticles.has(article.id) ? 'Свернуть' : 'Раскрыть подробнее'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}


                </div>
            </main>
        </div>
    );
};

export default NewsPage;
