import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextRevealSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);

    const rawText = "Мы не просто убираем помещения — мы создаем стандарты чистоты, которые меняют индустрию Казахстана ежедневно.";
    const characters = rawText.split("");

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate background radial-gradient position
            gsap.to(containerRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true
                },
                backgroundPosition: "100% 100%",
                ease: "none"
            });

            // Character reveal animation
            const charElements = gsap.utils.toArray<HTMLElement>(".reveal-char");
            charElements.forEach((char, i) => {
                const progress = i / charElements.length;
                gsap.to(char, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `top+=${progress * 80}% top`,
                        end: `top+=${(progress * 80) + 5}% top`,
                        scrub: true,
                    },
                    opacity: 1,
                    ease: "none"
                });
            });

            // Percentage counter
            if (counterRef.current) {
                gsap.to(counterRef.current, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true,
                    },
                    innerText: 100,
                    snap: { innerText: 1 },
                    ease: "none"
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-[300vh] bg-brand-dark"
            style={{
                backgroundImage: "radial-gradient(circle at 0% 0%, rgba(131, 182, 67, 0.1) 0%, transparent 50%)",
                backgroundSize: "200% 200%",
                backgroundPosition: "0% 0%"
            }}
        >
            <div className="sticky top-0 min-h-screen w-full flex flex-col justify-center px-6 py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto w-full relative">
                    <p
                        ref={textRef}
                        className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter max-w-[90%] md:max-w-full"
                    >
                        {characters.map((char, i) => (
                            <span
                                key={i}
                                className="reveal-char opacity-[0.08]"
                                style={{ display: 'inline' }}
                            >
                                {char}
                            </span>
                        ))}
                    </p>

                    <div className="absolute top-1/2 -translate-y-1/2 right-0 h-auto flex items-center pr-0 md:pr-10">
                        <div className="flex flex-col items-end gap-2 md:gap-4">
                            <div className="hidden md:block w-1 h-32 bg-white/5 relative overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 w-full h-full bg-brand-green origin-top scale-y-0 transition-transform duration-100" />
                            </div>
                            <div className="text-white font-black text-4xl sm:text-6xl md:text-8xl italic tracking-tighter tabular-nums opacity-10 md:opacity-20">
                                <span ref={counterRef}>0</span>%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-brand-green opacity-40 animate-bounce">
                    Keep Scrolling
                </div>
            </div>
        </section>
    );
};

export default TextRevealSection;
