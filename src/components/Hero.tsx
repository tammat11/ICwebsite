import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ onCalcOpen }: { onCalcOpen?: () => void }) => {
    const root = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial states
            gsap.set(".reveal-item", { y: 60, opacity: 0 });
            gsap.set(".hero-line", { y: 100, opacity: 0 });


            // 1. Text Lines Animation (Staggered)
            gsap.to(".hero-line", {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2
            });

            // 2. Buttons/Tags Reveal
            gsap.to(".reveal-item", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.8
            });



            // Parallax Effect
            gsap.to(".parallax-text", {
                scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5
                },
                y: -100,
                opacity: 0.5
            });

            // Rag Cleaning Animation (Fast & Fluid)
            const ragTl = gsap.timeline({ delay: 1.2 });

            // 1. Hand Appears - Nudged right and down to hit the spot
            ragTl.fromTo(".rag-hand",
                { x: 100, y: 200, opacity: 0, rotate: 45 },
                {
                    x: 100,
                    y: 60,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out"
                }
            )
                // 2. Wipe Motion
                .to(".rag-hand", {
                    x: 60,
                    y: 20,
                    rotation: -10,
                    duration: 0.2,
                    ease: "sine.inOut"
                })
                // Clean the dirt spot simultaneously
                .to(".dirt-spot", {
                    opacity: 0,
                    scale: 1.3,
                    duration: 0.2,
                    ease: "power2.out"
                }, "<")
                .to(".rag-hand", {
                    x: 60,
                    y: 60,
                    rotation: 15,
                    duration: 0.2,
                    ease: "sine.inOut"
                })
                // 3. Exit
                .to(".rag-hand", {
                    x: 500,
                    y: 500,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in"
                });

            // Cartoon Shine Pop - Aligned with dirt spot removal
            ragTl.fromTo(".cartoon-shine",
                { scale: 0, rotation: 0, opacity: 0 },
                {
                    scale: 1.4,
                    rotation: 120,
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(3)"
                },
                "-=0.8"
            )
                .to(".cartoon-shine", {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3
                }, "-=0.2");

            // Continuous Micro-Sparkles Loop on Title
            gsap.to(".title-micro-sparkle", {
                scale: 1,
                opacity: 0.6,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                stagger: {
                    each: 0.4,
                    from: "random"
                },
                ease: "sine.inOut"
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center pt-24 md:pt-32 px-4 overflow-hidden bg-brand-light">
            <div className="max-w-7xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
                <div className="reveal-item inline-flex items-center gap-3 bg-brand-secondary/10 text-brand-secondary px-5 py-2 rounded-full font-black text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase mb-8 md:mb-10 shadow-sm border border-brand-secondary/10">
                    <Sparkles size={14} />
                    Профессиональный клининг и эксплуатация
                </div>


                {/* Main Content Column */}
                <div className="flex flex-col items-center w-full">
                    <h1 ref={textRef} className="parallax-text font-black tracking-[-0.07em] leading-[0.85] text-brand-dark mb-8 md:mb-12 select-none relative z-20 flex flex-col items-center w-full text-center">
                        <div className="hero-line w-full text-[clamp(4.5rem,20vw,200px)] md:text-[clamp(100px,11vw,200px)]">СОЗДАТЬ</div>

                        <div className="hero-line relative z-10 w-full flex justify-center py-1 md:py-0 text-[clamp(4.5rem,22vw,200px)] md:text-[clamp(110px,12.5vw,200px)]">
                            <span className="relative inline-block group w-fit">
                                <span className="text-brand-green italic relative z-10 leading-none pr-[0.15em] inline-block w-fit">
                                    ЧИСТОТУ
                                    {/* Mud/Dirt Spot overlaid on 'ТУ' */}
                                    <svg className="dirt-spot absolute top-1/2 right-[5%] -translate-y-1/2 w-10 h-10 sm:w-24 sm:h-24 text-brand-dark/40 pointer-events-none z-20 mix-blend-multiply" viewBox="0 0 100 100" fill="currentColor">
                                        <path d="M68.5,-16.8C81.1,0.7,78.2,30.3,62.3,47.8C46.4,65.3,17.5,70.7,-4.8,63.2C-27.1,55.8,-42.8,35.5,-49.3,12.9C-55.8,-9.7,-53.1,-34.7,-38.7,-49.8C-24.3,-64.9,1.8,-70.2,18.9,-61.7C36,-53.2,44,-30.9,50,-13L68.5,-16.8Z" transform="translate(50 50) scale(0.6)" />
                                        <path d="M38.1,-12.3C45.3,9.8,43.9,37,28.6,49.8C13.3,62.6,-15.8,61.1,-36.8,44.5C-57.8,28,-70.7,-3.6,-61.6,-27.1C-52.5,-50.7,-21.4,-66.2,0.9,-66.5C23.2,-66.8,46.4,-51.9,38.1,-12.3Z" transform="translate(60 40) scale(0.4)" opacity="0.6" />
                                    </svg>

                                    {/* Cartoon Shine Effect (Star) */}
                                    <div className="cartoon-shine absolute top-[35%] right-5 -translate-y-1/2 w-12 h-16 md:w-20 md:h-32 pointer-events-none z-30 opacity-0">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-slate-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
                                        </svg>
                                    </div>

                                    {/* Rag Hand */}
                                    <img
                                        src="/rag.png"
                                        alt="Cleaning Rag"
                                        className="rag-hand absolute top-1/2 right-[5%] -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 object-contain pointer-events-none z-50 opacity-0"
                                    />
                                </span>
                            </span>
                        </div>

                        <div className="hero-line w-full text-[clamp(4.5rem,20vw,200px)] md:text-[clamp(100px,11vw,200px)]">ВО ВСЕМ</div>
                    </h1>

                    <div className="reveal-item flex flex-col items-center text-center gap-8 md:gap-14 w-full px-6">
                        {/* Description */}
                        <div className="flex flex-col items-center">
                            <p className="text-sm md:text-xl text-brand-dark/40 max-w-[280px] md:max-w-sm font-bold uppercase tracking-[0.1em] leading-tight relative z-20">
                                Крупнейший оператор профессионального клининга в Казахстане.
                                <span className="block mt-3 text-[10px] text-brand-dark/20 tracking-[0.3em]">IC GROUP • PROFESSIONAL FACILITY SERVICES</span>
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="flex flex-col items-center relative scale-95 md:scale-100 w-full mb-6">
                            <button
                                onClick={onCalcOpen}
                                className="group relative flex flex-col items-center gap-4 md:gap-6 transition-all duration-500 hover:scale-105 active:scale-95"
                            >
                                <div className="relative">
                                    {/* Button Body */}
                                    <div className="bg-[#7B85A7] text-white px-10 md:px-14 py-5 md:py-7 rounded-3xl md:rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.2em] shadow-[0_25px_50px_rgba(123,133,167,0.4)] transition-all duration-500 group-hover:bg-[#6A7496] group-hover:shadow-[0_30px_60px_rgba(123,133,167,0.5)] whitespace-nowrap">
                                        Рассчитать стоимость
                                    </div>
                                    {/* Icon Circle */}
                                    <div className="absolute -top-3 -right-3 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border-2 border-[#7B85A7] flex items-center justify-center text-[#7B85A7] shadow-xl transition-all duration-700 group-hover:rotate-[360deg]">
                                        <Sparkles size={16} />
                                    </div>
                                </div>

                                {/* Scroll hint */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const nextEl = document.getElementById('stats');
                                        if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' });
                                        else window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
                                    }}
                                    className="flex flex-col items-center gap-2 cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
                                >
                                    <ArrowDown size={14} className="text-brand-dark animate-bounce" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-brand-dark">Скролл</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

            </div>


        </section>
    );
};

export default Hero;
