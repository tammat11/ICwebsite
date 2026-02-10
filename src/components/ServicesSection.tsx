import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
    { title: "Уборка офисов", desc: "Ежедневная и генеральная уборка бизнес-центров и офисных помещений." },
    { title: "Индустриальный клининг", desc: "Профессиональный уход за производственными и складскими площадями." },
    { title: "Мойка фасадов", desc: "Высотные работы и бережное очищение любых фасадных покрытий." },
    { title: "Химчистка", desc: "Глубокая чистка ковровых покрытий и мягкой мебели на объекте." },
];

const ServicesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".service-card", {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 bg-brand-light relative z-10" id="services">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter">
                        Наши клининговые <br /> <span className="text-brand-green">услуги</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="service-card group bg-white border border-black/5 p-10 rounded-[40px] hover:bg-brand-green hover:border-brand-green transition-all duration-500 cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:bg-white group-hover:text-brand-green mb-8 transition-colors">
                                <span className="font-black text-xl">{i + 1}</span>
                            </div>
                            <h3 className="text-2xl font-black text-brand-dark group-hover:text-white mb-4 leading-tight transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-brand-dark/40 group-hover:text-white/80 text-sm font-bold leading-relaxed transition-colors">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
