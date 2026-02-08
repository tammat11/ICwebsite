import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Zap, Target, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PainSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);
    const [isExploded, setIsExploded] = useState(false);

    const pains = [
        {
            title: "Срывы смен",
            desc: "Персонал не вышел, а вы узнаете об этом последним.",
            icon: <Zap size={24} />,
            metric: "CRITICAL_FAIL",
            targetX: -200, targetY: -120, rot: -6
        },
        {
            title: "Качество плавает",
            desc: "Сегодня идеально — завтра грязно. Нет стандартов.",
            icon: <Target size={24} />,
            metric: "SLA_DEGRADATION",
            targetX: 200, targetY: -110, rot: 4
        },
        {
            title: "Риски и штрафы",
            desc: "СЭС, нарушения охраны труда. Платите вы.",
            icon: <ShieldCheck size={24} />,
            metric: "LEGAL_THREAT",
            targetX: -210, targetY: 120, rot: -4
        },
        {
            title: "Текучка кадров",
            desc: "Лица меняются каждую неделю. Нет обучения.",
            icon: <AlertCircle size={24} />,
            metric: "HR_CHURN",
            targetX: 210, targetY: 110, rot: 6
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".pain-kinetic-card");

            // Optimization: quickTo functions are not compatible with scrubbed X/Y animations.
            // Removing them as scrub will directly control X/Y.
            // const xTo: any[] = [];
            // const yTo: any[] = [];
            // cards.forEach((card) => {
            //     xTo.push(gsap.quickTo(card, "x", { duration: 0.8, ease: "power3" }));
            //     yTo.push(gsap.quickTo(card, "y", { duration: 0.8, ease: "power3" }));
            // });

            // 1. Initial State
            gsap.set(cards, {
                x: 0, y: 0, scale: 0.2, opacity: 0, rotate: 0
            });

            // 2. PINNED EXPLOSION SEQUENCE
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top", // Lock as soon as it hits top
                    end: "+=200%",   // Hold for 2 screens of scroll
                    pin: true,       // PIN THE SECTION
                    scrub: 1,        // Smooth scrub linked to scroll
                    anticipatePin: 1
                }
            });

            // Step 1: Holding moment (Question is visible, cards hidden)
            // We adding a small dummy tween to create a pause before explosion starts if needed, 
            // or just start exploding immediately but slowly. Let's make it dramatic.

            // Step 2: EXPLOSION linked to scroll progress
            cards.forEach((card, i) => {
                const p = pains[i];
                // Animate to target positions
                tl.to(card, {
                    x: p.targetX,
                    y: p.targetY,
                    rotate: p.rot,
                    scale: 1,
                    opacity: 1,
                    duration: 1, // Relative duration within scrub
                    ease: "power2.out", // More linear feel for scrub control
                }, 0); // All start at beginning of pinned scroll
            });

            // Also fade/blur the question simultaneously (but keep it visible as background)
            tl.to(".trigger-question", {
                scale: 0.4,
                opacity: 0.15, // Keep slightly visible
                filter: "blur(3px)", // Gentle blur
                duration: 0.5,
                ease: "power1.inOut"
            }, 0);

            // Set state for mouse interaction (enabled after some progress or always?)
            // With scrub, we can't easily toggle state mid-scrub for React re-renders without perf hit.
            // Better to just enable mouse interaction but dampen it based on progress if needed.
            // For now, let's set isExploded to true immediately on mount or just ignore it 
            // since we want physics to work always, just visually restricted by GSAP overrides until user scrolls.

            // To make mouse interaction work *on top* of scrub, we need 'overwrite: "auto"' or functional values.
            // But 'quickTo' conflicts with 'scrub' controlling X/Y. 
            // STRATEGY CHANGE: 
            // Let ScrollTrigger control a container or proxy, and quickTo control the element relative to that?
            // OR: Disable scrub for X/Y and use scrollTrigger callbacks to trigger a "play" animation?
            // USER ASKED FOR "DELAY" TO CATCH ATTENTION. PINNING DOES THIS.
            // Let's stick to Scrub for precise control of the explosion radius via scroll.
            // Mouse moves will be subtle parallax on specific elements or added after scroll completes?
            // Let's keep mouse interaction DISABLED during the scroll scrub to avoid fighting,
            // and maybe enable it only when pinned is done? 
            // Actually, simplest is to let scrub control position. Mouse effect might be overkill here combined with scrub.
            // Let's REMOVE mouse interaction for stability, or make it very subtle parallax on the CONTAINER.

            setIsExploded(true); // Just to set classnames if needed

            // Mouse interaction removed for stability with Pin/Scrub.
            // const handleMouseMove = (e: MouseEvent) => {
            //     if (!isExploded) return; // Only interact when exploded

            //     const { clientX, clientY } = e;
            //     const centerX = window.innerWidth / 2;
            //     const centerY = window.innerHeight / 2;
            //     const moveX = (clientX - centerX) / 80; // Reduced sensitivity even more
            //     const moveY = (clientY - centerY) / 80;

            //     cards.forEach((_, i) => {
            //         // Calculate target position based on explosion origin + mouse offset
            //         const targetX = pains[i].targetX + moveX * (i + 1) * 0.5;
            //         const targetY = pains[i].targetY + moveY * (i + 1) * 0.5;

            //         xTo[i](targetX);
            //         yTo[i](targetY);
            //     });
            // };

            // window.addEventListener('mousemove', handleMouseMove);
            // return () => window.removeEventListener('mousemove', handleMouseMove);

        }, sectionRef);

        return () => ctx.revert();
    }, []); // Removed isExploded from dependency array as it's set once

    // Mouse move removed for stability with Pin/Scrub. 
    // If we want it back, applied to a parent container parallax usually simpler.

    return (
        <section
            ref={sectionRef}
            className="h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center text-white"
            id="pain"
        >
            {/* Ambient FX - Simplified for performance */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at center, #83b643 0%, transparent 60%)',
                    filter: 'blur(80px)', // Reduced blur radius
                    willChange: 'transform'
                }} />

            {/* Background Grid - Static is fine */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }} />

            <div className="relative w-full max-w-[1200px] h-[600px] flex items-center justify-center">

                {/* 1. CENTRAL TRIGGER (The Question) */}
                <div className="trigger-question relative z-20 text-center transition-all duration-300">
                    <div className="inline-flex items-center gap-4 px-6 py-2 bg-brand-green/10 border border-brand-green/20 rounded-full mb-8">
                        <Sparkles size={14} className="text-brand-green animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-green">Critical Audit</span>
                    </div>
                    <h2 className="text-[clamp(2rem,7vw,110px)] font-black uppercase leading-[0.85] tracking-tighter text-white">
                        ВЫ ТОЧНО <br />
                        <span className="text-brand-green italic">КОНТРОЛИРУЕТЕ</span> <br />
                        СВОЙ ОБЪЕКТ?
                    </h2>
                    <div className="mt-8 h-px w-24 bg-brand-green/30 mx-auto" />
                </div>

                {/* 2. EXPLODING CARDS CONTAINER */}
                <div ref={centerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {pains.map((item, i) => (
                        <div
                            key={i}
                            className="pain-kinetic-card absolute pointer-events-auto will-change-transform"
                        >
                            <div className="bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-[30px] p-6 md:p-8 w-[260px] md:w-[320px] shadow-2xl hover:bg-[#1a1a1a] hover:border-brand-green/30 transition-colors duration-300 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all shadow-inner">
                                        {item.icon}
                                    </div>
                                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] mb-1">{item.metric}</div>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 group-hover:text-brand-green transition-colors leading-[0.85] italic">
                                    {item.title}
                                </h3>

                                <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed mb-10 group-hover:text-gray-300 transition-colors">
                                    {item.desc}
                                </p>

                                <div className="flex justify-between items-end">
                                    <span className="text-5xl font-black text-white/5 group-hover:text-brand-green/10 transition-colors select-none">0{i + 1}</span>
                                    <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all shadow-2xl group-hover:rotate-12">
                                        <ArrowUpRight size={28} className="text-white" />
                                    </div>
                                </div>

                                {/* Inner Card Detail */}
                                <div className="absolute top-4 right-10 flex gap-1 opacity-[0.03]">
                                    {[1, 2, 3].map(d => <div key={d} className="w-1 h-3 bg-white" />)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Tech Hint */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-20 flex flex-col items-center gap-4 text-center">
                <span className="text-[9px] font-mono tracking-[0.8em] uppercase">Scroll to detonate insights</span>
                <div className="w-px h-16 bg-gradient-to-b from-brand-green to-transparent" />
            </div>

        </section>
    );
};

export default PainSection;
