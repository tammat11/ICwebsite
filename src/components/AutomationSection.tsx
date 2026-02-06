import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Zap, BarChart3, Fingerprint } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AutomationSection = () => {
    const root = useRef<HTMLDivElement>(null);
    const graphRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text and icon reveals
            gsap.set(".auto-reveal", { opacity: 0, y: 30 });
            gsap.to(".auto-reveal", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top 95%", // Start earlier
                    once: true
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });

            // Graph lines animation (Rising from bottom + Drawing)
            const paths = graphRef.current?.querySelectorAll('.graph-line');
            if (paths) {
                gsap.set(paths, {
                    strokeDasharray: 2000,
                    strokeDashoffset: 2000,
                    opacity: 0,
                    y: 100
                });

                gsap.to(paths, {
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top 90%", // Start much earlier
                        end: "top 20%",   // Finish much earlier (at 20% of viewport)
                        scrub: 1,
                    },
                    strokeDashoffset: 0,
                    opacity: 0.8,
                    y: 0,
                    stagger: 0.2,
                    ease: "none"
                });
            }

            // Glow pulses
            gsap.to(".glow-node", {
                scale: 1.5,
                opacity: 1,
                duration: 2,
                repeat: -1,
                yoyo: true,
                stagger: 0.5,
                ease: "sine.inOut"
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="py-32 px-6 relative overflow-hidden bg-white">
            {/* Structured Data Graph Background */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-30">
                <svg
                    ref={graphRef}
                    viewBox="0 0 1000 600"
                    className="w-full h-full max-w-7xl px-20"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#83B643" strokeWidth="0.5" strokeOpacity="0.1" />
                        </pattern>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#83B643" stopOpacity="0" />
                            <stop offset="50%" stopColor="#83B643" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#83B643" stopOpacity="1" />
                        </linearGradient>
                    </defs>

                    {/* Grid Background */}
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Axis Lines */}
                    <line x1="0" y1="580" x2="1000" y2="580" stroke="#83B643" strokeOpacity="0.2" strokeWidth="2" />
                    <line x1="20" y1="0" x2="20" y2="600" stroke="#83B643" strokeOpacity="0.2" strokeWidth="2" />

                    {/* Data Lines - More angular/technical */}
                    <path
                        className="graph-line"
                        d="M20,550 L200,500 L300,520 L450,350 L600,300 L750,150 L1000,50"
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />
                    <path
                        className="graph-line"
                        d="M20,580 L150,530 L350,480 L500,420 L650,450 L850,220 L1000,180"
                        fill="none"
                        stroke="#83B643"
                        strokeOpacity="0.4"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />

                    {/* Animated Nodes */}
                    <circle cx="450" cy="350" r="6" fill="#83B643" className="glow-node" />
                    <circle cx="750" cy="150" r="8" fill="#83B643" className="glow-node" />
                    <circle cx="1000" cy="50" r="10" fill="#83B643" className="glow-node" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 xl:gap-40 items-center">
                <div className="text-left pr-4">
                    <div className="auto-reveal inline-flex items-center gap-3 bg-brand-green/10 text-brand-green px-5 py-2 rounded-full font-black text-[11px] tracking-[0.4em] uppercase mb-10 shadow-sm">
                        <Cpu size={14} />
                        Next-Gen Automation
                    </div>
                    <h2 className="auto-reveal text-7xl md:text-[90px] xl:text-[110px] font-black tracking-tighter text-brand-dark mb-10 leading-[0.85]">
                        УПРАВЛЯЕМ <br /> <span className="text-brand-green italic">ДАННЫМИ</span>
                    </h2>
                    <p className="auto-reveal text-xl md:text-2xl text-brand-dark/40 font-medium leading-tight max-w-lg mb-12">
                        Мы внедрили сквозную автоматизацию всех процессов: от контроля расхода химии до GPS-трекинга.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="auto-reveal group p-8 rounded-[40px] border border-black/5 hover:border-brand-green/20 transition-all bg-white/80 backdrop-blur-xl shadow-sm">
                            <Zap className="text-brand-green mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className="font-black text-lg mb-2">Real-time Response</h4>
                            <p className="text-sm text-brand-dark/40 font-medium leading-snug">Среднее время реакции — 14 минут.</p>
                        </div>
                        <div className="auto-reveal group p-8 rounded-[40px] border border-black/5 hover:border-brand-green/20 transition-all bg-white/80 backdrop-blur-xl shadow-sm">
                            <Fingerprint className="text-brand-green mb-6 group-hover:scale-110 transition-transform" />
                            <h4 className="font-black text-lg mb-2">Quality Fingerprint</h4>
                            <p className="text-sm text-brand-dark/40 font-medium leading-snug">Каждая уборка в цифровом паспорте.</p>
                        </div>
                    </div>
                </div>

                <div className="auto-reveal hidden lg:block premium-card rounded-[60px] p-12 xl:p-20 relative overflow-hidden bg-brand-dark text-white border-none shadow-3xl text-left">
                    <BarChart3 className="text-brand-green mb-10 w-16 h-16" />
                    <h3 className="text-4xl xl:text-5xl font-black mb-10 tracking-tighter leading-none">Эффективность<br />без компромиссов</h3>
                    <ul className="space-y-6">
                        {[
                            "Оптимизация штата на 15%",
                            "Снижение расхода материалов на 22%",
                            "Прозрачность 100% операций",
                            "Интеграция с ERP клиента"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-lg font-bold">
                                <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_10px_#83B643]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-20 pt-10 border-t border-white/5 opacity-30 text-[10px] font-black uppercase tracking-[0.4em]">
                        Performance Stats 2026
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AutomationSection;
