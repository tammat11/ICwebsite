import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
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
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={root} className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-4 overflow-hidden bg-brand-light">
            <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
                <div className="reveal-item inline-flex items-center gap-3 bg-brand-secondary/10 text-brand-secondary px-5 py-2 rounded-full font-black text-[10px] tracking-[0.4em] uppercase mb-10 shadow-sm">
                    <Sparkles size={14} />
                    Инновации в чистоте
                </div>


                <h1 ref={textRef} className="parallax-text font-black tracking-[-0.07em] leading-[0.9] text-brand-dark mb-8 md:mb-12 select-none relative z-20 flex flex-col items-center w-full text-center px-4">
                    <div className="hero-line w-full text-[clamp(3.5rem,11vw,200px)]">СОЗДАТЬ</div>

                    <div className="hero-line relative z-10 w-full flex justify-center py-1 md:py-0 text-[clamp(3.5rem,12.5vw,200px)]">
                        <span className="relative inline-block group w-fit">
                            <span className="text-brand-green italic relative z-10 leading-none pr-[0.15em] inline-block w-fit">
                                ЧИСТОТУ
                                {/* Mud/Dirt Spot overlaid on 'ТУ' */}
                                <svg className="dirt-spot absolute top-1/2 right-[5%] -translate-y-1/2 w-8 h-8 sm:w-24 sm:h-24 text-brand-dark/40 pointer-events-none z-20 mix-blend-multiply" viewBox="0 0 100 100" fill="currentColor">
                                    <path d="M68.5,-16.8C81.1,0.7,78.2,30.3,62.3,47.8C46.4,65.3,17.5,70.7,-4.8,63.2C-27.1,55.8,-42.8,35.5,-49.3,12.9C-55.8,-9.7,-53.1,-34.7,-38.7,-49.8C-24.3,-64.9,1.8,-70.2,18.9,-61.7C36,-53.2,44,-30.9,50,-13L68.5,-16.8Z" transform="translate(50 50) scale(0.6)" />
                                    <path d="M38.1,-12.3C45.3,9.8,43.9,37,28.6,49.8C13.3,62.6,-15.8,61.1,-36.8,44.5C-57.8,28,-70.7,-3.6,-61.6,-27.1C-52.5,-50.7,-21.4,-66.2,0.9,-66.5C23.2,-66.8,46.4,-51.9,38.1,-12.3Z" transform="translate(60 40) scale(0.4)" opacity="0.6" />
                                </svg>

                                {/* Cartoon Shine Effect (Star) - Larger and slightly darker gray */}
                                <div className="cartoon-shine absolute top-[35%] right-5 -translate-y-1/2 w-8 h-12 md:w-20 md:h-32 pointer-events-none z-30 opacity-0">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-slate-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
                                    </svg>
                                </div>

                                {/* Rag Hand moved here for relative positioning */}
                                <img
                                    src="/rag.png"
                                    alt="Cleaning Rag"
                                    className="rag-hand absolute top-1/2 right-[5%] -translate-y-1/2 w-24 h-24 md:w-64 md:h-64 object-contain pointer-events-none z-50 opacity-0"
                                />
                            </span>
                        </span>
                    </div>

                    <div className="hero-line w-full text-[clamp(3.5rem,11vw,200px)]">ВО ВСЕМ</div>
                </h1>

                <div className="reveal-item flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-4 md:mt-10 relative px-6">
                    <p className="text-xs md:text-xl text-brand-dark/50 max-w-[280px] md:max-w-sm text-center md:text-left font-medium leading-snug md:leading-tight relative z-20">
                        Мы — самая крупная компания, предоставляющая профессиональные клининговые услуги на рынке Казахстана.
                    </p>

                    <div className="flex items-center gap-6 relative">
                        <div className="flex flex-col items-center gap-1 text-brand-dark/20 cursor-pointer group relative z-10 transition-colors hover:text-brand-green">
                            <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Скролл</span>
                        </div>
                    </div>
                </div>

            </div>


        </section>
    );
};

export default Hero;
