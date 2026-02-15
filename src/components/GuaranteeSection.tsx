import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Lock, BadgeCheck, Users, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GuaranteeSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const rotatingTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Seal floating animation
            gsap.to([sealRef.current, rotatingTextRef.current], {
                y: -20,
                rotationZ: 1,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // 2. Cards layout: Peeking from behind the large circle
            const cards = gsap.utils.toArray<HTMLElement>(".guarantee-card");

            // Initial state: Hidden behind the seal
            // We set z-index to 10 so they are above the rotating text (z-5) but below the seal (z-20)
            gsap.set(cards, {
                scale: 0.5,
                opacity: 0,
                x: 0,
                y: 0,
                rotate: 0,
                zIndex: 10
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.to(cards, {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: "expo.out",
                stagger: 0.1,
                x: (i) => {
                    if (window.innerWidth < 768) {
                        const mobileX = [-85, 85, -85, 85];
                        return mobileX[i];
                    }
                    const xPositions = [-440, -360, 360, 440];
                    return xPositions[i];
                },
                y: (i) => {
                    if (window.innerWidth < 768) {
                        const mobileY = [240, 240, 410, 410];
                        return mobileY[i];
                    }
                    const yPositions = [-160, 180, -160, 180];
                    return yPositions[i];
                },
                rotate: (i) => {
                    if (window.innerWidth < 768) return 0;
                    const rotations = [-10, -5, 5, 10];
                    return rotations[i];
                }
            });

            // 3. Seal Entrance
            gsap.from([sealRef.current, rotatingTextRef.current], {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    once: true
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const guarantees = [
        {
            icon: <BadgeCheck className="text-brand-green" />,
            title: "Европейские стандарты",
            desc: "Используем только сертифицированную химию и оборудование",
        },
        {
            icon: <Users className="text-brand-green" />,
            title: "Обученный персонал",
            desc: "Каждый сотрудник проходит аттестацию в академии",
        },
        {
            icon: <Lock className="text-brand-green" />,
            title: "Страхование ответственности",
            desc: "Ваше имущество застраховано до 100 млн ₸",
        },
        {
            icon: <Zap className="text-brand-green" />,
            title: "Оперативный контроль",
            desc: "Реакция на любые замечания в течение 2 часов",
        }
    ];

    return (
        <section ref={sectionRef} className="relative py-12 md:py-20 bg-brand-light overflow-hidden" style={{ perspective: '2000px' }}>

            {/* Background Base */}
            <div className="absolute inset-0 bg-brand-light" />

            <div className="max-w-7xl mx-auto px-6 relative flex flex-col items-center">

                {/* Header- Improved with brand-secondary */}
                <div className="text-center mb-16 md:mb-24 z-30">
                    <h2 className="text-[clamp(2rem,6vw,80px)] font-[1000] text-brand-dark uppercase tracking-tighter leading-none mb-4">
                        ПЕЧАТЬ <br />
                        <span className="text-brand-green">НАДЕЖНОСТИ</span>
                    </h2>
                    <p className="text-base md:text-xl text-brand-secondary font-[1000] uppercase tracking-[0.2em] drop-shadow-sm">Гарантия качества №1 в Казахстане</p>
                </div>

                {/* Central Composition */}
                <div className="relative flex flex-col items-center justify-center w-full min-h-[750px] md:h-[600px]">

                    {/* 1. LAYER: Rotating Text & Orbital Paths (Technical background) */}
                    <div ref={rotatingTextRef} className="absolute top-0 md:inset-0 flex items-center justify-center z-[5] pointer-events-none opacity-[0.15] md:opacity-20 transform -translate-y-20 md:translate-y-0">
                        <div className="w-[300px] h-[300px] md:w-[640px] md:h-[640px] relative">
                            {/* Orbital Path Lines - Subtle technical detail */}
                            <div className="absolute inset-0 border border-brand-secondary/10 rounded-full scale-[0.85]" />
                            <div className="absolute inset-0 border border-brand-secondary/5 rounded-full scale-[1.1]" />

                            <svg className="w-full h-full animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
                                <defs>
                                    <path id="circlePathBack" d="M 50, 50 m -45, 0 a 45, 45 0 1, 1 90, 0 a 45, 45 0 1, 1 -90, 0" />
                                </defs>
                                <text className="text-[3.5px] font-[1000] uppercase tracking-[1.4em] fill-brand-secondary">
                                    <textPath xlinkHref="#circlePathBack">
                                        • IC Group Premium Quality • Trusted Partner Kazakhstan • Leading Facility Services •
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* 2. LAYER: The Cards (Peeking with precise offsets for beauty) */}
                    <div className="absolute top-0 md:inset-0 flex items-center justify-center z-30 pointer-events-none transform -translate-y-20 md:translate-y-0">
                        {guarantees.map((item, i) => {
                            // Precise offsets for a 'flower' or 'orbit' effect
                            return (
                                <div key={i} className="guarantee-card absolute w-[160px] md:w-[340px] pointer-events-auto">
                                    <div className={`bg-white/95 backdrop-blur-3xl border border-black/5 p-4 md:p-10 rounded-[32px] md:rounded-[50px] shadow-[0_30px_70px_rgba(0,0,0,0.05)] transition-all duration-700 ${i % 2 === 0 ? 'hover:border-brand-green/30' : 'hover:border-brand-secondary/30'} hover:-translate-y-4 group ring-1 ring-black/5 relative overflow-hidden h-[160px] md:h-auto flex flex-col justify-center`}>

                                        {/* Internal Glow on Hover */}
                                        <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full ${i % 2 === 0 ? 'bg-brand-green' : 'bg-brand-secondary'}`} />

                                        <div className={`w-8 h-8 md:w-16 md:h-16 rounded-[12px] md:rounded-[24px] ${i % 2 === 0 ? 'bg-brand-green/10 text-brand-green group-hover:bg-brand-green' : 'bg-brand-secondary/10 text-brand-secondary group-hover:bg-brand-secondary'} flex items-center justify-center mb-4 md:mb-8 group-hover:text-white transition-all duration-700 shadow-sm relative z-10 mx-auto md:mx-0`}>
                                            <div className="scale-75 md:scale-125 transition-transform duration-500">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <h4 className={`text-xs md:text-2xl font-[1000] text-brand-dark uppercase tracking-tight mb-2 md:mb-4 leading-[1.1] md:leading-[0.9] ${i % 2 === 0 ? 'group-hover:text-brand-green' : 'group-hover:text-brand-secondary'} transition-colors relative z-10 text-center md:text-left`}>
                                            {item.title}
                                        </h4>
                                        <p className="hidden md:block text-[13px] text-black/40 font-bold leading-relaxed relative z-10">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 3. LAYER: Central Seal Main Body (Heavier Depth) */}
                    <div ref={sealRef} className="relative z-20 w-64 h-64 md:w-[520px] md:h-[520px] flex items-center justify-center transform -translate-y-24 md:translate-y-0">

                        {/* 3D Glass Layers - More pronounced depth */}
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 ring-1 ring-black/5 shadow-2xl" />
                        <div className="absolute inset-4 bg-white/80 rounded-full border border-black/5" />

                        {/* Technical Precision Markings */}
                        <div className="absolute inset-0 border border-brand-secondary/5 rounded-full scale-[0.92]" />
                        <div className="absolute inset-0 border border-brand-secondary/5 rounded-full scale-[0.88] border-dashed" />

                        {/* Rotating Decorative Rings */}
                        <div className="absolute inset-12 border border-brand-secondary/20 border-dotted rounded-full animate-[spin_60s_linear_infinite] opacity-40" />
                        <div className="absolute inset-16 border border-brand-green/10 rounded-full" />

                        {/* Main Shield Icon */}
                        <div className="relative z-30 flex flex-col items-center">
                            <div className="p-8 md:p-12 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-black/5 mb-4 md:mb-8 group relative">
                                <Shield size={60} className="md:w-[120px] md:h-[120px] text-brand-secondary drop-shadow-[0_0_30px_rgba(123,133,167,0.3)] transition-all duration-700 group-hover:scale-110 group-hover:text-brand-green" fill="currentColor" fillOpacity={0.05} />
                                <div className="absolute inset-0 bg-brand-secondary/5 rounded-full blur-2xl group-hover:bg-brand-green/10 transition-colors" />
                            </div>
                            <div className="text-center space-y-1 md:space-y-3">
                                <div className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-brand-secondary/60">Quality Anchor</div>
                                <div className="text-3xl md:text-7xl font-[1000] text-brand-dark uppercase tracking-[-0.05em] leading-none">PREMIUM</div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default GuaranteeSection;
