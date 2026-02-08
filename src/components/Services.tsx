import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const root = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".service-card", {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: root.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }, root);
        return () => ctx.revert();
    }, []);

    const services = [
        {
            title: "Facility",
            subtitle: "Management",
            desc: "Комплексное обслуживание А-класса. Клининг, техническая эксплуатация, охрана и озеленение.",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
            tags: ["Cleaning", "Technical", "Security"]
        },
        {
            title: "Industrial",
            subtitle: "Solutions",
            desc: "Промышленный клининг и обслуживание заводов, месторождений и вахтовых поселков.",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
            tags: ["Mining", "Factory", "Safety"]
        },
        {
            title: "Catering",
            subtitle: "& Events",
            desc: "Организация корпоративного питания. Столовые полного цикла, буфеты и выездные банкеты.",
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200",
            tags: ["Corporate", "Delivery", "Premium"]
        },
        {
            title: "Outstaffing",
            subtitle: "Services",
            desc: "Аутсорсинг линейного персонала. Грузчики, разнорабочие, кассиры и операторы.",
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200",
            tags: ["HR", "Staffing", "Speed"]
        }
    ];

    return (
        <section ref={root} className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <div className="inline-block px-3 py-1 bg-brand-green/10 rounded-full mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Full Cycle</span>
                        </div>
                        <h2 className="text-[clamp(3rem,8vw,100px)] font-black uppercase leading-[0.85] tracking-tighter text-brand-dark">
                            Our <span className="text-brand-green">Expertise</span>
                        </h2>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-right text-gray-400 font-medium max-w-sm">From daily cleaning to complex industrial facility management.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, i) => (
                        <div key={i} className="service-card group relative h-[500px] rounded-[40px] overflow-hidden cursor-pointer">

                            {/* Background Image with Zoom Effect */}
                            <div className="absolute inset-0 bg-gray-200">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
                                <div className="flex justify-between items-start">
                                    <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                                        <span className="text-xs font-bold uppercase tracking-widest">0{i + 1}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white text-brand-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
                                        {service.title}<br /><span className="text-brand-green">{service.subtitle}</span>
                                    </h3>
                                    <p className="text-lg text-white/80 font-medium leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
                                        {service.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                        {service.tags.map((tag, j) => (
                                            <span key={j} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
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

export default Services;
