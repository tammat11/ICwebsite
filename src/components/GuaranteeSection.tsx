import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, CheckCircle, Zap, Lock, Award, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GuaranteeSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                }
            });

            tl.from(sealRef.current, {
                scale: 0.5,
                rotation: -180,
                opacity: 0,
                duration: 1,
                ease: "elastic.out(1, 0.75)"
            });

            tl.from(".seal-ring", {
                scale: 0,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(2)"
            }, "-=0.8");

            tl.from(".guarantee-card", {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "expo.out"
            }, "-=0.5");
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const guarantees = [
        { icon: <CheckCircle size={28} />, title: "SLA 98%", desc: "Гарантия качества", color: "from-green-500 to-emerald-600", rotate: -3, gridArea: "1 / 1 / 2 / 3" },
        { icon: <Shield size={28} />, title: "₸50M", desc: "Страховой полис", color: "from-blue-500 to-cyan-600", rotate: 2, gridArea: "1 / 3 / 2 / 4" },
        { icon: <Zap size={28} />, title: "24/7", desc: "Мониторинг", color: "from-yellow-500 to-orange-600", rotate: -2, gridArea: "2 / 1 / 3 / 2" },
        { icon: <Lock size={28} />, title: "₸500K", desc: "Штрафы", color: "from-red-500 to-pink-600", rotate: 4, gridArea: "2 / 2 / 3 / 4" }
    ];

    return (
        <section ref={sectionRef} className="relative py-40 md:py-56 bg-white overflow-hidden" style={{ perspective: '1200px' }}>
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#83b643 1.5px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 mb-8 px-6 py-2 bg-brand-green/10 rounded-full border border-brand-green/20">
                        <Award size={18} className="text-brand-green" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-green">Legal Security</span>
                    </div>
                    <h2 className="text-[clamp(3.5rem,10vw,160px)] font-[1000] uppercase leading-[0.8] tracking-tighter mb-8">
                        ПЕЧАТЬ <br /> <span className="text-brand-green">НАДЕЖНОСТИ</span>
                    </h2>
                </div>

                <div className="flex justify-center mb-40 relative">
                    <div ref={sealRef} className="relative transition-transform duration-300 ease-out" style={{ transform: `rotateX(${mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg)`, transformStyle: 'preserve-3d' }}>

                        {/* Multiple Glowing Rings */}
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="seal-ring absolute rounded-full border-2 border-brand-green"
                                style={{
                                    width: `${450 - i * 50}px`, height: `${450 - i * 50}px`,
                                    left: '50%', top: '50%',
                                    transform: `translate(-50%, -50%) translateZ(${i * 20}px)`,
                                    opacity: 0.3 - i * 0.05,
                                    boxShadow: i === 0 ? '0 0 50px rgba(131,182,67,0.3)' : 'none'
                                }}
                            />
                        ))}

                        {/* Central Master Seal */}
                        <div className="relative w-96 h-96 md:w-[480px] md:h-[480px] rounded-full bg-white border-[12px] border-brand-green flex items-center justify-center shadow-[0_50px_100px_rgba(131,182,67,0.2)]" style={{ transform: 'translateZ(60px)' }}>
                            <div className="text-center px-12">
                                <Shield size={140} className="text-brand-green mx-auto mb-8 drop-shadow-[0_0_20px_rgba(131,182,67,0.5)]" />
                                <div className="text-9xl font-black text-brand-green leading-none tracking-tighter">98<span className="text-4xl italic">%</span></div>
                                <div className="text-sm font-black uppercase tracking-[0.5em] text-black/20 mt-4">SLA Guarantee</div>
                            </div>

                            {/* Rotating Label */}
                            <div className="absolute inset-0 animate-spin-slow p-8">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <path id="curve" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                                    <text className="text-[4px] fill-brand-green/40 font-black uppercase tracking-[0.6em]">
                                        <textPath href="#curve">IC GROUP QUALITY STANDARD CONTROL SYSTEM • SECURITY PROTECTION • </textPath>
                                    </text>
                                </svg>
                            </div>

                            {/* Accent Stars */}
                            {[0, 90, 180, 270].map((angle, i) => (
                                <div key={i} className="absolute" style={{ transform: `rotate(${angle}deg) translateY(-210px)` }}>
                                    <Star size={24} className="text-brand-green fill-brand-green animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {guarantees.map((g, i) => (
                        <div key={i} className="guarantee-card group" style={{ gridArea: window.innerWidth > 768 ? g.gridArea : 'auto' }}>
                            <div className="bg-white border-2 border-black/5 rounded-[50px] p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4">
                                <div className="w-16 h-16 rounded-3xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-8 group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                                    {g.icon}
                                </div>
                                <div className="text-6xl font-black text-brand-green mb-4 tracking-tighter">{g.title}</div>
                                <p className="text-lg font-bold text-black/40">{g.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }
            `}</style>
        </section>
    );
};

export default GuaranteeSection;
