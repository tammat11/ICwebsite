import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Cloud, Bot, QrCode } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ecosystem = [
    {
        title: "SMART APP",
        desc: "Личный кабинет для клиента",
        icon: <Smartphone size={40} />,
        stat: "24/7",
        sub: "Access",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "CLOUD ERP",
        desc: "Управление ресурсами",
        icon: <Cloud size={40} />,
        stat: "100%",
        sub: "Control",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "AI VISION",
        desc: "Контроль качества",
        icon: <Bot size={40} />,
        stat: "99.9%",
        sub: "Accuracy",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
    },
    {
        title: "QR CHECK",
        desc: "Чек-листы объектов",
        icon: <QrCode size={40} />,
        stat: "1s",
        sub: "Scan",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
    }
];

const BentoSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".eco-card", {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 md:py-40 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="mb-20 text-center md:text-left md:flex justify-between items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full mb-6">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Digital Core</span>
                        </div>
                        <h2 className="text-[clamp(2.5rem,6vw,80px)] font-black leading-[0.9] text-brand-dark uppercase tracking-tighter">
                            ЦИФРОВАЯ <br />
                            <span className="text-brand-green">ЭКОСИСТЕМА</span>
                        </h2>
                    </div>
                </div>

                {/* Horizontal Cards Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ecosystem.map((item, i) => (
                        <div key={i} className="eco-card group relative h-[500px] rounded-[40px] bg-gray-50 overflow-hidden flex flex-col justify-end p-8 border border-transparent hover:shadow-2xl hover:shadow-brand-green/20 transition-all duration-500">

                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            </div>

                            <div className="relative z-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-brand-green mb-6 group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>

                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 group-hover:text-brand-green transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-white/60 font-medium mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {item.desc}
                                </p>

                                <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                                    <div>
                                        <div className="text-4xl font-black tracking-tighter leading-none mb-1">
                                            {item.stat}
                                        </div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                                            {item.sub}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BentoSection;
