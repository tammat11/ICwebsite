import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, PenTool, Rocket, Activity, Cpu, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MethodSection = () => {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Cards entrance with safety check
            gsap.from(".method-bento-card", {
                scrollTrigger: {
                    trigger: ".bento-grid",
                    start: "top 85%",
                },
                scale: 0.98,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out"
            });

            // Spotlight effect logic
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const rect = root.current?.getBoundingClientRect();
                if (!rect) return;

                const x = clientX - rect.left;
                const y = clientY - rect.top;

                gsap.to(".bento-spotlight", {
                    left: x,
                    top: y,
                    duration: 0.6,
                    ease: "power2.out"
                });
            };

            root.current?.addEventListener("mousemove", handleMouseMove);
            return () => root.current?.removeEventListener("mousemove", handleMouseMove);
        }, root);

        return () => ctx.revert();
    }, []);

    const steps = [
        {
            id: "01",
            code: "SCAN.SYS",
            title: "Цифровой Аудит",
            desc: "Лазерное сканирование пространства для создания прецизионных карт чистоты.",
            icon: <Search className="w-5 h-5" />,
            span: "col-span-12 lg:col-span-7",
            img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&q=80&w=1200",
            tags: ["Lidar", "Logistics"]
        },
        {
            id: "02",
            code: "BIO.TECH",
            title: "Инженерный Подбор",
            desc: "Молекулярный анализ поверхностей и подбор химии.",
            icon: <PenTool className="w-5 h-5" />,
            span: "col-span-12 lg:col-span-5",
            img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&q=80&w=1200",
            tags: ["Chemistry", "Robotics"]
        },
        {
            id: "03",
            code: "UNIT.OPS",
            title: "Деплоймент",
            desc: "Мгновенное развертывание операционных штабов на объекте.",
            icon: <Rocket className="w-5 h-5" />,
            span: "col-span-12 lg:col-span-5",
            img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&q=80&w=1200",
            tags: ["Operations"]
        },
        {
            id: "04",
            code: "AI.CTRL",
            title: "AI-Контроль",
            desc: "Мониторинг эталонного качества 24/7 через системы машинного зрения.",
            icon: <Activity className="w-5 h-5" />,
            span: "col-span-12 lg:col-span-7",
            img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&q=80&w=1200",
            tags: ["Vision AI"]
        }
    ];

    return (
        <section ref={root} className="py-24 md:py-40 px-6 bg-brand-dark overflow-hidden relative border-t border-white/5">
            {/* Spotlight Layer */}
            <div className="bento-spotlight absolute w-[600px] h-[600px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 opacity-30 blur-[100px]"
                style={{ background: 'radial-gradient(circle at center, rgba(131, 182, 67, 0.2) 0%, transparent 70%)' }}>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <span className="text-brand-green text-[10px] font-black tracking-[0.5em] uppercase block mb-6 animate-pulse px-4 py-1.5 border border-brand-green/20 rounded-full w-fit">
                            Engineering Excellence
                        </span>
                        <h2 className="text-[clamp(2.5rem,7.5vw,110px)] font-black tracking-tighter text-white leading-[0.85] uppercase">
                            КАК МЫ <br />
                            <span className="text-brand-green italic">РАБОТАЕМ</span>
                        </h2>
                    </div>

                    <div className="max-w-xs pb-4">
                        <div className="flex items-center gap-3 text-white/20 mb-4 font-mono">
                            <Cpu size={12} />
                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Protocol IC.v2</span>
                        </div>
                        <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed border-l-2 border-brand-green pl-6">
                            Мы превратили клининг в высокоточный инженерный процесс, где каждый шаг контролируется данными.
                        </p>
                    </div>
                </div>

                <div className="bento-grid grid grid-cols-12 gap-6 relative z-10">
                    {steps.map((step, i) => (
                        <div key={i} className={`method-bento-card group relative overflow-hidden rounded-[40px] md:rounded-[60px] bg-[#1E2223] border border-white/10 h-[400px] md:h-[480px] ${step.span} transition-all duration-700 hover:border-brand-green/40 [perspective:1000px] shadow-2xl`}>

                            {/* Card Content Overlay */}
                            <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative z-20 transition-all duration-700 group-hover:[transform:translateZ(20px)] group-hover:scale-[0.97]">

                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-light/5 border border-white/10 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-brand-dark transition-all duration-500 shadow-xl">
                                            {step.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-brand-green font-black text-[9px] tracking-[0.5em] mb-1">{step.code}</span>
                                            <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{step.title}</h3>
                                        </div>
                                    </div>
                                    <div className="text-5xl md:text-7xl font-black text-white/5 italic leading-none group-hover:text-brand-green/10 transition-colors select-none">
                                        {step.id}
                                    </div>
                                </div>

                                <div className="max-w-sm">
                                    <p className="text-white/60 text-base md:text-lg font-medium leading-snug italic mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {step.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {step.tags.map((tag, j) => (
                                            <span key={j} className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] px-3 py-1.5 border border-white/10 rounded-md bg-white/5 group-hover:border-brand-green/30 group-hover:text-brand-green transition-all">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Background Container */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={step.img}
                                    alt={step.title}
                                    className="w-full h-full object-cover opacity-20 grayscale scale-110 group-hover:scale-100 group-hover:opacity-40 group-hover:grayscale-0 transition-all duration-[2.5s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />

                                {/* Scanning Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-brand-green/30 blur-sm pointer-events-none opacity-0 group-hover:animate-scan-y" />
                            </div>

                            {/* Tech HUD Icon */}
                            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-60 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <MousePointer2 className="text-brand-green w-5 h-5 rotate-[-45deg] drop-shadow-[0_0_10px_rgba(131,182,67,0.5)]" />
                                <div className="absolute inset-0 rounded-full border border-brand-green animate-ping opacity-20" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Analytics Mockup */}
                <div className="mt-20 pt-16 border-t border-white/5 flex flex-wrap gap-12 justify-center opacity-40 hover:opacity-100 transition-all duration-1000">
                    {[
                        { label: "Engineering Precision", val: "±0.04mm" },
                        { label: "Deployment Speed", val: "< 2.0h" },
                        { label: "Quality Audit Index", val: "99.98" },
                    ].map((stat, i) => (
                        <div key={i} className="flex gap-4 items-center group">
                            <div className="w-1 h-8 bg-brand-green/20 group-hover:bg-brand-green transition-colors" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] mb-1">{stat.label}</span>
                                <span className="text-brand-green font-black text-sm tracking-widest">{stat.val}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scan-y {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan-y {
                    animation: scan-y 3.5s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default MethodSection;
