import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Building, Sparkles, Shield, HardHat } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const items = [
    {
        title: "Eco Management",
        category: "Office & B-Center",
        desc: "Системный подход к ежедневной чистоте. Используем биоразлагаемые средства и GPS-контроль персонала.",
        icon: <Building />,
        img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Deep Precision",
        category: "General & Special",
        desc: "Глубокая очистка поверхностей под давлением. Восстановление первоначального вида мрамора и ковролина.",
        icon: <Sparkles />,
        img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Industrial Scale",
        category: "Factories & Warehouses",
        desc: "Уборка промышленных зон с учетом ТБ. Очистка сложных загрязнений и высотные работы.",
        icon: <Shield />,
        img: "https://images.unsplash.com/photo-1504917595217-d4dc5f6497d7?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Post-Tech Clean",
        category: "Construction & Reno",
        desc: "Финальная подготовка объекта к сдаче. Удаление мелкодисперсной пыли и следов стройматериалов.",
        icon: <HardHat />,
        img: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800"
    }
];

const Services = () => {
    const root = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background text parallax
            gsap.to(".bg-text", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                x: -200
            });

            // Image clip-path reveal
            const cards = gsap.utils.toArray(".service-card");
            cards.forEach((card: any) => {
                const img = card.querySelector(".img-reveal");
                gsap.fromTo(img,
                    { clipPath: 'inset(100% 0% 0% 0%)' },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        duration: 1.5,
                        ease: 'power4.inOut',
                        scrollTrigger: {
                            trigger: card,
                            start: "top 95%",
                            once: true
                        }
                    }
                );
            });
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="py-40 px-6 relative overflow-hidden bg-brand-light">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none">
                <span className="bg-text absolute top-10 right-0 text-[300px] font-black text-black/[0.02] whitespace-nowrap">
                    EXPERTISE EXPERTISE EXPERTISE
                </span>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
                    <div className="max-w-2xl reveal">
                        <span className="text-brand-green text-[11px] font-black tracking-[0.4em] uppercase block mb-6 px-1">Expertise</span>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-brand-dark leading-none">
                            Решения высшей <br /> <span className="text-brand-green italic">категории</span>
                        </h2>
                    </div>
                    <p className="text-brand-dark/40 text-lg max-w-sm font-medium leading-relaxed reveal">
                        Индивидуальный план обслуживания для каждого объекта с использованием инновационных технологий.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {items.map((item, i) => (
                        <div key={i} className="service-card group relative p-1 transition-all reveal">
                            <div className="premium-card rounded-[60px] overflow-hidden p-10 h-full flex flex-col items-start relative z-10">
                                <div className="w-full h-80 rounded-[45px] overflow-hidden mb-12 relative">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="img-reveal w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-accent text-brand-green flex items-center justify-center shadow-inner">
                                        {item.icon}
                                    </div>
                                    <span className="text-[11px] font-black tracking-[0.3em] text-brand-dark/20 uppercase tracking-widest">{item.category}</span>
                                </div>

                                <h3 className="text-4xl font-black text-brand-dark mb-6 tracking-tighter leading-none">{item.title}</h3>
                                <p className="text-brand-dark/40 text-lg font-medium leading-relaxed mb-12 flex-grow">{item.desc}</p>

                                <Link to="/services" className="flex items-center gap-4 text-xs font-black text-brand-dark hover:text-brand-green transition-all uppercase tracking-[0.25em]">
                                    Experience Details
                                    <div className="w-10 h-px bg-brand-dark/10 group-hover:w-20 group-hover:bg-brand-green transition-all duration-500" />
                                </Link>
                            </div>
                            {/* Decorative Gradient Background for card */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-0 rounded-[60px] blur-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
