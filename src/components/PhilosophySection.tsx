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
                    start: "top 75%",
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
                    start: "top bottom",
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
        <section ref={sectionRef} className="relative pb-32 md:pb-48 pt-0 bg-white overflow-hidden" id="philosophy">

            {/* Background "BREATH" Text (Parallax) */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
                <span className="bg-breath-text text-[clamp(10rem,35vw,500px)] font-[1000] text-black italic opacity-[0.03] leading-none uppercase tracking-tighter whitespace-nowrap">
                    BREATHING SPACE
                </span>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                {/* 1. The Circular Master Portrait */}
                <div
                    ref={photoContainerRef}
                    className="w-64 h-64 md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[10px] md:border-[24px] border-white shadow-[0_45px_100px_-20px_rgba(0,0,0,0.2)] mb-16 md:mb-24 relative bg-gray-50 flex-shrink-0"
                >
                    <img
                        src={photoPath}
                        alt="Larion Lyan"
                        className="w-full h-full object-cover scale-[1.3] translate-y-4 md:translate-y-7"
                    />

                    {/* Corner Accent Star */}
                    <div className="absolute top-10 right-10 text-brand-green animate-pulse hidden md:block">
                        <Star size={40} fill="currentColor" />
                    </div>
                </div>

                {/* 2. Main Quote Typography with reveal words */}
                <h2 className="text-[clamp(2.5rem,8.5vw,140px)] font-[1000] uppercase tracking-[-0.07em] leading-[0.85] mb-12">
                    <span className="flex flex-col md:flex-row gap-x-6 justify-center">
                        <span className="reveal-word block text-black">Каждое</span>
                        <span className="reveal-word block text-black">пространство</span>
                    </span>
                    <span className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-10 mt-2">
                        <span className="reveal-word block text-black">должно</span>
                        <span className="reveal-word relative inline-block text-brand-green italic px-4">
                            дышать.
                            <div className="absolute inset-x-0 h-[85%] top-[7%] bg-brand-green/15 -z-10 transform -rotate-1 skew-x-[-12deg] scale-y-110" />
                        </span>
                    </span>
                </h2>

                {/* 3. Author / Signature with Animated Lines */}
                <div className="flex items-center justify-center gap-6 md:gap-12 w-full max-w-4xl mb-16">
                    <div className="sig-line h-[1px] flex-1 bg-black/20 origin-right" />
                    <p className="reveal-word text-xl md:text-3xl font-black italic text-black whitespace-nowrap tracking-tight">
                        Лян Ларион Викторович
                    </p>
                    <div className="sig-line h-[1px] flex-1 bg-black/20 origin-left" />
                </div>

                {/* 4. Action Link */}
                <button className="reveal-word group flex items-center gap-4 text-[11px] font-[1000] uppercase tracking-[0.5em] text-black hover:text-brand-green transition-colors">
                    Explore Philosophy
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>

            </div>
        </section>
    );
};

export default PhilosophySection;
