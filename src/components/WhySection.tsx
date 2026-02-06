import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Cpu, Globe, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
    {
        title: "Масштаб и Опыт",
        desc: "Более 12 лет мы задаем стандарты индустрии в Казахстане. Наша команда из 3000+ сертифицированных специалистов обеспечивает чистоту на объектах любой сложности — от бизнес-центров класса А до промышленных гигантов.",
        icon: <Globe size={40} />,
        color: "bg-white"
    },
    {
        title: "AI-Контроль",
        desc: "Мы внедрили собственную цифровую экосистему на базе искусственного интеллекта. Клиентский портал работает 24/7, обеспечивая полную прозрачность процессов и мгновенную реакцию на запросы в реальном времени.",
        icon: <Cpu size={40} />,
        color: "bg-white"
    },
    {
        title: "Технологии",
        desc: "Используем только передовое оборудование от мировых лидеров (Kärcher, Tennant) и 100% биоразлагаемые химические средства. Экологичность и безопасность — наш безусловный приоритет.",
        icon: <Zap size={40} />,
        color: "bg-white"
    },
    {
        title: "Надежность",
        desc: "Полное страхование ответственности и соответствие международным стандартам ISO 9001, 14001, 45001. Мы берем на себя все риски, чтобы вы могли сосредоточиться исключительно на развитии вашего бизнеса.",
        icon: <ShieldCheck size={40} />,
        color: "bg-white"
    }
];

const WhySection = () => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            if (!trackRef.current || !triggerRef.current) return;

            const totalScroll = trackRef.current.scrollWidth - window.innerWidth + 400;

            // Title Animation on Scroll
            gsap.from(".why-title", {
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top 90%",
                    end: "top 40%",
                    scrub: 1
                },
                y: 80,
                opacity: 0,
                ease: "none"
            });

            // Horizontal Scroll Pinned Animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1.5,
                    anticipatePin: 1,
                    start: "top top",
                    end: () => `+=${totalScroll}`,
                    invalidateOnRefresh: true,
                }
            });

            tl.to(trackRef.current, {
                x: -totalScroll,
                ease: "none"
            });

            // Card Animations inside the timeline or triggered by horizontal position
            const cards = gsap.utils.toArray<HTMLElement>(".why-card");
            cards.forEach((card) => {
                gsap.fromTo(card,
                    { opacity: 0.3, scale: 0.92 },
                    {
                        opacity: 1,
                        scale: 1,
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: tl, // This is key for horizontal scroll reveal
                            start: "left 80%",
                            end: "center center",
                            scrub: true,
                        }
                    }
                );
            });
        });

        mm.add("(max-width: 1023px)", () => {
            // Vertical Stagger for Mobile
            gsap.from(".why-card", {
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <div ref={triggerRef} className="bg-brand-light overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-32">
                <h2 className="why-title text-5xl md:text-[100px] font-black tracking-tighter text-brand-dark leading-none">
                    ПОЧЕМУ <span className="text-brand-green italic">ВЫБИРАЮТ НАС</span>
                </h2>
            </div>

            <div ref={trackRef} className="flex px-[10vw] gap-10 pb-40 h-full items-stretch w-max">
                {reasons.map((r, i) => (
                    <div key={i} className={`why-card min-w-[350px] md:min-w-[600px] p-12 md:p-16 rounded-[60px] ${r.color} border border-black/5 flex flex-col group hover:border-brand-green/30 transition-colors shadow-2xl relative overflow-hidden bg-white`}>
                        <div className="absolute top-0 right-0 p-8 text-9xl font-black text-brand-green/10 pointer-events-none group-hover:text-brand-green/20 transition-colors">
                            0{i + 1}
                        </div>
                        <div className="w-24 h-24 rounded-3xl bg-brand-light flex items-center justify-center mb-12 border border-black/5 group-hover:bg-brand-green group-hover:scale-110 transition-all duration-500">
                            <span className="text-brand-green group-hover:text-white transition-colors">{r.icon}</span>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight leading-none">{r.title}</h3>
                            <p className="text-brand-dark/50 text-xl font-medium leading-relaxed max-w-sm">{r.desc}</p>
                        </div>
                        <div className="mt-12 pt-8 border-t border-black/5 flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-brand-green" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-dark/20">Engineering Purity</span>
                        </div>
                    </div>
                ))}
                <div className="min-w-[10vw]" />
            </div>
        </div>
    );
};

export default WhySection;
