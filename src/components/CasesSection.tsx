import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, TrendingDown, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CasesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".case-card-v").forEach((card) => {
                gsap.from(card, {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 120%"
                    }
                });

                gsap.from(card.querySelector(".case-image-inner"), {
                    scale: 1.15,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 120%",
                        scrub: true
                    }
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const cases = [
        {
            company: "AO «Kaspi Bank»",
            stat: "Kaspi Bank",
            metric: "ЦЕНТРАЛИЗАЦИЯ",
            title: "Организовали централизованный закуп услуг клининга по всему Казахстану.",
            desc: "Упростили управление процессом клининга — стали единым поставщиком услуг по стране. Стандартизировали качество уборки во всех филиалах.",
            category: "Banking",
            icon: <ShieldCheck size={20} />,
            image: "https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "НК «Астана ЭКСПО-2017»",
            stat: "500 клинеров",
            metric: "МОБИЛИЗАЦИЯ",
            title: "Наняли 500 клинеров и наладили производственные процессы за 3 дня.",
            desc: "Запустили объект за 3 дня за счет региональной представленности и объемов производства.",
            category: "Public Sector",
            icon: <Zap size={20} />,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "АО «ТНК Казхром»",
            stat: "5 млн ₸",
            metric: "ЭКОНОМИЯ В МЕСЯЦ",
            title: "Сэкономили 5 млн ₸ ежемесячно.",
            desc: "Сократили фонд оплаты труда на 28% и сэкономили 5 млн тенге в месяц за счет автоматизации процессов.",
            category: "Industrial",
            icon: <TrendingDown size={20} />,
            image: "https://images.unsplash.com/photo-1504384308090-c89e12bf9a51?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <section ref={sectionRef} className="py-8 md:py-12 bg-brand-light overflow-hidden relative" id="cases">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-8 md:mb-12 text-center">
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
                <div className="space-y-12 md:space-y-20">
                    {cases.map((item, i) => (
                        <div
                            key={i}
                            className={`case-card-v group flex flex-col md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-20 items-center py-4 md:py-6`}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-3/5 shrink-0">
                                <div className="relative h-[220px] md:h-[380px] rounded-[24px] md:rounded-[48px] overflow-hidden border border-black/[0.05] shadow-sm group-hover:shadow-2xl transition-all duration-700">
                                    <div className="case-image-inner w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-[1500ms]">
                                        <img src={item.image} alt={item.company} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                                    {/* Company Label Floating */}
                                    <div className="absolute top-6 left-6">
                                        <div className={`px-4 py-1.5 ${i === 1 ? 'bg-brand-secondary' : 'bg-brand-green'} text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl`}>
                                            {item.company}
                                        </div>
                                    </div>

                                    {/* Fast Stat Overlay */}
                                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                                        <div className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none drop-shadow-lg">
                                            {item.stat}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-px bg-white/40" />
                                            <div className="text-[11px] font-medium text-white uppercase tracking-wider">{item.metric}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-2/5 space-y-4 md:space-y-6 pl-0 md:pl-2">
                                <div className="space-y-4">
                                    <div className="text-[9px] font-semibold uppercase tracking-[0.4em] text-brand-green flex items-center gap-2">
                                        <div className="w-8 h-px bg-brand-green" /> {item.category}
                                    </div>
                                    <h3 className="text-xl md:text-3xl font-bold uppercase tracking-tight text-brand-dark group-hover:text-brand-green transition-colors duration-500 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-base md:text-lg text-brand-dark/60 font-medium leading-tight">
                                        {item.desc}
                                    </p>
                                </div>

                                <button className="group/btn flex items-center gap-6 pt-6 text-brand-dark hover:text-brand-green transition-colors">
                                    <div className="w-12 h-12 rounded-full border border-black/[0.1] flex items-center justify-center group-hover/btn:bg-brand-green group-hover/btn:text-white group-hover/btn:border-brand-green transition-all duration-500 group-hover/btn:rotate-45 shadow-sm">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.3em]">View Full Case</div>
                                        <div className="text-[8px] font-semibold text-black/20 uppercase tracking-widest">Read methodology</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Action */}
                <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-black/[0.03] flex flex-col items-center">
                    <button className="px-8 md:px-12 py-4 md:py-5 bg-brand-dark text-white rounded-full font-bold text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-brand-green transition-all transform hover:-translate-y-1 active:scale-95 group">
                        Смотреть все проекты
                        <span className="inline-block ml-4 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <p className="mt-10 text-[9px] font-bold uppercase tracking-[0.3em] text-black/10">500+ клиентов по всему Казахстану</p>
                </div>
            </div>
        </section>
    );
};

export default CasesSection;
