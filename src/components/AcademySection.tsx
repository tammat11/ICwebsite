import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Clock, Leaf, Smartphone, CheckCircle2, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AcademySection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Safer Animation
            gsap.set(".advantage-card", {
                scale: 0.9,
                opacity: 0,
                y: 50
            });

            gsap.to(".advantage-card", {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 95%", // Almost immediately
                    toggleActions: "play none none reverse"
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const cards = [
        {
            title: "Safety",
            subtitle: "Security First",
            desc: "100% vetted personnel. Biometric access & daily health checks.",
            icon: <ShieldCheck size={32} />,
            bg: "bg-gradient-to-br from-white to-gray-50",
            text: "text-brand-dark",
            border: "border-gray-200",
            accent: "bg-blue-500"
        },
        {
            title: "Speed",
            subtitle: "2h Response",
            desc: "Mobile crews ready for rapid deployment anywhere.",
            icon: <Clock size={32} />,
            bg: "bg-gradient-to-br from-brand-green to-teal-500",
            text: "text-white",
            border: "border-brand-green",
            accent: "bg-white"
        },
        {
            title: "Eco",
            subtitle: "Green Tech",
            desc: "EU Ecolabel chemicals safe for kids & pets.",
            icon: <Leaf size={32} />,
            bg: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]",
            text: "text-brand-green",
            border: "border-green-100",
            accent: "bg-green-600"
        },
        {
            title: "Digital",
            subtitle: "App Control",
            desc: "Real-time monitoring via proprietary mobile app.",
            icon: <Smartphone size={32} />,
            bg: "bg-gradient-to-br from-gray-900 to-black",
            text: "text-white",
            border: "border-brand-dark",
            accent: "bg-brand-green"
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-6">
                            <Star size={14} className="text-brand-green fill-brand-green" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Premium Service</span>
                        </div>
                        <h2 className="text-[clamp(3.5rem,8vw,100px)] font-black uppercase leading-[0.85] tracking-tighter text-brand-dark">
                            Why <span className="text-brand-green">Us?</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <div key={i} className={`advantage-card relative p-8 rounded-[32px] ${card.bg} ${card.border} border shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-[400px] group overflow-hidden opacity-0`}>

                            {/* Abstract Bg Shape */}
                            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${card.accent} opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                            <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full ${card.accent} opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-500`} />

                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${card.text === 'text-white' ? 'bg-white/20 backdrop-blur text-white border border-white/20' : 'bg-white text-brand-dark shadow-md'}`}>
                                    {card.icon}
                                </div>
                                <div className={`text-xs font-bold uppercase tracking-widest ${card.text === 'text-white' ? 'opacity-80' : 'text-gray-400'} mb-2`}>
                                    {card.subtitle}
                                </div>
                                <h3 className={`text-4xl font-black uppercase tracking-tighter mb-4 ${card.text}`}>
                                    {card.title}
                                </h3>
                            </div>

                            <div className={`relative z-10 text-sm font-medium leading-relaxed ${card.text === 'text-white' ? 'opacity-90' : 'text-gray-500'}`}>
                                {card.desc}
                            </div>

                            {/* Hover Arrow */}
                            <div className={`absolute top-8 right-8 ${card.text} opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0`}>
                                <CheckCircle2 size={24} />
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default AcademySection;
