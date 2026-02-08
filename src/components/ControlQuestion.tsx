import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ControlQuestion = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePos({ x, y });

            // Spotlight movement
            gsap.to(spotlightRef.current, {
                x: x,
                y: y,
                duration: 0.1,
                ease: "power2.out"
            });
        };

        container.addEventListener('mousemove', handleMouseMove);

        // Text animation on scroll
        const ctx = gsap.context(() => {
            gsap.from(".q-word", {
                y: 100,
                opacity: 0,
                rotateX: -45,
                stagger: 0.1,
                duration: 1,
                scrollTrigger: {
                    trigger: container,
                    start: "top 70%",
                }
            });

            // Ambient scanning lines
            gsap.to(".scan-line", {
                y: "100%",
                duration: 3,
                repeat: -1,
                ease: "none",
                stagger: 0.5
            });
        }, container);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };
    }, []);

    const words = ["ВЫ", "ТОЧНО", "КОНТРОЛИРУЕТЕ", "СВОЙ", "ОБЪЕКТ?"];

    return (
        <section
            ref={containerRef}
            className="relative h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center cursor-none group"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }} />

            {/* Scanning Lines */}
            <div className="scan-line absolute top-[-10%] left-0 w-full h-px bg-brand-green/20 blur-[2px] pointer-events-none" />
            <div className="scan-line absolute top-[-10%] left-0 w-full h-px bg-brand-green/10 pointer-events-none" />

            {/* Main Question Text */}
            <div ref={textRef} className="relative z-10 text-center select-none px-6 pointer-events-none">
                <div className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-2">
                    {words.map((word, i) => (
                        <span
                            key={i}
                            className="q-word text-[clamp(2rem,12vw,180px)] font-black leading-[0.85] tracking-tighter text-white/5 uppercase"
                        >
                            {word}
                        </span>
                    ))}
                </div>

                {/* Visual Accent */}
                <div className="mt-12 flex items-center justify-center gap-4 opacity-20">
                    <div className="h-px w-24 bg-brand-green" />
                    <span className="text-[10px] font-mono tracking-[1em] text-brand-green">DIAGNOSTIC_MODE</span>
                    <div className="h-px w-24 bg-brand-green" />
                </div>
            </div>

            {/* THE SPOTLIGHT (Masking layer) */}
            <div
                ref={spotlightRef}
                className="absolute inset-0 z-20 pointer-events-none translate-z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(10,10,10,0.98) 100%)`,
                }}
            />

            {/* Highlighting Text (Visible only through spotlight) */}
            <div
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-6"
                style={{
                    clipPath: `circle(250px at ${mousePos.x}px ${mousePos.y}px)`
                }}
            >
                <div className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 text-center">
                    {words.map((word, i) => (
                        <span
                            key={i}
                            className="text-[clamp(2rem,12vw,180px)] font-black leading-[0.85] tracking-tighter text-white uppercase drop-shadow-[0_0_30px_rgba(131,182,67,0.5)]"
                        >
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            {/* Interactive Cursor Data */}
            <div
                className="absolute z-50 pointer-events-none select-none text-brand-green font-mono text-[10px] space-y-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ left: mousePos.x + 20, top: mousePos.y + 20 }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-brand-green rounded-full animate-pulse" />
                    <span>ANALYZING_OBJ_X: 100%</span>
                </div>
                <div className="text-white/40">X: {Math.round(mousePos.x)} Y: {Math.round(mousePos.y)}</div>
                <div className="text-red-500/60 font-bold">RISK_DETECTED: HIGH</div>
            </div>

            {/* Noise Texture */}
            <div className="absolute inset-0 z-40 opacity-[0.03] pointer-events-none scale-150"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

        </section>
    );
};

export default ControlQuestion;
