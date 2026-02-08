import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, TrendingDown, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CasesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".bg-parallax-cases", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2
                },
                x: -150,
                opacity: 0.05
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
            icon: <TrendingDown className="text-brand-green" size={20} />,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "Air Astana",
            stat: "99.8%",
            metric: "SLA COMPLIANCE",
            title: "Automate quality reporting",
            desc: "Внедрение QR-мониторинга и фото-отчетности в реальном времени для крупнейшего авиаперевозчика региона.",
            category: "Aviation Tech",
            icon: <Zap className="text-blue-400" size={20} />,
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800"
        },
        {
            company: "Samsung",
            stat: "Zero",
            metric: "INCIDENT RATE",
            title: "Move product work forward",
            desc: "Поддержка чистоты и безопасности на производственных и офисных площадках Samsung по международным стандартам.",
            category: "Production",
            icon: <ShieldCheck className="text-purple-400" size={20} />,
            image: "https://images.unsplash.com/photo-1504384308090-c89e12bf9a51?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 md:py-40 bg-[#0a0a0a] text-white overflow-hidden relative" id="cases">

            {/* Background Narrative */}
            <div className="bg-parallax-cases absolute top-1/2 left-0 -translate-y-1/2 text-[18rem] font-black text-white opacity-[0.02] select-none whitespace-nowrap leading-none hidden lg:block pointer-events-none">
                SYSTEMS AND INTEGRATIONS
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-20">
                    <h2 className="text-[clamp(2.5rem,7vw,100px)] font-black leading-[0.85] tracking-[-0.06em] text-white uppercase italic">
                        Масштабируем <br />
                        <span className="text-brand-green not-italic">ваши цели</span>
                    </h2>
                </div>

                {/* Vertical List for Stability */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cases.map((item, i) => (
                        <div key={i} className="flex flex-col bg-[#111] border border-white/[0.05] rounded-[32px] overflow-hidden transition-all duration-300 hover:border-white/20 shadow-2xl">
                            {/* Media Area */}
                            <div className="h-[240px] relative overflow-hidden bg-brand-dark">
                                <img
                                    src={item.image}
                                    alt={item.company}
                                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                                <div className="absolute top-6 left-6 z-20">
                                    <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2 border border-white/10">
                                        {item.icon}
                                        <span className="text-[10px] font-black">{item.stat}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                                    {item.category} // {item.company}
                                </div>
                                <h3 className="text-2xl font-black mb-4 tracking-tighter leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
                                    {item.desc}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">PROTOCOL 0{i + 1}</span>
                                    <ArrowUpRight size={18} className="text-white/20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CasesSection;
