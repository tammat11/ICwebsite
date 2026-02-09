import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ManifestoSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "+=4000",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Stage 1: "Мы не просто убираем помещения"
            tl.fromTo(".line-1",
                { opacity: 0, y: 100, filter: "blur(20px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 2 }
            );
            tl.to(".line-1", { opacity: 0.1, y: -50, filter: "blur(10px)", duration: 2 }, "+=1");

            // Stage 2: "МЫ СОЗДАЕМ"
            tl.fromTo(".line-2",
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2, ease: "power4.out" }
            );
            tl.to(".line-2", { scale: 1.5, opacity: 0, duration: 3 }, "+=1");

            // Stage 3: "СТАНДАРТЫ ЧИСТОТЫ"
            tl.to(".manifesto-bg", { backgroundColor: "#83B643", duration: 2 }, "-=2");
            tl.fromTo(".line-3",
                { x: -200, opacity: 0 },
                { x: 0, opacity: 1, duration: 2 }
            );
            tl.to(".line-3", { x: 200, opacity: 0, duration: 2 }, "+=1");

            // Stage 4: "меняют индустрию Казахстан"
            tl.to(".manifesto-bg", { backgroundColor: "#ffffff", duration: 2 }, "-=1");
            tl.fromTo(".line-4",
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 2 }
            );
            tl.fromTo(".kz-map-overlay",
                { opacity: 0, scale: 0.9 },
                { opacity: 0.05, scale: 1.1, duration: 3 }, "-=1"
            );
            tl.to(".line-4", { opacity: 0.2, duration: 2 }, "+=1");

            // Stage 5: "ЕЖЕДНЕВНО."
            tl.fromTo(".line-5",
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 2 }
            );

            gsap.to(".line-5", {
                scale: 1.05,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef}>
            <div ref={triggerRef} className="manifesto-bg relative w-full h-screen bg-white overflow-hidden flex items-center justify-center transition-colors duration-1000">

                <div className="kz-map-overlay absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                    <img
                        src="/kz-map.png"
                        alt="Map"
                        className="w-[80vw] h-auto object-contain opacity-10 grayscale brightness-0"
                    />
                </div>

                <div className="relative z-10 w-full max-w-7xl px-6 text-center">
                    <div className="line-1 absolute inset-0 flex items-center justify-center">
                        <h2 className="text-[clamp(1.5rem,5vw,72px)] font-medium text-black italic tracking-tight uppercase">
                            Мы не просто убираем помещения —
                        </h2>
                    </div>

                    <div className="line-2 absolute inset-0 flex items-center justify-center">
                        <h2 className="text-[clamp(4rem,15vw,260px)] font-[950] text-black tracking-[-0.08em] leading-none uppercase">
                            МЫ СОЗДАЕМ
                        </h2>
                    </div>

                    <div className="line-3 absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <h2 className="text-[clamp(3.5rem,12vw,200px)] font-black text-white leading-[0.8] tracking-tighter uppercase mb-4">
                                СТАНДАРТЫ
                            </h2>
                            <h2 className="text-[clamp(2.5rem,10vw,160px)] font-black text-black leading-none tracking-tighter uppercase italic px-6 bg-white transform rotate-1">
                                ЧИСТОТЫ
                            </h2>
                        </div>
                    </div>

                    <div className="line-4 absolute inset-0 flex items-center justify-center px-12">
                        <h2 className="text-[clamp(1.8rem,5vw,80px)] font-black text-black leading-[1.1] tracking-tighter uppercase">
                            Которые меняют <br />
                            <span className="text-brand-green italic">индустрию Казахстана</span>
                        </h2>
                    </div>

                    <div className="line-5 absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <h2 className="text-[clamp(4rem,18vw,350px)] font-[1000] text-brand-green tracking-[-0.1em] leading-none uppercase">
                                ЕЖЕДНЕВНО.
                            </h2>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-brand-green rounded-full shadow-[0_0_30px_rgba(131,182,67,0.5)]" />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Scroll to Dive</span>
                    <div className="w-px h-12 bg-gradient-to-b from-black to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default ManifestoSection;
