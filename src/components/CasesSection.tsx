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
                        start: "top 135%"
                    }
                });

                gsap.from(card.querySelector(".case-image-inner"), {
                    scale: 1.15,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 135%",
                        scrub: true
                    }
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const cases = [
        {
            company: "Forte Bank",
            stat: "−22%",
            metric: "OPEX REDUCTION",
            title: "Build unified service standards",
            desc: "Централизация управления 45 объектами через единую цифровую платформу IC Group. Оптимизация затрат без потери качества.",
            category: "Financial Sector",
            icon: <TrendingDown size={20} />,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "Air Astana",
            stat: "99.8%",
            metric: "SLA COMPLIANCE",
            title: "Automate quality reporting",
            desc: "Внедрение QR-мониторинга и фото-отчетности в реальном времени для крупнейшего авиаперевозчика региона.",
            category: "Aviation Tech",
            icon: <Zap size={20} />,
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "Samsung",
            stat: "Zero",
            metric: "INCIDENT RATE",
            title: "Safety standards",
            desc: "Поддержка чистоты и безопасности на производственных и офисных площадках Samsung по международным стандартам.",
            category: "Production",
            icon: <ShieldCheck size={20} />,
            image: "https://images.unsplash.com/photo-1504384308090-c89e12bf9a51?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <section ref={sectionRef} className="py-12 md:py-20 bg-brand-light overflow-hidden relative" id="cases">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-12 md:mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-green">Proof of Efficiency</span>
                    </div>
                    <h2 className="text-[clamp(48px,9vw,115px)] font-[1000] uppercase tracking-tighter leading-[0.8] italic text-brand-dark">
                        РЕАЛЬНЫЕ <br />
                        <span className="text-brand-green">КЕЙСЫ</span>
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
                                    <img
                                        src={item.image}
                                        alt={item.company}
                                        className="case-image-inner w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1500ms]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                                    {/* Company Label Floating */}
                                    <div className="absolute top-6 left-6">
                                        <div className={`px-4 py-1.5 ${i === 1 ? 'bg-brand-secondary' : 'bg-brand-green'} text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl`}>
                                            {item.company}
                                        </div>
                                    </div>

                                    {/* Fast Stat Overlay */}
                                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                                        <div className="text-5xl md:text-7xl font-[1000] text-white italic tracking-tighter leading-none drop-shadow-lg">
                                            {item.stat}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-px bg-white/40" />
                                            <div className="text-[11px] font-bold text-white uppercase tracking-wider">{item.metric}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-2/5 space-y-4 md:space-y-6 pl-0 md:pl-2">
                                <div className="space-y-4">
                                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-green flex items-center gap-2">
                                        <div className="w-8 h-px bg-brand-green" /> {item.category}
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black text-brand-dark uppercase italic tracking-tighter leading-[0.9] group-hover:text-brand-green transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-base md:text-lg text-black/40 font-bold leading-tight">
                                        {item.desc}
                                    </p>
                                </div>

                                <button className="group/btn flex items-center gap-6 pt-6 text-brand-dark hover:text-brand-green transition-colors">
                                    <div className="w-12 h-12 rounded-full border border-black/[0.1] flex items-center justify-center group-hover/btn:bg-brand-green group-hover/btn:text-white group-hover/btn:border-brand-green transition-all duration-500 group-hover/btn:rotate-45 shadow-sm">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em]">View Full Case</div>
                                        <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest">Read methodology</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Action */}
                <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-black/[0.03] flex flex-col items-center">
                    <button className="px-8 md:px-12 py-4 md:py-5 bg-brand-dark text-white rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-brand-green transition-all transform hover:-translate-y-1 active:scale-95 group">
                        Смотреть все проекты
                        <span className="inline-block ml-4 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <p className="mt-10 text-[9px] font-black uppercase tracking-[0.3em] text-black/10">100+ active contracts across Kazakhstan</p>
                </div>
            </div>
        </section>
    );
};

export default CasesSection;
