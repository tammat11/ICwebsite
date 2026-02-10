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
                        start: "top 75%",
                    }
                }
            );



        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-48 bg-white overflow-hidden text-brand-dark" id="benefits">

            {/* AMBIENT BACKGROUND (SOFT LIGHT) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[60%] h-[40%] bg-brand-green/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-brand-secondary/5 blur-[140px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">



                {/* THE BENTO GRID - Apple / Linear Aesthetic (Light) */}
                <div className="benefit-cards-grid grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">

                    {/* CARD 1: CONTROL (Puffy Glass Style) */}
                    <div className="bento-card md:col-span-7 group relative h-[450px] md:h-[520px]">
                        <div className="h-full bg-slate-50 border border-black/[0.04] rounded-[60px] p-10 md:p-16 flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-xl hover:bg-white transition-all duration-700">
                            <div className="relative z-10 max-w-sm">
                                <div className="w-14 h-14 rounded-[20px] bg-brand-green/10 flex items-center justify-center text-brand-green mb-8 group-hover:rotate-12 transition-transform">
                                    <Globe size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-4xl md:text-6xl font-[1000] text-brand-dark uppercase italic tracking-tighter leading-[0.85] mb-8">
                                    Цифровая <br /><span className="text-brand-green">Экосистема</span>
                                </h3>
                                <p className="text-base md:text-lg text-black/40 font-bold leading-relaxed">
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
                    <div className="bento-card md:col-span-5 group relative h-[450px] md:h-[520px]">
                        <div className="h-full bg-brand-dark rounded-[60px] p-10 md:p-14 flex flex-col justify-between overflow-hidden relative shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                            <div className="relative z-10">
                                <div className="text-[11px] font-black text-white/30 mb-12 tracking-[0.4em]">QUALITY_GURU</div>
                                <h3 className="text-7xl md:text-8xl font-[1000] text-white uppercase italic tracking-tighter leading-[0.8]">
                                    99.8%
                                </h3>
                                <p className="text-2xl text-white font-[1000] uppercase italic tracking-tight mt-6 text-brand-green">
                                    БЕЗУПРЕЧНЫЙ SLA
                                </p>
                            </div>

                            <div className="relative z-10 flex justify-end">
                                <div className="w-24 h-24 rounded-full border-2 border-brand-green/20 flex items-center justify-center text-brand-green animate-[spin_10s_linear_infinite]">
                                    <CheckCircle2 size={48} />
                                </div>
                            </div>

                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-green/20 blur-[100px] rounded-full" />
                        </div>
                    </div>

                    {/* CARD 3: LEGAL (The Trust Layer) */}
                    <div className="bento-card md:col-span-5 group relative h-[450px] md:h-[520px]">
                        <div className="h-full bg-white border border-black/[0.04] rounded-[60px] p-10 md:p-14 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-1000">
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-[20px] bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-10">
                                    <ShieldCheck size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-[1000] text-brand-dark uppercase italic tracking-tighter leading-[0.9] mb-8">
                                    0% <br /><span className="text-black/20 text-3xl">РИСКОВ</span>
                                </h3>
                                <p className="text-base md:text-lg text-black/40 font-bold leading-relaxed mb-6">
                                    Юридическая броня. Мы берем на себя все налоговые и административные обязательства.
                                </p>
                            </div>

                            <div className="mt-auto flex items-center gap-4 p-4 bg-slate-50 rounded-[30px] border border-black/[0.02]">
                                <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white">
                                    <Zap size={18} fill="currentColor" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-black/40">Verified by Legal Protocol v4.0</div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 4: BUDGET (The Efficiency King) */}
                    <div className="bento-card md:col-span-7 group relative h-[450px] md:h-[520px]">
                        <div className="h-full bg-slate-50 border border-black/[0.04] rounded-[60px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative shadow-sm hover:shadow-xl hover:bg-white transition-all duration-700">

                            <div className="relative z-10 flex-1">
                                <div className="inline-flex items-center gap-2 mb-8 text-brand-green">
                                    <BarChart3 size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green">Profit_Guardian</span>
                                </div>
                                <h3 className="text-4xl md:text-7xl font-[1000] text-brand-dark uppercase italic tracking-tighter leading-[0.8] mb-8">
                                    -30% <br /><span className="text-black/10">БУДЖЕТА</span>
                                </h3>
                                <p className="text-lg text-black/40 font-bold leading-relaxed max-w-sm">
                                    Инновации дешевле классического подхода. Мы убираем неэффективность, сохраняя качество.
                                </p>
                            </div>

                            {/* Data bars visual (Clean light style) */}
                            <div className="flex-1 w-full md:w-auto h-full flex items-end justify-center md:justify-end gap-3 md:gap-4 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                                {[0.3, 0.5, 0.4, 0.7, 0.6, 1, 0.9].map((h, i) => (
                                    <div key={i} className="w-5 md:w-8 bg-black/[0.05] rounded-t-full relative overflow-hidden" style={{ height: (h * 75) + '%' }}>
                                        <div className="absolute bottom-0 left-0 w-full bg-brand-green/30" style={{ height: (h * 100) + '%' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CORPORATE SEAL FOOTER */}
                <div className="mt-40 flex flex-col items-center">
                    <div className="p-10 md:p-16 rounded-[80px] bg-slate-50 border border-black/[0.03] flex flex-col items-center gap-10 group hover:shadow-2xl transition-all duration-1000">
                        <Cpu className="text-brand-green group-hover:scale-125 transition-transform duration-700" size={56} strokeWidth={1} />
                        <h4 className="text-4xl md:text-6xl font-[1000] text-brand-dark uppercase italic tracking-tighter text-center leading-none">
                            IC GROUP <span className="text-black/5">SYSTEMS</span>
                        </h4>
                        <div className="h-[2px] w-24 bg-brand-green/20 group-hover:w-48 transition-all duration-700" />
                        <p className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.6em] text-black/20 text-center">
                            Facility Management Excellence // Almaty 2026
                        </p>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default PainSection;
