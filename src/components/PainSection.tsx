import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, CheckCircle2, ShieldCheck, LayoutDashboard, Globe, Zap, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PainSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {


            // 2. Bento Cards Entrance - Pop in with bounce
            gsap.fromTo(".bento-card",
                { y: 60, opacity: 0, scale: 0.98 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    stagger: 0.15,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.8)",
                    scrollTrigger: {
                        trigger: ".benefit-cards-grid",
                        start: "top 95%",
                    }
                }
            );



        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-12 md:py-16 bg-white overflow-hidden text-brand-dark" id="benefits">

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* THE BENTO GRID - Apple / Linear Aesthetic (Light) */}
                <div className="benefit-cards-grid grid grid-cols-1 sm:grid-cols-12 gap-4 md:gap-10">

                    {/* CARD 1: CONTROL (Puffy Glass Style) */}
                    <div className="bento-card col-span-1 sm:col-span-7 group relative">
                        <div className="h-full bg-slate-50 border border-black/[0.04] rounded-[24px] md:rounded-[40px] p-5 md:p-10 flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-xl hover:bg-white transition-all duration-700">
                            <div className="relative z-10 max-w-sm">
                                <div className="w-16 h-1 rounded-[22px] bg-brand-green/10 flex items-center justify-center text-brand-green mb-8 group-hover:rotate-12 transition-transform">
                                    <Globe size={36} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl md:text-4xl font-bold text-brand-dark uppercase italic tracking-tighter leading-[0.85] mb-8">
                                    Цифровая <br /><span className="text-brand-green">Экосистема</span>
                                </h3>
                                <p className="text-lg text-black/70 font-medium leading-relaxed mb-4">
                                    Вы контролируете всё: от расхода химии до секунд появления персонала на смене. Прозрачность уровня 100%.
                                </p>
                            </div>

                            {/* Abstract Visual Background */}
                            <div className="absolute right-[-10%] bottom-[-10%] w-[350px] h-[350px] pointer-events-none opacity-[0.05] group-hover:opacity-10 transition-opacity duration-1000">
                                <LayoutDashboard size={400} strokeWidth={0.5} />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: SLA (The Strong Accent) */}
                    <div className="bento-card col-span-1 sm:col-span-5 group relative h-[220px] md:h-[350px]">
                        <div className="h-full bg-brand-dark rounded-[24px] md:rounded-[40px] p-5 md:p-10 flex flex-col justify-between overflow-hidden relative shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                            <div className="relative z-10">
                                <div className="text-[11px] font-bold text-white/30 mb-12 tracking-[0.4em]">QUALITY_GURU</div>
                                <h3 className="text-4xl md:text-6xl font-bold text-white uppercase italic tracking-tighter leading-[0.8]">
                                    99.8%
                                </h3>
                                <p className="text-xl md:text-2xl text-white font-bold uppercase italic tracking-tight mt-6 text-brand-green">
                                    БЕЗУПРЕЧНЫЙ SLA
                                </p>
                            </div>

                            <div className="relative z-10 flex justify-end mt-8">
                                <div className="w-24 h-24 rounded-full border-2 border-brand-green/20 flex items-center justify-center text-brand-green animate-[spin_10s_linear_infinite]">
                                    <CheckCircle2 size={48} />
                                </div>
                            </div>

                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-green/20 blur-[100px] rounded-full" />
                        </div>
                    </div>

                    {/* CARD 3: LEGAL (The Trust Layer) */}
                    <div className="bento-card col-span-1 sm:col-span-5 group relative h-[220px] md:h-[350px]">
                        <div className="h-full bg-white border border-black/[0.04] rounded-[24px] md:rounded-[40px] p-5 md:p-10 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-1000">
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-[22px] bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-10">
                                    <ShieldCheck size={36} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl md:text-4xl font-bold text-brand-dark uppercase italic tracking-tighter leading-[0.9] mb-8">
                                    0% <br /><span className="text-black/20 text-xl md:text-2xl">РИСКОВ</span>
                                </h3>
                                <p className="text-lg text-black/70 font-medium leading-relaxed mb-6">
                                    Юридическая броня. Мы берем на себя все налоговые и административные обязательства.
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 rounded-[30px] border border-black/[0.02]">
                                <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white">
                                    <Zap size={18} fill="currentColor" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Verified Protocol v4.0</div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: BUDGET (The Efficiency King) */}
                    <div className="bento-card col-span-1 sm:col-span-7 group relative h-[220px] md:h-[350px]">
                        <div className="h-full bg-slate-50 border border-black/[0.04] rounded-[24px] md:rounded-[40px] p-5 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden relative shadow-sm hover:shadow-xl hover:bg-white transition-all duration-700">

                            <div className="relative z-10 flex-1">
                                <div className="inline-flex items-center gap-2 mb-8 text-brand-green">
                                    <BarChart3 size={24} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-green">Profit_Guardian</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-bold text-brand-dark uppercase italic tracking-tighter leading-[0.8] mb-8">
                                    -30% <br /><span className="text-black/10">БУДЖЕТА</span>
                                </h3>
                                <p className="text-lg md:text-xl text-black/70 font-medium leading-relaxed max-w-sm">
                                    Инновации дешевле классического подхода. Мы убираем неэффективность, сохраняя качество.
                                </p>
                            </div>

                            {/* Data bars visual (Clean light style) */}
                            <div className="flex-1 w-auto h-full flex items-end justify-end gap-2 md:gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                {[0.3, 0.5, 0.4, 0.7, 0.6, 1, 0.9].map((h, i) => (
                                    <div key={i} className="w-5 md:w-8 bg-black/[0.05] rounded-t-full relative overflow-hidden" style={{ height: (h * 60) + '%' }}>
                                        <div className="absolute bottom-0 left-0 w-full bg-brand-green" style={{ height: (h * 100) + '%' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CORPORATE SEAL FOOTER */}
                <div className="mt-10 md:mt-14 flex flex-col items-center">
                    <div className="p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-slate-50 border border-black/[0.03] flex flex-col items-center gap-8 group hover:shadow-2xl transition-all duration-1000">
                        <Cpu className="text-brand-green group-hover:scale-125 transition-transform duration-700 w-10 h-10 md:w-14 md:h-14" strokeWidth={1} />
                        <h4 className="text-3xl md:text-5xl font-bold text-brand-dark uppercase italic tracking-tighter text-center leading-none">
                            IC GROUP <span className="text-black/5">SYSTEMS</span>
                        </h4>
                        <div className="h-[2px] w-24 bg-brand-green/20 group-hover:w-48 transition-all duration-700" />
                        <p className="text-[13px] font-semibold uppercase tracking-[0.6em] text-black/20 text-center">
                            Facility Management Excellence // Almaty 2026
                        </p>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default PainSection;
