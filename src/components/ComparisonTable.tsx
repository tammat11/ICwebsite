import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ComparisonTable = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".diagnostic-row", {
                x: -50,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const items = [
        {
            title: "STAFF QUALITY",
            issue: "High turnover, untrained, no vetting.",
            solution: "Biometric vetting, in-house Academy certified.",
            icon: <ShieldCheck size={24} />
        },
        {
            title: "CHEMISTRY",
            issue: "Generic bleach, allergens, toxic residue.",
            solution: "EU Ecolabel Certified, Probiotic & Safe.",
            icon: <Zap size={24} />
        },
        {
            title: "TECHNOLOGY",
            issue: "Manual labor, mop & bucket only.",
            solution: "Robotic fleet, IoT sensors, Tennant machines.",
            icon: <BarChart3 size={24} />
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-[#111] text-white relative overflow-hidden">

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="mb-20">
                    <div className="flex items-center gap-3 text-brand-green mb-4">
                        <AlertTriangle size={20} className="animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">System Diagnostic</span>
                    </div>
                    <h2 className="text-[clamp(3rem,6vw,90px)] font-black leading-none tracking-tighter uppercase">
                        STANDARD <span className="text-white/20">VS</span> <span className="text-brand-green">PREMIUM</span>
                    </h2>
                </div>

                <div className="grid gap-6">
                    {items.map((item, i) => (
                        <div key={i} className="diagnostic-row group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-green/50 transition-colors duration-500">

                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[120px]">

                                {/* Header */}
                                <div className="lg:col-span-3 p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex items-center gap-4 bg-white/[0.02]">
                                    <div className="text-brand-green">{item.icon}</div>
                                    <h3 className="text-xl font-black uppercase tracking-wide">{item.title}</h3>
                                </div>

                                {/* Problem (Red) */}
                                <div className="lg:col-span-4 p-8 flex items-center gap-4 text-red-400 bg-red-500/5 h-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-red-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                                    <XCircle size={24} className="shrink-0 relative z-10" />
                                    <span className="font-mono text-sm uppercase relative z-10">{item.issue}</span>
                                </div>

                                {/* Solution (Green) */}
                                <div className="lg:col-span-5 p-8 flex items-center gap-4 text-brand-green bg-brand-green/5 h-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-brand-green/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                                    <CheckCircle2 size={24} className="shrink-0 relative z-10" />
                                    <span className="font-black text-lg uppercase tracking-tight relative z-10">{item.solution}</span>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ComparisonTable;
