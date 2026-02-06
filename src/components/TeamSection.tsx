import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const team = [
    {
        name: "Алексей Смирнов",
        role: "Head of Operations",
        quote: "Мы не просто убираем помещения, мы создаем среду для продуктивности.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3000&auto=format&fit=crop"
    },
    {
        name: "Мария Касымова",
        role: "Quality Assurance",
        quote: "Цифровой контроль позволяет нам видеть каждую деталь на объекте 24/7.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3000&auto=format&fit=crop"
    },
    {
        name: "Ержан Талгатов",
        role: "Strategic Partner",
        quote: "Лидерство — это ответственность за каждый квадратный метр наших клиентов.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3000&auto=format&fit=crop"
    }
];

const TeamSection = () => {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".team-reveal", { opacity: 0, y: 30 });
            gsap.to(".team-reveal", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top 85%",
                    once: true
                },
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="py-40 px-6 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
                    <div className="max-w-2xl team-reveal">
                        <span className="text-brand-green text-[11px] font-black tracking-[0.4em] uppercase block mb-6">Human Factor</span>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-brand-dark leading-[0.85]">
                            Наши <span className="text-brand-green italic">Герои</span>
                        </h2>
                    </div>
                    <p className="text-brand-dark/40 text-xl font-medium max-w-sm mb-4 team-reveal">
                        Люди, которые стоят за каждым системным решением и блестящим результатом.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {team.map((member, i) => (
                        <div key={i} className="team-reveal group">
                            <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden mb-8 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-start gap-4 text-white">
                                        <Quote className="text-brand-green shrink-0" size={24} />
                                        <p className="text-sm font-medium italic leading-relaxed">{member.quote}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-brand-dark mb-1">{member.name}</h4>
                                <p className="text-xs font-black uppercase tracking-widest text-brand-green">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
