import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, MapPin, Building2, ShieldCheck, Zap, Award, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const StatsGrid = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const stats = [
        // Balanced Chaos Composition
        { value: "3,500+", label: "People", icon: <Users size={32} />, x: "-2%", y: "10%", speed: 0.9, size: "lg", zIndex: 10, rotation: -4 },
        { value: "1.2M", label: "Managed M²", icon: <MapPin size={32} />, x: "78%", y: "5%", speed: 1.6, size: "lg", zIndex: 15, rotation: 6 },
        { value: "12", label: "Years Exp", icon: <Award size={32} />, x: "33%", y: "-10%", speed: 0.6, size: "sm", zIndex: 20, rotation: -8 },

        // Mid Layer
        { value: "40%", label: "Market Share", icon: <TrendingUp size={20} />, x: "15%", y: "22%", speed: 1.8, size: "md", zIndex: 25, rotation: 5 },
        { value: "Top 1", label: "Industry", icon: <Star size={24} />, x: "46%", y: "0%", speed: 1.1, size: "md", zIndex: 5, rotation: -2 },
        { value: "98%", label: "Loyalty", icon: <ShieldCheck size={32} />, x: "80%", y: "68%", speed: 1.4, size: "lg", zIndex: 30, rotation: -5 },

        // Bottom Distributed
        { value: "500+", label: "Equipment", icon: <Zap size={32} />, x: "2%", y: "80%", speed: 1.3, size: "lg", zIndex: 10, scale: 1.05, rotation: 8 },
        { value: "250+", label: "Clients", icon: <Building2 size={32} />, x: "25%", y: "90%", speed: 2.1, size: "md", zIndex: 35, rotation: -3 },
        { value: "17", label: "Branches", icon: <MapPin size={28} />, x: "65%", y: "92%", speed: 0.8, size: "md", zIndex: 10, rotation: 4 },
    ];

    // Ambient Particles (More green)
    const particles = [...Array(60)].map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 1,
        color: ['#83b643', '#83b643', '#83b643', '#0a0a0a', '#cccccc'][Math.floor(Math.random() * 5)], // 60% Green
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1
    }));

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>(".parallax-item");

            items.forEach((item) => {
                const speed = parseFloat(item.getAttribute('data-speed') || '1');
                gsap.to(item, {
                    y: -120 * speed, // Reduced intensity for compact view
                    ease: "none",
                    force3D: true,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.8
                    }
                });
            });

            // Floating animation on INNER wrapper to avoid Y conflict
            gsap.to(".parallax-card-inner", {
                y: "random(-15, 15)",
                rotate: "random(-2, 2)",
                duration: "random(2.5, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                force3D: true
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-24 bg-white relative overflow-hidden" id="stats">

            {/* Ambient Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none z-0">
                <div className="text-[25vw] font-black uppercase tracking-tighter">METRICS HUB</div>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 relative z-10 h-[650px] md:h-[750px]">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20 w-full">
                    <h2 className="text-[clamp(2.5rem,8vw,90px)] font-black text-brand-dark tracking-[-0.05em] leading-[0.9] uppercase pointer-events-none">
                        Наш масштаб <br />
                        <span className="text-brand-green italic">в потоке</span>
                    </h2>
                </div>

                {/* Particles Layer */}
                <div className="absolute inset-0 pointer-events-none">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            data-speed={p.speed}
                            className="parallax-item absolute rounded-full blur-[0.5px]"
                            style={{
                                left: p.x,
                                top: p.y,
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                opacity: p.opacity,
                                zIndex: 5
                            }}
                        />
                    ))}
                </div>

                {/* Parallax Elements Layer with Chaos */}
                <div className="absolute inset-0 w-full h-full">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            data-speed={stat.speed}
                            className={`parallax-item parallax-card absolute bg-white border border-black/5 rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_100px_rgba(131,182,67,0.12)] transition-shadow duration-500 hover:z-[60] cursor-default will-change-transform
                                ${stat.size === 'lg' ? 'w-48 h-48 md:w-64 md:h-64' : stat.size === 'md' ? 'w-40 h-40 md:w-52 md:h-52' : 'w-32 h-32 md:w-44 md:h-44'}`}
                            style={{
                                left: stat.x,
                                top: stat.y,
                                zIndex: (stat as any).zIndex || 10,
                                transform: `scale(${(stat as any).scale || 1}) rotate(${(stat as any).rotation || 0}deg)`
                            }}
                        >
                            <div className="parallax-card-inner w-full h-full flex flex-col items-center justify-center p-6 md:p-10 relative">
                                <div className="text-brand-green mb-4 opacity-50 shrink-0">
                                    {stat.icon}
                                </div>
                                <div className="text-center">
                                    <div className={`font-black text-brand-dark tracking-tighter leading-none mb-1
                                        ${stat.size === 'lg' ? 'text-3xl md:text-5xl' : stat.size === 'md' ? 'text-2xl md:text-4xl' : 'text-xl md:text-3xl'}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30 whitespace-nowrap">
                                        {stat.label}
                                    </div>
                                </div>

                                {/* Corner Tech Detail */}
                                <div className="absolute top-4 right-6 text-[8px] font-mono text-brand-dark/10">
                                    S_{i + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Float Decorators */}
            <div className="absolute top-10 left-[20%] w-32 h-32 border border-brand-green/5 rounded-full" />
            <div className="absolute bottom-10 right-[20%] w-48 h-48 border border-brand-green/5 rounded-full" />

        </section>
    );
};

export default StatsGrid;
