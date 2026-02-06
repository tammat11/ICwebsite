import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ComparisonSlider = () => {
    const [position, setPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: any) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        if (!clientX) return;

        const x = (clientX - rect.left) / rect.width;
        setPosition(Math.max(0, Math.min(100, x * 100)));
    };

    useEffect(() => {
        const mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            gsap.set(".comparison-text", { opacity: 0, y: 30 });

            gsap.to(".comparison-text", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 95%",
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2
            });

            // Mobile Auto-Demo Animation
            mm.add("(max-width: 768px)", () => {
                // Animate the slider automatically on mobile scroll view to show it's interactive
                const obj = { val: 50 };
                gsap.to(obj, {
                    val: 10,
                    duration: 1.5,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1,
                    delay: 0.5,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "center center",
                        once: true
                    },
                    onUpdate: () => setPosition(obj.val)
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 px-6 bg-brand-light">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">
                <div className="md:w-1/3">
                    <span className="text-brand-green text-[11px] font-black tracking-[0.4em] uppercase block mb-8 transition-all hover:tracking-[0.6em] cursor-default">Precision</span>
                    <h2 className="comparison-text text-5xl md:text-7xl font-black tracking-tighter text-brand-dark mb-10 leading-[0.9]">Эффект <br /> <span className="text-brand-green italic">совершенства</span></h2>
                    <p className="comparison-text text-brand-dark/40 text-xl font-medium leading-relaxed mb-12">
                        Мы используем промышленное оборудование, которое удаляет 99.9% загрязнений.
                    </p>
                    <div className="comparison-text flex items-center gap-4 text-brand-dark font-black text-xs tracking-widest uppercase py-4 border-y border-black/5">
                        <span>Before</span>
                        <div className="w-12 h-px bg-brand-dark/10" />
                        <span>After IC CLEAN</span>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="md:w-2/3 aspect-[16/9] rounded-[60px] overflow-hidden relative cursor-col-resize select-none shadow-[0_40px_100px_rgba(0,0,0,0.1)]"
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                >
                    {/* After Image */}
                    <img
                        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1500"
                        alt="After"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Before Image (Clipped) */}
                    <div
                        className="absolute inset-0 w-full h-full overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1500"
                            alt="Before"
                            className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 contrast-125"
                        />
                    </div>

                    {/* Slider Line */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-10"
                        style={{ left: `${position}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center">
                            <div className="flex gap-1">
                                <div className="w-1 h-3 bg-brand-green rounded-full" />
                                <div className="w-1 h-3 bg-brand-green rounded-full opacity-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComparisonSlider;
