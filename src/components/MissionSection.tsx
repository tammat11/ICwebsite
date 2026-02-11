import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Heart, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MissionSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Sticky Title Animation (desktop only)
            if (window.innerWidth >= 1024) {
                gsap.to(".mission-title-sticky", {
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        pin: ".mission-title-container",
                        pinSpacing: false,
                        scrub: 1
                    }
                });
            }

            // 2. Connector Line Growth
            gsap.from(".mission-connector-line", {
                scaleY: 0,
                transformOrigin: "top center",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top center",
                    end: "bottom bottom",
                    scrub: 0.5
                }
            });

            // 3. Staggered reveal for blocks
            gsap.utils.toArray<HTMLElement>(".mission-block-entry").forEach((block) => {
                gsap.from(block, {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: block,
                        start: "top 92%",
                    }
                });
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-white relative overflow-hidden" id="mission">
            <div ref={triggerRef} className="max-w-7xl mx-auto px-6 py-20 md:py-56 flex flex-col lg:flex-row gap-10 lg:gap-20">

                {/* L E F T : Sticky Info (The Context) */}
                <div className="w-full lg:w-1/3 mission-title-container">
                    <div className="mission-title-sticky pt-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-[2px] bg-brand-green" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-dark/40">Philosophy</span>
                        </div>

                        <h2 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-[0.8] text-brand-dark mb-12">
                            ДНК <br />
                            <span className="text-brand-green">ЛИДЕРА</span>
                        </h2>

                        <div className="space-y-6 max-w-full lg:max-w-[240px]">
                            <p className="text-sm font-bold text-black/40 uppercase tracking-tight leading-snug">
                                Мы не следуем стандартам. Мы их создаем. Каждое наше действие — это шаг к совершенству.
                            </p>
                            <div className="flex items-center gap-3 text-brand-green group cursor-pointer">
                                <span className="text-[10px] font-black uppercase tracking-widest">Manifesto 2025</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* R I G H T : Immersive Scrolling Content */}
                <div className="w-full lg:w-2/3 space-y-24 md:space-y-64 relative">

                    {/* Vertical Connecting Cable */}
                    <div className="mission-connector-line hidden lg:block absolute -left-10 top-0 w-[1px] h-full bg-gradient-to-b from-brand-green via-brand-dark/10 to-transparent origin-top" />

                    {/* BLOCK 1: MISSION (Massive Impact) */}
                    <div className="mission-block-entry relative pl-0 lg:pl-10">
                        <div className="absolute -left-2 top-0 opacity-[0.05] select-none">
                            <span className="text-[6rem] md:text-[10rem] font-black italic leading-none">01</span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl md:w-16 md:h-16 md:rounded-3xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-6 md:mb-10 shadow-sm border border-brand-green/10">
                                <Target className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-4xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-brand-dark mb-8 leading-[0.9]">
                                МИССИЯ: <br />
                                <span className="text-brand-green">ЧИСТОТА КАК<br /> ИСКУССТВО</span>
                            </h3>
                            <p className="text-xl md:text-3xl font-bold text-black/30 leading-[1.1] max-w-xl">
                                Создавать безупречную чистоту, которая повышает качество жизни и работы наших клиентов.
                            </p>
                            <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">
                                <ShieldCheck size={16} />
                                Verified Standard • 100% Quality
                            </div>
                        </div>
                    </div>

                    {/* BLOCK 2: VISION (Split Layout) */}
                    <div className="mission-block-entry relative pl-0 lg:pl-10">
                        <div className="absolute -left-2 top-0 opacity-[0.05] select-none">
                            <span className="text-[6rem] md:text-[10rem] font-black italic leading-none">02</span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl md:w-16 md:h-16 md:rounded-3xl bg-[#7B85A7]/10 flex items-center justify-center text-[#7B85A7] mb-6 md:mb-10 shadow-sm border border-[#7B85A7]/10">
                                <Eye className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-4xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-brand-dark mb-8 leading-[0.9]">
                                ВИДЕНИЕ: <br />
                                <span className="text-[#7B85A7]">КВАНТОВЫЙ<br /> ПРЫЖОК</span>
                            </h3>
                            <p className="text-xl md:text-3xl font-bold text-black/30 leading-[1.1] max-w-xl">
                                Стать лидером клининговой индустрии Казахстана, устанавливая новые стандарты качества.
                            </p>
                            <div className="mt-12 p-6 md:p-8 bg-slate-50 border border-black/5 rounded-[24px] md:rounded-[40px] max-w-md">
                                <div className="flex items-center gap-4 mb-4">
                                    <Zap size={18} className="text-brand-green" />
                                    <span className="text-xs font-black uppercase tracking-widest text-brand-dark">Focus 2030</span>
                                </div>
                                <p className="text-sm text-black/40 font-bold leading-relaxed">
                                    Мы инвестируем в технологии и людей, чтобы завтрашний день клининга наступил уже сегодня.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BLOCK 3: VALUES (Grid Detail) */}
                    <div className="mission-block-entry relative pl-0 lg:pl-10 pb-20">
                        <div className="absolute -left-2 top-0 opacity-[0.05] select-none">
                            <span className="text-[6rem] md:text-[10rem] font-black italic leading-none">03</span>
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl md:w-16 md:h-16 md:rounded-3xl bg-brand-dark/10 flex items-center justify-center text-brand-dark mb-6 md:mb-10 shadow-sm border border-brand-dark/10">
                                <Heart className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-4xl md:text-7xl font-[1000] uppercase italic tracking-tighter text-brand-dark mb-12 leading-[0.9]">
                                ЦЕННОСТИ: <br />
                                <span className="text-brand-dark/40 italic">ФУНДАМЕНТ</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-10 md:gap-y-16">
                                <div className="space-y-4">
                                    <h4 className="text-xl md:text-2xl font-black text-brand-green uppercase italic tracking-tight">Качество</h4>
                                    <p className="text-sm font-bold text-black/40 leading-snug">Бескомпромиссный контроль на каждом этапе.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl md:text-2xl font-black text-brand-green uppercase italic tracking-tight">Инновации</h4>
                                    <p className="text-sm font-bold text-black/40 leading-snug">Использование лучших мировых технологий.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl md:text-2xl font-black text-brand-green uppercase italic tracking-tight">Надежность</h4>
                                    <p className="text-sm font-bold text-black/40 leading-snug">Стабильность и выполнение обязательств.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl md:text-2xl font-black text-brand-green uppercase italic tracking-tight">Забота</h4>
                                    <p className="text-sm font-bold text-black/40 leading-snug">Искреннее отношение к клиентам и людям.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Aesthetic Background Detail */}
            <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
                <span className="text-[10vh] md:text-[20vh] font-black uppercase tracking-tighter leading-none">MANIFESTO</span>
            </div>
        </section>
    );
};

export default MissionSection;
