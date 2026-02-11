import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PhilosophySection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const photoContainerRef = useRef<HTMLDivElement>(null);
    const photoPath = "/IMG_7169.jpg";

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 150%",
                }
            });

            // 1. Photo Entrance: Pop & Rotate
            tl.from(photoContainerRef.current, {
                scale: 0.5,
                opacity: 0,
                rotate: -10,
                duration: 1.4,
                ease: "elastic.out(1, 0.75)"
            });

            // 2. Heading: Word-by-word reveal
            tl.from(".reveal-word", {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                rotate: 5,
                duration: 1,
                ease: "power4.out"
            }, "-=1");

            // 3. Signature line: Growth
            tl.from(".sig-line", {
                scaleX: 0,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "expo.out"
            }, "-=0.5");

            // 4. Parallax Background "BREATH"
            gsap.to(".bg-breath-text", {
                xPercent: -30,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 120%",
                    end: "bottom top",
                    scrub: 1
                }
            });

            // Continuous floating animation for the circle
            gsap.to(photoContainerRef.current, {
                y: 15,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative pb-12 md:pb-16 pt-0 bg-white overflow-hidden" id="philosophy">

            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                {/* 1. The Circular Master Portrait */}
                <div
                    ref={photoContainerRef}
                    className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden border-[10px] md:border-[16px] border-white shadow-[0_45px_100px_-20px_rgba(0,0,0,0.2)] mb-8 md:mb-12 relative bg-gray-50 flex-shrink-0"
                >
                    <img
                        src={photoPath}
                        alt="Larion Lyan"
                        className="w-full h-full object-cover scale-[1.3] translate-y-7"
                    />

                    {/* Corner Accent Star */}
                    <div className="absolute top-4 right-4 md:top-10 md:right-10 text-brand-secondary animate-pulse">
                        <Star className="w-6 h-6 md:w-10 md:h-10" fill="currentColor" />
                    </div>
                </div>

                {/* 2. Main Quote Typography with reveal words */}
                <h2 className="text-[clamp(44px,8vw,95px)] font-[1000] uppercase leading-[0.8] tracking-tighter mb-8">
                    <span className="flex flex-col md:flex-row gap-y-1 gap-x-6 justify-center">
                        <span className="reveal-word block text-black">Каждое</span>
                        <span className="reveal-word block text-black">пространство</span>
                    </span>
                    <span className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-10 mt-1 md:mt-2">
                        <span className="reveal-word block text-black">должно</span>
                        <span className="reveal-word relative inline-block text-brand-green italic px-4">
                            дышать.
                            <div className="absolute inset-x-0 h-[85%] top-[7%] bg-brand-green/15 -z-10 transform -rotate-1 skew-x-[-12deg] scale-y-110" />
                        </span>
                    </span>
                </h2>

                {/* 3. Author / Signature with Animated Lines */}
                <div className="flex items-center justify-center gap-6 md:gap-12 w-full max-w-full md:max-w-4xl mb-3 md:mb-4">
                    <div className="sig-line h-[1px] flex-1 bg-brand-secondary/30 origin-right" />
                    <p className="reveal-word text-xl md:text-3xl font-black italic text-black whitespace-nowrap tracking-tight">
                        Лян Ларион Викторович
                    </p>
                    <div className="sig-line h-[1px] flex-1 bg-brand-secondary/30 origin-left" />
                </div>
                <p className="reveal-word text-[9px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-brand-dark/30 mb-8 md:mb-12">
                    Основатель IC GROUP • Лидер отрасли клининга
                </p>

                {/* 4. Action Link */}
                <button className="reveal-word group flex items-center gap-4 text-[10px] md:text-[11px] font-[1000] uppercase tracking-[0.3em] md:tracking-[0.5em] text-brand-secondary hover:text-brand-green transition-colors">
                    Explore Philosophy
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
            </div>
        </section>
    );
};

export default PhilosophySection;
